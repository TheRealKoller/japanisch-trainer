import { useState, useCallback } from "react";
import { numberToKanji, numberToHiragana, numberToRomaji, numberToHiraganaAlt, numberToRomajiAlt } from "../utils/numberConverter";
import { speakText } from "../utils/voicevox";

const QUIZ_SIZE = 10;

interface NumberCard {
  value: number;
  kanji: string;
  hiragana: string;
  hiraganaAlt: string | null;
  romaji: string;
  romajiAlt: string | null;
}

function generateCard(): NumberCard {
  const value = Math.floor(Math.random() * 100000);
  return {
    value,
    kanji: numberToKanji(value),
    hiragana: numberToHiragana(value),
    hiraganaAlt: numberToHiraganaAlt(value),
    romaji: numberToRomaji(value),
    romajiAlt: numberToRomajiAlt(value),
  };
}

function generateDeck(): NumberCard[] {
  return Array.from({ length: QUIZ_SIZE }, generateCard);
}

interface Props {
  onBack: () => void;
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
        <div key={i} className={`w-1 ${bar.h} bg-indigo-500 rounded-full animate-bounce`} style={{ animationDelay: bar.delay }} />
      ))}
    </div>
  );
}

export function NumberQuizSession({ onBack }: Props) {
  const [queue, setQueue] = useState<NumberCard[]>(() => generateDeck());
  const [wrongCards, setWrongCards] = useState<NumberCard[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<Set<number>>(() => new Set());
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = queue[0];

  const handleSpeak = useCallback(() => {
    if (!current) return;
    speakText(current.hiragana, () => setIsSpeaking(true), () => setIsSpeaking(false));
  }, [current]);

  const advance = useCallback((isCorrect: boolean) => {
    if (!isCorrect) {
      setWrongIds(ids => new Set([...ids, current.value]));
      setWrongCards(w => [...w, current]);
    } else {
      setCorrectCount(c => c + 1);
    }

    const next = queue.slice(1);
    if (next.length === 0) {
      const remaining = isCorrect ? wrongCards : [...wrongCards, current];
      if (remaining.length === 0) {
        setDone(true);
      } else {
        setQueue([...remaining].sort(() => Math.random() - 0.5));
        setWrongCards([]);
      }
    } else {
      setQueue(next);
    }
    setFlipped(false);
  }, [queue, wrongCards, current]);

  function restart() {
    setQueue(generateDeck());
    setWrongCards([]);
    setCorrectCount(0);
    setWrongIds(new Set());
    setDone(false);
    setFlipped(false);
  }

  if (done) {
    const firstTryCorrect = QUIZ_SIZE - wrongIds.size;
    const pct = Math.round((firstTryCorrect / QUIZ_SIZE) * 100);
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Geschafft!</h2>
        <div className="flex gap-10 text-center">
          <div>
            <p className="text-4xl font-bold text-green-600">{firstTryCorrect}</p>
            <p className="text-sm text-gray-400 mt-1">richtig</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-500">{wrongIds.size}</p>
            <p className="text-sm text-gray-400 mt-1">falsch</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-600">{pct}% beim ersten Versuch</p>
        <div className="flex gap-4 mt-4">
          <button onClick={restart} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
            Nochmal
          </button>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">
            Zurück zur Auswahl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-between w-full max-w-md">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700">Zahlen-Quiz</h2>
        <div className="w-8" />
      </div>

      {/* Card */}
      <div
        onClick={!flipped ? () => { setFlipped(true); handleSpeak(); } : undefined}
        className={`w-72 min-h-64 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 select-none transition-colors duration-200 p-6
          ${flipped
            ? "bg-white border-gray-200 cursor-default"
            : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer"}`}
      >
        {!flipped ? (
          <>
            <p className="text-6xl font-bold text-gray-800">{current.value.toLocaleString("de-DE")}</p>
            <p className="text-2xl text-indigo-600">{current.kanji}</p>
            <p className="text-gray-400 text-sm mt-2">Tippen zum Umdrehen</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <WaveAnimation />
              ) : (
                <button
                  onClick={e => { e.stopPropagation(); handleSpeak(); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Nochmal anhören"
                >
                  🔊
                </button>
              )}
            </div>
            <p className="text-xl text-indigo-600 font-medium text-center">{current.hiragana}</p>
            {current.hiraganaAlt && (
              <p className="text-base text-indigo-400 text-center">({current.hiraganaAlt})</p>
            )}
            <p className="text-gray-500 text-center">{current.romaji}</p>
            {current.romajiAlt && (
              <p className="text-gray-400 text-sm text-center">({current.romajiAlt})</p>
            )}
          </>
        )}
      </div>

      {flipped && (
        <div className="flex gap-4">
          <button onClick={() => advance(false)} className="px-6 py-3 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors">
            Nochmal
          </button>
          <button onClick={() => advance(true)} className="px-6 py-3 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors">
            Gewusst
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="w-full max-w-md bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(correctCount / QUIZ_SIZE) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">{correctCount} / {QUIZ_SIZE} gelernt</p>
    </div>
  );
}
