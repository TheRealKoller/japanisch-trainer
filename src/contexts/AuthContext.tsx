import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  fetchServerProgress,
  mirrorServerProgress,
  seedServerProgress,
  setSyncEnabled,
} from "../utils/progressSync";

export interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function postCredentials(path: string, email: string, password: string): Promise<AuthUser> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "Anfrage fehlgeschlagen");
  }
  return (await res.json()) as AuthUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? (res.json() as Promise<AuthUser>) : null))
      .then((data) => {
        if (cancelled) return;
        // setSyncEnabled direkt statt per useEffect: Kind-Effekte feuern vor
        // Eltern-Effekten — ein Save beim ersten Mount würde sonst verpuffen.
        setSyncEnabled(data !== null);
        setUser(data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    await postCredentials("/api/auth/login", email, password);
    // Server-Stand ist führend: localStorage überschreiben, dann Neustart,
    // damit alle useState-Initializer den Server-Stand lesen.
    mirrorServerProgress(await fetchServerProgress());
    window.location.hash = "";
    window.location.reload();
  }

  async function register(email: string, password: string) {
    const registered = await postCredentials("/api/auth/register", email, password);
    // Neues Konto: lokalen Fortschritt als Startstand zum Server hochladen.
    // Konto und Cookie existieren ab hier — ein Seed-Fehler darf die
    // Registrierung nicht scheitern lassen (sonst 409-Falle beim Retry).
    try {
      await seedServerProgress();
    } catch (err) {
      console.warn("[sync] Fortschritt-Upload nach Registrierung fehlgeschlagen:", err);
    }
    setSyncEnabled(true);
    setUser(registered);
    window.location.hash = "";
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    // localStorage bleibt unverändert — Gerät läuft im lokalen Modus weiter.
    setSyncEnabled(false);
    setUser(null);
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-950" />;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  return ctx;
}
