interface SegmentedProgressBarProps {
  completed: number;
  total: number;
  accentClass: string;
}

export function SegmentedProgressBar({ completed, total, accentClass }: SegmentedProgressBarProps) {
  if (completed <= 0) return null;

  return (
    <div className="flex mt-3 gap-0.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full flex-1 ${i < completed ? accentClass : "bg-gray-200 dark:bg-slate-700"}`}
        />
      ))}
    </div>
  );
}
