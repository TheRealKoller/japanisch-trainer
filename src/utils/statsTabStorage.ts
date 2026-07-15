import type { StatsLessonId } from "../components/StatsSections";

const STORAGE_KEY = "stats-active-tab";

export function getActiveStatsTab(
  validIds: readonly StatsLessonId[],
  fallback: StatsLessonId,
): StatsLessonId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as StatsLessonId | null;
    return stored !== null && validIds.includes(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

export function setActiveStatsTab(id: StatsLessonId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore storage quota/access errors
  }
}
