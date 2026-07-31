import type { VocabItem } from "../data/types";
import { successRate, totalAttempts, type ItemStatsStore } from "./itemStats";
import { weightedSampleWithoutReplacement } from "./weightedSample";

const SESSION_CAP = 20;
const NEW_ITEMS_RESERVED = 5;
// Restchance auch für Items mit 100%-Erfolgsquote, damit sie nie komplett aus der
// Wiederholungs-Ziehung herausfallen.
const REPETITION_WEIGHT_FLOOR = 0.05;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Liefert die ersten `count` noch nie geübten Items in bestehender Array-Reihenfolge
// (nicht zufällig gewählt) — liefert weniger, falls insgesamt nicht genug vorhanden sind.
function reserveNewItems(items: VocabItem[], stats: ItemStatsStore, count: number): VocabItem[] {
  const result: VocabItem[] = [];
  for (const item of items) {
    if (result.length >= count) break;
    if (totalAttempts(stats[item.id]) === 0) result.push(item);
  }
  return result;
}

// Begrenzt einen Lektionspool auf eine Session-Auswahl: Pools bis SESSION_CAP bleiben
// unverändert. Größere Pools reservieren NEW_ITEMS_RESERVED noch nie geübte Begriffe (in
// Datei-Reihenfolge), der Rest wird aus bereits geübten Begriffen gewichtet nach
// Erfolgsquote gezogen (je niedriger, desto häufiger). Reicht der Pool bereits geübter
// Begriffe nicht aus, um die restlichen Plätze zu füllen (z.B. ganz am Anfang einer
// großen Lektion, wenn erst wenige Begriffe je geübt wurden), werden weitere, noch nicht
// reservierte neue Begriffe angehängt, bis SESSION_CAP erreicht ist.
export function selectSessionItems(items: VocabItem[], stats: ItemStatsStore): VocabItem[] {
  if (items.length <= SESSION_CAP) return items;

  const newItems = reserveNewItems(items, stats, NEW_ITEMS_RESERVED);
  const seenItems = items.filter((item) => totalAttempts(stats[item.id]) > 0);

  const repetitions = weightedSampleWithoutReplacement(
    seenItems,
    (item) => 1 - successRate(stats[item.id]) + REPETITION_WEIGHT_FLOOR,
    SESSION_CAP - newItems.length,
  );

  const selected = [...newItems, ...repetitions];
  if (selected.length < SESSION_CAP) {
    const selectedIds = new Set(selected.map((item) => item.id));
    for (const item of items) {
      if (selected.length >= SESSION_CAP) break;
      if (!selectedIds.has(item.id)) selected.push(item);
    }
  }

  return selected;
}
