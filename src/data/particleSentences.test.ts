import { describe, it, expect } from "vitest";
import { particleSentences, PARTICLES, GAP_MARKER } from "./particleSentences";

describe("Partikel-Übung", () => {
  it("enthält 40 Sätze", () => {
    expect(particleSentences).toHaveLength(40);
  });

  it("hat eindeutige IDs mit Prefix ps", () => {
    const ids = particleSentences.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^ps\d+$/);
    }
  });

  it("hat keine leeren Pflichtfelder", () => {
    for (const item of particleSentences) {
      expect(item.sentence.trim(), item.id).not.toBe("");
      expect(item.reading.trim(), item.id).not.toBe("");
      expect(item.translation.trim(), item.id).not.toBe("");
      expect(PARTICLES, item.id).toContain(item.correctParticle);
    }
  });

  it("hat pro Satz genau eine Lücke", () => {
    for (const item of particleSentences) {
      expect(item.sentence.split(GAP_MARKER).length - 1, item.id).toBe(1);
    }
  });

  it("hat pro Partikel genau 8 Sätze", () => {
    const byParticle = new Map<string, number>();
    for (const item of particleSentences) {
      byParticle.set(item.correctParticle, (byParticle.get(item.correctParticle) ?? 0) + 1);
    }
    expect(byParticle.size).toBe(5);
    for (const particle of PARTICLES) {
      expect(byParticle.get(particle), particle).toBe(8);
    }
  });
});
