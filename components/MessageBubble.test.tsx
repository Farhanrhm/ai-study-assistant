import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageBubble from "@/components/MessageBubble";
import { Message } from "@/types/index";

const userMessage: Message = {
  id: "1",
  role: "user",
  content: "Hello, can you explain calculus?",
  timestamp: new Date("2024-01-01T10:00:00"),
};

const assistantMessage: Message = {
  id: "2",
  role: "assistant",
  content: "Sure! Calculus is the study of change.",
  timestamp: new Date("2024-01-01T10:00:05"),
};

describe("MessageBubble", () => {
  it("renders the message content", () => {
    render(<MessageBubble message={userMessage} />);
    expect(screen.getByText("Hello, can you explain calculus?")).toBeInTheDocument();
  });

  it("renders assistant message content", () => {
    render(<MessageBubble message={assistantMessage} />);
    expect(screen.getByText("Sure! Calculus is the study of change.")).toBeInTheDocument();
  });

  it("applies user-message class for user role", () => {
    const { container } = render(<MessageBubble message={userMessage} />);
    const bubble = container.querySelector(".user-message");
    expect(bubble).not.toBeNull();
  });

  it("applies assistant-message class for assistant role", () => {
    const { container } = render(<MessageBubble message={assistantMessage} />);
    const bubble = container.querySelector(".assistant-message");
    expect(bubble).not.toBeNull();
  });

  it("user and assistant messages have different CSS classes", () => {
    const { container: userContainer } = render(<MessageBubble message={userMessage} />);
    const { container: assistantContainer } = render(<MessageBubble message={assistantMessage} />);

    const userBubble = userContainer.querySelector("[class*='user-message']");
    const assistantBubble = assistantContainer.querySelector("[class*='assistant-message']");

    expect(userBubble).not.toBeNull();
    expect(assistantBubble).not.toBeNull();

    // They should not share the same distinguishing class
    expect(userBubble?.className).not.toBe(assistantBubble?.className);
  });

  it("shows 'AI Tutor' label for assistant messages", () => {
    render(<MessageBubble message={assistantMessage} />);
    expect(screen.getByText("AI Tutor")).toBeInTheDocument();
  });

  it("does not show 'AI Tutor' label for user messages", () => {
    render(<MessageBubble message={userMessage} />);
    expect(screen.queryByText("AI Tutor")).not.toBeInTheDocument();
  });
});
