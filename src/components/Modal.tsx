import { useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled"));
}

export function Modal({ onClose, label, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    ref.current?.focus();

    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const elements = focusableElements(ref.current);
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="relative w-full max-w-sm rounded-2xl border shadow-lg p-6 outline-none
          bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700"
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-3 right-3 p-2.5 rounded-xl transition-colors
            text-gray-400 hover:text-gray-600 hover:bg-gray-100
            dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
