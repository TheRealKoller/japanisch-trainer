import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
      title={dark ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
      className="fixed top-4 right-4 z-50 p-2 rounded-xl border transition-colors
        bg-white/90 border-gray-200 text-gray-600 hover:bg-gray-100
        dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700
        backdrop-blur-sm shadow-sm text-base leading-none"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
