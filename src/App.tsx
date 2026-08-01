import { useState, useEffect } from "react";
import { numbers } from "./data/numbers";
import { lessonItems, isVocabLessonId, type VocabLessonId } from "./data/lessonRegistry";
import { TrainingSession } from "./components/TrainingSession";
import type { FlashcardVariant } from "./components/Flashcard";
import { NumberQuizSession } from "./components/NumberQuizSession";
import { SegmentedProgressBar } from "./components/SegmentedProgressBar";
import { MasteryProgressBar } from "./components/MasteryProgressBar";
import { OptionsMenu } from "./components/OptionsMenu";
import { SettingsPage } from "./components/SettingsPage";
import { StatsPage } from "./components/StatsPage";
import { LoginPage } from "./components/LoginPage";
import { loadItemStats, masteryBuckets } from "./utils/itemStats";
import { loadStats } from "./utils/quizStats";

type Lesson =
  | "numbers"
  | "hiragana"
  | "katakana"
  | "number-quiz"
  | "core-vocab"
  | "daily-phrases"
  | "travel-phrases";
type View = Lesson | "settings" | "stats" | "login" | null;

interface LessonMeta {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  badge: string;
  progressTotal?: number;
  accentClass?: string;
}

// Record statt Array: TypeScript erzwingt so einen Eintrag pro Lesson-Variante.
const lessons: Record<Lesson, LessonMeta> = {
  numbers: {
    title: "Zahlen",
    subtitle: "一 二 三 ...",
    description: "0 – 10.000",
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:border-amber-500/30 dark:hover:bg-amber-500/15",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300",
  },
  "number-quiz": {
    title: "Zahlen-Quiz",
    subtitle: "1 · 2 · 432 · 99999",
    description: "0 – 99.999",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-500/10 dark:border-orange-500/30 dark:hover:bg-orange-500/15",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300",
    progressTotal: 4,
    accentClass: "bg-orange-400 dark:bg-orange-400",
  },
  hiragana: {
    title: "Hiragana",
    subtitle: "あ い う え お ...",
    description: `${lessonItems.hiragana.length} Zeichen`,
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30 dark:hover:bg-rose-500/15",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-300",
  },
  katakana: {
    title: "Katakana",
    subtitle: "ア イ ウ エ オ ...",
    description: `${lessonItems.katakana.length} Zeichen`,
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100 dark:bg-sky-500/10 dark:border-sky-500/30 dark:hover:bg-sky-500/15",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300",
  },
  "core-vocab": {
    title: "Grundwortschatz",
    subtitle: "水 家 食べる ...",
    description: `${lessonItems["core-vocab"].length} Wörter`,
    color: "bg-violet-50 border-violet-200 hover:bg-violet-100 dark:bg-violet-500/10 dark:border-violet-500/30 dark:hover:bg-violet-500/15",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-400/20 dark:text-violet-300",
  },
  "daily-phrases": {
    title: "Alltags-Floskeln",
    subtitle: "こんにちは ...",
    description: `${lessonItems["daily-phrases"].length} Floskeln`,
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100 dark:bg-teal-500/10 dark:border-teal-500/30 dark:hover:bg-teal-500/15",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-400/20 dark:text-teal-300",
  },
  "travel-phrases": {
    title: "Reise-Floskeln",
    subtitle: "いくらですか ...",
    description: `${lessonItems["travel-phrases"].length} Floskeln`,
    color: "bg-lime-50 border-lime-200 hover:bg-lime-100 dark:bg-lime-500/10 dark:border-lime-500/30 dark:hover:bg-lime-500/15",
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-400/20 dark:text-lime-300",
  },
};

interface VocabLessonConfig {
  cardVariant: FlashcardVariant; // Kana-Sessions zeigen Kanji/Kana groß, Vokabel-Sessions Romaji groß (siehe Issue #119)
}

const vocabLessonConfig: Record<VocabLessonId, VocabLessonConfig> = {
  hiragana: { cardVariant: "default" },
  katakana: { cardVariant: "default" },
  "core-vocab": { cardVariant: "vocab" },
  "daily-phrases": { cardVariant: "vocab" },
  "travel-phrases": { cardVariant: "vocab" },
};

function isVocabLesson(view: View): view is VocabLessonId {
  return view !== null && isVocabLessonId(view);
}

function viewFromHash(): View {
  if (window.location.hash === "#/settings") return "settings";
  if (window.location.hash === "#/stats") return "stats";
  if (window.location.hash === "#/login") return "login";
  return null;
}

function App() {
  const [view, setView] = useState<View>(viewFromHash);
  const [quizLevel, setQuizLevel] = useState(() => loadStats().currentLevel);

  function getProgressCompleted(lessonId: Lesson): number | null {
    if (lessonId === "number-quiz") return quizLevel - 1;
    return null;
  }

  useEffect(() => {
    function onHashChange() {
      const next = viewFromHash();
      if (next !== null) {
        setView(next);
      } else if (!window.location.hash) {
        setView((v) => (v === "settings" || v === "stats" || v === "login" ? null : v));
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function goBack() {
    window.location.hash = "";
  }

  if (view === "settings") {
    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <SettingsPage onBack={goBack} />
      </main>
    );
  }

  if (view === "login") {
    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <LoginPage onBack={goBack} />
      </main>
    );
  }

  if (view === "stats") {
    return (
      <main className="h-screen overflow-hidden flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <StatsPage onBack={goBack} />
      </main>
    );
  }

  if (view === "number-quiz") {
    return (
      <main className="h-screen overflow-hidden flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <NumberQuizSession onBack={() => { setView(null); setQuizLevel(loadStats().currentLevel); }} />
      </main>
    );
  }

  if (isVocabLesson(view)) {
    const lessonId = view;
    const items = lessonItems[lessonId];
    const { cardVariant } = vocabLessonConfig[lessonId];
    const { title } = lessons[lessonId];

    return (
      <main className="h-screen overflow-hidden flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <TrainingSession
          items={items}
          title={title}
          onBack={() => setView(null)}
          cardVariant={cardVariant}
          lessonId={lessonId}
        />
      </main>
    );
  }

  if (view) {
    const _: "numbers" = view;
    void _;
    return (
      <main className="h-screen overflow-hidden flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <TrainingSession
          items={numbers}
          title="Zahlen"
          onBack={() => setView(null)}
        />
      </main>
    );
  }

  const homeScreenItemStats = loadItemStats();

  return (
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
          {(Object.entries(lessons) as [Lesson, LessonMeta][]).map(([id, lesson]) => {
            const completed = getProgressCompleted(id);
            return (
              <button
                key={id}
                onClick={() => setView(id)}
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
                {isVocabLessonId(id) && (
                  <MasteryProgressBar {...masteryBuckets(lessonItems[id], homeScreenItemStats)} />
                )}
                {lesson.progressTotal !== undefined && completed !== null && lesson.accentClass && (
                  <SegmentedProgressBar
                    completed={completed}
                    total={lesson.progressTotal}
                    accentClass={lesson.accentClass}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default App;
