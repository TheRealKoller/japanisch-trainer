import { useState } from "react";
import { hiragana } from "../data/hiragana";
import { katakana } from "../data/katakana";
import type { VocabItem } from "../data/types";
import { loadItemStats, type ItemStats, type ItemStatsStore } from "../utils/itemStats";

interface Props {
  onBack: () => void;
}

function tileColor(stats: ItemStats | undefined): string {
  if (!stats || stats.correct + stats.incorrect === 0) {
    return "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500";
  }
  const rate = stats.correct / (stats.correct + stats.incorrect);
  if (rate >= 0.8) return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";
  if (rate >= 0.5) return "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400";
  return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
}

// --- Gojūon grid structure ---

const COL_LABELS = ["−", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
const ROW_LABELS = ["a", "i", "u", "e", "o"];
const DAKUTEN_LABELS = ["G", "Z", "D", "B", "P"];
const YOUON_LABELS = ["ky", "sh", "ch", "ny", "hy", "my", "ry", "gy", "j", "by", "py"];

function gojuonGrid(p: string): (string | null)[][] {
  return [
    [`${p}a`, `${p}ka`, `${p}sa`, `${p}ta`,  `${p}na`, `${p}ha`, `${p}ma`, `${p}ya`, `${p}ra`, `${p}wa`],
    [`${p}i`, `${p}ki`, `${p}si`, `${p}chi`, `${p}ni`, `${p}hi`, `${p}mi`, null,      `${p}ri`, null],
    [`${p}u`, `${p}ku`, `${p}su`, `${p}tsu`, `${p}nu`, `${p}fu`, `${p}mu`, `${p}yu`, `${p}ru`, null],
    [`${p}e`, `${p}ke`, `${p}se`, `${p}te`,  `${p}ne`, `${p}he`, `${p}me`, null,      `${p}re`, null],
    [`${p}o`, `${p}ko`, `${p}so`, `${p}to`,  `${p}no`, `${p}ho`, `${p}mo`, `${p}yo`, `${p}ro`, `${p}wo`],
  ];
}

function dakutenHandakutenRows(p: string): string[][] {
  return [
    [`${p}ga`, `${p}gi`, `${p}gu`, `${p}ge`, `${p}go`],
    [`${p}za`, `${p}ji`, `${p}zu`, `${p}ze`, `${p}zo`],
    [`${p}da`, `${p}di`, `${p}du`, `${p}de`, `${p}do`],
    [`${p}ba`, `${p}bi`, `${p}bu`, `${p}be`, `${p}bo`],
    [`${p}pa`, `${p}pi`, `${p}pu`, `${p}pe`, `${p}po`],
  ];
}

function youonRows(p: string): string[][] {
  return [
    [`${p}kya`, `${p}kyu`, `${p}kyo`],
    [`${p}sha`, `${p}shu`, `${p}sho`],
    [`${p}cha`, `${p}chu`, `${p}cho`],
    [`${p}nya`, `${p}nyu`, `${p}nyo`],
    [`${p}hya`, `${p}hyu`, `${p}hyo`],
    [`${p}mya`, `${p}myu`, `${p}myo`],
    [`${p}rya`, `${p}ryu`, `${p}ryo`],
    [`${p}gya`, `${p}gyu`, `${p}gyo`],
    [`${p}ja`,  `${p}ju`,  `${p}jo`],
    [`${p}bya`, `${p}byu`, `${p}byo`],
    [`${p}pya`, `${p}pyu`, `${p}pyo`],
  ];
}

// --- Components ---

interface TileProps {
  item: VocabItem | undefined;
  stats: ItemStats | undefined;
  showRomaji?: boolean;
}

function KanaTile({ item, stats, showRomaji }: TileProps) {
  if (!item) {
    return <div className="rounded-lg bg-gray-100 dark:bg-slate-800/50" />;
  }
  const correct = stats?.correct ?? 0;
  const total = correct + (stats?.incorrect ?? 0);
  const pct = total > 0 ? `${Math.round((correct / total) * 100)}%` : "—";
  return (
    <div className={`flex flex-col items-center py-1.5 rounded-lg transition-colors ${tileColor(stats)}`}>
      <span className="text-sm font-medium leading-none">{item.japanese}</span>
      {showRomaji && <span className="text-xs leading-none mt-0.5 opacity-60">{item.romaji}</span>}
      <span className="text-xs leading-none mt-0.5 opacity-70">{pct}</span>
    </div>
  );
}

interface GridProps {
  prefix: string;
  lookup: Record<string, VocabItem>;
  store: ItemStatsStore;
}

function GojuonMainGrid({ prefix, lookup, store }: GridProps) {
  const grid = gojuonGrid(prefix);
  const nId = `${prefix}nn`;
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-11 gap-1">
        <div />
        {COL_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-gray-400 dark:text-slate-500">
            {label}
          </div>
        ))}
      </div>
      {grid.map((row, ri) => (
        <div key={ri} className="grid grid-cols-11 gap-1">
          <div className="flex items-center justify-center text-xs font-medium text-gray-400 dark:text-slate-500">
            {ROW_LABELS[ri]}
          </div>
          {row.map((id, ci) => (
            <KanaTile key={ci} item={id ? lookup[id] : undefined} stats={id ? store[id] : undefined} />
          ))}
        </div>
      ))}
      <div className="grid grid-cols-11 gap-1">
        <div className="flex items-center justify-center text-xs font-medium text-gray-400 dark:text-slate-500">n</div>
        <KanaTile item={lookup[nId]} stats={store[nId]} />
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} />
        ))}
      </div>
    </div>
  );
}

