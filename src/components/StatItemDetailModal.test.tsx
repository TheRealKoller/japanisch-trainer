// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { StatItemDetailModal } from "./StatItemDetailModal";
import type { VocabItem } from "../data/types";
import type { ItemStats } from "../utils/itemStats";

vi.mock("../utils/voicevox", () => ({
  speakText: vi.fn(),
  stopAudio: vi.fn(),
}));

const item: VocabItem = { id: "n1", japanese: "一", reading: "いち", romaji: "ichi", meaning: "1" };

function statsFor(correct: number, incorrect: number, lastSeen = 1_700_000_000_000): ItemStats {
  const history = [...Array(correct).fill(true), ...Array(incorrect).fill(false)];
  return { id: "n1", correct, incorrect, history, lastSeen };
}

describe("StatItemDetailModal", () => {
  it("zeigt Schreibweisen des Begriffs", () => {
    render(<StatItemDetailModal item={item} stats={undefined} onClose={vi.fn()} />);
    expect(screen.getByText("一")).toBeInTheDocument();
    expect(screen.getByText("いち")).toBeInTheDocument();
    expect(screen.getByText("ichi")).toBeInTheDocument();
  });

  it("zeigt 'Noch nicht geübt' ohne Statistikdaten", () => {
    render(<StatItemDetailModal item={item} stats={undefined} onClose={vi.fn()} />);
    expect(screen.getByText("Noch nicht geübt")).toBeInTheDocument();
  });

  it("zeigt gesehen, richtig, beide Quoten und den Zeitpunkt der letzten Übung", () => {
    render(<StatItemDetailModal item={item} stats={statsFor(4, 1)} onClose={vi.fn()} />);
    expect(screen.queryByText("Noch nicht geübt")).not.toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // gesehen
    expect(screen.getByText("4")).toBeInTheDocument(); // richtig
    expect(screen.getAllByText("80%")).toHaveLength(2); // aktuelle Quote + Lifetime-Quote
    expect(screen.getByText("Zuletzt geübt")).toBeInTheDocument();
  });

  it("löst beim Klick auf den Play-Button die Sprachausgabe aus", async () => {
    const { speakText } = await import("../utils/voicevox");
    render(<StatItemDetailModal item={item} stats={undefined} onClose={vi.fn()} />);
    fireEvent.click(screen.getByTitle("Aussprache anhören"));
    expect(speakText).toHaveBeenCalledWith("一", expect.any(Function), expect.any(Function), expect.any(Function));
  });

  it("stoppt eine laufende Wiedergabe beim Unmount (Schließen des Modals)", async () => {
    const { stopAudio } = await import("../utils/voicevox");
    const { unmount } = render(<StatItemDetailModal item={item} stats={undefined} onClose={vi.fn()} />);
    unmount();
    expect(stopAudio).toHaveBeenCalled();
    cleanup();
  });
});
