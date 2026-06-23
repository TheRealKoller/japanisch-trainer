import { useState, useCallback, useRef } from "react";
import { numberToKanji, numberToHiragana, numberToRomaji, numberToHiraganaAlt, numberToRomajiAlt } from "../utils/numberConverter";
import { speakText, prefetchAudio } from "../utils/voicevox";
import { loadStats, saveStats, recordSession, LEVELS, type QuizStats } from "../utils/quizStats";
import { OptionsMenu } from "./OptionsMenu";
import { Flashcard } from "./Flashcard";

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

function shuffleSample(max: number, count: number): number[] {
  const pool = Array.from({ length: max + 1 }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function generateDeck(level: number): NumberCard[] {
  const { max } = LEVELS[level - 1];
  if (level === 1) {
    return shuffleSample(max, max + 1).map(makeCard);
  }
  return shuffleSample(max, QUIZ_SIZE).map(makeCard);
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
  const [started, setStarted] = useState(false);
  const [wrongCards, setWrongCards] = useState<NumberCard[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<Set<number>>(() => new Set());
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const isSpeakingRef = useRef(false);

  const current = queue[0];
  const currentLevel = stats.currentLevel;

  const handleSpeak = useCallback(() => {
    if (!current || isSpeakingRef.current) return;
    isSpeakingRef.current = true;
    speakText(
      current.hiragana,
      () => { setIsSpeaking(true); },
      () => { isSpeakingRef.current = false; setIsSpeaking(false); },
    );
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
        const updatedStats = recordSession(stats, currentLevel, wrongIds, deckSize);
        setStats(updatedStats);
        saveStats(updatedStats);
        setLeveledUp(updatedStats.currentLevel > currentLevel);
        setDone(true);
      } else {
        const retry = [...remaining].sort(() => Math.random() - 0.5);
        if (retry[0]) prefetchAudio(retry[0].hiragana);
        setQueue(retry);
        setWrongCards([]);
      }
    } else {
      if (next[0]) prefetchAudio(next[0].hiragana);
      setQueue(next);
    }
    setFlipped(false);
  }, [queue, wrongCards, current, wrongIds, stats, currentLevel, deckSize]);

  function selectLevel(level: number) {
    const updated = { ...stats, currentLevel: level };
    setStats(updated);
    saveStats(updated);
  }

  function startQuiz(level: number) {
    const deck = generateDeck(level);
    if (deck[0]) prefetchAudio(deck[0].hiragana);
    setQueue(deck);
    setDeckSize(level === 1 ? LEVELS[0].max + 1 : QUIZ_SIZE);
    setStarted(true);
  }

  function restart() {
    setWrongCards([]);
    setCorrectCount(0);
    setWrongIds(new Set());
    setDone(false);
    setFlipped(false);
    setLeveledUp(false);
    setStarted(false);
  }

  if (!started) {
    const levelConfig = LEVELS[currentLevel - 1];
    return (
      <div className="flex flex-col w-full max-w-md mx-auto flex-1">
        <div className="flex items-center justify-between w-full py-1">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
          >
            ← Zurück
          </button>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Zahlen-Quiz</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-gray-500 dark:text-slate-400 text-sm">Wähle eine Stufe</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">0 – {levelConfig.max.toLocaleString("de-DE")}</p>
          </div>

          <div className="flex gap-2 justify-center w-full">
            {LEVELS.map(l => (
              <button
                key={l.level}
                onClick={() => selectLevel(l.level)}
                className={`flex flex-col items-center px-2.5 py-3 rounded-xl border-2 transition-colors flex-1
                  ${currentLevel === l.level
                    ? "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:border-orange-400/60 dark:text-orange-300"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                  }`}
              >
                <span className="font-bold text-base">{l.level}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight mt-0.5">
                  0–{l.max >= 1000 ? `${l.max / 1000}k` : l.max}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => startQuiz(currentLevel)}
            className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity"
          >
            Quiz starten
          </button>
        </div>
      </div>
    );
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
      <div className="flex flex-col items-center gap-4 py-8 w-full max-w-md">
        <div className="text-6xl">🎉</div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300">
            Stufe {currentLevel} · 0–{levelConfig.max.toLocaleString("de-DE")}
          </span>
          {leveledUp && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              🎊 Aufgestiegen auf Stufe {currentLevel + 1}!
            </p>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Geschafft!</h2>

        <div className="flex gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{firstTryCorrect}</p>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">richtig</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-500 dark:text-red-400">{wrongIds.size}</p>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">falsch</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-600 dark:text-slate-300">{pct}% beim ersten Versuch</p>

        <div className="w-full">
          <p className="text-xs text-gray-400 dark:text-slate-500 text-center mb-2">Stufe wählen</p>
          <div className="flex gap-2 justify-center">
            {LEVELS.map(l => (
              <button
                key={l.level}
                onClick={() => selectLevel(l.level)}
                className={`flex flex-col items-center px-2.5 py-2 rounded-xl border-2 transition-colors
                  ${stats.currentLevel === l.level
                    ? "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:border-orange-400/60 dark:text-orange-300"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                  }`}
              >
                <span className="font-bold text-sm">{l.level}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">
                  0–{l.max >= 1000 ? `${l.max / 1000}k` : l.max}
                </span>
              </button>
            ))}
          </div>
        </div>

        {levelEntries.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-400 dark:text-slate-500 text-center mb-2">Gesamtstatistik</p>
            <div className="flex flex-col gap-2 w-full">
              {levelEntries.map(({ l, rec }) => {
                const acc = Math.round((rec.firstTryCorrect / rec.totalCards) * 100);
                const reached = acc >= l.threshold * 100;
                return (
                  <div key={l.level} className="flex justify-between text-sm text-gray-600 dark:text-slate-400 px-1">
                    <span>Stufe {l.level}</span>
                    <span className="text-gray-400 dark:text-slate-500">{rec.sessions} Sitzung{rec.sessions !== 1 ? "en" : ""}</span>
                    <span className={reached ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-500 dark:text-slate-500"}>
                      {acc}% {reached ? "✓" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {digitEntries.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-400 dark:text-slate-500 text-center mb-2">Problematische Ziffern</p>
            <div className="flex gap-2 justify-center">
              {digitEntries.map(({ digit, count }) => (
                <div key={digit} className="flex flex-col items-center px-4 py-2 rounded-xl bg-red-100 dark:bg-red-500/15">
                  <span className="text-2xl font-bold text-red-700 dark:text-red-400">{digit}</span>
                  <span className="text-xs text-red-500 dark:text-red-500">{count}×</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.recentWrongNumbers.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-400 dark:text-slate-500 text-center mb-1">Letzte Fehler</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 text-center leading-relaxed">
              {stats.recentWrongNumbers.slice(0, 10).map(n => n.toLocaleString("de-DE")).join(" · ")}
            </p>
          </div>
        )}

        <div className="flex gap-4 mt-2 w-full max-w-xs sm:w-auto">
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
            Zurück
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
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Zahlen-Quiz</h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300">
            Stufe {currentLevel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isSpeaking ? (
            <WaveAnimation />
          ) : (
            <button
              onClick={handleSpeak}
              className="p-2.5 rounded-xl transition-colors
                text-gray-400 hover:text-indigo-600 hover:bg-indigo-50
                dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10"
              title="Aussprache anhören"
            >
              🔊
            </button>
          )}
          <OptionsMenu autoPlay={autoPlay} onAutoPlayChange={setAutoPlay} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <Flashcard
          front={
            <>
              <p className="text-6xl font-bold text-gray-800 dark:text-slate-100">{current.value.toLocaleString("de-DE")}</p>
              <p className="text-2xl text-indigo-600 dark:text-indigo-400">{current.kanji}</p>
              <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">Tippen zum Umdrehen</p>
            </>
          }
          back={
            <div className="text-center px-4">
              <p className="text-xl text-indigo-600 dark:text-indigo-300 font-medium">{current.hiragana}</p>
              {current.hiraganaAlt && (
                <p className="text-base text-indigo-400 dark:text-indigo-500">({current.hiraganaAlt})</p>
              )}
              <p className="text-gray-500 dark:text-slate-400 mt-1">{current.romaji}</p>
              {current.romajiAlt && (
                <p className="text-gray-400 dark:text-slate-500 text-sm">({current.romajiAlt})</p>
              )}
            </div>
          }
          flipped={flipped}
          onFlip={() => setFlipped(true)}
          onSpeak={handleSpeak}
          isSpeaking={isSpeaking}
          autoSpeak={autoPlay}
        />

        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(correctCount / deckSize) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500">{correctCount} / {deckSize} gelernt</p>
      </div>

      <div className="pb-4">
        <div className={`flex gap-4 w-full transition-opacity duration-200 ${flipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button
            onClick={() => advance(false)}
            className="flex-1 py-4 rounded-xl font-medium transition-colors
              bg-red-100 text-red-700 hover:bg-red-200
              dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25"
          >
            Nochmal
          </button>
          <button
            onClick={() => advance(true)}
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
