"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatSession, Message, Subject, Mode } from "@/types/index";

const STORAGE_KEY = "ai-study-assistant-sessions";
const MAX_SESSIONS = 30;

// Serialize/deserialize dates since JSON doesn't support Date objects
function serializeSessions(sessions: ChatSession[]): string {
  return JSON.stringify(sessions);
}

function deserializeSessions(raw: string): ChatSession[] {
  const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
  return parsed.map((s) => ({
    ...s,
    createdAt: new Date(s.createdAt as string),
    updatedAt: new Date(s.updatedAt as string),
    messages: (s.messages as Array<Record<string, unknown>>).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp as string),
    })),
  })) as ChatSession[];
}

function generateTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  if (trimmed.length <= 50) return trimmed;
  return trimmed.slice(0, 47) + "…";
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const loaded = deserializeSessions(raw);
        setSessions(loaded);
      }
    } catch {
      // Ignore parse errors — start fresh
    }
  }, []);

  // Persist sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeSessions(sessions));
    } catch {
      // Ignore storage errors (e.g. private browsing quota)
    }
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  /** Create a new empty session and make it active */
  const createSession = useCallback((subject: Subject, mode: Mode): ChatSession => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      subject,
      mode,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      // Cap at MAX_SESSIONS — remove oldest
      return updated.slice(0, MAX_SESSIONS);
    });
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  /** Update messages in the active session */
  const updateSessionMessages = useCallback(
    (sessionId: string, messages: Message[]) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          // Auto-generate title from first user message
          const firstUserMsg = messages.find((m) => m.role === "user");
          const title =
            s.title === "New Chat" && firstUserMsg
              ? generateTitle(firstUserMsg.content)
              : s.title;
          return { ...s, messages, title, updatedAt: new Date() };
        })
      );
    },
    []
  );

  /** Switch to an existing session */
  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  /** Delete a session */
  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
    },
    [activeSessionId]
  );

  /** Rename a session */
  const renameSession = useCallback((sessionId: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title } : s))
    );
  }, []);

  return {
    sessions,
    activeSession,
    activeSessionId,
    createSession,
    updateSessionMessages,
    switchSession,
    deleteSession,
    renameSession,
    setActiveSessionId,
  };
}
