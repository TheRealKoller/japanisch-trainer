// Muss mit ALLOWED_KEYS in api/src/routes/progress.ts synchron gehalten werden.
const API_KEYS = ["item-stats", "quiz-stats", "kana-level-hiragana", "kana-level-katakana"] as const;

export type ProgressKey = (typeof API_KEYS)[number];

const LS_PREFIX = "japanisch-trainer:";

// Modul-Flag statt React-State, damit die save*-Utils ohne Hook-Kontext syncen können.
// Der AuthProvider setzt es bei Login/Logout.
let syncEnabled = false;

export function setSyncEnabled(enabled: boolean): void {
  syncEnabled = enabled;
}

function putProgress(key: string, value: unknown): Promise<Response> {
  return fetch(`/api/progress/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ value }),
  });
}

// Pro Key höchstens ein PUT gleichzeitig, Zwischenstände werden verworfen —
// parallele PUTs könnten sonst in falscher Reihenfolge ankommen und am Server
// einen neueren Stand mit einem älteren überschreiben.
const pendingValues = new Map<string, unknown>();
const inFlightKeys = new Set<string>();

function flushKey(key: string): void {
  if (inFlightKeys.has(key) || !pendingValues.has(key)) return;
  const value = pendingValues.get(key);
  pendingValues.delete(key);
  inFlightKeys.add(key);
  putProgress(key, value)
    .catch((err) => console.warn("[sync] PUT fehlgeschlagen:", err))
    .finally(() => {
      inFlightKeys.delete(key);
      flushKey(key);
    });
}

export function pushProgress(key: ProgressKey, value: unknown): void {
  if (!syncEnabled) return;
  pendingValues.set(key, value);
  flushKey(key);
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

function collectLocalProgress(): Partial<Record<ProgressKey, unknown>> {
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
    Object.entries(local).map(async ([key, value]) => {
      const res = await putProgress(key, value);
      if (!res.ok) throw new Error(`PUT ${key} fehlgeschlagen: ${res.status}`);
    }),
  );
}
