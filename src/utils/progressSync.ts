const API_KEYS = ["item-stats", "quiz-stats", "kana-level-hiragana", "kana-level-katakana"] as const;

export type ProgressKey = (typeof API_KEYS)[number];

const LS_PREFIX = "japanisch-trainer:";

// Modul-Flag statt React-State, damit die save*-Utils ohne Hook-Kontext syncen können.
// Der AuthProvider setzt es bei Login/Logout.
let syncEnabled = false;

export function setSyncEnabled(enabled: boolean): void {
  syncEnabled = enabled;
}

export function pushProgress(key: ProgressKey, value: unknown): void {
  if (!syncEnabled) return;
  void fetch(`/api/progress/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ value }),
  }).catch((err) => console.warn("[sync] PUT fehlgeschlagen:", err));
}

export async function fetchServerProgress(): Promise<Record<string, unknown>> {
  const res = await fetch("/api/progress", { credentials: "include" });
  if (!res.ok) return {};
  return (await res.json()) as Record<string, unknown>;
}

// Server-Stand ist führend: alle Sync-Keys überschreiben, fehlende entfernen.
export function mirrorServerProgress(data: Record<string, unknown>): void {
  for (const key of API_KEYS) {
    if (key in data) {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify(data[key]));
    } else {
      localStorage.removeItem(LS_PREFIX + key);
    }
  }
}

export function collectLocalProgress(): Partial<Record<ProgressKey, unknown>> {
  const out: Partial<Record<ProgressKey, unknown>> = {};
  for (const key of API_KEYS) {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (raw === null) continue;
    try {
      out[key] = JSON.parse(raw);
    } catch {
      // korrupten Eintrag nicht hochladen
    }
  }
  return out;
}

export async function seedServerProgress(): Promise<void> {
  const local = collectLocalProgress();
  await Promise.all(
    Object.entries(local).map(([key, value]) =>
      fetch(`/api/progress/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value }),
      }),
    ),
  );
}
