import { useState } from "react";
import { numbers } from "./data/numbers";
import { hiragana } from "./data/hiragana";
import { katakana } from "./data/katakana";
import { TrainingSession } from "./components/TrainingSession";
import { NumberQuizSession } from "./components/NumberQuizSession";
import { OptionsMenu } from "./components/OptionsMenu";

type Lesson = "numbers" | "hiragana" | "katakana" | "number-quiz";

const lessons = [
  {
    id: "numbers" as Lesson,
    title: "Zahlen",
    subtitle: "一 二 三 ...",
    description: "0 – 10.000",
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:border-amber-500/30 dark:hover:bg-amber-500/15",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300",
  },
  {
    id: "number-quiz" as Lesson,
    title: "Zahlen-Quiz",
    subtitle: "3.847 · 92.105 · ...",
    description: "0 – 99.999",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-500/10 dark:border-orange-500/30 dark:hover:bg-orange-500/15",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300",
  },
  {
    id: "hiragana" as Lesson,
    title: "Hiragana",
    subtitle: "あ い う え お ...",
    description: "46 Zeichen",
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30 dark:hover:bg-rose-500/15",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-300",
  },
  {
    id: "katakana" as Lesson,
    title: "Katakana",
    subtitle: "ア イ ウ エ オ ...",
    description: "46 Zeichen",
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100 dark:bg-sky-500/10 dark:border-sky-500/30 dark:hover:bg-sky-500/15",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300",
  },
];

const dataMap = { numbers, hiragana, katakana, "number-quiz": [] as typeof numbers };
const titleMap: Record<Lesson, string> = {
  numbers: "Zahlen",
  hiragana: "Hiragana",
  katakana: "Katakana",
  "number-quiz": "",
};

function App() {
  const [active, setActive] = useState<Lesson | null>(null);

  return (
    <>
      {active === "number-quiz" ? (
        <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
          <NumberQuizSession onBack={() => setActive(null)} />
        </main>
      ) : active ? (
        <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
          <TrainingSession
            items={dataMap[active]}
            title={titleMap[active]}
            onBack={() => setActive(null)}
          />
        </main>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 bg-gray-50 dark:bg-slate-950">
          <div className="fixed top-4 right-4 z-50">
            <OptionsMenu />
          </div>
          <div className="max-w-md w-full flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                日本語トレーナー
              </h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base">
                Japanisch Vokabeltrainer
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActive(lesson.id)}
                  className={`border-2 rounded-2xl p-5 text-left transition-colors duration-200 ${lesson.color}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                        {lesson.title}
                      </h2>
                      <p className="text-2xl mt-1 tracking-widest text-gray-700 dark:text-slate-300">
                        {lesson.subtitle}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${lesson.badge}`}>
                      {lesson.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default App;
