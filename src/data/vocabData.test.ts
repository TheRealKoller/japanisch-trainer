import { describe, it, expect } from "vitest";
import { numbers } from "./numbers";
import { hiragana } from "./hiragana";
import { katakana } from "./katakana";
import { coreVocab, coreVocabLevels } from "./coreVocab";
import { dailyPhrases, dailyPhraseLevels } from "./dailyPhrases";
import { travelPhrases, travelPhraseLevels } from "./travelPhrases";

const datasets = [
  { name: "Grundwortschatz", items: coreVocab, levels: coreVocabLevels, prefix: "w", count: 80 },
  { name: "Alltags-Floskeln", items: dailyPhrases, levels: dailyPhraseLevels, prefix: "a", count: 40 },
  { name: "Reise-Floskeln", items: travelPhrases, levels: travelPhraseLevels, prefix: "r", count: 40 },
];

const kanjiRe = /[一-鿿]/;

for (const { name, items, levels, prefix, count } of datasets) {
  describe(name, () => {
    it(`enthält ${count} Karten`, () => {
      expect(items).toHaveLength(count);
    });

    it("hat eindeutige IDs mit korrektem Prefix", () => {
      const ids = items.map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
      const idPattern = new RegExp(`^${prefix}\\d+$`);
      for (const id of ids) {
        expect(id).toMatch(idPattern);
      }
    });

    it("hat keine leeren Pflichtfelder", () => {
      for (const item of items) {
        expect(item.japanese.trim(), item.id).not.toBe("");
        expect(item.romaji.trim(), item.id).not.toBe("");
        expect(item.meaning.trim(), item.id).not.toBe("");
      }
    });

    it("hat eine Kana-Lesung bei allen Kanji-Einträgen", () => {
      for (const item of items) {
        if (kanjiRe.test(item.japanese)) {
          expect(item.reading, `${item.id} (${item.japanese})`).toBeTruthy();
        }
      }
    });

    it("deckt mit den Leveln alle Karten genau einmal ab", () => {
      expect(levels.flatMap((l) => l.ids)).toEqual(items.map((i) => i.id));
      levels.forEach((level, i) => {
        expect(level.level).toBe(i + 1);
        expect(level.ids.length).toBeGreaterThanOrEqual(8);
        expect(level.ids.length).toBeLessThanOrEqual(10);
      });
    });
  });
}

describe("alle Lektionen", () => {
  it("hat lektionsübergreifend eindeutige IDs", () => {
    const all = [...numbers, ...hiragana, ...katakana, ...coreVocab, ...dailyPhrases, ...travelPhrases];
    const ids = all.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
