interface MasteryProgressBarProps {
  mastered: number;
  learning: number;
  unseen: number;
  showLabel?: boolean;
  // Rendert auch, wenn noch nichts geübt wurde (komplett grau) — für die Statistikseite,
  // die den Lektionsstand auch vor der ersten Session als Übersicht zeigen soll. Der
  // Home-Screen blendet den Balken dagegen bewusst aus, bis die Lektion angefasst wurde
  // (Konsistenz mit dem bisherigen Verhalten der alten SegmentedProgressBar).
  alwaysShow?: boolean;
}

export function MasteryProgressBar({ mastered, learning, unseen, showLabel, alwaysShow }: MasteryProgressBarProps) {
  const total = mastered + learning + unseen;
  if (total <= 0 || (!alwaysShow && mastered + learning === 0)) return null;

  return (
    <div className="mt-3 flex flex-col gap-1">
      <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
        <div
          className="bg-green-400 transition-all duration-500"
          style={{ width: `${(mastered / total) * 100}%` }}
        />
        <div
          className="bg-orange-400 transition-all duration-500"
          style={{ width: `${(learning / total) * 100}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 dark:text-slate-500">
          {mastered} gut gekannt · {learning} wird gelernt · {unseen} nicht gesehen
        </p>
      )}
    </div>
  );
}
