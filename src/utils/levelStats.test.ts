import { describe, it, expect, beforeEach } from "vitest";
import { loadUnlockedLevel, saveUnlockedLevel } from "./levelStats";

// localStorage mock for node environment
const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value); },
    removeItem: (key: string) => { storage.delete(key); },
    clear: () => { storage.clear(); },
  },
  writable: true,
  configurable: true,
});

describe("levelStats", () => {
  beforeEach(() => { storage.clear(); });

  it("liefert Level 1 ohne gespeicherten Stand", () => {
    expect(loadUnlockedLevel("level-core-vocab")).toBe(1);
  });

  it("persistiert freigeschaltete Level pro Lektion getrennt", () => {
    saveUnlockedLevel("level-core-vocab", 3);
    saveUnlockedLevel("kana-level-hiragana", 5);
    expect(loadUnlockedLevel("level-core-vocab")).toBe(3);
    expect(loadUnlockedLevel("kana-level-hiragana")).toBe(5);
    expect(loadUnlockedLevel("level-daily-phrases")).toBe(1);
  });

  it("liest die bestehenden localStorage-Keys der Kana-Lektionen weiter", () => {
    storage.set("japanisch-trainer:kana-level-katakana", "7");
    expect(loadUnlockedLevel("kana-level-katakana")).toBe(7);
  });

  it("fällt bei ungültigem Wert auf Level 1 zurück", () => {
    storage.set("japanisch-trainer:level-travel-phrases", "abc");
    expect(loadUnlockedLevel("level-travel-phrases")).toBe(1);
  });
});
