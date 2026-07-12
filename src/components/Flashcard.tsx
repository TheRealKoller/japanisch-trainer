import { useEffect, type ReactNode } from "react";
import type { VocabItem } from "../data/types";

export type FlashcardVariant = "default" | "vocab";

// Nur bei variant="vocab" relevant: "forward" zeigt vorne Romaji/Kana/Kanji (wie bisher),
// "reversed" vertauscht Vorder- und Rückseite (vorne nur Bedeutung).
export type CardOrientation = "forward" | "reversed";

interface Props {
  item?: VocabItem;
  front?: ReactNode;
  back?: ReactNode;
  variant?: FlashcardVariant;
  orientation?: CardOrientation;
  flipped: boolean;
  onFlip: () => void;
  onSpeak: () => void;
  isSpeaking?: boolean;
  autoSpeak?: boolean;
}

// Schriftgröße nach Textlänge, damit auch Wörter und Floskeln auf die Karte passen.
function japaneseSizeClass(text: string): string {
  if (text.length <= 2) return "text-7xl sm:text-8xl";
  if (text.length <= 4) return "text-5xl sm:text-6xl";
  if (text.length <= 8) return "text-3xl sm:text-4xl";
  return "text-xl sm:text-2xl";
}

// Schriftgröße nach Romaji-Länge — Romaji-Strings sind deutlich länger als Kana/Kanji.
function romajiSizeClass(text: string): string {
  if (text.length <= 4) return "text-5xl sm:text-6xl";
  if (text.length <= 8) return "text-4xl sm:text-5xl";
  if (text.length <= 14) return "text-2xl sm:text-3xl";
  if (text.length <= 22) return "text-xl sm:text-2xl";
  return "text-lg sm:text-xl";
}

// Schriftgröße nach Bedeutungs-Länge — deutsche Bedeutungen reichen von kurzen
// Wörtern bis zu ganzen Sätzen (Reise-/Alltags-Floskeln), daher eigene Staffelung.
function meaningSizeClass(text: string): string {
  if (text.length <= 6) return "text-5xl sm:text-6xl";
  if (text.length <= 12) return "text-4xl sm:text-5xl";
  if (text.length <= 20) return "text-2xl sm:text-3xl";
  if (text.length <= 30) return "text-xl sm:text-2xl";
  return "text-lg sm:text-xl";
}

// Gemeinsamer Romaji/Kana/Kanji-Block — bei orientation="forward" auf der Vorderseite,
// bei orientation="reversed" gespiegelt auf der Rückseite (identischer Inhalt/Reihenfolge).
function RomajiKanaKanji({ item }: { item?: VocabItem }) {
  const kanaLine = item?.reading ?? item?.japanese;
  return (
    <>
      <span className={`${romajiSizeClass(item?.romaji ?? "")} text-center px-4 text-gray-800 dark:text-slate-100`}>
        {item?.romaji}
      </span>
      {kanaLine && (
        <p className="text-lg text-indigo-500 dark:text-indigo-400 text-center px-4">{kanaLine}</p>
      )}
      {item?.reading && (
        <p className="text-2xl text-indigo-600 dark:text-indigo-400 text-center px-4">{item.japanese}</p>
      )}
    </>
  );
}

export function Flashcard({ item, front, back, variant = "default", orientation = "forward", flipped, onFlip, onSpeak, isSpeaking = false, autoSpeak = true }: Props) {
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
          {variant === "vocab" ? (
            orientation === "reversed" ? (
              <span className={`${meaningSizeClass(item?.meaning ?? "")} text-center px-4 text-gray-800 dark:text-slate-100`}>
                {item?.meaning}
              </span>
            ) : (
              <RomajiKanaKanji item={item} />
            )
          ) : (
            <>
              <span className={`${japaneseSizeClass(item?.japanese ?? "")} text-center px-4 text-gray-800 dark:text-slate-100`}>
                {item?.japanese}
              </span>
              {item?.reading && (
                <p className="text-lg text-indigo-500 dark:text-indigo-400">{item.reading}</p>
              )}
            </>
          )}
          <p className="text-gray-400 dark:text-slate-500 text-sm">Tippen zum Umdrehen</p>
        </>
      ))}

      {flipped && (back ?? (variant === "vocab" ? (
        orientation === "reversed" ? (
          <RomajiKanaKanji item={item} />
        ) : (
          <div className="text-center px-4">
            <p className="text-2xl font-medium text-gray-700 dark:text-slate-200">{item?.meaning}</p>
          </div>
        )
      ) : (
        <div className="text-center px-4">
          {item?.reading && (
            <p className="text-lg text-indigo-500 dark:text-indigo-400">{item.reading}</p>
          )}
          <p className="text-xl text-indigo-600 dark:text-indigo-300 font-medium">{item?.romaji}</p>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{item?.meaning}</p>
        </div>
      )))}
    </div>
  );
}
