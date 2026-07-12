import { itemsForLevel, type Level } from "../data/levels";
import { successRate, type ItemStatsStore } from "./itemStats";

export const MASTERY_THRESHOLD = 0.9;

// Level 1..targetLevel gilt als gemeistert, wenn ALLE Karten dieser Level (kumulativ)
// eine Erfolgsquote >= MASTERY_THRESHOLD haben. Nie geübte Karten zählen als 0%
// (siehe successRate()). Rein aus itemStats abgeleitet, kein gespeicherter Zustand —
// kann bei Regression eines früheren Levels beim nächsten Aufruf "still" wieder
// zurückfallen (Issue #128).
export function isLevelMastered<T extends { id: string }>(
  items: T[],
  levels: Level[],
  targetLevel: number,
  stats: ItemStatsStore,
): boolean {
  const cumulativeItems = itemsForLevel(items, levels, targetLevel, true);
  return (
    cumulativeItems.length > 0 &&
    cumulativeItems.every((item) => successRate(stats[item.id]) >= MASTERY_THRESHOLD)
  );
}

// Höchstes erreichbares Level = höchstes gemeistertes Level + 1 (mindestens 1).
// Levels sind lückenlos aufsteigend nummeriert, daher reicht ein linearer Scan mit
// Abbruch beim ersten nicht gemeisterten Level.
export function highestUnlockedLevel<T extends { id: string }>(
  items: T[],
  levels: Level[],
  stats: ItemStatsStore,
): number {
  let unlocked = 1;
  for (const level of levels) {
    if (!isLevelMastered(items, levels, level.level, stats)) break;
    unlocked = level.level + 1;
  }
  return unlocked;
}
