import type { VocabItem } from "../data/types";
import type { Level } from "../data/levels";
import { coreVocabLevels } from "../data/coreVocab";
import { dailyPhraseLevels } from "../data/dailyPhrases";
import { travelPhraseLevels } from "../data/travelPhrases";
import { lessonItems, type VocabLessonId } from "../data/lessonRegistry";
import { successRate, totalAttempts, formatPercent, MASTERY_THRESHOLD, type ItemStats, type ItemStatsStore } from "../utils/itemStats";

function tileColor(stats: ItemStats | undefined): string {
  if (!stats || stats.correct + stats.incorrect === 0) {
    return "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500";
  }
  const rate = successRate(stats);
  if (rate >= MASTERY_THRESHOLD) return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";
  if (rate >= 0.5) return "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400";
  return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
}

function buildLookup(items: VocabItem[]): Record<string, VocabItem> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

// --- Gojūon grid structure ---

const COL_LABELS = ["a", "i", "u", "e", "o"];
const ROW_LABELS = ["−", "k", "s", "t", "n", "h", "m", "y", "r", "w", "n"];
const DAKUTEN_LABELS = ["G", "Z", "D", "B", "P"];
const YOUON_LABELS = ["ky", "sh", "ch", "ny", "hy", "my", "ry", "gy", "j", "by", "py"];

function gojuonGrid(p: string): (string | null)[][] {
  return [
    [`${p}a`,  `${p}i`,   `${p}u`,   `${p}e`,  `${p}o`],
    [`${p}ka`, `${p}ki`,  `${p}ku`,  `${p}ke`, `${p}ko`],
    [`${p}sa`, `${p}si`,  `${p}su`,  `${p}se`, `${p}so`],
    [`${p}ta`, `${p}chi`, `${p}tsu`, `${p}te`, `${p}to`],
    [`${p}na`, `${p}ni`,  `${p}nu`,  `${p}ne`, `${p}no`],
    [`${p}ha`, `${p}hi`,  `${p}fu`,  `${p}he`, `${p}ho`],
    [`${p}ma`, `${p}mi`,  `${p}mu`,  `${p}me`, `${p}mo`],
    [`${p}ya`, null,       `${p}yu`,  null,     `${p}yo`],
    [`${p}ra`, `${p}ri`,  `${p}ru`,  `${p}re`, `${p}ro`],
    [`${p}wa`, null,       null,      null,     `${p}wo`],
    [`${p}nn`, null,       null,      null,     null],
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

// Schriftgröße nach Textlänge — Kana-Zeichen sind immer 1-2 Zeichen (fällt automatisch
// in die erste Stufe), Vokabeln/Floskeln reichen bis zu 13 Zeichen. Bleibt innerhalb der
// Standard-Tailwind-Skala; lange Wörter brechen stattdessen mehrzeilig um.
function tileTextSizeClass(text: string): string {
  if (text.length <= 4) return "text-sm leading-none";
  return "text-xs leading-tight";
}

interface TileProps {
  item: VocabItem | undefined;
  stats: ItemStats | undefined;
  showRomaji?: boolean;
  onSelect?: (item: VocabItem) => void;
}

function KanaTile({ item, stats, showRomaji, onSelect }: TileProps) {
  if (!item) {
    return <div className="rounded-lg bg-gray-100 dark:bg-slate-800/50" />;
  }
  const total = totalAttempts(stats);
  const pct = total > 0 ? formatPercent(successRate(stats)) : "—";
  const className = `flex flex-col items-center py-1.5 rounded-lg transition-colors ${tileColor(stats)}`;
  const content = (
    <>
      <span className={`${tileTextSizeClass(item.japanese)} font-medium text-center`}>{item.japanese}</span>
      {showRomaji && <span className="text-xs leading-none mt-0.5 opacity-60">{item.romaji}</span>}
      <span className="text-xs leading-none mt-0.5 opacity-70">{pct}</span>
    </>
  );
  if (!onSelect) {
    return <div className={className}>{content}</div>;
  }
  return (
    <button onClick={() => onSelect(item)} className={`${className} hover:opacity-70`}>
      {content}
    </button>
  );
}

interface GridProps {
  prefix: string;
  lookup: Record<string, VocabItem>;
  store: ItemStatsStore;
  onSelect?: (item: VocabItem) => void;
}

function GojuonMainGrid({ prefix, lookup, store, onSelect }: GridProps) {
  const grid = gojuonGrid(prefix);
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-6 gap-1">
        <div />
        {COL_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-gray-400 dark:text-slate-500">
            {label}
          </div>
        ))}
      </div>
      {grid.map((row, ri) => (
        <div key={ri} className="grid grid-cols-6 gap-1">
          <div className="flex items-center justify-center text-xs font-medium text-gray-400 dark:text-slate-500">
            {ROW_LABELS[ri]}
          </div>
          {row.map((id, ci) => (
            <KanaTile key={ci} item={id ? lookup[id] : undefined} stats={id ? store[id] : undefined} onSelect={onSelect} />
          ))}
        </div>
      ))}
    </div>
  );
}

