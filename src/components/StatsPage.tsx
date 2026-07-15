import { useState } from "react";
import { loadItemStats } from "../utils/itemStats";
import { LessonStatsSection, type StatsLessonId } from "./StatsSections";

interface Props {
  onBack: () => void;
}

const LESSON_IDS: StatsLessonId[] = [
  "hiragana",
  "katakana",
  "number-quiz",
  "core-vocab",
  "daily-phrases",
  "travel-phrases",
];

export function StatsPage({ onBack }: Props) {
  const [store] = useState(() => loadItemStats());

  return (
    <div className="flex flex-col w-full max-w-md mx-auto flex-1">
      <div className="flex items-center justify-between w-full py-1">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Statistik</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-8">
        {LESSON_IDS.map((id) => (
          <LessonStatsSection key={id} lessonId={id} store={store} />
        ))}
      </div>
    </div>
  );
}
