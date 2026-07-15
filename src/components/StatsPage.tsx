import { useState } from "react";
import { loadItemStats } from "../utils/itemStats";
import { getActiveStatsTab, setActiveStatsTab } from "../utils/statsTabStorage";
import { LessonStatsSection, type StatsLessonId } from "./StatsSections";
import { LessonTabs } from "./LessonTabs";

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
  const [activeTab, setActiveTab] = useState<StatsLessonId>(() =>
    getActiveStatsTab(LESSON_IDS, LESSON_IDS[0]),
  );

  function selectTab(id: StatsLessonId) {
    setActiveTab(id);
    setActiveStatsTab(id);
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto flex-1 min-h-0">
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

      <LessonTabs ids={LESSON_IDS} active={activeTab} onSelect={selectTab} />

      <div className="flex-1 min-h-0 overflow-y-auto py-4">
        <LessonStatsSection lessonId={activeTab} store={store} />
      </div>
    </div>
  );
}
