import { useCallback, useState } from "react";
import { particleSentences, PARTICLES, PARTICLE_STAT_ID, GAP_MARKER, type Particle, type ParticleSentence } from "../data/particleSentences";
import { speakText } from "../utils/voicevox";
import { recordAnswer, loadItemStats } from "../utils/itemStats";
import { selectSessionItems, shuffle } from "../utils/sessionSelection";
import { usePrefetchNext } from "../hooks/usePrefetchNext";
import { LessonStatsSection } from "./StatsSections";
import { OptionsMenu } from "./OptionsMenu";

const GAP_DISPLAY = "＿＿＿";

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

interface Props {
  onBack: () => void;
}

function optionClassName(option: Particle, current: ParticleSentence, selected: Particle | null): string {
  const base = "flex-1 py-4 rounded-xl font-medium transition-colors border-2";
  if (selected === null) {
    return `${base} border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-400/60 dark:hover:bg-indigo-500/10`;
  }
  const isCorrectOption = option === current.correctParticle;
  if (isCorrectOption) {
    return `${base} border-green-300 bg-green-100 text-green-700 dark:border-green-400/60 dark:bg-green-500/15 dark:text-green-400`;
  }
  if (option === selected) {
    return `${base} border-red-300 bg-red-100 text-red-700 dark:border-red-400/60 dark:bg-red-500/15 dark:text-red-400`;
  }
  return `${base} border-gray-200 text-gray-400 dark:border-slate-700 dark:text-slate-500 opacity-60`;
}

export function ParticleQuizSession({ onBack }: Props) {
  const [selectedItems, setSelectedItems] = useState<ParticleSentence[]>(
    () => selectSessionItems(particleSentences, loadItemStats()),
  );
  const [queue, setQueue] = useState<ParticleSentence[]>(() => shuffle(selectedItems));
  const [wrongItems, setWrongItems] = useState<ParticleSentence[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItemIds, setWrongItemIds] = useState<Set<string>>(() => new Set());
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<Particle | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = queue[0];
  const answered = selected !== null;

  usePrefetchNext(current?.reading);

  const handleSpeak = useCallback(() => {
    if (!current || isSpeaking) return;
    speakText(
      current.reading,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
    );
  }, [current, isSpeaking]);

  function handleSelect(option: Particle) {
    if (!current || answered) return;
    const isCorrect = option === current.correctParticle;
    // Zwei getrennte Stats-Einträge: current.id treibt selectSessionItems() (Wiederholung nach
    // Erfolgsquote pro Satz), PARTICLE_STAT_ID die ParticleSection-Anzeige (Erfolgsquote pro
    // Partikel, unabhängig vom konkreten Satz).
    recordAnswer(current.id, isCorrect);
    recordAnswer(PARTICLE_STAT_ID[current.correctParticle], isCorrect);
    setSelected(option);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongItemIds((ids) => new Set([...ids, current.id]));
      setWrongItems((w) => [...w, current]);
    }
    if (autoSpeak) {
      speakText(current.reading, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  }

  function handleNext() {
    setSelected(null);
    setIsSpeaking(false);
    const next = queue.slice(1);
    if (next.length === 0) {
      if (wrongItems.length === 0) {
        setDone(true);
      } else {
        setQueue(shuffle(wrongItems));
        setWrongItems([]);
      }
    } else {
      setQueue(next);
    }
  }

  function restart() {
    const nextSelected = selectSessionItems(particleSentences, loadItemStats());
    setSelectedItems(nextSelected);
    setQueue(shuffle(nextSelected));
    setWrongItems([]);
    setCorrectCount(0);
    setWrongItemIds(new Set());
    setDone(false);
    setSelected(null);
  }

  if (done) {
    const firstTryCorrect = selectedItems.length - wrongItemIds.size;
    const pct = Math.round((firstTryCorrect / selectedItems.length) * 100);
    return (
      <div className="flex flex-col w-full max-w-md mx-auto flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-6 py-4">
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
          <div className="w-full">
            <LessonStatsSection lessonId="particle-quiz" store={loadItemStats()} />
          </div>
        </div>
        <div className="flex gap-4 pt-4 w-full max-w-xs mx-auto sm:w-auto">
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

  const [before, after] = current ? current.sentence.split(GAP_MARKER) : ["", ""];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto flex-1 min-h-0 overflow-y-auto">
      <div className="flex items-center justify-between w-full py-1">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Partikel-Übung</h2>
        <div className="flex items-center gap-1">
          {answered && (
            isSpeaking ? (
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
            )
          )}
          <OptionsMenu autoPlay={autoSpeak} onAutoPlayChange={setAutoSpeak} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-72 sm:w-80 min-h-64 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 select-none p-6 text-center
          bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30">
          <p className="text-2xl sm:text-3xl leading-relaxed text-gray-800 dark:text-slate-100">
            {before}
            <span className="text-indigo-400 dark:text-indigo-500">{GAP_DISPLAY}</span>
            {after}
          </p>
          {answered && (
            <p className="text-gray-500 dark:text-slate-400 text-sm">{current.translation}</p>
          )}
        </div>

        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(correctCount / selectedItems.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500">{correctCount} / {selectedItems.length} gelernt</p>
      </div>

      <div className="pb-4 flex flex-col gap-3">
        <div className="flex gap-2">
          {PARTICLES.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={optionClassName(option, current, selected)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          className={`w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity
            ${answered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
