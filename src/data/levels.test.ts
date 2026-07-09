import { describe, it, expect } from "vitest";
import { buildLevels, itemsForLevel } from "./levels";

const items = Array.from({ length: 20 }, (_, i) => ({ id: `x${i + 1}` }));

describe("buildLevels", () => {
  it("teilt Karten der Reihe nach in Level fester Größe", () => {
    const levels = buildLevels(items, 8);
    expect(levels).toHaveLength(3);
    expect(levels[0]).toEqual({ level: 1, ids: items.slice(0, 8).map((i) => i.id) });
    expect(levels[1]).toEqual({ level: 2, ids: items.slice(8, 16).map((i) => i.id) });
    expect(levels[2]).toEqual({ level: 3, ids: items.slice(16, 20).map((i) => i.id) });
  });
});

describe("itemsForLevel", () => {
  const levels = buildLevels(items, 8);

  it("liefert nicht-kumulativ nur die Karten des gewählten Levels", () => {
    const result = itemsForLevel(items, levels, 2, false);
    expect(result.map((i) => i.id)).toEqual(["x9", "x10", "x11", "x12", "x13", "x14", "x15", "x16"]);
  });

  it("liefert kumulativ alle Karten bis einschließlich des gewählten Levels", () => {
    const result = itemsForLevel(items, levels, 2, true);
    expect(result.map((i) => i.id)).toEqual(items.slice(0, 16).map((i) => i.id));
  });
});