function DakutenSection({ prefix, lookup, store, onSelect }: GridProps) {
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
              <KanaTile key={id} item={lookup[id]} stats={store[id]} showRomaji onSelect={onSelect} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function YouonSection({ prefix, lookup, store, onSelect }: GridProps) {
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
              <KanaTile key={id} item={lookup[id]} stats={store[id]} showRomaji onSelect={onSelect} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface GojuonSectionProps {
  title: string;
  items: VocabItem[];
  prefix: string;
  store: ItemStatsStore;
  onSelect?: (item: VocabItem) => void;
}

export function GojuonSection({ title, items, prefix, store, onSelect }: GojuonSectionProps) {
  const lookup = buildLookup(items);
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</h3>
      <GojuonMainGrid prefix={prefix} lookup={lookup} store={store} onSelect={onSelect} />
      <DakutenSection prefix={prefix} lookup={lookup} store={store} onSelect={onSelect} />
      <YouonSection prefix={prefix} lookup={lookup} store={store} onSelect={onSelect} />
    </div>
  );
}

export function DigitSection({ store }: { store: ItemStatsStore }) {
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

export interface LevelGroupedSectionProps {
  title: string;
  items: VocabItem[];
  levels: Level[];
  store: ItemStatsStore;
  onSelect?: (item: VocabItem) => void;
}

// Zeigt alle Wörter/Floskeln einer Lektion, gruppiert nach Level — unabhängig vom
// Freischaltungsstatus (bewusste Vollansicht, siehe Issue #124).
export function LevelGroupedSection({ title, items, levels, store, onSelect }: LevelGroupedSectionProps) {
  const lookup = buildLookup(items);
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</h3>
      {levels.map((level) => (
        <div key={level.level}>
          <h4 className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Level {level.level}</h4>
          <div className="grid grid-cols-4 gap-1.5">
            {level.ids.map((id) => (
              <KanaTile key={id} item={lookup[id]} stats={store[id]} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Lesson → Sektion Mapping ---
// Einzige Quelle für "welche Lektionsart zeigt welche Sektion mit welchen Props" —
// sowohl StatsPage.tsx (alle Lektionen) als auch der "Geschafft!"-Screen von
// TrainingSession/NumberQuizSession (genau eine Lektionsart, siehe Issue #133)
// rendern darüber, damit das Mapping nicht doppelt gepflegt werden muss.

export type StatsLessonId = VocabLessonId | "number-quiz";

interface LessonStatsSectionProps {
  lessonId: StatsLessonId;
  store: ItemStatsStore;
  onSelect?: (item: VocabItem) => void;
}

export function LessonStatsSection({ lessonId, store, onSelect }: LessonStatsSectionProps) {
  switch (lessonId) {
    case "hiragana":
      return <GojuonSection title="Hiragana" items={lessonItems.hiragana} prefix="h" store={store} onSelect={onSelect} />;
    case "katakana":
      return <GojuonSection title="Katakana" items={lessonItems.katakana} prefix="k" store={store} onSelect={onSelect} />;
    case "number-quiz":
      return <DigitSection store={store} />;
    case "core-vocab":
      return <LevelGroupedSection title="Grundwortschatz" items={lessonItems["core-vocab"]} levels={coreVocabLevels} store={store} onSelect={onSelect} />;
    case "daily-phrases":
      return <LevelGroupedSection title="Alltags-Floskeln" items={lessonItems["daily-phrases"]} levels={dailyPhraseLevels} store={store} onSelect={onSelect} />;
    case "travel-phrases":
      return <LevelGroupedSection title="Reise-Floskeln" items={lessonItems["travel-phrases"]} levels={travelPhraseLevels} store={store} onSelect={onSelect} />;
  }
}
