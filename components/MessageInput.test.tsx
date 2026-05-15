import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageInput from "@/components/MessageInput";

describe("MessageInput", () => {
  it("renders a textarea with aria-label", () => {
    render(<MessageInput onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("textbox", { name: /type your message/i })).toBeInTheDocument();
  });

  it("renders a send button with aria-label", () => {
    render(<MessageInput onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("calls onSubmit with trimmed text when send button is clicked", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<MessageInput onSubmit={onSubmit} disabled={false} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "  Hello world  ");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(onSubmit).toHaveBeenCalledWith("Hello world");
  });

  it("clears the textarea after submit", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={vi.fn()} disabled={false} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    await user.type(textarea, "Hello");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(textarea.value).toBe("");
  });

  it("does not call onSubmit for empty/whitespace-only input", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<MessageInput onSubmit={onSubmit} disabled={false} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "   ");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits on Enter key (without Shift)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<MessageInput onSubmit={onSubmit} disabled={false} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello");
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("Hello");
  });

  it("does not submit on Shift+Enter", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<MessageInput onSubmit={onSubmit} disabled={false} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello");
    await user.keyboard("{Shift>}{Enter}{/Shift}");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables textarea and send button when disabled prop is true", () => {
    render(<MessageInput onSubmit={vi.fn()} disabled={true} />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /send message/i }) as HTMLButtonElement;
    expect(textarea.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it("shows character count", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={vi.fn()} disabled={false} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hi");

    // 2000 - 2 = 1998 remaining
    expect(screen.getByText("1998 characters remaining")).toBeInTheDocument();
  });
});
