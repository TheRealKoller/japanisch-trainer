const BASE_URL = "/voicevox";
const SPEAKER_STORAGE_KEY = "voicevox_speaker_id";

export function getSpeakerId(): number {
  const stored = localStorage.getItem(SPEAKER_STORAGE_KEY);
  const parsed = stored !== null ? Number(stored) : NaN;
  return Number.isFinite(parsed) ? parsed : 1;
}

export function setSpeakerId(id: number): void {
  localStorage.setItem(SPEAKER_STORAGE_KEY, String(id));
  prefetchCache.clear();
}

export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentAudio = null;
    currentObjectUrl = null;
  }
}

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
const prefetchCache = new Map<string, Promise<Blob>>();

function cacheKey(text: string, speakerId: number): string {
  return `${speakerId}:${text}`;
}

function fetchBlob(text: string, speakerId: number): Promise<Blob> {
  return fetch(
    `${BASE_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
    { method: "POST" },
  )
    .then(res => {
      if (!res.ok) throw new Error("audio_query failed");
      return res.json();
    })
    .then(query => {
      query.volumeScale = 3.0;
      return fetch(`${BASE_URL}/synthesis?speaker=${speakerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("synthesis failed");
      return res.blob();
    });
}

export function prefetchAudio(text: string, speakerIdOverride?: number): void {
  const speakerId = speakerIdOverride ?? getSpeakerId();
  const key = cacheKey(text, speakerId);
  if (prefetchCache.has(key)) return;
  const promise = fetchBlob(text, speakerId);
  prefetchCache.set(key, promise);
  promise.catch(() => prefetchCache.delete(key));
}

export async function speakText(
  text: string,
  onStart: () => void,
  onEnd: () => void,
  onError?: () => void,
  speakerIdOverride?: number,
): Promise<void> {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentAudio = null;
    currentObjectUrl = null;
  }

  const speakerId = speakerIdOverride ?? getSpeakerId();
  const key = cacheKey(text, speakerId);

  try {
    let blob: Blob;
    const cached = prefetchCache.get(key);
    prefetchCache.delete(key);

    if (cached) {
      try {
        blob = await cached;
      } catch {
        blob = await fetchBlob(text, speakerId);
      }
    } else {
      blob = await fetchBlob(text, speakerId);
    }

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    currentObjectUrl = url;

    audio.onplaying = onStart;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      currentObjectUrl = null;
      onEnd();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      currentObjectUrl = null;
      onEnd();
      onError?.();
    };
    await audio.play();
  } catch {
    onEnd();
    onError?.();
  }
}
