import { useState, useCallback, useRef, useEffect } from "react";
import type { VocabItem } from "../data/types";
import { Flashcard } from "./Flashcard";
import type { FlashcardVariant, CardOrientation } from "./Flashcard";
import { OptionsMenu } from "./OptionsMenu";
import { speakText } from "../utils/voicevox";
import { recordAnswer } from "../utils/itemStats";
import { buildOrientations } from "../utils/cardOrientation";
import { usePrefetchNext } from "../hooks/usePrefetchNext";

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
        <div key={i} className={`w-1 ${bar.h} bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce`} style={{ animationDelay: bar.delay }} />
      ))}
    </div>
  );
}

export interface TrainingLevelConfig {
  onLevelComplete: () => void;
}

interface Props {
  items: VocabItem[];
  title: string;
  onBack: () => void;
  levelConfig?: TrainingLevelConfig;
  cardVariant?: FlashcardVariant;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TrainingSession({ items, title, onBack, levelConfig, cardVariant }: Props) {
  const [queue, setQueue] = useState<VocabItem[]>(() => shuffle(items));
  const [orientations, setOrientations] = useState<Partial<Record<string, CardOrientation>>>(
    () => (cardVariant === "vocab" ? buildOrientations(items) : {}),
  );
  const [wrongItems, setWrongItems] = useState<VocabItem[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItemIds, setWrongItemIds] = useState<Set<string>>(() => new Set());
  const [done, setDone] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakError, setSpeakError] = useState(false);
  const isSpeakingRef = useRef(false);

  const onLevelComplete = levelConfig?.onLevelComplete;
  useEffect(() => {
    if (done && onLevelComplete) {
      onLevelComplete();
    }
  }, [done, onLevelComplete]);

  usePrefetchNext(queue[0]?.japanese);

  const current = queue[0];

  const handleSpeak = useCallback(() => {
    if (!current || isSpeakingRef.current) return;
    speakText(
      current.japanese,
      () => { isSpeakingRef.current = true; setIsSpeaking(true); setSpeakError(false); },
      () => { isSpeakingRef.current = false; setIsSpeaking(false); },
      () => setSpeakError(true),
    );
  }, [current]);

  const handleCorrect = useCallback(() => {
    if (!current) return;
    recordAnswer(current.id, true);
    setFlipped(false);
    setSpeakError(false);
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
  }, [queue, wrongItems, current]);

  const handleWrong = useCallback(() => {
    if (!current) return;
    recordAnswer(current.id, false);
    setFlipped(false);
    setSpeakError(false);
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
    setOrientations(cardVariant === "vocab" ? buildOrientations(items) : {});
    setWrongItems([]);
    setCorrectCount(0);
    setWrongItemIds(new Set());
    setDone(false);
    setFlipped(false);
  }

  if (done) {
    const firstTryCorrect = items.length - wrongItemIds.size;
    const pct = Math.round((firstTryCorrect / items.length) * 100);
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Geschafft!</h2>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{firstTryCorrect}</p>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">richtig</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-500 dark:text-red-400">{wrongItemIds.size}</p>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">falsch</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-600 dark:text-slate-300">{pct}% beim ersten Versuch</p>
        <div className="flex gap-4 mt-4 w-full max-w-xs sm:w-auto">
          <button
            onClick={restart}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity"
          >
            Nochmal
          </button>
          <button
            onClick={onBack}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium transition-colors
              bg-gray-100 text-gray-700 hover:bg-gray-200
              dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Zurück zur Auswahl
          </button>
        </div>
      </div>
    );
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
        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">{title}</h2>
        <div className="flex items-center gap-1">
          {isSpeaking ? (
            <WaveAnimation />
          ) : (
            <>
              {speakError && (
                <span className="text-red-500 text-xs">Fehler</span>
              )}
              <button
                onClick={handleSpeak}
                className="p-2.5 rounded-xl transition-colors
                  text-gray-400 hover:text-indigo-600 hover:bg-indigo-50
                  dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10"
                title="Aussprache anhören"
              >
                🔊
              </button>
            </>
          )}
          <OptionsMenu autoPlay={autoSpeak} onAutoPlayChange={setAutoSpeak} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <Flashcard
          item={current}
          variant={cardVariant}
          orientation={current ? orientations[current.id] : undefined}
          flipped={flipped}
          onFlip={() => setFlipped(true)}
          onSpeak={handleSpeak}
          isSpeaking={isSpeaking}
          autoSpeak={autoSpeak}
        />
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(correctCount / items.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500">{correctCount} / {items.length} gelernt</p>
      </div>

      <div className="pb-4">
        <div className={`flex gap-4 w-full transition-opacity duration-200 ${flipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button
            onClick={handleWrong}
            className="flex-1 py-4 rounded-xl font-medium transition-colors
              bg-red-100 text-red-700 hover:bg-red-200
              dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25"
          >
            Nochmal
          </button>
          <button
            onClick={handleCorrect}
            className="flex-1 py-4 rounded-xl font-medium transition-colors
              bg-green-100 text-green-700 hover:bg-green-200
              dark:bg-green-500/15 dark:text-green-400 dark:hover:bg-green-500/25"
          >
            Gewusst
          </button>
        </div>
      </div>
    </div>
  );
}
