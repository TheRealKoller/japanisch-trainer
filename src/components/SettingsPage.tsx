import { useState, useEffect } from "react";
import { getSpeakerId, setSpeakerId } from "../utils/voicevox";

interface SpeakerStyle {
  id: number;
  name: string;
}

interface Speaker {
  name: string;
  styles: SpeakerStyle[];
}

interface Props {
  onBack: () => void;
}

export function SettingsPage({ onBack }: Props) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState(getSpeakerId);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/voicevox/speakers", { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: Speaker[]) => setSpeakers(data))
      .catch((e: unknown) => { if ((e as { name?: string })?.name !== "AbortError") setError(true); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  function selectStyle(id: number) {
    setSpeakerId(id);
    setSelectedId(id);
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto flex-1">
      <div className="flex items-center justify-between w-full py-1">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Stimme</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {loading && (
          <p className="text-center text-gray-400 dark:text-slate-500 text-sm mt-8">
            Lädt Stimmen…
          </p>
        )}

        {error && (
          <p className="text-center text-gray-400 dark:text-slate-500 text-sm mt-8">
            VoiceVox ist nicht erreichbar.
          </p>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-5">
            {speakers.map(speaker => (
              <div key={speaker.name}>
                <p className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide px-1 mb-2">
                  {speaker.name}
                </p>
                <div className="flex flex-col gap-1">
                  {speaker.styles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => selectStyle(style.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors text-left
                        ${selectedId === style.id
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:border-indigo-400/60 dark:text-indigo-300"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                        }`}
                    >
                      <span className="font-medium text-sm">{style.name}</span>
                      {selectedId === style.id && (
                        <span className="text-indigo-500 dark:text-indigo-400 text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
