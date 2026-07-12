import { useState, useEffect } from "react";
import { numbers } from "./data/numbers";
import { hiragana } from "./data/hiragana";
import { katakana } from "./data/katakana";
import { coreVocab, coreVocabLevels } from "./data/coreVocab";
import { dailyPhrases, dailyPhraseLevels } from "./data/dailyPhrases";
import { travelPhrases, travelPhraseLevels } from "./data/travelPhrases";
import type { VocabItem } from "./data/types";
import { TrainingSession } from "./components/TrainingSession";
import type { TrainingLevelConfig } from "./components/TrainingSession";
import type { FlashcardVariant } from "./components/Flashcard";
import { NumberQuizSession } from "./components/NumberQuizSession";
import { SegmentedProgressBar } from "./components/SegmentedProgressBar";
import { OptionsMenu } from "./components/OptionsMenu";
import { SettingsPage } from "./components/SettingsPage";
import { StatsPage } from "./components/StatsPage";
import { LoginPage } from "./components/LoginPage";
import { hiraganaLevels, katakanaLevels } from "./data/kanaLevels";
import { itemsForLevel } from "./data/levels";
import type { Level } from "./data/levels";
import { loadUnlockedLevel, saveUnlockedLevel } from "./utils/levelStats";
import type { LevelKey } from "./utils/levelStats";
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
    description: "16 Level",
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30 dark:hover:bg-rose-500/15",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-300",
    progressTotal: 16,
    accentClass: "bg-rose-400 dark:bg-rose-400",
  },
  katakana: {
    title: "Katakana",
    subtitle: "ア イ ウ エ オ ...",
    description: "16 Level",
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100 dark:bg-sky-500/10 dark:border-sky-500/30 dark:hover:bg-sky-500/15",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300",
    progressTotal: 16,
    accentClass: "bg-sky-400 dark:bg-sky-400",
  },
  "core-vocab": {
    title: "Grundwortschatz",
    subtitle: "水 家 食べる ...",
    description: `${coreVocabLevels.length} Level`,
    color: "bg-violet-50 border-violet-200 hover:bg-violet-100 dark:bg-violet-500/10 dark:border-violet-500/30 dark:hover:bg-violet-500/15",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-400/20 dark:text-violet-300",
    progressTotal: coreVocabLevels.length,
    accentClass: "bg-violet-400 dark:bg-violet-400",
  },
  "daily-phrases": {
    title: "Alltags-Floskeln",
    subtitle: "こんにちは ...",
    description: `${dailyPhraseLevels.length} Level`,
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100 dark:bg-teal-500/10 dark:border-teal-500/30 dark:hover:bg-teal-500/15",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-400/20 dark:text-teal-300",
    progressTotal: dailyPhraseLevels.length,
    accentClass: "bg-teal-400 dark:bg-teal-400",
  },
  "travel-phrases": {
    title: "Reise-Floskeln",
    subtitle: "いくらですか ...",
    description: `${travelPhraseLevels.length} Level`,
    color: "bg-lime-50 border-lime-200 hover:bg-lime-100 dark:bg-lime-500/10 dark:border-lime-500/30 dark:hover:bg-lime-500/15",
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-400/20 dark:text-lime-300",
    progressTotal: travelPhraseLevels.length,
    accentClass: "bg-lime-400 dark:bg-lime-400",
  },
};

interface LevelLessonConfig {
  items: VocabItem[];
  levels: Level[];
  progressKey: LevelKey;
  cumulative: boolean; // true: Session übt alle Karten bis einschließlich des Levels, nicht nur das Level selbst
  unit: string;
  cardVariant: FlashcardVariant; // Kana-Sessions zeigen Kanji/Kana groß, Vokabel-Sessions Romaji groß (siehe Issue #119)
}

const levelLessons = {
  hiragana: { items: hiragana, levels: hiraganaLevels, progressKey: "kana-level-hiragana", cumulative: true, unit: "neue Zeichen", cardVariant: "default" },
  katakana: { items: katakana, levels: katakanaLevels, progressKey: "kana-level-katakana", cumulative: true, unit: "neue Zeichen", cardVariant: "default" },
  "core-vocab": { items: coreVocab, levels: coreVocabLevels, progressKey: "level-core-vocab", cumulative: true, unit: "neue Wörter", cardVariant: "vocab" },
  "daily-phrases": { items: dailyPhrases, levels: dailyPhraseLevels, progressKey: "level-daily-phrases", cumulative: true, unit: "neue Floskeln", cardVariant: "vocab" },
  "travel-phrases": { items: travelPhrases, levels: travelPhraseLevels, progressKey: "level-travel-phrases", cumulative: true, unit: "neue Floskeln", cardVariant: "vocab" },
} satisfies Record<string, LevelLessonConfig>;

