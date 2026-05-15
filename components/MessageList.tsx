"use client";

import { useRef, useEffect } from "react";
import { Message, Subject, Mode } from "@/types/index";
import MessageBubble from "@/components/MessageBubble";
import LoadingIndicator from "@/components/LoadingIndicator";
import SuggestedQuestions from "@/components/SuggestedQuestions";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent?: string;
  subject: Subject;
  mode: Mode;
  language: "id" | "en";
  onSuggestedQuestion: (q: string) => void;
  onRegenerate: () => void;
}

export default function MessageList({
  messages,
  isLoading,
  streamingContent,
  subject,
  mode,
  language,
  onSuggestedQuestion,
  onRegenerate,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, streamingContent]);

  const lastAssistantIndex = messages.reduce(
    (last, msg, i) => (msg.role === "assistant" ? i : last),
    -1
  );

  return (
    <div
      aria-label="Chat messages"
      role="log"
      aria-live="polite"
      className="scrollbar-thin flex flex-1 flex-col overflow-y-auto dark:bg-gray-900"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">

        {/* Empty state + suggested questions */}
        {messages.length === 0 && !isLoading && !streamingContent && (
          <div className="m-auto flex w-full max-w-md flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl shadow-sm dark:bg-indigo-900">
              🎓
            </div>
            <div>
              <p className="mb-1 font-semibold text-gray-700 dark:text-gray-200">Ready to study?</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Select a subject and mode above, then type your first question below.
              </p>
            </div>
            <SuggestedQuestions
              subject={subject}
              language={language}
              onSelect={onSuggestedQuestion}
            />
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLastAssistant={index === lastAssistantIndex}
            onRegenerate={index === lastAssistantIndex ? onRegenerate : undefined}
          />
        ))}

        {/* Streaming bubble — shows while AI is typing */}
        {streamingContent && (
          <MessageBubble
            message={{
              id: "streaming",
              role: "assistant",
              content: streamingContent,
              timestamp: new Date(),
            }}
            isStreaming
          />
        )}

        {/* Dots loading — shown before first streaming token arrives */}
        {isLoading && !streamingContent && (
          <div className="flex items-end gap-2">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white shadow-sm"
            >
              AI
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-white ring-1 ring-gray-100 shadow-sm dark:bg-gray-800 dark:ring-gray-700">
              <LoadingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
    </div>
  );
}
