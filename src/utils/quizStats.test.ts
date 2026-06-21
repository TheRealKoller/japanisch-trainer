import { describe, it, expect, beforeEach } from "vitest";
import { extractDigits, recordSession, loadStats, saveStats, LEVELS, type QuizStats } from "./quizStats";

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
});

function emptyStats(): QuizStats {
  return { currentLevel: 1, levelRecords: {}, digitErrors: {}, recentWrongNumbers: [] };
}

describe("extractDigits", () => {
  it("single digit", () => expect(extractDigits(5)).toEqual([5]));
  it("multi-digit number", () => expect(extractDigits(3847)).toEqual([3, 8, 4, 7]));
  it("zero", () => expect(extractDigits(0)).toEqual([0]));
  it("number with repeated digits", () => expect(extractDigits(100)).toEqual([1, 0, 0]));
});

describe("recordSession — level advancement", () => {
  it("advances from level 1 to 2 at exactly 100%", () => {
    const result = recordSession(emptyStats(), 1, new Set<number>(), 10);
    expect(result.currentLevel).toBe(2);
  });

  it("does not advance from level 1 at 90% (1 wrong out of 10)", () => {
    const result = recordSession(emptyStats(), 1, new Set([1]), 10);
    expect(result.currentLevel).toBe(1);
  });

  it("advances from level 2 to 3 at 80% (≥ 75% threshold)", () => {
    const result = recordSession({ ...emptyStats(), currentLevel: 2 }, 2, new Set([1, 2]), 10);
    expect(result.currentLevel).toBe(3);
  });

  it("does not advance from level 2 at 70% (< 75% threshold)", () => {
    const result = recordSession({ ...emptyStats(), currentLevel: 2 }, 2, new Set([1, 2, 3]), 10);
    expect(result.currentLevel).toBe(2);
  });

  it("advances from level 3 to 4 at exactly 50%", () => {
    const wrongIds = new Set([1, 2, 3, 4, 5]);
    const result = recordSession({ ...emptyStats(), currentLevel: 3 }, 3, wrongIds, 10);
    expect(result.currentLevel).toBe(4);
  });

  it("does not advance beyond level 5", () => {
    const result = recordSession({ ...emptyStats(), currentLevel: 5 }, 5, new Set<number>(), 10);
    expect(result.currentLevel).toBe(5);
  });
});

describe("recordSession — digit analysis", () => {
  it("counts digit errors for wrong numbers", () => {
    const result = recordSession(emptyStats(), 1, new Set([8, 3]), 10);
    expect(result.digitErrors[8]).toBe(1);
    expect(result.digitErrors[3]).toBe(1);
  });

  it("counts repeated digits in a single number", () => {
    const result = recordSession(emptyStats(), 1, new Set([300]), 10);
    expect(result.digitErrors[3]).toBe(1);
    expect(result.digitErrors[0]).toBe(2);
  });

  it("accumulates digit errors across sessions", () => {
    let stats = emptyStats();
    stats = recordSession(stats, 1, new Set([8]), 10);
    stats = recordSession(stats, 1, new Set([18]), 10);
    expect(stats.digitErrors[8]).toBe(2);
    expect(stats.digitErrors[1]).toBe(1);
  });

  it("identifies the most-failed digit", () => {
    const result = recordSession(emptyStats(), 2, new Set([8, 18, 28, 3]), 10);
    const sorted = (Object.entries(result.digitErrors) as [string, number][])
      .sort(([, a], [, b]) => b - a);
    expect(Number(sorted[0][0])).toBe(8);
  });
});

describe("recordSession — stats accumulation", () => {
  it("accumulates level records across sessions", () => {
    let stats = emptyStats();
    stats = recordSession(stats, 1, new Set([1]), 10);
    stats = recordSession(stats, 1, new Set<number>(), 10);
    const rec = stats.levelRecords[1]!;
    expect(rec.sessions).toBe(2);
    expect(rec.totalCards).toBe(20);
    expect(rec.firstTryCorrect).toBe(19);
  });

  it("tracks recent wrong numbers", () => {
    const result = recordSession(emptyStats(), 1, new Set([3, 7]), 10);
    expect(result.recentWrongNumbers).toContain(3);
    expect(result.recentWrongNumbers).toContain(7);
  });

  it("caps recent wrong numbers at 20", () => {
    let stats = emptyStats();
    for (let i = 0; i < 5; i++) {
      stats = recordSession(stats, 2, new Set([i * 10, i * 10 + 1, i * 10 + 2, i * 10 + 3, i * 10 + 4]), 10);
    }
    expect(stats.recentWrongNumbers.length).toBeLessThanOrEqual(20);
  });
});

describe("localStorage persistence", () => {
  beforeEach(() => { storage.clear(); });

  it("returns default stats when storage is empty", () => {
    expect(loadStats().currentLevel).toBe(1);
    expect(loadStats().recentWrongNumbers).toEqual([]);
  });

  it("persists and restores currentLevel", () => {
    const stats = { ...emptyStats(), currentLevel: 3 };
    saveStats(stats);
    expect(loadStats().currentLevel).toBe(3);
  });

  it("persists and restores levelRecords", () => {
    const stats = recordSession(emptyStats(), 1, new Set<number>(), 10);
    saveStats(stats);
    const loaded = loadStats();
    expect(loaded.levelRecords[1]?.sessions).toBe(1);
  });
});

describe("LEVELS config", () => {
  it("has 5 levels", () => expect(LEVELS).toHaveLength(5));
  it("level 5 has max 99999", () => expect(LEVELS[4].max).toBe(99999));
  it("level 1 threshold is 1.0 (100%)", () => expect(LEVELS[0].threshold).toBe(1.0));
});
