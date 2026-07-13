import { pushProgress } from "./progressSync";

// Anzahl der jüngsten Antworten, die in successRate() einfließen — ältere Antworten
// verjähren, damit früh im Lernprozess gemachte Fehler nicht dauerhaft nachwirken.
export const HISTORY_WINDOW = 10;

export interface ItemStats {
  id: string;
  correct: number;
  incorrect: number;
  // Letzte HISTORY_WINDOW Antworten (älteste zuerst) — Grundlage für successRate().
  // correct/incorrect bleiben als Lifetime-Zähler daneben bestehen.
  history: boolean[];
  lastSeen: number;
}

export type ItemStatsStore = Record<string, ItemStats>;

const STORAGE_KEY = "japanisch-trainer:item-stats";

// Alt-Datensätze (vor Einführung von history[]) haben nur correct/incorrect. Leitet daraus
// eine plausible Historie ab, statt bestehende Level durch einen abrupten Rate-Sprung auf 0%
// zu sperren — die Reihenfolge der Einträge ist irrelevant, da nur der Mittelwert zählt.
function migrateEntry(raw: ItemStats): ItemStats {
  if (Array.isArray(raw.history)) return raw;
  const total = raw.correct + raw.incorrect;
  const n = Math.min(total, HISTORY_WINDOW);
  const trueCount = total === 0 ? 0 : Math.round((n * raw.correct) / total);
  return { ...raw, history: [...Array(trueCount).fill(true), ...Array(n - trueCount).fill(false)] };
}

export function loadItemStats(): ItemStatsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const store = JSON.parse(raw) as ItemStatsStore;
    return Object.fromEntries(Object.entries(store).map(([id, stats]) => [id, migrateEntry(stats)]));
  } catch {
    return {};
  }
}

export function saveItemStats(store: ItemStatsStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage quota errors
  }
  pushProgress("item-stats", store);
}

export function updateItemRecord(store: ItemStatsStore, id: string, correct: boolean): ItemStatsStore {
  const prev = store[id] ?? { id, correct: 0, incorrect: 0, history: [], lastSeen: 0 };
  return {
    ...store,
    [id]: {
      id,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      history: [...prev.history, correct].slice(-HISTORY_WINDOW),
      lastSeen: Date.now(),
    },
  };
}

export function recordAnswer(id: string, correct: boolean): void {
  saveItemStats(updateItemRecord(loadItemStats(), id, correct));
}

// Erfolgsquote 0..1 über die letzten HISTORY_WINDOW Antworten; kein Datensatz oder keine
// Antworten (nie geübt) zählt als 0.
export function successRate(stats: ItemStats | undefined): number {
  if (!stats || stats.history.length === 0) return 0;
  return stats.history.filter(Boolean).length / stats.history.length;
}
