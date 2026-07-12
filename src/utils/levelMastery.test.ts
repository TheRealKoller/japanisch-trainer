import { describe, it, expect } from "vitest";
import { isLevelMastered, highestUnlockedLevel } from "./levelMastery";
import { buildLevels } from "../data/levels";
import type { ItemStatsStore } from "./itemStats";

const items = Array.from({ length: 24 }, (_, i) => ({ id: `x${i + 1}` }));
const levels = buildLevels(items, 8); // Level 1: x1-x8, Level 2: x9-x16, Level 3: x17-x24

function statsFor(ids: string[], rate: number): ItemStatsStore {
  const store: ItemStatsStore = {};
  for (const id of ids) {
    store[id] = { id, correct: Math.round(rate * 10), incorrect: 10 - Math.round(rate * 10), lastSeen: 0 };
  }
  return store;
}

describe("isLevelMastered", () => {
  it("ist bestanden, wenn alle kumulierten Begriffe mindestens 90% haben", () => {
    const stats = statsFor(levels[0].ids, 0.9);
    expect(isLevelMastered(items, levels, 1, stats)).toBe(true);
  });

  it("ist nicht bestanden, wenn ein einzelner Begriff unter 90% liegt", () => {
    const stats = statsFor(levels[0].ids, 1);
    stats[levels[0].ids[0]] = { id: levels[0].ids[0], correct: 8, incorrect: 2, lastSeen: 0 }; // 80%
    expect(isLevelMastered(items, levels, 1, stats)).toBe(false);
  });

  it("behandelt nie geübte Begriffe (kein Store-Eintrag) als 0% und damit als nicht bestanden", () => {
    expect(isLevelMastered(items, levels, 1, {})).toBe(false);
  });

  it("prüft kumulativ auch vorherige Level, nicht nur das Ziel-Level selbst", () => {
    const stats = { ...statsFor(levels[0].ids, 0.5), ...statsFor(levels[1].ids, 1) };
    // Level 2 selbst steht bei 100%, aber Level 1 (Voraussetzung) nur bei 50%.
    expect(isLevelMastered(items, levels, 2, stats)).toBe(false);
  });

  it("ist nicht bestanden für ein Level jenseits der definierten Level", () => {
    expect(isLevelMastered(items, levels, 99, {})).toBe(false);
  });
});

describe("highestUnlockedLevel", () => {
  it("liefert 1 ohne jede Statistik", () => {
    expect(highestUnlockedLevel(items, levels, {})).toBe(1);
  });

  it("liefert das nächste Level nach dem letzten durchgehend bestandenen Level", () => {
    const stats = { ...statsFor(levels[0].ids, 1), ...statsFor(levels[1].ids, 1) };
    expect(highestUnlockedLevel(items, levels, stats)).toBe(3);
  });

  it("bricht am ersten nicht bestandenen Level ab, auch wenn spätere Level isoliert bestehen würden", () => {
    const stats = { ...statsFor(levels[0].ids, 1), ...statsFor(levels[2].ids, 1) }; // Level 2 fehlt
    expect(highestUnlockedLevel(items, levels, stats)).toBe(2);
  });

  it("fällt bei Regression eines früheren Levels wieder zurück (Re-Lock)", () => {
    const mastered = { ...statsFor(levels[0].ids, 1), ...statsFor(levels[1].ids, 1) };
    expect(highestUnlockedLevel(items, levels, mastered)).toBe(3);

    const regressed = { ...mastered, [levels[0].ids[0]]: { id: levels[0].ids[0], correct: 1, incorrect: 9, lastSeen: 0 } };
    expect(highestUnlockedLevel(items, levels, regressed)).toBe(1);
  });
});
