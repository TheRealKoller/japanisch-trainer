// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GojuonSection, LevelGroupedSection, DigitSection } from "./StatsSections";
import type { VocabItem } from "../data/types";
import type { Level } from "../data/levels";
import type { ItemStatsStore } from "../utils/itemStats";

function stats(correct: number, incorrect: number): ItemStatsStore[string] {
  const history = [...Array(correct).fill(true), ...Array(incorrect).fill(false)];
  return { id: "x", correct, incorrect, history, lastSeen: 0 };
}

describe("GojuonSection", () => {
  it("zeigt Titel und Erfolgsquote für ein bekanntes Item", () => {
    const items: VocabItem[] = [{ id: "ha", japanese: "は", romaji: "ha", meaning: "ha" }];
    const store: ItemStatsStore = { ha: stats(4, 1) };
    render(<GojuonSection title="Hiragana" items={items} prefix="h" store={store} />);
    expect(screen.getByText("Hiragana")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("ruft onSelect mit dem Item auf, wenn eine Kachel angeklickt wird", () => {
    const items: VocabItem[] = [{ id: "ha", japanese: "は", romaji: "ha", meaning: "ha" }];
    const store: ItemStatsStore = { ha: stats(4, 1) };
    const onSelect = vi.fn();
    render(<GojuonSection title="Hiragana" items={items} prefix="h" store={store} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("は"));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it("ist ohne onSelect nicht klickbar (kein Button-Element)", () => {
    const items: VocabItem[] = [{ id: "ha", japanese: "は", romaji: "ha", meaning: "ha" }];
    const store: ItemStatsStore = { ha: stats(4, 1) };
    render(<GojuonSection title="Hiragana" items={items} prefix="h" store={store} />);
    expect(screen.queryByRole("button", { name: /は/ })).not.toBeInTheDocument();
  });
});

describe("LevelGroupedSection", () => {
  it("zeigt Titel, Level-Überschrift und Erfolgsquote", () => {
    const items: VocabItem[] = [{ id: "cv1", japanese: "水", romaji: "mizu", meaning: "Wasser" }];
    const levels: Level[] = [{ level: 1, ids: ["cv1"] }];
    const store: ItemStatsStore = { cv1: stats(3, 1) };
    render(<LevelGroupedSection title="Grundwortschatz" items={items} levels={levels} store={store} />);
    expect(screen.getByText("Grundwortschatz")).toBeInTheDocument();
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("ruft onSelect mit dem Item auf, wenn eine Kachel angeklickt wird", () => {
    const items: VocabItem[] = [{ id: "cv1", japanese: "水", romaji: "mizu", meaning: "Wasser" }];
    const levels: Level[] = [{ level: 1, ids: ["cv1"] }];
    const store: ItemStatsStore = { cv1: stats(3, 1) };
    const onSelect = vi.fn();
    render(<LevelGroupedSection title="Grundwortschatz" items={items} levels={levels} store={store} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("水"));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });
});

describe("DigitSection", () => {
  it("zeigt alle Ziffern 0-9 sowie Überschrift", () => {
    const store: ItemStatsStore = { d3: stats(4, 1) };
    render(<DigitSection store={store} />);
    expect(screen.getByText("Ziffern (Zahlen-Quiz)")).toBeInTheDocument();
    for (let d = 0; d <= 9; d++) {
      expect(screen.getByText(String(d))).toBeInTheDocument();
    }
  });
});
