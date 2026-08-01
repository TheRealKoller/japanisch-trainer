import { pushProgress } from "./progressSync";

// Anzahl der jüngsten Antworten, die in successRate() einfließen — ältere Antworten
// verjähren, damit früh im Lernprozess gemachte Fehler nicht dauerhaft nachwirken.
export const HISTORY_WINDOW = 10;

// Schwelle für "gemeistert" bei der Kachel-Einfärbung in den Statistik-Sektionen.
// Ehemals in utils/levelMastery.ts (Level-Freischaltlogik entfernt, Issue #143).
export const MASTERY_THRESHOLD = 0.9;

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
// correct/incorrect werden dabei defensiv genormt: ein einzelner beschädigter Eintrag
// (z.B. NaN durch manuelle localStorage-Manipulation) darf nicht die gesamte Migration
// crashen und damit über den try/catch in loadItemStats() die komplette Statistik löschen.
function migrateEntry(raw: ItemStats): ItemStats {
  if (Array.isArray(raw.history)) return raw;
  const correct = Number.isFinite(raw.correct) && raw.correct > 0 ? raw.correct : 0;
  const incorrect = Number.isFinite(raw.incorrect) && raw.incorrect > 0 ? raw.incorrect : 0;
  const total = correct + incorrect;
  const n = Math.min(total, HISTORY_WINDOW);
  const trueCount = total === 0 ? 0 : Math.round((n * correct) / total);
  return { ...raw, correct, incorrect, history: [...Array(trueCount).fill(true), ...Array(n - trueCount).fill(false)] };
}

function migrateStore(store: ItemStatsStore): ItemStatsStore {
  const result: ItemStatsStore = {};
  for (const [id, stats] of Object.entries(store)) {
    try {
      result[id] = migrateEntry(stats);
    } catch {
      // Ein einzelner unlesbarer Eintrag darf nicht die gesamte Statistik mitreißen.
    }
  }
  return result;
}

export function loadItemStats(): ItemStatsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return migrateStore(JSON.parse(raw) as ItemStatsStore);
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

// Erfolgsquote 0..1 über die gesamte Lernhistorie (Lifetime-Zähler), im Gegensatz zu
// successRate() oben, das nur das jüngste HISTORY_WINDOW betrachtet.
export function lifetimeSuccessRate(stats: ItemStats | undefined): number {
  if (!stats || stats.correct + stats.incorrect === 0) return 0;
  return stats.correct / (stats.correct + stats.incorrect);
}

// Anzahl bisheriger Antworten (richtig + falsch) — 0 bedeutet "noch nie geübt".
export function totalAttempts(stats: ItemStats | undefined): number {
  return (stats?.correct ?? 0) + (stats?.incorrect ?? 0);
}

export interface MasteryBuckets {
  mastered: number; // successRate() >= MASTERY_THRESHOLD
  learning: number; // mindestens 1 Versuch, aber < MASTERY_THRESHOLD
  unseen: number;   // noch nie geübt
}

// Teilt `items` anhand ihrer Erfolgsquote in 3 Kategorien ein — Grundlage für die
// Fortschrittsanzeige pro Lektion (gut gekannt/wird gelernt/noch nicht gesehen, Issue #146).
export function masteryBuckets(items: { id: string }[], stats: ItemStatsStore): MasteryBuckets {
  const result: MasteryBuckets = { mastered: 0, learning: 0, unseen: 0 };
  for (const item of items) {
    const entry = stats[item.id];
    if (totalAttempts(entry) === 0) {
      result.unseen++;
    } else if (successRate(entry) >= MASTERY_THRESHOLD) {
      result.mastered++;
    } else {
      result.learning++;
    }
  }
  return result;
}

// Formatiert eine Quote (0..1) als gerundeten Prozentwert, z.B. 0.8 -> "80%".
export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
