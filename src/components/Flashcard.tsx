import { useState, useEffect } from "react";
import type { VocabItem } from "../data/types";

interface Props {
  item: VocabItem;
  onCorrect: () => void;
  onWrong: () => void;
}

export function Flashcard({ item, onCorrect, onWrong }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!flipped) return;
    const text = item.reading ?? item.japanese;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [flipped, item]);

  function handleFlip() {
    setFlipped(true);
  }

  function handleAnswer(correct: boolean) {
    setFlipped(false);
    if (correct) onCorrect();
    else onWrong();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onClick={!flipped ? handleFlip : undefined}
        className={`
          w-64 h-64 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 cursor-pointer select-none
          transition-colors duration-200
          ${flipped
            ? "bg-white border-gray-200 cursor-default"
            : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"}
        `}
      >
        <span className="text-7xl">{item.japanese}</span>

        {!flipped && item.reading && (
          <p className="text-lg text-indigo-500">{item.reading}</p>
        )}

        {!flipped && (
          <p className="text-gray-400 text-sm">Tippen zum Umdrehen</p>
        )}

        {flipped && (
          <div className="text-center">
            {item.reading && (
              <p className="text-lg text-indigo-500">{item.reading}</p>
            )}
            <p className="text-xl text-indigo-600 font-medium">{item.romaji}</p>
            <p className="text-gray-500 text-sm mt-1">{item.meaning}</p>
          </div>
        )}
      </div>

      {flipped && (
        <div className="flex gap-4">
          <button
            onClick={() => handleAnswer(false)}
            className="px-6 py-3 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
          >
            Nochmal
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="px-6 py-3 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors"
          >
            Gewusst
          </button>
        </div>
      )}
    </div>
  );
}
