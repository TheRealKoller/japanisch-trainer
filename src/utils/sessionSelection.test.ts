import { describe, it, expect } from "vitest";
import { selectSessionItems } from "./sessionSelection";
import type { ItemStats, ItemStatsStore } from "./itemStats";

function makeStats(id: string, correct: number, incorrect: number): ItemStats {
  return { id, correct, incorrect, history: [...Array(correct).fill(true), ...Array(incorrect).fill(false)], lastSeen: 0 };
}

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `x${i + 1}`,
    japanese: "テスト",
    romaji: "tesuto",
    meaning: "Test",
  }));
}

// Markiert die ersten `count` Items als bereits geübt (mit gegebener Erfolgsquote),
// der Rest bleibt unangetastet (totalAttempts === 0, "noch nie geübt").
function markSeen(items: ReturnType<typeof makeItems>, count: number, correct: number, incorrect: number) {
  const stats: ItemStatsStore = {};
  for (const item of items.slice(0, count)) {
    stats[item.id] = makeStats(item.id, correct, incorrect);
  }
  return stats;
}

describe("selectSessionItems", () => {
  it("lässt Pools bis 20 Begriffe unverändert", () => {
    const items = makeItems(20);
    expect(selectSessionItems(items, {})).toEqual(items);
  });

  it("lässt kleinere Pools unverändert", () => {
    const items = makeItems(5);
    expect(selectSessionItems(items, {})).toEqual(items);
  });

  it("begrenzt größere Pools auf genau 20 eindeutige Begriffe aus dem Pool", () => {
    const items = makeItems(50);
    const stats = markSeen(items, 30, 8, 2);
    const selected = selectSessionItems(items, stats);
    expect(selected).toHaveLength(20);
    const ids = new Set(selected.map((item) => item.id));
    expect(ids.size).toBe(20);
    for (const item of selected) {
      expect(items.some((i) => i.id === item.id)).toBe(true);
    }
  });

  it("enthält bei genug ungesehenen Wörtern genau die ersten 5 nie geübten Items in Datei-Reihenfolge", () => {
    const items = makeItems(50);
    // Erste 30 Items sind bereits geübt, die letzten 20 sind noch nie geübt.
    const stats = markSeen(items, 30, 8, 2);
    const expectedNewIds = items.slice(30, 35).map((item) => item.id);

    const selected = selectSessionItems(items, stats);
    expect(selected.slice(0, 5).map((item) => item.id)).toEqual(expectedNewIds);
  });

  it("füllt bei weniger als 5 verbleibenden neuen Wörtern nur die tatsächlich verfügbaren neuen Wörter auf, Rest sind Wiederholungen", () => {
    const items = makeItems(30);
    // Nur die letzten 2 Items wurden noch nie geübt.
    const stats = markSeen(items, 28, 5, 5);
    const expectedNewIds = new Set(items.slice(28).map((item) => item.id));

    const selected = selectSessionItems(items, stats);
    expect(selected).toHaveLength(20);
    const newInSelection = selected.filter((item) => expectedNewIds.has(item.id));
    expect(newInSelection).toHaveLength(2);
    const repetitions = selected.filter((item) => !expectedNewIds.has(item.id));
    expect(repetitions).toHaveLength(18);
    for (const item of repetitions) {
      expect(item.id.startsWith("x") && Number(item.id.slice(1)) <= 28).toBe(true);
    }
  });

  it("besteht komplett aus Wiederholungen, wenn alle Wörter bereits gesehen wurden", () => {
    const items = makeItems(25);
    const stats = markSeen(items, 25, 5, 5);

    const selected = selectSessionItems(items, stats);
    expect(selected).toHaveLength(20);
    const ids = new Set(selected.map((item) => item.id));
    expect(ids.size).toBe(20);
  });

  it("füllt mit weiteren neuen Wörtern auf, wenn weder 5 neue noch genug bereits gesehene Wörter für 20 Plätze reichen", () => {
    const items = makeItems(30);
    // Ganz am Anfang der Lektion: nur 3 Items je geübt, der Rest komplett neu.
    const stats = markSeen(items, 3, 5, 0);

    const selected = selectSessionItems(items, stats);
    expect(selected).toHaveLength(20);
    const ids = new Set(selected.map((item) => item.id));
    expect(ids.size).toBe(20);
  });

  it("bevorzugt Wörter mit niedrigerer successRate() in der Wiederholungsauswahl über viele Durchläufe", () => {
    const items = makeItems(30);
    // Alle 30 Items sind bereits geübt: die ersten 15 mit niedriger, die letzten 15 mit
    // hoher Erfolgsquote. Keine neuen Items vorhanden, also besteht die Session komplett
    // aus gewichteten Wiederholungen (20 von 30).
    const stats: ItemStatsStore = {};
    items.forEach((item, i) => {
      stats[item.id] = i < 15 ? makeStats(item.id, 1, 9) : makeStats(item.id, 9, 1);
    });
    const weakIds = new Set(items.slice(0, 15).map((item) => item.id));

    const counts = new Map<string, number>();
    const runs = 100;
    for (let i = 0; i < runs; i++) {
      for (const item of selectSessionItems(items, stats)) {
        counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
      }
    }
    const weakAvg =
      [...weakIds].reduce((sum, id) => sum + (counts.get(id) ?? 0), 0) / weakIds.size;
    const strongIds = items.slice(15).map((item) => item.id);
    const strongAvg = strongIds.reduce((sum, id) => sum + (counts.get(id) ?? 0), 0) / strongIds.length;

    expect(weakAvg).toBeGreaterThan(strongAvg);
  });

  it("zieht auch Items mit 100%-Erfolgsquote über viele Durchläufe gelegentlich, aber seltener", () => {
    const items = makeItems(25);
    const stats: ItemStatsStore = {};
    items.forEach((item, i) => {
      stats[item.id] = i === 0 ? makeStats(item.id, 10, 0) : makeStats(item.id, 1, 9);
    });

    let masteredSeen = 0;
    const runs = 300;
    for (let i = 0; i < runs; i++) {
      if (selectSessionItems(items, stats).some((item) => item.id === "x1")) masteredSeen++;
    }
    expect(masteredSeen).toBeGreaterThan(0);
    expect(masteredSeen).toBeLessThan(runs);
  });
});
