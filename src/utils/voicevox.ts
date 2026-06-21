const BASE_URL = "/voicevox";
const SPEAKER_STORAGE_KEY = "voicevox_speaker_id";

export function getSpeakerId(): number {
  const stored = localStorage.getItem(SPEAKER_STORAGE_KEY);
  const parsed = stored !== null ? Number(stored) : NaN;
  return Number.isFinite(parsed) ? parsed : 1;
}

export function setSpeakerId(id: number): void {
  localStorage.setItem(SPEAKER_STORAGE_KEY, String(id));
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

  try {
    const queryRes = await fetch(
      `${BASE_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
      { method: "POST" },
    );
    if (!queryRes.ok) { onEnd(); onError?.(); return; }
    const query = await queryRes.json();
    query.volumeScale = 3.0;

    const synthRes = await fetch(`${BASE_URL}/synthesis?speaker=${speakerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    if (!synthRes.ok) { onEnd(); onError?.(); return; }

    const blob = await synthRes.blob();
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
