import { hiragana } from "../data/hiragana";
import { katakana } from "../data/katakana";
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

interface CharTileProps {
  japanese: string;
  romaji: string;
  stats: ItemStats | undefined;
}

function CharTile({ japanese, romaji, stats }: CharTileProps) {
  return (
    <div className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${tileColor(stats)}`}>
      <span className="text-lg font-medium leading-none">{japanese}</span>
      <span className="text-[10px] mt-1 leading-none opacity-70">{romaji}</span>
    </div>
  );
}

interface CharSectionProps {
  title: string;
  items: { id: string; japanese: string; romaji: string }[];
  store: ItemStatsStore;
}

function CharSection({ title, items, store }: CharSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">{title}</h3>
      <div className="grid grid-cols-8 gap-1.5">
        {items.map((item) => (
          <CharTile
            key={item.id}
            japanese={item.japanese}
            romaji={item.romaji}
            stats={store[item.id]}
          />
        ))}
      </div>
    </div>
  );
}

function DigitSection({ store }: { store: ItemStatsStore }) {
  const digits = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">Ziffern</h3>
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
  const store = loadItemStats();

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
        <CharSection title="Hiragana" items={hiragana} store={store} />
        <CharSection title="Katakana" items={katakana} store={store} />
        <DigitSection store={store} />
      </div>
    </div>
  );
}
