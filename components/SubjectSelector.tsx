"use client";

import { Subject } from "@/types/index";

const SUBJECTS: Subject[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Computer Science",
  "Economics",
];

interface SubjectSelectorProps {
  value: Subject;
  onChange: (subject: Subject) => void;
  disabled: boolean;
}

export default function SubjectSelector({
  value,
  onChange,
  disabled,
}: SubjectSelectorProps) {
  return (
    <select
      aria-label="Select a study subject"
      value={value}
      onChange={(e) => onChange(e.target.value as Subject)}
      disabled={disabled}
      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-indigo-300 hover:bg-white focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {SUBJECTS.map((subject) => (
        <option key={subject} value={subject}>
          {subject}
        </option>
      ))}
    </select>
  );
}
