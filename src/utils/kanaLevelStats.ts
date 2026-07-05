import { pushProgress } from "./progressSync";

const PREFIX = "japanisch-trainer:kana-level-";

export type KanaKey = "hiragana" | "katakana";

export function loadUnlockedLevel(key: KanaKey): number {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return 1;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 1 : n;
  } catch {
    return 1;
  }
}

export function saveUnlockedLevel(key: KanaKey, level: number): void {
  try {
    localStorage.setItem(PREFIX + key, String(level));
  } catch {
    // ignore storage quota errors
  }
  pushProgress(`kana-level-${key}`, level);
}
