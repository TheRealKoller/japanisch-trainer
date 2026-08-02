// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ParticleQuizSession } from "./ParticleQuizSession";
import { loadItemStats } from "../utils/itemStats";
import { particleSentences } from "../data/particleSentences";

vi.mock("../utils/voicevox", () => ({
  speakText: vi.fn(),
  prefetchAudio: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, login: vi.fn(), register: vi.fn(), logout: vi.fn() }),
}));

// Macht die Session-Reihenfolge deterministisch: erste Frage ist immer particleSentences[0]
// (ps1, correctParticle "は"), damit die Auswertungslogik gezielt getestet werden kann.
vi.mock("../utils/sessionSelection", async () => {
  const actual = await vi.importActual<typeof import("../utils/sessionSelection")>("../utils/sessionSelection");
  return { ...actual, shuffle: <T,>(arr: T[]) => arr, selectSessionItems: <T,>(items: T[]) => items };
});

const first = particleSentences[0]; // ps1: "は", "Das ist ein Buch."

// shuffle/selectSessionItems sind auf Identität gemockt und es wird immer richtig geantwortet
// (keine Wiederholungen) — die Queue-Reihenfolge entspricht daher durchgehend particleSentences.
function completeQuiz() {
  for (const item of particleSentences) {
    fireEvent.click(screen.getByRole("button", { name: item.correctParticle }));
    fireEvent.click(screen.getByText("Weiter"));
  }
}

describe("ParticleQuizSession Auswertungslogik", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("wertet eine richtige Auswahl als korrekt (Statistik, Fortschritt, Übersetzung)", () => {
    render(<ParticleQuizSession onBack={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: first.correctParticle }));

    expect(screen.getByText(first.translation)).toBeInTheDocument();
    expect(screen.getByText(`1 / ${particleSentences.length} gelernt`)).toBeInTheDocument();

    const stats = loadItemStats();
    expect(stats["p-ha"].correct).toBe(1);
    expect(stats["p-ha"].incorrect).toBe(0);
    // Satz-ID muss ebenfalls erfasst werden — sonst hält selectSessionItems() den Session-Pool
    // dauerhaft auf die ersten SESSION_CAP Sätze eingefroren (nie geübte Sätze bleiben "neu").
    expect(stats[first.id].correct).toBe(1);
    expect(stats[first.id].incorrect).toBe(0);
  });

  it("wertet eine falsche Auswahl als falsch (Statistik, Fortschritt bleibt 0, richtige Option wird hervorgehoben)", () => {
    render(<ParticleQuizSession onBack={() => {}} />);

    const wrongOption = first.correctParticle === "が" ? "を" : "が";
    fireEvent.click(screen.getByRole("button", { name: wrongOption }));

    expect(screen.getByText(first.translation)).toBeInTheDocument();
    expect(screen.getByText(`0 / ${particleSentences.length} gelernt`)).toBeInTheDocument();

    const stats = loadItemStats()["p-ha"];
    expect(stats.correct).toBe(0);
    expect(stats.incorrect).toBe(1);

    const correctButton = screen.getByRole("button", { name: first.correctParticle });
    expect(correctButton.className).toMatch(/bg-green-100/);
    const wrongButton = screen.getByRole("button", { name: wrongOption });
    expect(wrongButton.className).toMatch(/bg-red-100/);
  });

  it("sperrt die Optionen nach der Antwort und schaltet erst mit 'Weiter' zur nächsten Frage", () => {
    render(<ParticleQuizSession onBack={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: first.correctParticle }));
    for (const p of ["は", "が", "を", "に", "で"]) {
      expect(screen.getByRole("button", { name: p })).toBeDisabled();
    }

    fireEvent.click(screen.getByText("Weiter"));
    expect(screen.queryByText(first.translation)).not.toBeInTheDocument();
  });

  it("zeigt nach Abschluss der Session den Geschafft!-Screen mit der Partikel-Statistik", () => {
    render(<ParticleQuizSession onBack={() => {}} />);
    completeQuiz();

    expect(screen.getByText("Geschafft!")).toBeInTheDocument();
    expect(screen.getByText("Partikel (Partikel-Übung)")).toBeInTheDocument();
    expect(screen.getByText(`${particleSentences.length}`)).toBeInTheDocument();
  });
});
