import type { StatsLessonId } from "../components/StatsSections";

// Anzeigenamen für die Reiter auf der Statistikseite (StatsPage.tsx/LessonTabs.tsx).
// Unabhängig von den Titeln innerhalb von LessonStatsSection/DigitSection — "Zahlen-Quiz"
// statt "Ziffern (Zahlen-Quiz)", da der Tab-Kontext das Präfix redundant macht.
export const LESSON_LABELS: Record<StatsLessonId, string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
  "number-quiz": "Zahlen-Quiz",
  "core-vocab": "Grundwortschatz",
  "daily-phrases": "Alltags-Floskeln",
  "travel-phrases": "Reise-Floskeln",
  "verb-conjugation": "Verbkonjugation",
};
