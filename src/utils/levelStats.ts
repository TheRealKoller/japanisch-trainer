import { pushProgress, type ProgressKey } from "./progressSync";

const LS_PREFIX = "japanisch-trainer:";

// Progress-Keys der Lektionen mit Level-Freischaltung.
// Die Kana-Keys behalten ihr historisches "kana-level-"-Präfix (localStorage-Kompatibilität).
export type LevelKey = Extract<
  ProgressKey,
  "kana-level-hiragana" | "kana-level-katakana" | "level-core-vocab" | "level-daily-phrases" | "level-travel-phrases"
>;

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
