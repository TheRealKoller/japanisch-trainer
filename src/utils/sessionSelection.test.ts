import { describe, it, expect } from "vitest";
import { selectSessionItems } from "./sessionSelection";
import type { ItemStatsStore } from "./itemStats";

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `x${i + 1}`,
    japanese: "テスト",
    romaji: "tesuto",
    meaning: "Test",
  }));
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
    const selected = selectSessionItems(items, {});
    expect(selected).toHaveLength(20);
    const ids = new Set(selected.map((item) => item.id));
    expect(ids.size).toBe(20);
    for (const item of selected) {
      expect(items.some((i) => i.id === item.id)).toBe(true);
    }
  });

  it("enthält garantiert die 10 Begriffe mit der niedrigsten Erfolgsquote", () => {
    const items = makeItems(30);
    const stats: ItemStatsStore = {};
    // Die ersten 10 Begriffe bekommen eine niedrige, eindeutig unterscheidbare Quote,
    // der Rest eine deutlich höhere Quote — kein Gleichstand an der Auswahlgrenze.
    items.forEach((item, i) => {
      stats[item.id] = { id: item.id, correct: i < 10 ? 0 : 9, incorrect: i < 10 ? 10 - i : 1, lastSeen: 0 };
    });
    const expectedWeakestIds = items.slice(0, 10).map((item) => item.id);

    const selected = selectSessionItems(items, stats);
    const selectedIds = new Set(selected.map((item) => item.id));
    for (const id of expectedWeakestIds) {
      expect(selectedIds.has(id)).toBe(true);
    }
  });

  it("behandelt nie geübte Begriffe (kein Store-Eintrag) als 0% und bevorzugt sie", () => {
    const items = makeItems(25);
    const stats: ItemStatsStore = {};
    // Nur die letzten 5 Begriffe haben überhaupt einen Eintrag, alle mit 100%.
    for (const item of items.slice(20)) {
      stats[item.id] = { id: item.id, correct: 5, incorrect: 0, lastSeen: 0 };
    }
    const neverPracticedIds = new Set(items.slice(0, 20).map((item) => item.id));

    const selected = selectSessionItems(items, stats);
    const guaranteedWeakest = selected.slice(0, 10);
    for (const item of guaranteedWeakest) {
      expect(neverPracticedIds.has(item.id)).toBe(true);
    }
  });

  it("wählt die zufälligen 10 über mehrere Durchläufe hinweg unterschiedlich aus", () => {
    const items = makeItems(30);
    // Alle Begriffe haben dieselbe (hohe) Quote — die "schwächsten 10" sind also
    // beliebig, und die "zufälligen 10" sollten über viele Läufe hinweg variieren.
    const stats: ItemStatsStore = Object.fromEntries(
      items.map((item) => [item.id, { id: item.id, correct: 10, incorrect: 0, lastSeen: 0 }]),
    );

    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      for (const item of selectSessionItems(items, stats)) {
        seen.add(item.id);
      }
    }
    // Bei rein deterministischer Auswahl blieben immer dieselben 20 IDs übrig.
    expect(seen.size).toBeGreaterThan(20);
  });
});
