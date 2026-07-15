// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonTabs } from "./LessonTabs";
import type { StatsLessonId } from "./StatsSections";

const IDS: StatsLessonId[] = ["hiragana", "katakana", "number-quiz"];

describe("LessonTabs", () => {
  it("zeigt alle Labels in der übergebenen Reihenfolge", () => {
    render(<LessonTabs ids={IDS} active="hiragana" onSelect={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["Hiragana", "Katakana", "Zahlen-Quiz"]);
  });

  it("hebt den aktiven Reiter optisch hervor", () => {
    render(<LessonTabs ids={IDS} active="katakana" onSelect={vi.fn()} />);
    expect(screen.getByText("Katakana")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Hiragana")).toHaveAttribute("aria-pressed", "false");
  });

  it("ruft onSelect mit der passenden ID auf", () => {
    const onSelect = vi.fn();
    render(<LessonTabs ids={IDS} active="hiragana" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Zahlen-Quiz"));
    expect(onSelect).toHaveBeenCalledWith("number-quiz");
  });
});
