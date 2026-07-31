import { describe, it, expect } from "vitest";
import { weightedSampleWithoutReplacement } from "./weightedSample";

describe("weightedSampleWithoutReplacement", () => {
  it("liefert den gesamten Pool wenn count >= pool.length", () => {
    const pool = [1, 2, 3];
    const result = weightedSampleWithoutReplacement(pool, () => 1, 5);
    expect(result).toHaveLength(3);
    expect(new Set(result)).toEqual(new Set(pool));
  });

  it("liefert genau count eindeutige Elemente aus dem Pool", () => {
    const pool = Array.from({ length: 30 }, (_, i) => i);
    const result = weightedSampleWithoutReplacement(pool, () => 1, 10);
    expect(result).toHaveLength(10);
    expect(new Set(result).size).toBe(10);
    for (const item of result) {
      expect(pool).toContain(item);
    }
  });

  it("zieht Elemente mit höherem Gewicht über viele Läufe hinweg deutlich häufiger", () => {
    const pool = ["heavy", "light"];
    let heavyCount = 0;
    const runs = 500;
    for (let i = 0; i < runs; i++) {
      const [drawn] = weightedSampleWithoutReplacement(pool, (item) => (item === "heavy" ? 100 : 0.01), 1);
      if (drawn === "heavy") heavyCount++;
    }
    expect(heavyCount).toBeGreaterThan(runs * 0.9);
  });

  it("zieht auch Elemente mit niedrigem Gewicht gelegentlich", () => {
    const pool = Array.from({ length: 5 }, (_, i) => i);
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const [drawn] = weightedSampleWithoutReplacement(pool, (item) => (item === 0 ? 0.3 : 1), 1);
      seen.add(drawn);
    }
    expect(seen.has(0)).toBe(true);
  });
});
