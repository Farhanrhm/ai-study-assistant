"use client";

interface Props {
  onSelect: (q: string) => void;
  subject: string;
  language: "id" | "en";
}

export default function SuggestedQuestions({ onSelect, subject, language }: Props) {
  // Database pertanyaan berdasarkan bahasa dan mata pelajaran
  const suggestions = {
    id: {
      Mathematics: [
        "Jelaskan Teorema Pythagoras dengan contoh",
        "Bantu saya menyelesaikan persamaan kuadrat",
        "Apa perbedaan permutasi dan kombinasi?",
        "Bagaimana cara menghitung peluang?"
      ],
      Physics: [
        "Jelaskan 3 Hukum Newton",
        "Apa itu Gerak Lurus Berubah Beraturan (GLBB)?",
        "Bantu saya memahami konsep gaya gesek",
        "Apa perbedaan massa dan berat?"
      ],
      Chemistry: [
        "Jelaskan konsep ikatan kovalen",
        "Bagaimana cara menyeimbangkan reaksi kimia?",
        "Apa perbedaan asam dan basa?",
        "Jelaskan sistem periodik unsur"
      ],
      Biology: [
        "Jelaskan proses fotosintesis pada tumbuhan",
        "Apa perbedaan sel hewan dan sel tumbuhan?",
        "Bagaimana sistem pernapasan manusia bekerja?",
        "Jelaskan teori evolusi Darwin"
      ],
      History: [
        "Ceritakan sejarah kemerdekaan Indonesia",
        "Apa penyebab terjadinya Perang Dunia II?",
        "Jelaskan tentang Revolusi Industri",
        "Siapa saja tokoh penting dalam Sumpah Pemuda?"
      ],
      "Computer Science": [
        "Apa itu Machine Learning?",
        "Jelaskan perbedaan frontend dan backend",
        "Bagaimana cara kerja algoritma sorting?",
        "Bantu saya memahami struktur data Array"
      ],
      Economics: [
        "Jelaskan hukum permintaan dan penawaran",
        "Apa perbedaan inflasi dan deflasi?",
        "Bagaimana cara menghitung PDB?",
        "Jelaskan sistem ekonomi pasar"
      ]
    },
    en: {
      Mathematics: [
        "Explain the Pythagorean theorem with examples",
        "Help me solve a quadratic equation",
        "What is the difference between permutation and combination?",
        "How to calculate probability?"
      ],
      Physics: [
        "Explain Newton's 3 Laws of Motion",
        "What is uniformly accelerated linear motion?",
        "Help me understand the concept of friction",
        "What is the difference between mass and weight?"
      ],
      Chemistry: [
        "Explain the concept of covalent bonds",
        "How to balance a chemical equation?",
        "What is the difference between acid and base?",
        "Explain the periodic table of elements"
      ],
      Biology: [
        "Explain the photosynthesis process in plants",
        "What is the difference between animal and plant cells?",
        "How does the human respiratory system work?",
        "Explain Darwin's theory of evolution"
      ],
      History: [
        "Tell me about the history of World War II",
        "What were the causes of the French Revolution?",
        "Explain the Industrial Revolution",
        "Who were the key figures in the Cold War?"
      ],
      "Computer Science": [
        "What is Machine Learning?",
        "Explain the difference between frontend and backend",
        "How do sorting algorithms work?",
        "Help me understand Array data structure"
      ],
      Economics: [
        "Explain the law of supply and demand",
        "What is the difference between inflation and deflation?",
        "How to calculate GDP?",
        "Explain the market economy system"
      ]
    }
  };

  // Pertanyaan default jika mata pelajaran tidak ditemukan
  const defaultQuestions = language === "id" 
    ? ["Apa topik utama pelajaran ini?", "Bantu saya buat ringkasan", "Jelaskan konsep dasarnya", "Berikan saya kuis pendek"]
    : ["What is the main topic?", "Help me summarize", "Explain the basic concepts", "Give me a short quiz"];

  // Ambil pertanyaan sesuai pilihan bahasa dan mata pelajaran saat ini
  const currentQuestions = (suggestions[language] as any)[subject] || defaultQuestions;

  // Sesuaikan Judul berdasarkan bahasa
  const title = language === "id" ? "Selamat datang di AI Study Assistant! 👋" : "Welcome to AI Study Assistant! 👋";
  const subtitle = language === "id" 
    ? `Mulai belajar ${subject} dengan memilih topik di bawah ini.`
    : `Start learning ${subject} by selecting a topic below.`;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestions.map((question: string, index: number) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 text-left"
          >
            <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 font-medium leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {question}
            </span>
            <span className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all">
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
