# Japanisch Trainer

Interaktiver Vokabeltrainer für Japanisch als Web-App mit optionalem Konto für Cross-Device-Sync.

## Tech Stack

- **React 19 + TypeScript** — Komponenten und Logik
- **Vite** — Build-Tool und Dev-Server
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — Styling
- **nginx** — Statischer Dateiserver + Reverse-Proxy (`/api/`, `/voicevox/`) im Docker-Container
- **Fastify + TypeScript** (`api/`) — Auth- und Progress-API
- **PostgreSQL + Drizzle ORM** — serverseitige Persistenz (JWT-Auth via httpOnly-Cookie)

## Deployment

```bash
# Entwicklung (Frontend; API-Calls werden auf localhost:3000 geproxied)
npm run dev

# API-Entwicklung (braucht laufende Postgres, siehe docker-compose.yml)
cd api && npm run dev

# Alle Dienste (frontend, api, db, voicevox, audio-generierung)
docker compose up --build
# → http://localhost:8080
```

## Projektstruktur

```
src/
  data/         # Vokabeldaten als TypeScript-Arrays
    numbers.ts  # Zahlen (0–10.000)
    hiragana.ts # Hiragana-Alphabet (46 Zeichen)
    katakana.ts # Katakana-Alphabet (46 Zeichen)
    coreVocab.ts     # Grundwortschatz (128 Wörter, 16 Level)
    dailyPhrases.ts  # Alltags-Floskeln (40 Wendungen, 5 Level)
    travelPhrases.ts # Reise-Floskeln (40 Wendungen, 5 Level)
    verbConjugation.ts # Verbkonjugation (48 Karten, 6 Level)
    particleSentences.ts # Partikel-Übung (40 Lückensätze, は/が/を/に/で)
  components/
    Flashcard.tsx        # Einzelne Lernkarte (vorne/hinten)
    TrainingSession.tsx  # Kartenstapel-Logik mit Wiederholung falsch beantworteter Karten
    LoginPage.tsx        # Login/Registrierung (#/login)
  contexts/
    AuthContext.tsx      # Auth-State (user, login, register, logout)
  utils/
    progressSync.ts      # Server-Sync des Lernfortschritts (fire-and-forget PUTs)
  App.tsx       # Hauptnavigation (Lektionsauswahl)
api/
  src/
    app.ts      # Fastify-Instanz (Routen, JWT, Cookies)
    routes/     # auth.ts (register/login/logout/me), progress.ts (GET/PUT)
    db/         # Drizzle-Schema (users, progress) + Client
  drizzle/      # Generierte SQL-Migrationen (laufen beim API-Start)
```

## Datenformat

Alle Vokabeln folgen dem `VocabItem`-Interface:

```ts
interface VocabItem {
  id: string;        // eindeutig, z.B. "n1", "ha", "kka"
  japanese: string;  // Kanji oder Kana
  romaji: string;    // Romaji-Lesung
  reading?: string;  // optional: Kana-Lesung (nur bei Zahlen/Kanji)
  meaning: string;   // Deutsche/Englische Bedeutung
  formLabel?: string; // optional: gefragte Konjugationsform (nur Verbkonjugation)
}
```

## Lernlogik

- Karten werden gemischt (Fisher-Yates)
- Falsch beantwortete Karten kommen erneut in den Stapel
- Fortschrittsbalken zeigt korrekt beantwortete Karten
- Fortschritt liegt in `localStorage` (synchroner Lese-Cache); mit Konto wird jede Änderung
  zusätzlich fire-and-forget an die API gepusht (`src/utils/progressSync.ts`)
- Beim Login ist der Server-Stand führend: localStorage wird überschrieben, danach Reload
- Ohne Konto funktioniert alles rein lokal (localStorage-Fallback)
- Theme und Sprecher-Stimme bleiben bewusst gerätelokal

## Git-Workflow

- **Kein direkter Push auf `main`** — immer über Feature-Branches und PRs
- Branch-Namenskonvention: `feature/<name>` oder `fix/<name>`
- Jedes Feature hat ein GitHub Issue — PR schließt das Issue via `Closes #<nr>` im Body
- Vor dem PR: `/pr-ready` ausführen (Lint, Build, TypeScript-Check)
- Vor dem Merge: `/review` für Code-Review

```bash
git checkout -b feature/mein-feature
# ... entwickeln ...
/pr-ready   # Qualitätscheck + PR erstellen
```

## Design System

**Pflichtlektüre für Implementierung, Code-Review und Issue-Erstellung:** [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

Das Design System definiert verbindlich:
- Farbpalette (Indigo als Primärfarbe, semantische Farben, Lektionsfarben)
- Typografie-Skala (display → label)
- Spacing-Tokens (gap-xs bis gap-xl, page-padding)
- Border-Radius-Tokens (radius-sm bis radius-full)
- Komponenten-Patterns (Button-Varianten, Flashcard, Toggle, Fortschrittsbalken, Session-Header)
- Interaktionsregeln (transition-colors, select-none, Hover-States)

Bei neuen UI-Komponenten und bei Code-Reviews: prüfen ob die Klassen den Tokens in `DESIGN_SYSTEM.md` entsprechen. Abweichungen nur mit expliziter Begründung.

## Konventionen

- Keine CSS-Klassen-Extraktion — Tailwind direkt im JSX
- Kein globales State-Management — lokaler `useState` reicht; einzige Ausnahme: `AuthContext` für den Login-Status (wird app-weit gebraucht)
- Neue Lektionen: neue Datei in `src/data/`, Eintrag in `App.tsx`
