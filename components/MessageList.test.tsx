import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageList from "@/components/MessageList";
import { Message } from "@/types/index";

// jsdom does not implement scrollIntoView — mock it globally
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

const messages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What is calculus?",
    timestamp: new Date("2024-01-01T10:00:00"),
  },
  {
    id: "2",
    role: "assistant",
    content: "Calculus is the study of change.",
    timestamp: new Date("2024-01-01T10:00:05"),
  },
];

describe("MessageList", () => {
  it("renders all messages", () => {
    render(<MessageList messages={messages} isLoading={false} />);
    expect(screen.getByText("What is calculus?")).toBeInTheDocument();
    expect(screen.getByText("Calculus is the study of change.")).toBeInTheDocument();
  });

  it("shows empty state message when no messages and not loading", () => {
    render(<MessageList messages={[]} isLoading={false} />);
    expect(
      screen.getByText(/start a conversation/i)
    ).toBeInTheDocument();
  });

  it("shows LoadingIndicator when isLoading is true", () => {
    render(<MessageList messages={[]} isLoading={true} />);
    expect(screen.getByRole("status", { name: /ai is typing/i })).toBeInTheDocument();
  });

  it("does not show LoadingIndicator when isLoading is false", () => {
    render(<MessageList messages={messages} isLoading={false} />);
    expect(screen.queryByRole("status", { name: /ai is typing/i })).not.toBeInTheDocument();
  });

  it("has role='log' and aria-label for accessibility", () => {
    render(<MessageList messages={[]} isLoading={false} />);
    expect(screen.getByRole("log", { name: /chat messages/i })).toBeInTheDocument();
  });

  it("renders messages in order", () => {
    render(<MessageList messages={messages} isLoading={false} />);
    const allText = screen.getByRole("log").textContent ?? "";
    const userIdx = allText.indexOf("What is calculus?");
    const assistantIdx = allText.indexOf("Calculus is the study of change.");
    expect(userIdx).toBeLessThan(assistantIdx);
  });
});
