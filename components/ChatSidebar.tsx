"use client";

import { useState } from "react";
import { ChatSession, Subject, Mode } from "@/types/index";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SUBJECT_COLORS: Record<Subject, string> = {
  Mathematics:       "bg-blue-100 text-blue-700",
  Physics:           "bg-orange-100 text-orange-700",
  Chemistry:         "bg-green-100 text-green-700",
  Biology:           "bg-emerald-100 text-emerald-700",
  History:           "bg-amber-100 text-amber-700",
  "Computer Science":"bg-violet-100 text-violet-700",
  Economics:         "bg-rose-100 text-rose-700",
};

const MODE_ICONS: Record<Mode, string> = {
  Explain: "📖",
  Quiz:    "✏️",
  Summary: "📝",
};

function formatDate(date: Date): string {
  const now = new Date();
  const d = date instanceof Date ? date : new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function startRename(session: ChatSession) {
    setEditingId(session.id);
    setEditingTitle(session.title);
  }

  function commitRename(id: string) {
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        aria-label="Chat history"
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-gray-200 bg-white shadow-xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 lg:relative lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:-ml-72"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">🎓</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">Study History</span>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 py-3">
          <button
            type="button"
            aria-label="Start a new chat"
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Session list */}
        <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-4">
          {sessions.length === 0 ? (
            <div className="mt-8 flex flex-col items-center gap-2 px-4 text-center">
              <span className="text-3xl" aria-hidden="true">💬</span>
              <p className="text-sm text-gray-400">No chat history yet. Start a new chat!</p>
            </div>
          ) : (
            <ul role="list" className="flex flex-col gap-1">
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                const isEditing = editingId === session.id;
                const isHovered = hoveredId === session.id;

                return (
                  <li key={session.id}>
                    <div
                      className={`group relative flex cursor-pointer flex-col gap-1 rounded-xl px-3 py-2.5 transition-colors ${
                        isActive
                          ? "bg-indigo-50 ring-1 ring-indigo-200 dark:bg-indigo-900/30 dark:ring-indigo-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => !isEditing && onSelectSession(session.id)}
                      onMouseEnter={() => setHoveredId(session.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open chat: ${session.title}`}
                      aria-current={isActive ? "page" : undefined}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectSession(session.id);
                        }
                      }}
                    >
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-1">
                        {isEditing ? (
                          <input
                            autoFocus
                            aria-label="Rename chat"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => commitRename(session.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename(session.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full rounded border border-indigo-300 bg-white px-1.5 py-0.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : (
                          <span className={`line-clamp-2 text-sm font-medium ${isActive ? "text-indigo-900 dark:text-indigo-100" : "text-gray-800 dark:text-gray-200"}`}>
                            {session.title}
                          </span>
                        )}

                        {/* Action buttons — show on hover or active */}
                        {!isEditing && (isHovered || isActive) && (
                          <div className="flex shrink-0 items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              aria-label={`Rename chat: ${session.title}`}
                              onClick={() => startRename(session)}
                              className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                                <path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L6.75 6.774a2.75 2.75 0 00-.596.892l-.848 2.047a.75.75 0 00.98.98l2.047-.848a2.75 2.75 0 00.892-.596l4.261-4.263a1.75 1.75 0 000-2.474zM4.75 8.75l-.857 2.062 2.062-.857a1.25 1.25 0 00.405-.271L10.622 5.5 10.5 5.378 6.271 9.607a1.25 1.25 0 00-.271.405z" />
                                <path d="M3.5 3.75c0-.966.784-1.75 1.75-1.75h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-2.5a.75.75 0 011.5 0v2.5A1.75 1.75 0 0113.75 14h-8.5A1.75 1.75 0 013.5 12.25v-8.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete chat: ${session.title}`}
                              onClick={() => onDeleteSession(session.id)}
                              className="rounded p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-1 focus:ring-red-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                                <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5a.75.75 0 01.786-.711z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center gap-1.5">
                        <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${SUBJECT_COLORS[session.subject]}`}>
                          {session.subject}
                        </span>
                        <span className="text-xs text-gray-400" aria-hidden="true">·</span>
                        <span className="text-xs text-gray-400">
                          {MODE_ICONS[session.mode]} {session.mode}
                        </span>
                        <span className="ml-auto text-xs text-gray-300">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-400">
            {sessions.length} chat{sessions.length !== 1 ? "s" : ""} saved locally
          </p>
        </div>
      </aside>
    </>
  );
}
