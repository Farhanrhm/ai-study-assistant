"use client";

import { Mode } from "@/types/index";

const MODES: { value: Mode; label: string; icon: string }[] = [
  { value: "Explain", label: "Explain", icon: "📖" },
  { value: "Quiz",    label: "Quiz",    icon: "✏️" },
  { value: "Summary", label: "Summary", icon: "📝" },
];

interface ModeSelectorProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Select learning mode"
      className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 shadow-sm"
    >
      {MODES.map(({ value: modeValue, label, icon }) => {
        const isActive = value === modeValue;
        return (
          <button
            key={modeValue}
            type="button"
            aria-label={`${label} mode`}
            aria-pressed={isActive}
            onClick={() => onChange(modeValue)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
              isActive
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span aria-hidden="true" className="text-base leading-none">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
