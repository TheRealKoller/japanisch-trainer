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
    expect(store["ha"]?.history).toEqual([true]);
  });

  it("increments incorrect count on wrong answer", () => {
    const store = updateItemRecord({}, "ha", false);
    expect(store["ha"]?.correct).toBe(0);
    expect(store["ha"]?.incorrect).toBe(1);
    expect(store["ha"]?.history).toEqual([false]);
  });

  it("accumulates counts across multiple calls", () => {
    let store: ItemStatsStore = {};
    store = updateItemRecord(store, "ha", true);
    store = updateItemRecord(store, "ha", false);
    store = updateItemRecord(store, "ha", true);
    expect(store["ha"]?.correct).toBe(2);
    expect(store["ha"]?.incorrect).toBe(1);
    expect(store["ha"]?.history).toEqual([true, false, true]);
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

  it("caps history at HISTORY_WINDOW, dropping the oldest entries", () => {
    let store: ItemStatsStore = {};
    for (let i = 0; i < 12; i++) {
      store = updateItemRecord(store, "ha", i >= 2); // erste 2 falsch, Rest richtig
    }
    expect(store["ha"]?.history).toHaveLength(10);
    expect(store["ha"]?.history.every(Boolean)).toBe(true); // die 2 Fehler sind aus dem Fenster gefallen
    expect(store["ha"]?.correct).toBe(10); // Lifetime-Zähler bleiben unbegrenzt
    expect(store["ha"]?.incorrect).toBe(2);
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
    expect(successRate({ id: "ha", correct: 0, incorrect: 0, history: [], lastSeen: 0 })).toBe(0);
  });

  it("liefert 1 wenn alle Antworten richtig waren", () => {
    expect(successRate({ id: "ha", correct: 3, incorrect: 0, history: [true, true, true], lastSeen: 0 })).toBe(1);
  });

  it("liefert die korrekte Quote bei gemischten Antworten", () => {
    expect(
      successRate({ id: "ha", correct: 3, incorrect: 1, history: [true, true, true, false], lastSeen: 0 }),
    ).toBe(0.75);
  });

  it("berücksichtigt nur die letzten HISTORY_WINDOW Antworten, nicht die Lifetime-Zähler", () => {
    // Lifetime wäre 3/13 ≈ 23%, aber history spiegelt nur die letzten 10 (alle richtig) wider.
    expect(
      successRate({
        id: "ha",
        correct: 10,
        incorrect: 3,
        history: Array(10).fill(true),
        lastSeen: 0,
      }),
    ).toBe(1);
  });
});

describe("Beispielrechnung aus Issue #137", () => {
  it("erreicht nach früh gemachten Fehlern (1x richtig, 3x falsch) mit weniger als 26 weiteren richtigen Antworten wieder 90%", () => {
    let store: ItemStatsStore = {};
    store = updateItemRecord(store, "ha", true);
    store = updateItemRecord(store, "ha", false);
    store = updateItemRecord(store, "ha", false);
    store = updateItemRecord(store, "ha", false);
    expect(successRate(store["ha"])).toBe(0.25); // Lifetime-Quote wie zuvor: 1/4

    // Mit der alten Lifetime-Formel wären ab hier 26 weitere richtige Antworten nötig
    // (siehe Issue #137), bis correct/(correct+incorrect) wieder auf 0.9 steigt.
    // Das rollierende Fenster braucht dafür höchstens HISTORY_WINDOW (10) Antworten.
    for (let i = 0; i < 9; i++) {
      store = updateItemRecord(store, "ha", true);
    }
    expect(successRate(store["ha"])).toBeGreaterThanOrEqual(0.9);
  });
});

describe("loadItemStats — Migration von Alt-Daten ohne history", () => {
  beforeEach(() => { storage.clear(); });

  it("synthetisiert eine plausible history aus correct/incorrect im vorhandenen Verhältnis", () => {
    storage.set(
      "japanisch-trainer:item-stats",
      JSON.stringify({ ha: { id: "ha", correct: 1, incorrect: 3, lastSeen: 123 } }),
    );
    const loaded = loadItemStats();
    expect(loaded["ha"]?.history).toHaveLength(4);
    expect(loaded["ha"]?.history.filter(Boolean)).toHaveLength(1);
    expect(successRate(loaded["ha"])).toBe(0.25);
  });

  it("kappt die synthetisierte history auf HISTORY_WINDOW Einträge bei hoher Lifetime-Gesamtzahl", () => {
    storage.set(
      "japanisch-trainer:item-stats",
      JSON.stringify({ ha: { id: "ha", correct: 27, incorrect: 3, lastSeen: 123 } }),
    );
    const loaded = loadItemStats();
    expect(loaded["ha"]?.history).toHaveLength(10);
    // 30 total, Verhältnis 27/30 = 90% → 9 von 10 synthetisierten Einträgen richtig
    expect(loaded["ha"]?.history.filter(Boolean)).toHaveLength(9);
  });

  it("lässt bereits migrierte Einträge (mit history) unverändert", () => {
    storage.set(
      "japanisch-trainer:item-stats",
      JSON.stringify({ ha: { id: "ha", correct: 1, incorrect: 1, history: [true, false], lastSeen: 123 } }),
    );
    const loaded = loadItemStats();
    expect(loaded["ha"]?.history).toEqual([true, false]);
  });

  it("verwirft nur einen beschädigten Eintrag statt die gesamte Statistik zu löschen", () => {
    storage.set(
      "japanisch-trainer:item-stats",
      JSON.stringify({
        // korrupte Werte (z.B. durch manuelle localStorage-Manipulation): dürfen migrateEntry
        // nicht crashen lassen (new Array(NaN)/new Array(negativ) würde einen RangeError werfen)
        kaputt: { id: "kaputt", correct: NaN, incorrect: -1, lastSeen: 0 },
        hi: { id: "hi", correct: 2, incorrect: 0, lastSeen: 0 },
      }),
    );
    const loaded = loadItemStats();
    expect(loaded["kaputt"]?.history).toEqual([]);
    expect(loaded["hi"]?.history.filter(Boolean)).toHaveLength(2);
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
