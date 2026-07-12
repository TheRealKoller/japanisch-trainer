import { describe, it, expect, beforeEach } from "vitest";
import { updateItemRecord, loadItemStats, saveItemStats, successRate, type ItemStatsStore } from "./itemStats";
import { extractDigits } from "./quizStats";

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

describe("updateItemRecord", () => {
  it("increments correct count on correct answer", () => {
    const store = updateItemRecord({}, "ha", true);
    expect(store["ha"]?.correct).toBe(1);
    expect(store["ha"]?.incorrect).toBe(0);
  });

  it("increments incorrect count on wrong answer", () => {
    const store = updateItemRecord({}, "ha", false);
    expect(store["ha"]?.correct).toBe(0);
    expect(store["ha"]?.incorrect).toBe(1);
  });

  it("accumulates counts across multiple calls", () => {
    let store: ItemStatsStore = {};
    store = updateItemRecord(store, "ha", true);
    store = updateItemRecord(store, "ha", false);
    store = updateItemRecord(store, "ha", true);
    expect(store["ha"]?.correct).toBe(2);
    expect(store["ha"]?.incorrect).toBe(1);
  });

  it("tracks multiple items independently", () => {
    let store: ItemStatsStore = {};
    store = updateItemRecord(store, "ha", true);
    store = updateItemRecord(store, "hi", false);
    expect(store["ha"]?.correct).toBe(1);
    expect(store["hi"]?.incorrect).toBe(1);
    expect(store["hi"]?.correct).toBe(0);
  });

  it("does not mutate the input store", () => {
    const original: ItemStatsStore = {};
    updateItemRecord(original, "ha", true);
    expect(original["ha"]).toBeUndefined();
  });
});

describe("localStorage persistence", () => {
  beforeEach(() => { storage.clear(); });

  it("returns empty store when storage is empty", () => {
    expect(loadItemStats()).toEqual({});
  });

  it("persists and restores item stats", () => {
    const store = updateItemRecord({}, "ha", true);
    saveItemStats(store);
    const loaded = loadItemStats();
    expect(loaded["ha"]?.correct).toBe(1);
    expect(loaded["ha"]?.incorrect).toBe(0);
  });

  it("roundtrip preserves all fields", () => {
    let store: ItemStatsStore = {};
    store = updateItemRecord(store, "hka", true);
    store = updateItemRecord(store, "hka", false);
    store = updateItemRecord(store, "hi", true);
    saveItemStats(store);
    const loaded = loadItemStats();
    expect(loaded["hka"]?.correct).toBe(1);
    expect(loaded["hka"]?.incorrect).toBe(1);
    expect(loaded["hi"]?.correct).toBe(1);
  });
});

describe("successRate", () => {
  it("liefert 0 für fehlenden Eintrag", () => {
    expect(successRate(undefined)).toBe(0);
  });

  it("liefert 0 für einen Eintrag ohne jede Antwort", () => {
    expect(successRate({ id: "ha", correct: 0, incorrect: 0, lastSeen: 0 })).toBe(0);
  });

  it("liefert 1 wenn alle Antworten richtig waren", () => {
    expect(successRate({ id: "ha", correct: 3, incorrect: 0, lastSeen: 0 })).toBe(1);
  });

  it("liefert die korrekte Quote bei gemischten Antworten", () => {
    expect(successRate({ id: "ha", correct: 3, incorrect: 1, lastSeen: 0 })).toBe(0.75);
  });
});

// Tests below verify the combination of quizStats.extractDigits + updateItemRecord,
// matching the batch loop used in NumberQuizSession.advance().
describe("digit extraction — all digits get credit", () => {
  it("single digit 5 credits only d5", () => {
    let store: ItemStatsStore = {};
    for (const digit of extractDigits(5)) {
      store = updateItemRecord(store, `d${digit}`, true);
    }
    expect(store["d5"]?.correct).toBe(1);
    expect(Object.keys(store)).toHaveLength(1);
  });

  it("123 credits d1, d2, and d3", () => {
    let store: ItemStatsStore = {};
    for (const digit of extractDigits(123)) {
      store = updateItemRecord(store, `d${digit}`, true);
    }
    expect(store["d1"]?.correct).toBe(1);
    expect(store["d2"]?.correct).toBe(1);
    expect(store["d3"]?.correct).toBe(1);
  });

  it("repeated digits in 100 give d0 double credit", () => {
    let store: ItemStatsStore = {};
    for (const digit of extractDigits(100)) {
      store = updateItemRecord(store, `d${digit}`, false);
    }
    expect(store["d1"]?.incorrect).toBe(1);
    expect(store["d0"]?.incorrect).toBe(2);
  });
});
