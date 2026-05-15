/**
 * Input sanitization utilities for user-submitted content.
 *
 * Prevents:
 * - Prompt injection attacks (attempts to override system instructions)
 * - Excessively long inputs that waste tokens
 * - Null bytes and other control characters
 */

const MAX_MESSAGE_LENGTH = 2000; // characters
const MAX_HISTORY_MESSAGES = 50; // max conversation turns to include

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /forget\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /you\s+are\s+now\s+(a\s+)?(?!an?\s+AI\s+tutor)/i,
  /act\s+as\s+(?!an?\s+AI\s+tutor)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(?!an?\s+AI\s+tutor)/i,
  /system\s*:\s*you\s+are/i,
  /<\s*system\s*>/i,
  /\[INST\]/i,
  /###\s*instruction/i,
];

export interface SanitizeResult {
  ok: boolean;
  value: string;
  reason?: string;
}

/**
 * Sanitize a single user message.
 * Returns { ok: true, value } on success, or { ok: false, reason } on rejection.
 */
export function sanitizeMessage(input: string): SanitizeResult {
  // 1. Trim whitespace
  const trimmed = input.trim();

  // 2. Reject empty messages
  if (trimmed.length === 0) {
    return { ok: false, value: "", reason: "Message cannot be empty." };
  }

  // 3. Enforce max length
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      value: "",
      reason: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  // 4. Remove null bytes and non-printable control characters (except newlines/tabs)
  const cleaned = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 5. Check for prompt injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(cleaned)) {
      return {
        ok: false,
        value: "",
        reason: "Message contains disallowed content.",
      };
    }
  }

  return { ok: true, value: cleaned };
}

/**
 * Sanitize the conversation history array.
 * - Caps history length to MAX_HISTORY_MESSAGES
 * - Sanitizes each message content
 * - Filters out any messages that fail sanitization
 */
export function sanitizeHistory(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Array<{ role: "user" | "assistant"; content: string }> {
  // Take only the most recent messages to cap history size
  const recent = messages.slice(-MAX_HISTORY_MESSAGES);

  return recent
    .map((msg) => {
      const result = sanitizeMessage(msg.content);
      if (!result.ok) return null;
      return { role: msg.role, content: result.value };
    })
    .filter((msg): msg is { role: "user" | "assistant"; content: string } => msg !== null);
}
