import { NextRequest, NextResponse } from "next/server";
import { ChatAPIRequest, ChatAPIError } from "@/types/index";
import { buildLLMPayload } from "@/lib/buildLLMPayload";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeMessage, sanitizeHistory } from "@/lib/sanitize";

// ---------------------------------------------------------------------------
// Type guard
// ---------------------------------------------------------------------------
const VALID_SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "History", "Computer Science", "Economics",
] as const;

const VALID_MODES = ["Explain", "Quiz", "Summary"] as const;

function isValidRequestBody(body: unknown): body is ChatAPIRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.messages)) return false;
  for (const msg of b.messages) {
    if (
      !msg || typeof msg !== "object" ||
      !("role" in msg) || !("content" in msg) ||
      (msg.role !== "user" && msg.role !== "assistant") ||
      typeof msg.content !== "string"
    ) return false;
  }
  if (!VALID_SUBJECTS.includes(b.subject as (typeof VALID_SUBJECTS)[number])) return false;
  if (!VALID_MODES.includes(b.mode as (typeof VALID_MODES)[number])) return false;
  return true;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// POST /api/chat  — supports both streaming and non-streaming
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<Response> {
  // 1. Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    const retryAfterSecs = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json<ChatAPIError>(
      { error: `Too many requests. Please wait ${retryAfterSecs} seconds before trying again.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSecs),
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        },
      }
    );
  }

  // 2. API key check
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return NextResponse.json<ChatAPIError>(
      { error: "Service configuration error. Please contact the administrator." },
      { status: 500 }
    );
  }

  // 3. Parse & validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ChatAPIError>(
      { error: "Invalid request: body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!isValidRequestBody(body)) {
    return NextResponse.json<ChatAPIError>(
      { error: "Invalid request: body must include valid `messages` array, `subject`, and `mode`." },
      { status: 400 }
    );
  }

  const { messages, subject, mode } = body;

  // 4. Separate new user message from history
  const rawNewUserMessage = messages[messages.length - 1];
  const rawHistory = messages.slice(0, -1);

  if (!rawNewUserMessage || rawNewUserMessage.role !== "user") {
    return NextResponse.json<ChatAPIError>(
      { error: "Invalid request: last message must be a user message." },
      { status: 400 }
    );
  }

  // 5. Sanitize
  const sanitizedMessage = sanitizeMessage(rawNewUserMessage.content);
  if (!sanitizedMessage.ok) {
    return NextResponse.json<ChatAPIError>(
      { error: sanitizedMessage.reason ?? "Invalid message content." },
      { status: 400 }
    );
  }
  const sanitizedHistory = sanitizeHistory(rawHistory);

  // 6. Build payload — enable streaming
  const payload = {
    ...buildLLMPayload(sanitizedHistory, subject, mode, sanitizedMessage.value),
    stream: true,
  };

  // 7. Call Gemini API with streaming
  const geminiEndpoint =
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

  let llmResponse: Response;
  try {
    llmResponse = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    console.error("[/api/chat] Network error:", networkError);
    return NextResponse.json<ChatAPIError>(
      { error: "Unable to reach the AI service. Please check your connection and try again." },
      { status: 502 }
    );
  }

  // 8. Handle non-2xx
  if (!llmResponse.ok) {
    let errorDetail = `LLM API returned status ${llmResponse.status}`;
    try {
      const errorBody = await llmResponse.json();
      if (errorBody?.error?.message) errorDetail = errorBody.error.message;
    } catch { /* ignore */ }

    console.error("[/api/chat] LLM API error:", errorDetail);

    if (llmResponse.status >= 500) {
      return NextResponse.json<ChatAPIError>(
        { error: "The AI service is currently unavailable. Please try again later." },
        { status: 502 }
      );
    }
    return NextResponse.json<ChatAPIError>(
      { error: `AI service error: ${errorDetail}` },
      { status: 502 }
    );
  }

  // 9. Stream the response back to the client as Server-Sent Events
  const rateLimitHeaders = {
    "X-RateLimit-Limit": "10",
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
  };

  if (!llmResponse.body) {
    return NextResponse.json<ChatAPIError>(
      { error: "No response body from AI service." },
      { status: 502 }
    );
  }

  // Pipe the SSE stream from Gemini directly to the client
  return new Response(llmResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...rateLimitHeaders,
    },
  });
}
