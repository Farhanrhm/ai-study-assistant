import { Subject, Mode } from "@/types/index";

const modeInstructions: Record<Mode, string> = {
  Explain:
    "Provide clear, step-by-step explanations with relevant examples. Break down complex concepts into understandable parts.",
  Quiz: "Generate practice questions related to the topic. When the user answers, evaluate their response and provide constructive feedback.",
  Summary:
    "Produce concise, well-structured summaries of the provided topic. Highlight key concepts and important points.",
};

/**
 * Builds a system prompt string for the AI Tutor based on the selected
 * subject and learning mode.
 *
 * Pure function — no side effects, deterministic output.
 */
export function buildSystemPrompt(subject: Subject, mode: Mode): string {
  return `You are an expert AI Tutor specializing in ${subject} for university-level students.
Your role is to assist students with their studies in a clear, accurate, and encouraging manner.
You must only respond to questions and topics related to ${subject} and educational content.
If asked about unrelated topics, politely decline and redirect the conversation to ${subject}.
Use language appropriate for university-level students.

Current Mode: ${mode}
${modeInstructions[mode]}`;
}
