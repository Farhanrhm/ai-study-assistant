import { Subject, Mode, LLMRequestPayload } from "@/types/index";
import { buildSystemPrompt } from "@/lib/systemPrompt";

/**
 * Constructs the full LLM API request payload by combining:
 *   1. A system message (built from subject + mode)
 *   2. The existing conversation history
 *   3. The new user message
 *
 * Resulting order: [{ role: "system" }, ...conversationHistory, newUserMessage]
 *
 * Pure function — no side effects, deterministic output.
 *
 * @param messages   Existing conversation history (user/assistant turns)
 * @param subject    Currently selected study subject
 * @param mode       Currently selected learning mode
 * @param newMessage The new user message to append
 * @returns          A fully-formed LLMRequestPayload ready to send to the LLM API
 */
export function buildLLMPayload(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  subject: Subject,
  mode: Mode,
  newMessage: string
): LLMRequestPayload {
  const systemContent = buildSystemPrompt(subject, mode);

  return {
    model: "gemini-2.5-flash",
    messages: [
      { role: "system", content: systemContent },
      ...messages,
      { role: "user", content: newMessage },
    ],
    temperature: 0.7,
    // Google AI Studio OpenAI-compatible endpoint uses max_completion_tokens
    max_completion_tokens: 1024,
  };
}
