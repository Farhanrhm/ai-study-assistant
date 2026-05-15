"use client";

export default function LoadingIndicator() {
  return (
    <div
      aria-label="AI is typing"
      role="status"
      className="flex items-center gap-1.5 px-4 py-3"
    >
      <span className="sr-only">AI is typing</span>
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 dark:bg-indigo-500 [animation-delay:-0.3s]"
        aria-hidden="true"
      />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 dark:bg-indigo-500 [animation-delay:-0.15s]"
        aria-hidden="true"
      />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 dark:bg-indigo-500"
        aria-hidden="true"
      />
    </div>
  );
}
