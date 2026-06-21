import { useState, useCallback } from "react";
import { numberToKanji, numberToHiragana, numberToRomaji, numberToHiraganaAlt, numberToRomajiAlt } from "../utils/numberConverter";
import { speakText } from "../utils/voicevox";
import { loadStats, saveStats, recordSession, LEVELS, type QuizStats } from "../utils/quizStats";

const QUIZ_SIZE = 10;

interface NumberCard {
  value: number;
  kanji: string;
  hiragana: string;
  hiraganaAlt: string | null;
  romaji: string;
  romajiAlt: string | null;
}

function makeCard(value: number): NumberCard {
  return {
    value,
    kanji: numberToKanji(value),
    hiragana: numberToHiragana(value),
    hiraganaAlt: numberToHiraganaAlt(value),
    romaji: numberToRomaji(value),
    romajiAlt: numberToRomajiAlt(value),
  };
}

function generateDeck(level: number): NumberCard[] {
  const { max } = LEVELS[level - 1];
  if (level === 1) {
    // Garantierte Abdeckung aller Werte 0–10 per Fisher-Yates Shuffle
    const values = Array.from({ length: max + 1 }, (_, i) => i);
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values.map(makeCard);
  }
  return Array.from({ length: QUIZ_SIZE }, () => makeCard(Math.floor(Math.random() * (max + 1))));
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

interface Props {
  onBack: () => void;
}

export function NumberQuizSession({ onBack }: Props) {
  const [stats, setStats] = useState<QuizStats>(loadStats);
  const [queue, setQueue] = useState<NumberCard[]>(() => generateDeck(loadStats().currentLevel));
  const [deckSize, setDeckSize] = useState(() => {
    const level = loadStats().currentLevel;
    return level === 1 ? LEVELS[0].max + 1 : QUIZ_SIZE;
  });
  const [wrongCards, setWrongCards] = useState<NumberCard[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<Set<number>>(() => new Set());
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);

  const current = queue[0];
  const currentLevel = stats.currentLevel;

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
        // Session complete — isCorrect is true here, so wrongIds is up-to-date
        const updatedStats = recordSession(stats, currentLevel, wrongIds, deckSize);
        setStats(updatedStats);
        saveStats(updatedStats);
        setLeveledUp(updatedStats.currentLevel > currentLevel);
        setDone(true);
      } else {
        setQueue([...remaining].sort(() => Math.random() - 0.5));
        setWrongCards([]);
      }
    } else {
      setQueue(next);
    }
    setFlipped(false);
  }, [queue, wrongCards, current, wrongIds, stats, currentLevel]);

  function selectLevel(level: number) {
    const updated = { ...stats, currentLevel: level };
    setStats(updated);
    saveStats(updated);
  }

  function restart() {
    const level = stats.currentLevel;
    setQueue(generateDeck(level));
    setDeckSize(level === 1 ? LEVELS[0].max + 1 : QUIZ_SIZE);
    setWrongCards([]);
    setCorrectCount(0);
    setWrongIds(new Set());
    setDone(false);
    setFlipped(false);
    setLeveledUp(false);
  }

  if (done) {
    const firstTryCorrect = deckSize - wrongIds.size;
    const pct = Math.round((firstTryCorrect / deckSize) * 100);
    const levelConfig = LEVELS[currentLevel - 1];

    const levelEntries = LEVELS
      .map(l => ({ l, rec: stats.levelRecords[l.level] }))
      .filter((e): e is { l: typeof LEVELS[0]; rec: NonNullable<typeof e.rec> } => e.rec != null);

    const digitEntries = (Object.entries(stats.digitErrors) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([digit, count]) => ({ digit: Number(digit), count }));

    return (
      <div className="flex flex-col items-center gap-5 py-8 w-full max-w-md">
        <div className="text-6xl">🎉</div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
            Stufe {currentLevel} · 0–{levelConfig.max.toLocaleString("de-DE")}
          </span>
          {leveledUp && (
            <p className="text-sm font-medium text-green-600">
              🎊 Aufgestiegen auf Stufe {currentLevel + 1}!
            </p>
          )}
        </div>

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

        {/* Level selector */}
        <div className="w-full">
          <p className="text-xs text-gray-400 text-center mb-2">Stufe wählen</p>
          <div className="flex gap-2 justify-center">
            {LEVELS.map(l => (
              <button
                key={l.level}
                onClick={() => selectLevel(l.level)}
                className={`flex flex-col items-center px-2.5 py-2 rounded-xl border-2 transition-colors
                  ${stats.currentLevel === l.level
                    ? "border-orange-400 bg-orange-50 text-orange-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
              >
                <span className="font-bold text-sm">{l.level}</span>
                <span className="text-[10px] text-gray-400 leading-tight">
                  0–{l.max >= 1000 ? `${l.max / 1000}k` : l.max}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cumulative stats per level */}
        {levelEntries.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-400 text-center mb-2">Gesamtstatistik</p>
            <div className="flex flex-col gap-1 w-full">
              {levelEntries.map(({ l, rec }) => {
                const acc = Math.round((rec.firstTryCorrect / rec.totalCards) * 100);
                const reached = acc >= l.threshold * 100;
                return (
                  <div key={l.level} className="flex justify-between text-sm text-gray-600 px-1">
                    <span>Stufe {l.level}</span>
                    <span className="text-gray-400">{rec.sessions} Sitzung{rec.sessions !== 1 ? "en" : ""}</span>
                    <span className={reached ? "text-green-600 font-medium" : "text-gray-500"}>
                      {acc}% {reached ? "✓" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Problem digits */}
        {digitEntries.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-400 text-center mb-2">Problematische Ziffern</p>
            <div className="flex gap-2 justify-center">
              {digitEntries.map(({ digit, count }) => (
                <div key={digit} className="flex flex-col items-center px-4 py-2 bg-red-50 rounded-xl">
                  <span className="text-2xl font-bold text-red-600">{digit}</span>
                  <span className="text-xs text-red-400">{count}×</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent wrong numbers */}
        {stats.recentWrongNumbers.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-400 text-center mb-1">Letzte Fehler</p>
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              {stats.recentWrongNumbers.slice(0, 10).map(n => n.toLocaleString("de-DE")).join(" · ")}
            </p>
          </div>
        )}

        <div className="flex gap-4 mt-2">
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
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-700">Zahlen-Quiz</h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
            Stufe {currentLevel}
          </span>
        </div>
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
          style={{ width: `${(correctCount / deckSize) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">{correctCount} / {deckSize} gelernt</p>
    </div>
  );
}
