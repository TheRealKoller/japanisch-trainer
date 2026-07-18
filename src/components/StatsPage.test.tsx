// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { StatsPage } from "./StatsPage";

vi.mock("../utils/voicevox", () => ({
  speakText: vi.fn(),
  stopAudio: vi.fn(),
}));

describe("StatsPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("zeigt initial die Hiragana-Sektion (erster Reiter), wenn kein Tab gespeichert ist", () => {
    render(<StatsPage onBack={vi.fn()} />);
    expect(screen.getByText("Dakuten / Handakuten")).toBeInTheDocument();
    expect(screen.queryByText("Ziffern (Zahlen-Quiz)")).not.toBeInTheDocument();
  });

  it("zeigt nach Klick auf einen Reiter nur dessen Sektion", () => {
    render(<StatsPage onBack={vi.fn()} />);
    fireEvent.click(screen.getByText("Zahlen-Quiz"));
    expect(screen.getByText("Ziffern (Zahlen-Quiz)")).toBeInTheDocument();
    expect(screen.queryByText("Dakuten / Handakuten")).not.toBeInTheDocument();
  });

  it("stellt den zuletzt aktiven Reiter nach einem Remount wieder her", () => {
    render(<StatsPage onBack={vi.fn()} />);
    fireEvent.click(screen.getByText("Grundwortschatz"));
    cleanup();

    render(<StatsPage onBack={vi.fn()} />);
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.queryByText("Dakuten / Handakuten")).not.toBeInTheDocument();
  });

  it("öffnet das Detailview beim Klick auf eine Kachel und schließt es wieder", () => {
    render(<StatsPage onBack={vi.fn()} />);
    fireEvent.click(screen.getAllByText("あ")[0]);
    expect(screen.getByText("Noch nicht geübt")).toBeInTheDocument();
    expect(screen.getByTitle("Aussprache anhören")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Schließen"));
    expect(screen.queryByText("Noch nicht geübt")).not.toBeInTheDocument();
  });
});
