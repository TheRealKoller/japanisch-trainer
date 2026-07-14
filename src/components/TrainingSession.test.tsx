// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TrainingSession } from "./TrainingSession";
import { StatsPage } from "./StatsPage";
import { saveItemStats } from "../utils/itemStats";
import type { VocabItem } from "../data/types";

vi.mock("../utils/voicevox", () => ({
  speakText: vi.fn(),
  prefetchAudio: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, login: vi.fn(), register: vi.fn(), logout: vi.fn() }),
}));

const singleHiraganaItem: VocabItem[] = [{ id: "ha", japanese: "は", romaji: "ha", meaning: "ha" }];

function completeSession() {
  fireEvent.click(screen.getByText("Tippen zum Umdrehen"));
  fireEvent.click(screen.getByText("Gewusst"));
}

describe("TrainingSession Fertig-Screen Statistik-Sektion (Issue #133)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("zeigt nach Abschluss einer Hiragana-Lektion nur die Hiragana-Sektion, keine anderen Kategorien", () => {
    render(
      <TrainingSession items={singleHiraganaItem} title="Hiragana – Level 1" onBack={() => {}} lessonId="hiragana" />,
    );
    completeSession();

    expect(screen.getByText("Geschafft!")).toBeInTheDocument();
    expect(screen.getByText("Hiragana")).toBeInTheDocument();
    expect(screen.queryByText("Katakana")).not.toBeInTheDocument();
    expect(screen.queryByText("Grundwortschatz")).not.toBeInTheDocument();
    expect(screen.queryByText("Alltags-Floskeln")).not.toBeInTheDocument();
    expect(screen.queryByText("Reise-Floskeln")).not.toBeInTheDocument();
    expect(screen.queryByText("Ziffern (Zahlen-Quiz)")).not.toBeInTheDocument();
  });

  it("zeigt keine Statistik-Sektion, wenn keine lessonId übergeben wird (z.B. Zahlen-Lektion)", () => {
    render(<TrainingSession items={singleHiraganaItem} title="Zahlen" onBack={() => {}} />);
    completeSession();

    expect(screen.getByText("Geschafft!")).toBeInTheDocument();
    expect(screen.queryByText("Hiragana")).not.toBeInTheDocument();
  });

  it("zeigt dieselben Statistik-Werte wie die globale Statistik-Seite (gleiche Datenquelle loadItemStats())", () => {
    saveItemStats({
      ha: { id: "ha", correct: 4, incorrect: 1, history: [true, true, true, true, false], lastSeen: 0 },
    });

    const { unmount } = render(
      <TrainingSession items={singleHiraganaItem} title="Hiragana – Level 1" onBack={() => {}} lessonId="hiragana" />,
    );
    completeSession();
    // Die Session selbst schreibt eine neue Antwort in den Store — die Erfolgsquote nach
    // Abschluss (5 von 6 Antworten) muss mit der später frisch geladenen StatsPage übereinstimmen.
    expect(screen.getByText("83%")).toBeInTheDocument();
    unmount();

    render(<StatsPage onBack={() => {}} />);
    expect(screen.getByText("83%")).toBeInTheDocument();
  });
});
