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

export function TrainingSession({ items, title, onBack }: Props) {
  const [queue, setQueue] = useState<VocabItem[]>(() => shuffle(items));
  const [wrongItems, setWrongItems] = useState<VocabItem[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const current = queue[0];

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
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Geschafft!</h2>
        <p className="text-gray-500">{correctCount} von {items.length} richtig beantwortet</p>
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
            Zurück
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
        <button
          onClick={() => setAutoSpeak((v) => !v)}
          className="text-xl opacity-60 hover:opacity-100 transition-opacity"
          title={autoSpeak ? "Automatische Sprachausgabe deaktivieren" : "Automatische Sprachausgabe aktivieren"}
        >
          {autoSpeak ? "🔊" : "🔇"}
        </button>
      </div>

      <Flashcard key={current.id} item={current} onCorrect={handleCorrect} onWrong={handleWrong} autoSpeak={autoSpeak} />

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
