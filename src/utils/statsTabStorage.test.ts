import { describe, it, expect, beforeEach } from "vitest";
import { getActiveStatsTab, setActiveStatsTab } from "./statsTabStorage";
import type { StatsLessonId } from "../components/StatsSections";

// localStorage mock for node environment
const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value); },
    removeItem: (key: string) => { storage.delete(key); },
    clear: () => { storage.clear(); },
  },
  writable: true,
  configurable: true,
});

const IDS: StatsLessonId[] = ["hiragana", "katakana", "number-quiz"];

describe("statsTabStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("liefert den Fallback wenn kein Wert gespeichert ist", () => {
    expect(getActiveStatsTab(IDS, "hiragana")).toBe("hiragana");
  });

  it("liefert den Fallback bei einem ungültigen/veralteten Wert", () => {
    localStorage.setItem("stats-active-tab", "core-vocab");
    expect(getActiveStatsTab(IDS, "hiragana")).toBe("hiragana");
  });

  it("liefert den gespeicherten Wert wenn er gültig ist", () => {
    localStorage.setItem("stats-active-tab", "katakana");
    expect(getActiveStatsTab(IDS, "hiragana")).toBe("katakana");
  });

  it("speichert den aktiven Tab, sodass er danach ausgelesen werden kann", () => {
    setActiveStatsTab("number-quiz");
    expect(getActiveStatsTab(IDS, "hiragana")).toBe("number-quiz");
  });
});
