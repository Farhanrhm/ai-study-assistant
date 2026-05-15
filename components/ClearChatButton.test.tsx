import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ClearChatButton from "@/components/ClearChatButton";

describe("ClearChatButton", () => {
  it("renders a button with aria-label 'Clear chat history'", () => {
    render(<ClearChatButton onClear={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /clear chat history/i })
    ).toBeInTheDocument();
  });

  it("displays 'Clear Chat' text", () => {
    render(<ClearChatButton onClear={vi.fn()} />);
    expect(screen.getByText("Clear Chat")).toBeInTheDocument();
  });

  it("calls onClear when clicked", () => {
    const onClear = vi.fn();
    render(<ClearChatButton onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: /clear chat history/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
