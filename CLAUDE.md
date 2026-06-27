# Japanisch Trainer

Interaktiver Vokabeltrainer für Japanisch als statische Web-App.

## Tech Stack

- **React 19 + TypeScript** — Komponenten und Logik
- **Vite** — Build-Tool und Dev-Server
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — Styling
- **nginx** — Statischer Dateiserver im Docker-Container

## Deployment

```bash
# Entwicklung
npm run dev

# Docker-Build und Start
docker build -t japanisch-trainer .
docker run -p 8080:80 japanisch-trainer
# → http://localhost:8080
```

## Projektstruktur

```
src/
  data/         # Vokabeldaten als TypeScript-Arrays
    numbers.ts  # Zahlen (0–10.000)
    hiragana.ts # Hiragana-Alphabet (46 Zeichen)
    katakana.ts # Katakana-Alphabet (46 Zeichen)
  components/
    Flashcard.tsx        # Einzelne Lernkarte (vorne/hinten)
    TrainingSession.tsx  # Kartenstapel-Logik mit Wiederholung falsch beantworteter Karten
  App.tsx       # Hauptnavigation (Lektionsauswahl)
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
}
```

## Lernlogik

- Karten werden gemischt (Fisher-Yates)
- Falsch beantwortete Karten kommen erneut in den Stapel
- Fortschrittsbalken zeigt korrekt beantwortete Karten
- Kein Backend — bewusst einfach gehalten
- Fortschritt wird via `localStorage` gespeichert (z.B. freigeschaltete Level)

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
- Kein globales State-Management — lokaler `useState` reicht
- Neue Lektionen: neue Datei in `src/data/`, Eintrag in `App.tsx`
