import type { VocabItem } from "../data/types";
import { successRate, type ItemStatsStore } from "./itemStats";

const SESSION_CAP = 20;
const GUARANTEED_LOW_RATE_COUNT = 10;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Begrenzt einen kumulierten Level-Pool auf eine Session-Auswahl: Pools bis SESSION_CAP
// bleiben unverändert. Größere Pools liefern GUARANTEED_LOW_RATE_COUNT Begriffe mit der
// niedrigsten Erfolgsquote (nie geübt zählt als 0%, siehe successRate()) garantiert, der
// Rest wird gleichverteilt zufällig aus dem verbleibenden Pool ergänzt — so kommen auch
// bereits gut beherrschte Begriffe hin und wieder dran. Items werden vor dem (stabilen)
// Sortieren einmal gemischt, damit Gleichstände an der Auswahlgrenze zufällig aufgelöst
// werden statt die Array-Reihenfolge zu bevorzugen. Die Rückgabe-Reihenfolge ist NICHT
// zufällig für die Session-Anzeige geeignet (schwächste Begriffe stehen zuerst) — Aufrufer
// müssen selbst nochmal mischen, wenn eine zufällige Anzeigereihenfolge gebraucht wird.
export function selectSessionItems(items: VocabItem[], stats: ItemStatsStore): VocabItem[] {
  if (items.length <= SESSION_CAP) return items;

  const byRateAsc = shuffle(items).sort(
    (a, b) => successRate(stats[a.id]) - successRate(stats[b.id]),
  );

  const guaranteed = byRateAsc.slice(0, GUARANTEED_LOW_RATE_COUNT);
  const remainder = byRateAsc.slice(GUARANTEED_LOW_RATE_COUNT);
  const randomRest = shuffle(remainder).slice(0, SESSION_CAP - GUARANTEED_LOW_RATE_COUNT);

  return [...guaranteed, ...randomRest];
}
