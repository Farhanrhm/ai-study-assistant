"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Message } from "@/types/index";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

export default function MessageBubble({
  message,
  isStreaming = false,
  onRegenerate,
  isLastAssistant = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const time =
    message.timestamp instanceof Date
      ? message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  return (
    <div
      className={`flex w-full items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      data-role={message.role}
    >
      {/* Avatar */}
      <div
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
        }`}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble + actions */}
      <div
        className={`group flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
        style={{ maxWidth: "min(85%, 600px)" }}
      >
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "user-message rounded-br-sm bg-indigo-600 text-white"
              : "assistant-message rounded-bl-sm bg-white text-gray-800 ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700"
          }`}
        >
          {!isUser && (
            <p className="mb-1.5 text-xs font-semibold text-indigo-500 dark:text-indigo-400">
              AI Tutor
            </p>
          )}

          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose-chat break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message.content}
              </ReactMarkdown>
              {/* Blinking cursor while streaming */}
              {isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-500" aria-hidden="true" />
              )}
            </div>
          )}
        </div>

        {/* Timestamp + action buttons */}
        <div className={`flex items-center gap-1.5 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <p className="text-xs text-gray-400 dark:text-gray-500" aria-label={`Sent at ${time}`}>
            {time}
          </p>

          {!isUser && !isStreaming && (
            <>
              {/* Copy button */}
              <button
                type="button"
                aria-label={copied ? "Copied!" : "Copy response"}
                onClick={handleCopy}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-green-500" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M3.5 2A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h5a1.5 1.5 0 001.5-1.5V12h1.5A1.5 1.5 0 0013 10.5v-7A1.5 1.5 0 0011.5 2h-5A1.5 1.5 0 005 3.5V4H3.5zM5 4V3.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H10V6.5A1.5 1.5 0 008.5 5H5V4zm-1.5 1H5v5.5A1.5 1.5 0 006.5 12H9v.5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>

              {/* Regenerate button — only on last AI message */}
              {isLastAssistant && onRegenerate && (
                <button
                  type="button"
                  aria-label="Regenerate response"
                  onClick={onRegenerate}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-indigo-600 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z" clipRule="evenodd" />
                  </svg>
                  Regenerate
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
