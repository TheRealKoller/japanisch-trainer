import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  onBack: () => void;
}

const inputClass = `w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors
  border-gray-200 bg-white text-gray-700 focus:border-indigo-500
  dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-indigo-400`;

export function LoginPage({ onBack }: Props) {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto flex-1">
      <div className="flex items-center justify-between w-full py-1">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Konto</h2>
        <div className="w-14" />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        {user ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-gray-700 dark:text-slate-300">
              Angemeldet als <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Dein Lernfortschritt wird auf allen Geräten synchronisiert.
            </p>
            <button
              onClick={() => void logout().then(onBack)}
              className="px-6 py-3 rounded-xl font-medium transition-colors
                bg-gray-100 text-gray-700 hover:bg-gray-200
                dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Abmelden
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
                {mode === "login" ? "Anmelden" : "Registrieren"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                {mode === "login"
                  ? "Melde dich an, um deinen Fortschritt auf allen Geräten zu nutzen."
                  : "Erstelle ein Konto — dein bisheriger Fortschritt wird übernommen."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <input
                type="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="Passwort (mind. 8 Zeichen)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />

              {error && (
                <p className="text-sm text-red-700 dark:text-red-400 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {busy ? "Bitte warten…" : mode === "login" ? "Anmelden" : "Konto erstellen"}
              </button>
            </form>

            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-center"
            >
              {mode === "login" ? "Noch kein Konto? Registrieren" : "Schon ein Konto? Anmelden"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
