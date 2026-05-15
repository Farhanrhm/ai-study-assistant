"use client";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  // Daftar pertanyaan saran
  const questions = [
    "Apa itu LLM (Large Language Model)?",
    "Jelaskan konsep dasar Machine Learning",
    "Bagaimana cara belajar pemrograman dengan efektif?",
    "Bantu saya membuat ringkasan materi"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Selamat datang di AI Study Assistant! 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Mulai percakapan dengan memilih salah satu topik di bawah ini, atau ketik pertanyaanmu sendiri.
        </p>
      </div>

      {/* Grid responsif: 1 kolom di HP, 2 kolom di Laptop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 text-left"
          >
            <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 font-medium leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {question}
            </span>
            <span className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all">
              {/* Icon panah ke kanan */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
