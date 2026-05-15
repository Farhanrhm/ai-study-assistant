"use client";

import { useState, useRef, KeyboardEvent } from "react";

const MAX_CHARS = 2000;
// Rough token estimate: ~4 chars per token
const CHARS_PER_TOKEN = 4;

interface MessageInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
  totalTokensUsed?: number;
}

export default function MessageInput({
  onSubmit,
  disabled,
  totalTokensUsed = 0,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0 && text.length <= MAX_CHARS && !disabled;
  const charsRemaining = MAX_CHARS - text.length;
  const isOverLimit = text.length > MAX_CHARS;
  const isNearLimit = !isOverLimit && charsRemaining <= 200;

  // Estimated tokens for current input
  const estimatedTokens = Math.ceil(text.length / CHARS_PER_TOKEN);

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Input container */}
      <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm transition-colors focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:border-indigo-500 dark:focus-within:bg-gray-800 dark:focus-within:ring-indigo-900">
        <textarea
          ref={textareaRef}
          aria-label="Type your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={disabled ? "AI is thinking…" : "Ask anything… (Enter to send, Shift+Enter for new line)"}
          className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed text-gray-900 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-100 dark:placeholder-gray-500"
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />
        <button
          type="button"
          aria-label="Send message"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? (
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>

      {/* Footer row: token counter + char limit warning */}
      <div className="flex items-center justify-between px-1">
        {/* Token counter */}
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          {text.length > 0 && (
            <span>~{estimatedTokens} tokens</span>
          )}
          {totalTokensUsed > 0 && (
            <>
              {text.length > 0 && <span aria-hidden="true">·</span>}
              <span
                className={
                  totalTokensUsed > 200000
                    ? "text-red-500"
                    : totalTokensUsed > 150000
                    ? "text-amber-500"
                    : "text-gray-400 dark:text-gray-500"
                }
                title="Estimated total tokens used in this session"
              >
                Session: ~{totalTokensUsed.toLocaleString()} tokens
                {totalTokensUsed > 150000 && " ⚠️"}
              </span>
            </>
          )}
        </div>

        {/* Char limit warning */}
        {(isNearLimit || isOverLimit) ? (
          <p
            className={`text-xs ${isOverLimit ? "text-red-500" : "text-amber-500"}`}
            aria-live="polite"
          >
            {isOverLimit
              ? `${Math.abs(charsRemaining)} over limit`
              : `${charsRemaining} left`}
          </p>
        ) : (
          !disabled && text.length === 0 && (
            <p className="hidden text-xs text-gray-300 dark:text-gray-600 sm:block">
              Enter to send · Shift+Enter for new line
            </p>
          )
        )}
      </div>
    </div>
  );
}
