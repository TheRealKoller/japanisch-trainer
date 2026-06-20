const BASE_URL = "http://localhost:50021";
const SPEAKER_ID = 1;

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;

export async function speakText(
  text: string,
  onStart: () => void,
  onEnd: () => void,
): Promise<void> {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentAudio = null;
    currentObjectUrl = null;
  }

  try {
    const queryRes = await fetch(
      `${BASE_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${SPEAKER_ID}`,
      { method: "POST" },
    );
    if (!queryRes.ok) { onEnd(); return; }
    const query = await queryRes.json();

    const synthRes = await fetch(`${BASE_URL}/synthesis?speaker=${SPEAKER_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    if (!synthRes.ok) { onEnd(); return; }

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
    };
    await audio.play();
  } catch {
    onEnd();
  }
}
