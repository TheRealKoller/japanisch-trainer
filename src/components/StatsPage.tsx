import { useCallback, useState } from "react";
import type { VocabItem } from "../data/types";
import { lessonItems, isVocabLessonId } from "../data/lessonRegistry";
import { loadItemStats, masteryBuckets } from "../utils/itemStats";
import { getActiveStatsTab, setActiveStatsTab } from "../utils/statsTabStorage";
import { LessonStatsSection, type StatsLessonId } from "./StatsSections";
import { LessonTabs } from "./LessonTabs";
import { MasteryProgressBar } from "./MasteryProgressBar";
import { StatItemDetailModal } from "./StatItemDetailModal";

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
  "verb-conjugation",
  "particle-quiz",
];

export function StatsPage({ onBack }: Props) {
  const [store] = useState(() => loadItemStats());
  const [activeTab, setActiveTab] = useState<StatsLessonId>(() =>
    getActiveStatsTab(LESSON_IDS, LESSON_IDS[0]),
  );
  const [selectedItem, setSelectedItem] = useState<VocabItem | null>(null);
  const closeDetail = useCallback(() => setSelectedItem(null), []);

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

      {isVocabLessonId(activeTab) && (
        <MasteryProgressBar {...masteryBuckets(lessonItems[activeTab], store)} showLabel alwaysShow />
      )}

      <div className="flex-1 min-h-0 overflow-y-auto py-4">
        <LessonStatsSection lessonId={activeTab} store={store} onSelect={setSelectedItem} />
      </div>

      {selectedItem && (
        <StatItemDetailModal
          item={selectedItem}
          stats={store[selectedItem.id]}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
