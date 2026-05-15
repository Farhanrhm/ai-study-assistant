import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeSelector from "@/components/ModeSelector";

describe("ModeSelector", () => {
  it("renders three mode buttons", () => {
    render(<ModeSelector value="Explain" onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /explain mode/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quiz mode/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /summary mode/i })).toBeInTheDocument();
  });

  it("marks the active mode button with aria-pressed=true", () => {
    render(<ModeSelector value="Quiz" onChange={vi.fn()} />);
    const quizBtn = screen.getByRole("button", { name: /quiz mode/i });
    expect(quizBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("marks inactive mode buttons with aria-pressed=false", () => {
    render(<ModeSelector value="Quiz" onChange={vi.fn()} />);
    const explainBtn = screen.getByRole("button", { name: /explain mode/i });
    const summaryBtn = screen.getByRole("button", { name: /summary mode/i });
    expect(explainBtn).toHaveAttribute("aria-pressed", "false");
    expect(summaryBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the selected mode when a button is clicked", () => {
    const onChange = vi.fn();
    render(<ModeSelector value="Explain" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /summary mode/i }));
    expect(onChange).toHaveBeenCalledWith("Summary");
  });

  it("has a group aria-label for accessibility", () => {
    render(<ModeSelector value="Explain" onChange={vi.fn()} />);
    expect(screen.getByRole("group", { name: /select learning mode/i })).toBeInTheDocument();
  });
});
