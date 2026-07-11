import { pushProgress, LS_PREFIX, type ProgressKey } from "./progressSync";

// Progress-Keys der Lektionen mit Level-Freischaltung (alle außer item-stats/quiz-stats).
// Die Kana-Keys behalten ihr historisches "kana-level-"-Präfix (localStorage-Kompatibilität).
export type LevelKey = Exclude<ProgressKey, "item-stats" | "quiz-stats">;

export function loadUnlockedLevel(key: LevelKey): number {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return 1;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 1 : n;
  } catch {
    return 1;
  }
}

export function saveUnlockedLevel(key: LevelKey, level: number): void {
  try {
    localStorage.setItem(LS_PREFIX + key, String(level));
  } catch {
    // ignore storage quota errors
  }
  pushProgress(key, level);
}