type LevelLessonId = keyof typeof levelLessons;

function isLevelLesson(view: View): view is LevelLessonId {
  return view !== null && view in levelLessons;
}

function viewFromHash(): View {
  if (window.location.hash === "#/settings") return "settings";
  if (window.location.hash === "#/stats") return "stats";
  if (window.location.hash === "#/login") return "login";
  return null;
}

function App() {
  const [view, setView] = useState<View>(viewFromHash);
  const [unlockedLevels, setUnlockedLevels] = useState<Record<LevelLessonId, number>>(() =>
    Object.fromEntries(
      (Object.keys(levelLessons) as LevelLessonId[]).map((id) => [id, loadUnlockedLevel(levelLessons[id].progressKey)]),
    ) as Record<LevelLessonId, number>,
  );
  const [quizLevel, setQuizLevel] = useState(() => loadStats().currentLevel);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  function getProgressCompleted(lessonId: Lesson): number | null {
    if (isLevelLesson(lessonId)) return unlockedLevels[lessonId] - 1;
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
        setActiveLevel(null);
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
      <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <StatsPage onBack={goBack} />
      </main>
    );
  }

  if (view === "number-quiz") {
    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <NumberQuizSession onBack={() => { setView(null); setQuizLevel(loadStats().currentLevel); }} />
      </main>
    );
  }

  if (isLevelLesson(view)) {
    const lessonId = view;
    const { items: allItems, levels, progressKey, cumulative, unit, cardVariant } = levelLessons[lessonId];
    const unlocked = unlockedLevels[lessonId];
    const { title, color: cardBase, badge: badgeActive } = lessons[lessonId];

    if (activeLevel !== null) {
      const level = activeLevel;
      const sessionItems = itemsForLevel(allItems, levels, level, cumulative);

      const handleLevelComplete = () => {
        if (level >= unlocked) {
          const nextLevel = level + 1;
          saveUnlockedLevel(progressKey, nextLevel);
          setUnlockedLevels((prev) => ({ ...prev, [lessonId]: nextLevel }));
        }
      };

      const levelConfig: TrainingLevelConfig = {
        onLevelComplete: handleLevelComplete,
      };

      return (
        <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
          <TrainingSession
            items={sessionItems}
            title={`${title} – Level ${level}`}
            onBack={() => setActiveLevel(null)}
            levelConfig={levelConfig}
            cardVariant={cardVariant}
          />
        </main>
      );
    }

    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-gray-50 dark:bg-slate-950">
        <div className="fixed top-4 right-4 z-50">
          <OptionsMenu />
        </div>
        <div className="max-w-md w-full mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView(null)}
              className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
            >
              ← Zurück
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{title}</h1>
            <div className="w-14" />
          </div>

          <div className="flex flex-col gap-3">
            {levels.map((levelDef) => {
              const isCompleted = levelDef.level < unlocked;
              const isLocked = levelDef.level > unlocked;

              return (
                <button
                  key={levelDef.level}
                  onClick={() => !isLocked && setActiveLevel(levelDef.level)}
                  disabled={isLocked}
                  className={`border-2 rounded-2xl p-5 text-left transition-colors duration-200 ${
                    isLocked
                      ? "bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed dark:bg-slate-900 dark:border-slate-800"
                      : cardBase
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                        Level {levelDef.level} {isCompleted && "✓"}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        {levelDef.ids.length} {unit}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                        isLocked
                          ? "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                          : isCompleted
                          ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                          : badgeActive
                      }`}
                    >
                      {isLocked ? "Gesperrt" : isCompleted ? "Bestanden" : "Aktuell"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  if (view) {
    const _: "numbers" = view;
    void _;
    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950">
        <TrainingSession
          items={numbers}
          title="Zahlen"
          onBack={() => setView(null)}
        />
      </main>
    );
  }

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
