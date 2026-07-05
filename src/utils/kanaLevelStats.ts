import { pushProgress } from "./progressSync";
import type { ProgressKey } from "./progressSync";

const PREFIX = "japanisch-trainer:kana-level-";

export function loadUnlockedLevel(key: string): number {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return 1;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 1 : n;
  } catch {
    return 1;
  }
}

export function saveUnlockedLevel(key: string, level: number): void {
  try {
    localStorage.setItem(PREFIX + key, String(level));
  } catch {
    // ignore storage quota errors
  }
  pushProgress(`kana-level-${key}` as ProgressKey, level);
}
