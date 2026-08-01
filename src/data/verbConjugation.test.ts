import { describe, it, expect } from "vitest";
import { verbConjugation, verbConjugationLevels } from "./verbConjugation";
import { coreVocab } from "./coreVocab";

const FORMS = ["て-Form", "ます-Form", "Vergangenheit"];

describe("Verbkonjugation", () => {
  it("enthält 48 Karten", () => {
    expect(verbConjugation).toHaveLength(48);
  });

  it("hat eindeutige IDs mit Prefix v", () => {
    const ids = verbConjugation.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^v\d+$/);
    }
  });

  it("hat keine leeren Pflichtfelder", () => {
    for (const item of verbConjugation) {
      expect(item.japanese.trim(), item.id).not.toBe("");
      expect(item.reading?.trim(), item.id).toBeTruthy();
      expect(item.romaji.trim(), item.id).not.toBe("");
      expect(item.meaning.trim(), item.id).not.toBe("");
      expect(item.formLabel, item.id).toBeTruthy();
    }
  });

  it("deckt mit den Leveln alle Karten genau einmal ab", () => {
    expect(verbConjugationLevels.flatMap((l) => l.ids)).toEqual(verbConjugation.map((i) => i.id));
    verbConjugationLevels.forEach((level, i) => {
      expect(level.level).toBe(i + 1);
      expect(level.ids.length).toBe(8);
    });
  });

  it("hat für jedes der 16 Basisverben genau 3 Konjugationskarten (eine pro Form)", () => {
    const formsByVerb = new Map<string, string[]>();
    for (const item of verbConjugation) {
      const forms = formsByVerb.get(item.japanese) ?? [];
      forms.push(item.formLabel!);
      formsByVerb.set(item.japanese, forms);
    }
    expect(formsByVerb.size).toBe(16);
    for (const [verb, forms] of formsByVerb) {
      expect(new Set(forms), verb).toEqual(new Set(FORMS));
    }
  });

  it("jedes Level übt genau eine Konjugationsform (Level 1-2 て, 3-4 ます, 5-6 Vergangenheit)", () => {
    const lookup = Object.fromEntries(verbConjugation.map((i) => [i.id, i]));
    const expectedFormByLevel = [FORMS[0], FORMS[0], FORMS[1], FORMS[1], FORMS[2], FORMS[2]];
    verbConjugationLevels.forEach((level, i) => {
      for (const id of level.ids) {
        expect(lookup[id].formLabel, `Level ${level.level}, ${id}`).toBe(expectedFormByLevel[i]);
      }
    });
  });

  it("stimmt mit den Basisverben w57-w72 aus coreVocab.ts überein (Kanji + Bedeutung)", () => {
    const baseVerbs = coreVocab.filter((i) => /^w(5[7-9]|6[0-9]|7[0-2])$/.test(i.id));
    expect(baseVerbs).toHaveLength(16);
    const baseMeaningByKanji = new Map(baseVerbs.map((v) => [v.japanese, v.meaning]));
    const conjugatedKanji = new Set(verbConjugation.map((v) => v.japanese));
    expect(conjugatedKanji).toEqual(new Set(baseMeaningByKanji.keys()));
    for (const item of verbConjugation) {
      expect(item.meaning, item.japanese).toBe(baseMeaningByKanji.get(item.japanese));
    }
  });
});
