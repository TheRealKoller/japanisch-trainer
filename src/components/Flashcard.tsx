import { useEffect } from "react";
import type { VocabItem } from "../data/types";

interface Props {
  item: VocabItem;
  flipped: boolean;
  onFlip: () => void;
  onSpeak: () => void;
  autoSpeak?: boolean;
}

export function Flashcard({ item, flipped, onFlip, onSpeak, autoSpeak = true }: Props) {
  useEffect(() => {
    if (flipped && autoSpeak) onSpeak();
  }, [flipped, autoSpeak, onSpeak]);

  return (
    <div
      onClick={!flipped ? onFlip : undefined}
      className={`
        w-72 h-72 sm:w-80 sm:h-80 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 select-none
        transition-colors duration-200
        ${flipped
          ? "bg-white border-gray-200 cursor-default dark:bg-slate-800 dark:border-slate-700"
          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:hover:bg-indigo-500/15"
        }
      `}
    >
      <span className="text-7xl sm:text-8xl">{item.japanese}</span>

      {!flipped && item.reading && (
        <p className="text-lg text-indigo-500 dark:text-indigo-400">{item.reading}</p>
      )}

      {!flipped && (
        <p className="text-gray-400 dark:text-slate-500 text-sm">Tippen zum Umdrehen</p>
      )}

      {flipped && (
        <div className="text-center px-4">
          {item.reading && (
            <p className="text-lg text-indigo-500 dark:text-indigo-400">{item.reading}</p>
          )}
          <p className="text-xl text-indigo-600 dark:text-indigo-300 font-medium">{item.romaji}</p>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{item.meaning}</p>
        </div>
      )}
    </div>
  );
}
