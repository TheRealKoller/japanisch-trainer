import { useState, useCallback } from "react";
import type { VocabItem } from "../data/types";
import { Flashcard } from "./Flashcard";

interface Props {
  items: VocabItem[];
  title: string;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let currentAudio: HTMLAudioElement | null = null;
let pendingOnEnd: (() => void) | null = null;

function speakItem(item: VocabItem, onStart: () => void, onEnd: () => void) {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio = null;
    pendingOnEnd?.();
    pendingOnEnd = null;
  }
  const audio = new Audio(`/audio/${item.id}.wav`);
  currentAudio = audio;
  pendingOnEnd = onEnd;
  audio.onplaying = onStart;
  audio.onended = () => { currentAudio = null; pendingOnEnd = null; onEnd(); };
  audio.onerror = () => { currentAudio = null; pendingOnEnd = null; onEnd(); };
  audio.play().catch(() => { currentAudio = null; pendingOnEnd = null; onEnd(); });
}

const WAVE_BARS = [
  { delay: "0ms",   h: "h-2" },
  { delay: "120ms", h: "h-4" },
  { delay: "240ms", h: "h-5" },
  { delay: "120ms", h: "h-3" },
];

function WaveAnimation() {
  return (
    <div className="flex items-center gap-0.5 h-5">
      {WAVE_BARS.map((bar, i) => (
        <div
          key={i}
          className={`w-1 ${bar.h} bg-indigo-500 rounded-full animate-bounce`}
          style={{ animationDelay: bar.delay }}
        />
      ))}
    </div>
  );
}

export function TrainingSession({ items, title, onBack }: Props) {
  const [queue, setQueue] = useState<VocabItem[]>(() => shuffle(items));
  const [wrongItems, setWrongItems] = useState<VocabItem[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItemIds, setWrongItemIds] = useState<Set<string>>(() => new Set());
  const [done, setDone] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = queue[0];

  const handleSpeak = useCallback(() => {
    speakItem(current, () => setIsSpeaking(true), () => setIsSpeaking(false));
  }, [current]);

  const handleCorrect = useCallback(() => {
    setCorrectCount((c) => c + 1);
    const next = queue.slice(1);
    if (next.length === 0 && wrongItems.length === 0) {
      setDone(true);
    } else if (next.length === 0 && wrongItems.length > 0) {
      setQueue(shuffle(wrongItems));
      setWrongItems([]);
    } else {
      setQueue(next);
    }
  }, [queue, wrongItems]);

  const handleWrong = useCallback(() => {
    setWrongItemIds((ids) => new Set([...ids, current.id]));
    setWrongItems((w) => [...w, current]);
    const next = queue.slice(1);
    if (next.length === 0) {
      setQueue(shuffle([...wrongItems, current]));
      setWrongItems([]);
    } else {
      setQueue(next);
    }
  }, [queue, wrongItems, current]);

  function restart() {
    setQueue(shuffle(items));
    setWrongItems([]);
    setCorrectCount(0);
    setWrongItemIds(new Set());
    setDone(false);
  }

  if (done) {
    const firstTryCorrect = items.length - wrongItemIds.size;
    const pct = Math.round((firstTryCorrect / items.length) * 100);
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Geschafft!</h2>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-green-600">{firstTryCorrect}</p>
            <p className="text-sm text-gray-400 mt-1">richtig</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-500">{wrongItemIds.size}</p>
            <p className="text-sm text-gray-400 mt-1">falsch</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-600">{pct}% beim ersten Versuch</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Nochmal
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Zurück zur Auswahl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-between w-full max-w-md">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <WaveAnimation />
          ) : (
            <button
              onClick={handleSpeak}
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Aussprache anhören"
            >
              🔊
            </button>
          )}
          <button
            onClick={() => setAutoSpeak((v) => !v)}
            title={autoSpeak ? "Automatische Sprachausgabe deaktivieren" : "Automatische Sprachausgabe aktivieren"}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${autoSpeak ? "bg-indigo-500" : "bg-gray-300"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${autoSpeak ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      <Flashcard
        key={current.id}
        item={current}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
        onSpeak={handleSpeak}
        autoSpeak={autoSpeak}
      />

      <div className="w-full max-w-md bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(correctCount / items.length) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">{correctCount} / {items.length} gelernt</p>
    </div>
  );
}
