import { describe, it, expect } from "vitest";
import { buildLevels } from "./levels";

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
