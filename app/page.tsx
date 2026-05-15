import Link from "next/link";

const modes = [
  {
    name: "Explain",
    icon: "📖",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    description:
      "Get clear, step-by-step explanations with real examples. Perfect for understanding complex concepts.",
  },
  {
    name: "Quiz",
    icon: "✏️",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    description:
      "Practice with AI-generated questions. Get instant feedback and improve your understanding.",
  },
  {
    name: "Summary",
    icon: "📝",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    description:
      "Get concise, well-structured summaries that highlight the key concepts of any topic.",
  },
];

const subjects = [
  "Mathematics", "Physics", "Chemistry",
  "Biology", "History", "Computer Science", "Economics",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🎓</span>
          <span className="text-lg font-bold text-indigo-900">StudyAI</span>
        </div>
        <Link
          href="/chat"
          aria-label="Open chat interface"
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          Open Chat
        </Link>
      </nav>

      <div className="mx-auto max-w-5xl px-6 pb-20 pt-10 sm:px-10 sm:pt-16">
        {/* Hero */}
        <section className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />
            Powered by Google Gemini
          </div>
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Your Personal{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AI Tutor
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-500 sm:text-xl">
            Ask questions, get explanations, practice with quizzes, and review
            summaries — all tailored to your subject and learning style.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/chat"
              aria-label="Start Studying — go to chat interface"
              className="w-full rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-300 sm:w-auto"
            >
              Start Studying →
            </Link>
            <span className="text-sm text-gray-400">Free to use · No sign-up required</span>
          </div>
        </section>

        {/* Modes */}
        <section className="mb-16" aria-labelledby="modes-heading">
          <h2
            id="modes-heading"
            className="mb-8 text-center text-2xl font-bold text-gray-800 sm:text-3xl"
          >
            Three Ways to Learn
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {modes.map((mode) => (
              <div
                key={mode.name}
                className={`group relative overflow-hidden rounded-2xl border ${mode.border} ${mode.bg} p-6 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${mode.color} text-2xl shadow-sm`}
                  aria-hidden="true"
                >
                  {mode.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {mode.name} Mode
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {mode.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Subjects */}
        <section className="mb-16 text-center" aria-labelledby="subjects-heading">
          <h2
            id="subjects-heading"
            className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl"
          >
            Available Subjects
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </section>

        {/* CTA bottom */}
        <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white shadow-xl sm:p-12">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Ready to study smarter?
          </h2>
          <p className="mb-6 text-indigo-200">
            Pick a subject, choose your mode, and start chatting with your AI tutor.
          </p>
          <Link
            href="/chat"
            aria-label="Start Studying now"
            className="inline-block rounded-2xl bg-white px-8 py-3 text-base font-semibold text-indigo-700 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            Start Studying Now
          </Link>
        </section>
      </div>
    </main>
  );
}
