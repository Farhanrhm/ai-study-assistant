import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingIndicator from "@/components/LoadingIndicator";

describe("LoadingIndicator", () => {
  it("renders with aria-label 'AI is typing'", () => {
    render(<LoadingIndicator />);
    expect(screen.getByRole("status", { name: /ai is typing/i })).toBeInTheDocument();
  });

  it("renders the screen-reader text", () => {
    render(<LoadingIndicator />);
    expect(screen.getByText("AI is typing")).toBeInTheDocument();
  });

  it("renders three animated dots", () => {
    const { container } = render(<LoadingIndicator />);
    const dots = container.querySelectorAll(".animate-bounce");
    expect(dots).toHaveLength(3);
  });
});
