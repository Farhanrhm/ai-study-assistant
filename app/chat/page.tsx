"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Message, Subject, Mode } from "@/types/index";
import { useChatSessions } from "@/lib/useChatSessions";
import SubjectSelector from "@/components/SubjectSelector";
import ModeSelector from "@/components/ModeSelector";
import ClearChatButton from "@/components/ClearChatButton";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import ChatSidebar from "@/components/ChatSidebar";
import DarkModeToggle from "@/components/DarkModeToggle";

// Rough token estimate: ~4 chars per token
const CHARS_PER_TOKEN = 4;

function estimateTokens(text: string) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export default function ChatPage() {
  const [subject, setSubject] = useState<Subject>("Mathematics");
  const [mode, setMode] = useState<Mode>("Explain");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    sessions,
    activeSession,
    activeSessionId,
    createSession,
    updateSessionMessages,
    switchSession,
    deleteSession,
    renameSession,
  } = useChatSessions();

  useEffect(() => {
    if (activeSession) {
      setSubject(activeSession.subject);
      setMode(activeSession.mode);
    }
  }, [activeSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const messages = activeSession?.messages ?? [];

  // Estimate total session tokens
  const totalTokensUsed = messages.reduce(
    (sum, m) => sum + estimateTokens(m.content),
    0
  );

  function getOrCreateSession(): string {
    if (activeSessionId) return activeSessionId;
    const session = createSession(subject, mode);
    return session.id;
  }

  async function sendMessages(
    messagesToSend: Message[],
    sessionId: string
  ) {
    setIsLoading(true);
    setStreamingContent("");
    setError(null);

    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: messagesToSend.map(({ role, content }) => ({ role, content })),
          subject,
          mode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage =
          (data as { error?: string }).error ?? "An unexpected error occurred.";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Read the SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (!reader) {
        setError("No response stream received.");
        setIsLoading(false);
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setStreamingContent(accumulated);
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      // Streaming complete — save final message
      if (accumulated.trim()) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: accumulated,
          timestamp: new Date(),
        };
        updateSessionMessages(sessionId, [...messagesToSend, aiMessage]);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Unable to reach the server. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  }

  async function handleSendMessage(text: string) {
    if (!text.trim()) return;

    const sessionId = getOrCreateSession();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    updateSessionMessages(sessionId, updatedMessages);
    await sendMessages(updatedMessages, sessionId);
  }

  async function handleRegenerate() {
    if (messages.length < 2) return;
    const sessionId = activeSessionId ?? getOrCreateSession();

    // Remove last AI message, resend
    const withoutLastAI = messages.slice(0, -1);
    updateSessionMessages(sessionId, withoutLastAI);
    await sendMessages(withoutLastAI, sessionId);
  }

  function handleNewChat() {
    abortControllerRef.current?.abort();
    const session = createSession(subject, mode);
    setError(null);
    setStreamingContent("");
    setSidebarOpen(false);
    return session;
  }

  function handleSelectSession(id: string) {
    abortControllerRef.current?.abort();
    switchSession(id);
    setError(null);
    setStreamingContent("");
    setSidebarOpen(false);
  }

  function handleClearChat() {
    abortControllerRef.current?.abort();
    if (activeSessionId) updateSessionMessages(activeSessionId, []);
    setError(null);
    setStreamingContent("");
  }

  function handleSubjectChange(newSubject: Subject) {
    setSubject(newSubject);
    if (activeSession && activeSession.messages.length > 0) {
      createSession(newSubject, mode);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* ── Sidebar ── */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* ── Header ── */}
        <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-4">
          <button
            type="button"
            title="Toggle History"
            aria-label="Toggle chat history sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <Link
            href="/"
            aria-label="Back to home"
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Home</span>
          </Link>

          <h1 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100 sm:text-base">
            {activeSession?.title ?? "AI Study Assistant"}
          </h1>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <SubjectSelector value={subject} onChange={handleSubjectChange} disabled={isLoading} />
            <ModeSelector value={mode} onChange={setMode} />
            <ClearChatButton onClear={handleClearChat} disabled={messages.length === 0 && !streamingContent} />
            <DarkModeToggle />
          </div>
        </header>

        {/* ── Context pill ── */}
        <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs text-gray-400 dark:text-gray-500">Studying:</span>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            {subject}
          </span>
          <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
            {mode} Mode
          </span>
          {messages.length > 0 && (
            <>
              <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div role="alert" className="flex shrink-0 items-start gap-3 border-b border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="flex-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError(null)}
              className="rounded p-0.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:hover:bg-red-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Message list ── */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            streamingContent={streamingContent}
            subject={subject}
            mode={mode}
            onSuggestedQuestion={handleSendMessage}
            onRegenerate={handleRegenerate}
          />
        </main>

        {/* ── Input area ── */}
        <footer className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto w-full max-w-3xl">
            <MessageInput
              onSubmit={handleSendMessage}
              disabled={isLoading}
              totalTokensUsed={totalTokensUsed}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
