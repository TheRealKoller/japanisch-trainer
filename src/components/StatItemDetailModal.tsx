import { useCallback, useEffect, useRef, useState } from "react";
import type { VocabItem } from "../data/types";
import { lifetimeSuccessRate, successRate, totalAttempts, formatPercent, type ItemStats } from "../utils/itemStats";
import { speakText, stopAudio } from "../utils/voicevox";
import { Modal } from "./Modal";

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

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{value}</span>
    </div>
  );
}

interface Props {
  item: VocabItem;
  stats: ItemStats | undefined;
  onClose: () => void;
}

export function StatItemDetailModal({ item, stats, onClose }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakError, setSpeakError] = useState(false);
  const isSpeakingRef = useRef(false);

  useEffect(() => stopAudio, []);

  const handleSpeak = useCallback(() => {
    if (isSpeakingRef.current) return;
    speakText(
      item.japanese,
      () => { isSpeakingRef.current = true; setIsSpeaking(true); setSpeakError(false); },
      () => { isSpeakingRef.current = false; setIsSpeaking(false); },
      () => setSpeakError(true),
    );
  }, [item.japanese]);

  const total = totalAttempts(stats);

  return (
    <Modal onClose={onClose} label={`Details zu ${item.japanese}`}>
      <div className="flex flex-col items-center gap-1 pt-2">
        <span className="text-2xl text-indigo-600 dark:text-indigo-400">{item.japanese}</span>
        {item.reading && (
          <span className="text-xl text-indigo-600 dark:text-indigo-300 font-medium">{item.reading}</span>
        )}
        <span className="text-gray-500 dark:text-slate-400">{item.romaji}</span>
        <span className="text-sm text-gray-400 dark:text-slate-500">{item.meaning}</span>
      </div>

      <div className="flex justify-center mt-4">
        {isSpeaking ? (
          <WaveAnimation />
        ) : (
          <>
            <button
              onClick={handleSpeak}
              className="p-2.5 rounded-xl transition-colors
                text-gray-400 hover:text-indigo-600 hover:bg-indigo-50
                dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10"
              title="Aussprache anhören"
            >
              🔊
            </button>
            {speakError && <span className="text-red-500 text-xs self-center">Fehler</span>}
          </>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-slate-700 flex flex-col gap-2">
        {total === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center">Noch nicht geübt</p>
        ) : (
          <>
            <StatRow label="Gesehen" value={String(total)} />
            <StatRow label="Richtig beantwortet" value={String(stats?.correct ?? 0)} />
            <StatRow label="Aktuelle Quote" value={formatPercent(successRate(stats))} />
            <StatRow label="Lifetime-Quote" value={formatPercent(lifetimeSuccessRate(stats))} />
            {stats && stats.lastSeen > 0 && (
              <StatRow
                label="Zuletzt geübt"
                value={new Date(stats.lastSeen).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
