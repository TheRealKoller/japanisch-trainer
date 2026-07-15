import type { StatsLessonId } from "./StatsSections";
import { LESSON_LABELS } from "../utils/lessonLabels";

interface LessonTabsProps {
  ids: readonly StatsLessonId[];
  active: StatsLessonId;
  onSelect: (id: StatsLessonId) => void;
}

export function LessonTabs({ ids, active, onSelect }: LessonTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {ids.map((id) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          aria-pressed={id === active}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            id === active
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          {LESSON_LABELS[id]}
        </button>
      ))}
    </div>
  );
}
