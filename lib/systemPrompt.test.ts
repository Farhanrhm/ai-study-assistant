import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { Subject, Mode } from "@/types/index";

const subjects: Subject[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Computer Science",
  "Economics",
];

const modes: Mode[] = ["Explain", "Quiz", "Summary"];

describe("buildSystemPrompt", () => {
  it("returns a non-empty string for every subject/mode combination", () => {
    for (const subject of subjects) {
      for (const mode of modes) {
        const prompt = buildSystemPrompt(subject, mode);
        expect(typeof prompt).toBe("string");
        expect(prompt.length).toBeGreaterThan(0);
      }
    }
  });

  it("includes the subject name in the prompt", () => {
    const prompt = buildSystemPrompt("Mathematics", "Explain");
    expect(prompt).toContain("Mathematics");
  });

  it("includes the mode in the prompt", () => {
    const prompt = buildSystemPrompt("Physics", "Quiz");
    expect(prompt).toContain("Quiz");
  });

  it("includes educational scope restriction", () => {
    const prompt = buildSystemPrompt("Chemistry", "Summary");
    // Should instruct AI to stay on topic
    expect(prompt.toLowerCase()).toMatch(/only respond|educational|decline/);
  });

  it("includes university-level language instruction", () => {
    const prompt = buildSystemPrompt("Biology", "Explain");
    expect(prompt.toLowerCase()).toContain("university");
  });

  it("produces different prompts for different subject/mode combinations", () => {
    const prompt1 = buildSystemPrompt("Mathematics", "Explain");
    const prompt2 = buildSystemPrompt("Physics", "Quiz");
    expect(prompt1).not.toBe(prompt2);
  });

  it("produces different prompts when only subject differs", () => {
    const prompt1 = buildSystemPrompt("Mathematics", "Explain");
    const prompt2 = buildSystemPrompt("Physics", "Explain");
    expect(prompt1).not.toBe(prompt2);
  });

  it("produces different prompts when only mode differs", () => {
    const prompt1 = buildSystemPrompt("Mathematics", "Explain");
    const prompt2 = buildSystemPrompt("Mathematics", "Quiz");
    expect(prompt1).not.toBe(prompt2);
  });

  it("is deterministic — same inputs always produce same output", () => {
    const a = buildSystemPrompt("Computer Science", "Summary");
    const b = buildSystemPrompt("Computer Science", "Summary");
    expect(a).toBe(b);
  });
});
