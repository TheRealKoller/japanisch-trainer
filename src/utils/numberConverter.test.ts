import { describe, it, expect } from "vitest";
import { numberToKanji, numberToHiragana, numberToRomaji, numberToHiraganaAlt } from "./numberConverter";

describe("numberToKanji", () => {
  it("converts 0", () => expect(numberToKanji(0)).toBe("零"));
  it("converts 1", () => expect(numberToKanji(1)).toBe("一"));
  it("converts 10", () => expect(numberToKanji(10)).toBe("十"));
  it("converts 11", () => expect(numberToKanji(11)).toBe("十一"));
  it("converts 20", () => expect(numberToKanji(20)).toBe("二十"));
  it("converts 100", () => expect(numberToKanji(100)).toBe("百"));
  it("converts 101", () => expect(numberToKanji(101)).toBe("百一"));
  it("converts 200", () => expect(numberToKanji(200)).toBe("二百"));
  it("converts 1000", () => expect(numberToKanji(1000)).toBe("千"));
  it("converts 1001", () => expect(numberToKanji(1001)).toBe("千一"));
  it("converts 2000", () => expect(numberToKanji(2000)).toBe("二千"));
  it("converts 10000", () => expect(numberToKanji(10000)).toBe("一万"));
  it("converts 99999", () => expect(numberToKanji(99999)).toBe("九万九千九百九十九"));
  it("converts 3847", () => expect(numberToKanji(3847)).toBe("三千八百四十七"));
  it("converts 20000", () => expect(numberToKanji(20000)).toBe("二万"));
});

describe("numberToHiragana", () => {
  it("converts 0", () => expect(numberToHiragana(0)).toBe("れい / ゼロ"));
  it("converts 1", () => expect(numberToHiragana(1)).toBe("いち"));
  it("converts 10", () => expect(numberToHiragana(10)).toBe("じゅう"));
  it("converts 11", () => expect(numberToHiragana(11)).toBe("じゅういち"));
  it("converts 100", () => expect(numberToHiragana(100)).toBe("ひゃく"));
  it("converts 300 (irregular)", () => expect(numberToHiragana(300)).toBe("さんびゃく"));
  it("converts 600 (irregular)", () => expect(numberToHiragana(600)).toBe("ろっぴゃく"));
  it("converts 800 (irregular)", () => expect(numberToHiragana(800)).toBe("はっぴゃく"));
  it("converts 1000", () => expect(numberToHiragana(1000)).toBe("せん"));
  it("converts 3000 (irregular)", () => expect(numberToHiragana(3000)).toBe("さんぜん"));
  it("converts 8000 (irregular)", () => expect(numberToHiragana(8000)).toBe("はっせん"));
  it("converts 10000", () => expect(numberToHiragana(10000)).toBe("いちまん"));
  it("converts 99999", () => expect(numberToHiragana(99999)).toBe("きゅうまんきゅうせんきゅうひゃくきゅうじゅうきゅう"));
});

describe("numberToRomaji", () => {
  it("converts 0", () => expect(numberToRomaji(0)).toBe("rei / zero"));
  it("converts 10", () => expect(numberToRomaji(10)).toBe("juu"));
  it("converts 100", () => expect(numberToRomaji(100)).toBe("hyaku"));
  it("converts 300 (irregular)", () => expect(numberToRomaji(300)).toBe("sanbyaku"));
  it("converts 1000", () => expect(numberToRomaji(1000)).toBe("sen"));
  it("converts 3000 (irregular)", () => expect(numberToRomaji(3000)).toBe("sanzen"));
  it("converts 99999", () => expect(numberToRomaji(99999)).toBe("kyuumankyuusenkyuuhyakukyuujuukyuu"));
});

describe("alternate readings", () => {
  it("returns null when no alternate exists", () => expect(numberToHiraganaAlt(1)).toBeNull());
  it("よん → し alternate for 4", () => expect(numberToHiraganaAlt(4)).toBe("し"));
  it("なな → しち alternate for 7", () => expect(numberToHiraganaAlt(7)).toBe("しち"));
  it("きゅう → く alternate for 9", () => expect(numberToHiraganaAlt(9)).toBe("く"));
  it("alternate works in compound numbers", () => expect(numberToHiraganaAlt(47)).toBe("しじゅうしち"));
});
