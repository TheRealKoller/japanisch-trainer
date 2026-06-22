import { useEffect, type ReactNode } from "react";
import type { VocabItem } from "../data/types";

interface Props {
  item?: VocabItem;
  front?: ReactNode;
  back?: ReactNode;
  flipped: boolean;
  onFlip: () => void;
  onSpeak: () => void;
  isSpeaking?: boolean;
  autoSpeak?: boolean;
}

export function Flashcard({ item, front, back, flipped, onFlip, onSpeak, isSpeaking = false, autoSpeak = true }: Props) {
  useEffect(() => {
    if (flipped && autoSpeak) onSpeak();
  }, [flipped, autoSpeak, onSpeak]);

  function handleClick() {
    if (!flipped) onFlip();
    else if (!isSpeaking) onSpeak();
  }

  return (
    <div
      onClick={handleClick}
      className={`
        w-72 h-72 sm:w-80 sm:h-80 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 select-none
        transition-colors duration-200
        ${flipped
          ? `bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700 ${isSpeaking ? "cursor-default" : "cursor-pointer"}`
          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:hover:bg-indigo-500/15"
        }
      `}
    >
      {!flipped && (front ?? (
        <>
          <span className="text-7xl sm:text-8xl">{item?.japanese}</span>
          {item?.reading && (
            <p className="text-lg text-indigo-500 dark:text-indigo-400">{item.reading}</p>
          )}
          <p className="text-gray-400 dark:text-slate-500 text-sm">Tippen zum Umdrehen</p>
        </>
      ))}

      {flipped && (back ?? (
        <div className="text-center px-4">
          {item?.reading && (
            <p className="text-lg text-indigo-500 dark:text-indigo-400">{item.reading}</p>
          )}
          <p className="text-xl text-indigo-600 dark:text-indigo-300 font-medium">{item?.romaji}</p>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{item?.meaning}</p>
        </div>
      ))}
    </div>
  );
}
