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
  id: string;       // eindeutig, z.B. "n1", "ha", "kka"
  japanese: string; // Kanji oder Kana
  reading: string;  // Romaji oder Kana-Lesung
  meaning: string;  // Deutsche/Englische Bedeutung
}
```

## Lernlogik

- Karten werden gemischt (Fisher-Yates)
- Falsch beantwortete Karten kommen erneut in den Stapel
- Fortschrittsbalken zeigt korrekt beantwortete Karten
- Kein Backend, kein Persistenz — bewusst einfach gehalten

## Konventionen

- Keine CSS-Klassen-Extraktion — Tailwind direkt im JSX
- Kein globales State-Management — lokaler `useState` reicht
- Neue Lektionen: neue Datei in `src/data/`, Eintrag in `App.tsx`
