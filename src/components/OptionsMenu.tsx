import { useState, useEffect, useRef } from "react";

interface Props {
  autoPlay?: boolean;
  onAutoPlayChange?: (v: boolean) => void;
}

export function OptionsMenu({ autoPlay, onAutoPlayChange }: Props) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Optionen"
        className={`p-2.5 rounded-xl transition-colors
          ${open
            ? "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800"
          }`}
      >
        ⚙️
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-lg z-50
          bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700
          p-1.5 flex flex-col gap-0.5">

          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg
            hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm text-gray-700 dark:text-slate-300">
              {dark ? "Heller Modus" : "Dunkler Modus"}
            </span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
                dark ? "bg-indigo-500" : "bg-gray-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${dark ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {onAutoPlayChange !== undefined && (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg
              hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="text-sm text-gray-700 dark:text-slate-300">Auto-Wiedergabe</span>
              <button
                onClick={() => onAutoPlayChange(!autoPlay)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
                  autoPlay ? "bg-indigo-500" : "bg-gray-300 dark:bg-slate-600"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${autoPlay ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
