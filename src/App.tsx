import { useState, useEffect } from "react";
import { numbers } from "./data/numbers";
import { hiragana } from "./data/hiragana";
import { katakana } from "./data/katakana";
import { TrainingSession } from "./components/TrainingSession";
import type { TrainingLevelConfig } from "./components/TrainingSession";
import { NumberQuizSession } from "./components/NumberQuizSession";
import { OptionsMenu } from "./components/OptionsMenu";
import { SettingsPage } from "./components/SettingsPage";
import { StatsPage } from "./components/StatsPage";
import { hiraganaLevels, katakanaLevels } from "./data/kanaLevels";
import type { KanaLevel } from "./data/kanaLevels";
import { loadUnlockedLevel, saveUnlockedLevel } from "./utils/kanaLevelStats";

type Lesson = "numbers" | "hiragana" | "katakana" | "number-quiz";
type View = Lesson | "settings" | "stats" | null;

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
    subtitle: "1 · 2 · 432 · 99999",
    description: "0 – 99.999",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-500/10 dark:border-orange-500/30 dark:hover:bg-orange-500/15",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300",
  },
  {
    id: "hiragana" as Lesson,
    title: "Hiragana",
    subtitle: "あ い う え お ...",
    description: "16 Level",
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30 dark:hover:bg-rose-500/15",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-300",
  },
  {
    id: "katakana" as Lesson,
    title: "Katakana",
    subtitle: "ア イ ウ エ オ ...",
    description: "16 Level",
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100 dark:bg-sky-500/10 dark:border-sky-500/30 dark:hover:bg-sky-500/15",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300",
  },
];

function getItemsUpToLevel<T extends { id: string }>(items: T[], levels: KanaLevel[], targetLevel: number): T[] {
  const ids = new Set(levels.filter((l) => l.level <= targetLevel).flatMap((l) => l.ids));
  return items.filter((item) => ids.has(item.id));
}

function viewFromHash(): View {
  if (window.location.hash === "#/settings") return "settings";
  if (window.location.hash === "#/stats") return "stats";
  return null;
}

function App() {
  const [view, setView] = useState<View>(viewFromHash);
  const [hiraganaUnlocked, setHiraganaUnlocked] = useState(() => loadUnlockedLevel("hiragana"));
  const [katakanaUnlocked, setKatakanaUnlocked] = useState(() => loadUnlockedLevel("katakana"));
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === "#/settings") {
        setView("settings");
      } else if (window.location.hash === "#/stats") {
        setView("stats");
      } else if (!window.location.hash) {
        setView((v) => (v === "settings" || v === "stats" ? null : v));
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
        <NumberQuizSession onBack={() => setView(null)} />
      </main>
    );
  }

  if (view === "hiragana" || view === "katakana") {
    const isHiragana = view === "hiragana";
    const allItems = isHiragana ? hiragana : katakana;
    const levels = isHiragana ? hiraganaLevels : katakanaLevels;
    const unlocked = isHiragana ? hiraganaUnlocked : katakanaUnlocked;
    const setUnlocked = isHiragana ? setHiraganaUnlocked : setKatakanaUnlocked;
    const { title, color: cardBase, badge: badgeActive } = lessons.find((l) => l.id === view)!;

    if (activeLevel !== null) {
      const level = activeLevel;
      const sessionItems = getItemsUpToLevel(allItems, levels, level);

      const handleLevelComplete = () => {
        if (level >= unlocked) {
          const nextLevel = level + 1;
          saveUnlockedLevel(view, nextLevel);
          setUnlocked(nextLevel);
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
                        {levelDef.ids.length} neue Zeichen
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
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setView(lesson.id)}
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
  );
}

export default App;
