import type { VocabItem } from "../data/types";
import type { CardOrientation } from "../components/Flashcard";

// Weist jeder Karte einmalig eine zufällige Ausrichtung zu (~50/50 forward/reversed).
export function buildOrientations(items: VocabItem[]): Record<string, CardOrientation> {
  const map: Record<string, CardOrientation> = {};
  for (const item of items) {
    map[item.id] = Math.random() < 0.5 ? "forward" : "reversed";
  }
  return map;
}
