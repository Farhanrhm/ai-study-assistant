"use client";

import { Subject, Mode } from "@/types/index";

interface SuggestedQuestionsProps {
  subject: Subject;
  mode: Mode;
  onSelect: (question: string) => void;
}

const SUGGESTIONS: Record<Subject, Record<Mode, string[]>> = {
  Mathematics: {
    Explain: [
      "Explain the Pythagorean theorem with examples",
      "How does calculus differentiation work?",
      "What is a matrix and how is it used?",
    ],
    Quiz: [
      "Quiz me on basic algebra",
      "Give me 3 calculus problems to solve",
      "Test my knowledge of trigonometry",
    ],
    Summary: [
      "Summarize the key concepts of linear algebra",
      "Give me a summary of probability theory",
      "Summarize integration techniques",
    ],
  },
  Physics: {
    Explain: [
      "Explain Newton's three laws of motion",
      "How does quantum mechanics work?",
      "What is the theory of relativity?",
    ],
    Quiz: [
      "Quiz me on classical mechanics",
      "Test my understanding of thermodynamics",
      "Give me problems on electromagnetism",
    ],
    Summary: [
      "Summarize the laws of thermodynamics",
      "Give me a summary of wave mechanics",
      "Summarize electrostatics concepts",
    ],
  },
  Chemistry: {
    Explain: [
      "Explain how chemical bonding works",
      "What is the periodic table and how is it organized?",
      "How do acid-base reactions work?",
    ],
    Quiz: [
      "Quiz me on organic chemistry reactions",
      "Test my knowledge of the periodic table",
      "Give me stoichiometry problems",
    ],
    Summary: [
      "Summarize organic chemistry fundamentals",
      "Give me a summary of electrochemistry",
      "Summarize chemical equilibrium concepts",
    ],
  },
  Biology: {
    Explain: [
      "Explain how DNA replication works",
      "What is natural selection and evolution?",
      "How does the human immune system work?",
    ],
    Quiz: [
      "Quiz me on cell biology",
      "Test my knowledge of genetics",
      "Give me questions on human anatomy",
    ],
    Summary: [
      "Summarize the central dogma of molecular biology",
      "Give me a summary of ecosystem ecology",
      "Summarize the process of photosynthesis",
    ],
  },
  History: {
    Explain: [
      "Explain the causes of World War I",
      "What led to the fall of the Roman Empire?",
      "How did the Industrial Revolution change society?",
    ],
    Quiz: [
      "Quiz me on World War II events",
      "Test my knowledge of ancient civilizations",
      "Give me questions on the Cold War",
    ],
    Summary: [
      "Summarize the key events of the French Revolution",
      "Give me a summary of the Renaissance period",
      "Summarize the causes and effects of colonialism",
    ],
  },
  "Computer Science": {
    Explain: [
      "Explain how sorting algorithms work",
      "What is object-oriented programming?",
      "How does a computer network work?",
    ],
    Quiz: [
      "Quiz me on data structures",
      "Test my knowledge of algorithms",
      "Give me questions on database design",
    ],
    Summary: [
      "Summarize the key concepts of operating systems",
      "Give me a summary of machine learning basics",
      "Summarize software design patterns",
    ],
  },
  Economics: {
    Explain: [
      "Explain supply and demand with examples",
      "How does inflation affect the economy?",
      "What is GDP and how is it measured?",
    ],
    Quiz: [
      "Quiz me on microeconomics concepts",
      "Test my knowledge of macroeconomics",
      "Give me questions on market structures",
    ],
    Summary: [
      "Summarize Keynesian economics theory",
      "Give me a summary of international trade theory",
      "Summarize the concepts of monetary policy",
    ],
  },
};

export default function SuggestedQuestions({
  subject,
  mode,
  onSelect,
}: SuggestedQuestionsProps) {
  const questions = SUGGESTIONS[subject]?.[mode] ?? [];

  return (
    <div className="mt-4 flex flex-col gap-2">
      <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">
        Try asking…
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        {questions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
