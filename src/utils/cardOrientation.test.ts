import { describe, it, expect } from "vitest";
import { buildOrientations } from "./cardOrientation";

const items = Array.from({ length: 200 }, (_, i) => ({
  id: `x${i + 1}`,
  japanese: "テスト",
  romaji: "tesuto",
  meaning: "Test",
}));

describe("buildOrientations", () => {
  it("weist jeder Karte eine Ausrichtung zu", () => {
    const orientations = buildOrientations(items);
    expect(Object.keys(orientations)).toHaveLength(items.length);
    for (const item of items) {
      expect(["forward", "reversed"]).toContain(orientations[item.id]);
    }
  });

  it("verteilt Ausrichtungen ungefähr 50/50", () => {
    const orientations = buildOrientations(items);
    const reversedCount = Object.values(orientations).filter((o) => o === "reversed").length;
    const ratio = reversedCount / items.length;
    expect(ratio).toBeGreaterThan(0.3);
    expect(ratio).toBeLessThan(0.7);
  });
});