function DakutenSection({ prefix, lookup, store }: GridProps) {
  const rows = dakutenHandakutenRows(prefix);
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Dakuten / Handakuten</h4>
      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-6 gap-1">
            <div className="flex items-center justify-center text-xs font-medium text-gray-400 dark:text-slate-500">
              {DAKUTEN_LABELS[ri]}
            </div>
            {row.map((id) => (
              <KanaTile key={id} item={lookup[id]} stats={store[id]} showRomaji />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function YouonSection({ prefix, lookup, store }: GridProps) {
  const rows = youonRows(prefix);
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Yōon</h4>
      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-4 gap-1">
            <div className="flex items-center justify-center text-xs font-medium text-gray-400 dark:text-slate-500">
              {YOUON_LABELS[ri]}
            </div>
            {row.map((id) => (
              <KanaTile key={id} item={lookup[id]} stats={store[id]} showRomaji />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface GojuonSectionProps {
  title: string;
  items: VocabItem[];
  prefix: string;
  store: ItemStatsStore;
}

function GojuonSection({ title, items, prefix, store }: GojuonSectionProps) {
  const lookup = Object.fromEntries(items.map((item) => [item.id, item]));
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</h3>
      <GojuonMainGrid prefix={prefix} lookup={lookup} store={store} />
      <DakutenSection prefix={prefix} lookup={lookup} store={store} />
      <YouonSection prefix={prefix} lookup={lookup} store={store} />
    </div>
  );
}

function DigitSection({ store }: { store: ItemStatsStore }) {
  const digits = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">Ziffern (Zahlen-Quiz)</h3>
      <div className="flex gap-1.5">
        {digits.map((d) => (
          <div
            key={d}
            className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-colors ${tileColor(store[`d${d}`])}`}
          >
            <span className="text-lg font-bold leading-none">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsPage({ onBack }: Props) {
  const [store] = useState(() => loadItemStats());

  return (
    <div className="flex flex-col w-full max-w-md mx-auto flex-1">
      <div className="flex items-center justify-between w-full py-1">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Statistik</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-8">
        <GojuonSection title="Hiragana" items={hiragana} prefix="h" store={store} />
        <GojuonSection title="Katakana" items={katakana} prefix="k" store={store} />
        <DigitSection store={store} />
      </div>
    </div>
  );
}
