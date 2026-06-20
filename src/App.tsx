import { useState } from "react";
import { numbers } from "./data/numbers";
import { hiragana } from "./data/hiragana";
import { katakana } from "./data/katakana";
import { TrainingSession } from "./components/TrainingSession";

type Lesson = "numbers" | "hiragana" | "katakana";

const lessons = [
  {
    id: "numbers" as Lesson,
    title: "Zahlen",
    subtitle: "一 二 三 ...",
    description: "0 – 10.000",
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: "hiragana" as Lesson,
    title: "Hiragana",
    subtitle: "あ い う え お ...",
    description: "46 Zeichen",
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    id: "katakana" as Lesson,
    title: "Katakana",
    subtitle: "ア イ ウ エ オ ...",
    description: "46 Zeichen",
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100",
    badge: "bg-sky-100 text-sky-700",
  },
];

function App() {
  const [active, setActive] = useState<Lesson | null>(null);

  if (active) {
    const dataMap = { numbers, hiragana, katakana };
    const titleMap = { numbers: "Zahlen", hiragana: "Hiragana", katakana: "Katakana" };
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <TrainingSession
          items={dataMap[active]}
          title={titleMap[active]}
          onBack={() => setActive(null)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">日本語トレーナー</h1>
          <p className="text-gray-500">Japanisch Vokabeltrainer</p>
        </div>

        <div className="flex flex-col gap-4">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActive(lesson.id)}
              className={`border-2 rounded-2xl p-5 text-left transition-colors duration-200 ${lesson.color}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>
                  <p className="text-2xl mt-1 tracking-widest">{lesson.subtitle}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${lesson.badge}`}>
                  {lesson.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
