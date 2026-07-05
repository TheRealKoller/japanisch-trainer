export interface ItemStats {
  id: string;
  correct: number;
  incorrect: number;
  lastSeen: number;
}

import { pushProgress } from "./progressSync";

export type ItemStatsStore = Record<string, ItemStats>;

const STORAGE_KEY = "japanisch-trainer:item-stats";

export function loadItemStats(): ItemStatsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ItemStatsStore;
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
  const prev = store[id] ?? { id, correct: 0, incorrect: 0, lastSeen: 0 };
  return {
    ...store,
    [id]: {
      id,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      lastSeen: Date.now(),
    },
  };
}

export function recordAnswer(id: string, correct: boolean): void {
  saveItemStats(updateItemRecord(loadItemStats(), id, correct));
}
