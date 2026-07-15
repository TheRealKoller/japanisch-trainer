// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberQuizSession } from "./NumberQuizSession";

vi.mock("../utils/voicevox", () => ({
  speakText: vi.fn(),
  prefetchAudio: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, login: vi.fn(), register: vi.fn(), logout: vi.fn() }),
}));

function completeQuiz() {
  fireEvent.click(screen.getByText("Quiz starten"));
  while (!screen.queryByText("Geschafft!")) {
    fireEvent.click(screen.getByText("Tippen zum Umdrehen"));
    fireEvent.click(screen.getByText("Gewusst"));
  }
}

describe("NumberQuizSession Fertig-Screen Ziffern-Statistik (Issue #133)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("zeigt nach Abschluss einer Zahlen-Quiz-Runde die Ziffern-Statistik (d0-d9)", () => {
    render(<NumberQuizSession onBack={() => {}} />);
    completeQuiz();

    expect(screen.getByText("Geschafft!")).toBeInTheDocument();
    expect(screen.getByText("Ziffern (Zahlen-Quiz)")).toBeInTheDocument();
  });
});
