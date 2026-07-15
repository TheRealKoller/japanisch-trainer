# Design System — Japanisch Trainer

Verbindliche Gestaltungsregeln für alle UI-Komponenten. Gilt für Implementierung, Code-Review und Issue-Erstellung.

---

## Dark Mode

Dark Mode ist **Standard**. Die App startet im dunklen Modus, sofern der User nicht `"light"` in `localStorage` gespeichert hat.

- **Implementierung:** `.dark`-Klasse auf `<html>`, gesetzt via Anti-FOUC-Script in `index.html` vor React-Hydration
- **Tailwind-Variante:** `@custom-variant dark (&:where(.dark, .dark *))` in `src/index.css`
- **Umschalten:** `OptionsMenu`-Komponente, persistiert in `localStorage` (`"dark"` / `"light"`)
- Jede Klasse mit Dark-Mode-Verhalten erhält eine `dark:`-Variante

---

## Farben

### Primärfarbe — Indigo
Hauptfarbe für interaktive und aktive Elemente.

| Token | Light | Dark | Verwendung |
|---|---|---|---|
| primary | `indigo-500` | `indigo-500` | Toggle aktiv, Wave-Animation |
| primary-bg | `bg-indigo-50` | `dark:bg-indigo-500/10` | Karten-Vorderseite |
| primary-border | `border-indigo-200` | `dark:border-indigo-500/30` | Karten-Vorderseite Rahmen |
| primary-hover-bg | `bg-indigo-100` | `dark:hover:bg-indigo-500/15` | Karten-Vorderseite Hover |
| primary-text | `text-indigo-600` | `dark:text-indigo-300` | Lesungen Rückseite |
| primary-text-light | `text-indigo-500` | `dark:text-indigo-400` | Lesungen Vorderseite |
| primary-text-muted | `text-indigo-400` | `dark:text-indigo-500` | Alternative Lesungen |
| primary-icon-hover | `hover:text-indigo-600 hover:bg-indigo-50` | `dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10` | 🔊-Button Hover |
| gradient | `bg-gradient-to-r from-indigo-500 to-violet-500` | — | Titel (text), Fortschrittsbalken, Primary-Button |

### Neutralfarben

| Token | Light | Dark | Verwendung |
|---|---|---|---|
| page-bg | `bg-gray-50` | `dark:bg-slate-950` | Startseite Hintergrund |
| session-bg | `bg-white` | `dark:bg-slate-950` | Session Hintergrund |
| surface | `bg-gray-100` | `dark:bg-slate-800` | Fortschrittsbalken Track, sekundärer Button |
| surface-hover | `bg-gray-200` | `dark:hover:bg-slate-700` | Sekundärer Button Hover |
| card-back | `bg-white` | `dark:bg-slate-800` | Karten-Rückseite, aufgeklappte Karten |
| border | `border-gray-200` | `dark:border-slate-700` | Karten-Rückseite Rahmen |
| text-heading | `text-gray-800` | `dark:text-slate-100` | Überschriften |
| text-body | `text-gray-700` | `dark:text-slate-300` | Options-Labels, Beschriftungen |
| text-secondary | `text-gray-600` | `dark:text-slate-300` | Ergebnis-Texte |
| text-muted | `text-gray-500` | `dark:text-slate-400` | Body-Text, Romaji |
| text-hint | `text-gray-400` | `dark:text-slate-500` | Hinweistexte, ← Zurück |
| toggle-off | `bg-gray-300` | `dark:bg-slate-600` | Toggle inaktiv (Auto-Wiedergabe) |
| toggle-off-theme | `bg-gray-300` | — | Toggle inaktiv (Theme, nur im hellen Modus relevant) |
| options-dropdown | `bg-white border-gray-200` | `dark:bg-slate-800 dark:border-slate-700` | OptionsMenu Panel |
| options-row-hover | `hover:bg-gray-50` | `dark:hover:bg-slate-700/50` | Zeile im OptionsMenu |

### Semantische Farben

| Verwendung | Light | Dark |
|---|---|---|
| Richtig / Erfolg | `bg-green-100 text-green-700 hover:bg-green-200` | `dark:bg-green-500/15 dark:text-green-400 dark:hover:bg-green-500/25` |
| Falsch / Fehler | `bg-red-100 text-red-700 hover:bg-red-200` | `dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25` |
| Erfolg-Zahl | `text-green-600` | `dark:text-green-400` |
| Fehler-Zahl | `text-red-500` | `dark:text-red-400` |

### Lektionsfarben
Jede Lektion hat eine eigene Tintfarbe — nur auf der Startseite und für Badges.

| Lektion | Light Card | Dark Card | Light Badge | Dark Badge |
|---|---|---|---|---|
| Zahlen | `bg-amber-50 border-amber-200 hover:bg-amber-100` | `dark:bg-amber-500/10 dark:border-amber-500/30 dark:hover:bg-amber-500/15` | `bg-amber-100 text-amber-700` | `dark:bg-amber-400/20 dark:text-amber-300` |
| Zahlen-Quiz | `bg-orange-50 border-orange-200 hover:bg-orange-100` | `dark:bg-orange-500/10 dark:border-orange-500/30 dark:hover:bg-orange-500/15` | `bg-orange-100 text-orange-700` | `dark:bg-orange-400/20 dark:text-orange-300` |
| Hiragana | `bg-rose-50 border-rose-200 hover:bg-rose-100` | `dark:bg-rose-500/10 dark:border-rose-500/30 dark:hover:bg-rose-500/15` | `bg-rose-100 text-rose-700` | `dark:bg-rose-400/20 dark:text-rose-300` |
| Katakana | `bg-sky-50 border-sky-200 hover:bg-sky-100` | `dark:bg-sky-500/10 dark:border-sky-500/30 dark:hover:bg-sky-500/15` | `bg-sky-100 text-sky-700` | `dark:bg-sky-400/20 dark:text-sky-300` |
| Grundwortschatz | `bg-violet-50 border-violet-200 hover:bg-violet-100` | `dark:bg-violet-500/10 dark:border-violet-500/30 dark:hover:bg-violet-500/15` | `bg-violet-100 text-violet-700` | `dark:bg-violet-400/20 dark:text-violet-300` |
| Alltags-Floskeln | `bg-teal-50 border-teal-200 hover:bg-teal-100` | `dark:bg-teal-500/10 dark:border-teal-500/30 dark:hover:bg-teal-500/15` | `bg-teal-100 text-teal-700` | `dark:bg-teal-400/20 dark:text-teal-300` |
| Reise-Floskeln | `bg-lime-50 border-lime-200 hover:bg-lime-100` | `dark:bg-lime-500/10 dark:border-lime-500/30 dark:hover:bg-lime-500/15` | `bg-lime-100 text-lime-700` | `dark:bg-lime-400/20 dark:text-lime-300` |

---

## Typografie

| Token | Klassen | Verwendung |
|---|---|---|
| display-gradient | `text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent` | App-Titel (日本語トレーナー) |
| heading-lg | `text-2xl font-bold text-gray-800 dark:text-slate-100` | Ergebnis-Überschriften |
| heading-md | `text-xl font-semibold text-gray-800 dark:text-slate-100` | Lektions-Titel auf Startseite |
| heading-sm | `text-lg font-semibold text-gray-700 dark:text-slate-200` | Session-Header-Titel |
| japanese-xl | `text-7xl sm:text-8xl` | Zeichen auf Flashcard, ≤ 2 Zeichen (Hiragana/Katakana) — weitere Stufen siehe „Flashcard / Lernkarte“ unten |
| japanese-lg | `text-6xl font-bold text-gray-800 dark:text-slate-100` | Zahlen auf Quiz-Karte |
| japanese-md | `text-2xl text-indigo-600 dark:text-indigo-400` | Kanji-Darstellung |
| reading-lg | `text-xl text-indigo-600 dark:text-indigo-300 font-medium` | Primäre Lesung (Rückseite) |
| reading-md | `text-lg text-indigo-500 dark:text-indigo-400` | Lesung auf Vorderseite / Flashcard |
| reading-sm | `text-base text-indigo-400 dark:text-indigo-500` | Alternative Lesung |
| body | `text-gray-500 dark:text-slate-400` | Romaji, Bedeutungen |
| body-sm | `text-sm text-gray-400 dark:text-slate-500` | Hinweistexte, Fortschritts-Labels |
| label | `text-xs font-medium` | Badges, kleine Labels |
| stat-number | `text-4xl font-bold` | Große Kennzahlen im Ergebnis-Screen |
| meaning-lg | `text-2xl font-medium text-gray-700 dark:text-slate-200` | Bedeutung auf Kartenrückseite (Vokabel-/Floskel-Karten, `cardVariant="vocab"`) |

---

## Spacing

Alle Abstände folgen dem 4px-Raster (Tailwind-Standard).

| Token | Klasse | Verwendung |
|---|---|---|
| gap-xs | `gap-1` | Icon-Button-Gruppe im Header |
| gap-sm | `gap-2` / `gap-3` | Inline-Elemente, enge Komponenten-Gruppen |
| gap-md | `gap-4` | Button-Gruppen, Karten-Inhalte |
| gap-lg | `gap-6` | Session-Content-Bereich (Karte, Fortschrittsbalken) |
| gap-xl | `gap-8` | Haupt-Layout-Abschnitte |
| page-padding | `p-6 sm:p-8` | Seiten-Padding (responsiv) |
| card-padding-md | `p-5` | Lektions-Karten (Startseite) |
| card-padding-lg | `p-6` | Quiz-Karten |
| button-padding | `py-4` | Nochmal/Gewusst-Buttons |

---

## Border Radius

| Token | Klasse | Verwendung |
|---|---|---|
| radius-sm | `rounded-lg` | OptionsMenu-Zeilen |
| radius-md | `rounded-xl` | Buttons, Icon-Buttons, OptionsMenu-Panel, Toggle-Buttons |
| radius-lg | `rounded-2xl` | Karten, Lektions-Kacheln |
| radius-full | `rounded-full` | Badges, Fortschrittsbalken, Toggle-Thumb |

---

## Komponenten

### Button

Alle Buttons: `font-medium transition-colors`

| Variante | Klassen | Verwendung |
|---|---|---|
| primary | `py-3 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity` | Hauptaktion (Nochmal, Quiz starten) |
| secondary | `px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700` | Sekundäraktion (Zurück zur Auswahl) |
| danger | `flex-1 py-4 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25` | Nochmal-Button |
| success | `flex-1 py-4 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-400 dark:hover:bg-green-500/25` | Gewusst-Button |
| ghost | `text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm` | Navigation (← Zurück) |
| icon | `p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors` | 🔊-Button |

> **Hinweis:** Primary-Buttons verwenden `hover:opacity-90 transition-opacity` statt Farb-Hover, da der Gradient sonst abrupt wechseln würde.

### Flashcard / Lernkarte

```
Vorderseite: w-72 h-72 sm:w-80 sm:h-80 rounded-2xl border-2
             bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer
             dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:hover:bg-indigo-500/15

Rückseite:   w-72 h-72 sm:w-80 sm:h-80 rounded-2xl border-2
             bg-white border-gray-200 cursor-default
             dark:bg-slate-800 dark:border-slate-700
```

- `Flashcard` ist eine **controlled component**: `flipped` und `onFlip` kommen vom Parent
- Übergangsanimation: `transition-colors duration-200`
- Hinweis auf Vorderseite: `text-gray-400 dark:text-slate-500 text-sm` — "Tippen zum Umdrehen"
- Quiz-Karte (Zahlen): `w-72 sm:w-80 min-h-64` (variable Höhe)

**Dynamische Schriftgröße (Vorderseite):** `japaneseSizeClass()` in `Flashcard.tsx` staffelt die Zeichengröße nach Textlänge, damit auch mehrzeichige Vokabeln und Floskeln (Grundwortschatz, Alltags-/Reise-Floskeln) auf die Karte passen:

| Zeichenlänge | Klassen |
|---|---|
| ≤ 2 | `text-7xl sm:text-8xl` |
| ≤ 4 | `text-5xl sm:text-6xl` |
| ≤ 8 | `text-3xl sm:text-4xl` |
| > 8 | `text-xl sm:text-2xl` |

**Kartenvariante `vocab` (Grundwortschatz, Alltags-/Reise-Floskeln):** `Flashcard` erhält einen `variant`-Prop (`"default" | "vocab"`), gesteuert über `cardVariant` in `levelLessons` (`App.tsx`) und durchgereicht über `TrainingSession`. Bei `variant="vocab"` steht die westliche Schreibweise im Vordergrund, nicht die Schriftzeichen (Ziel: Wörter/Floskeln lernen, nicht die Schrift) — Hiragana/Katakana/Zahlen-Lektionen bleiben unverändert bei `"default"`.

Vorderseite (`variant="vocab"`), von oben nach unten:
1. Romaji (`item.romaji`) groß, Größe via `romajiSizeClass()`
2. Kana-Lesung (`item.reading`, oder `item.japanese` falls dieses bereits vollständig Kana ist) — `reading-md`
3. Korrekte Schreibweise (`item.japanese`) klein — `japanese-md`; **ausgeblendet**, wenn `item.reading` nicht gesetzt ist (reine Kana-Wörter ohne Kanji, `japanese` ist dann bereits identisch mit Zeile 2)

Rückseite (`variant="vocab"`): nur `item.meaning`, Stil `meaning-lg`.

**Dynamische Schriftgröße (Romaji, Vorderseite):** `romajiSizeClass()` in `Flashcard.tsx` — Romaji-Strings sind deutlich länger als Kana/Kanji, daher eigene Staffelung:

| Zeichenlänge | Klassen |
|---|---|
| ≤ 4 | `text-5xl sm:text-6xl` |
| ≤ 8 | `text-4xl sm:text-5xl` |
| ≤ 14 | `text-2xl sm:text-3xl` |
| ≤ 22 | `text-xl sm:text-2xl` |
| > 22 | `text-lg sm:text-xl` |

**Kartenausrichtung `orientation` (nur `variant="vocab"`):** Jede Karte bekommt beim Sessionstart zufällig (~50/50) eine `orientation` (`"forward" | "reversed"`), zugewiesen in `TrainingSession` über `buildOrientations()` (`src/utils/cardOrientation.ts`), gekeyt nach `item.id` und daher stabil über die gesamte Session hinweg — auch beim Requeue falsch beantworteter Karten. Bei "Nochmal" (Neustart) wird neu gewürfelt, analog zur Kartenreihenfolge selbst.

- `orientation="forward"` (Standard): wie oben beschrieben — Vorderseite Romaji/Kana/Kanji, Rückseite nur Bedeutung.
- `orientation="reversed"`: **gespiegelt** — Vorderseite zeigt nur `item.meaning` (groß, `meaningSizeClass()`), Rückseite zeigt denselben Romaji/Kana/Kanji-Block wie sonst die Vorderseite (identischer Inhalt/Reihenfolge, via gemeinsame `RomajiKanaKanji`-Komponente in `Flashcard.tsx`).

**Dynamische Schriftgröße (Bedeutung, `orientation="reversed"`):** `meaningSizeClass()` in `Flashcard.tsx` — deutsche Bedeutungen reichen von kurzen Wörtern bis zu ganzen Sätzen (Reise-/Alltags-Floskeln), daher eigene Staffelung:

| Zeichenlänge | Klassen |
|---|---|
| ≤ 6 | `text-5xl sm:text-6xl` |
| ≤ 12 | `text-4xl sm:text-5xl` |
| ≤ 20 | `text-2xl sm:text-3xl` |
| ≤ 30 | `text-xl sm:text-2xl` |
| > 30 | `text-lg sm:text-xl` |

### StatsPage / Statistik-Seite

Zeigt pro Zeichen/Wort eine Kachel `flex flex-col items-center py-1.5 rounded-lg transition-colors` (`KanaTile`), Hintergrundfarbe via `tileColor()` nach Erfolgsquote:

| Erfolgsquote | Klassen |
|---|---|
| ≥ 80% | `bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400` |
| ≥ 50% | `bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400` |
| < 50% | `bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400` |
| keine Daten | `bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500` |

Hiragana/Katakana: Gojūon-Raster (`grid-cols-6`, Zeilen/Spalten nach Aussprache). Grundwortschatz/Alltags-/Reise-Floskeln (`LevelGroupedSection`): nach Level gruppiert (Überschrift „Level N"), `grid grid-cols-4 gap-1.5` pro Level — **alle** Wörter werden angezeigt, unabhängig vom Freischaltungsstatus.

**Dynamische Schriftgröße:** `tileTextSizeClass()` in `StatsPage.tsx` — dieselbe Funktion für Kana- und Wort-Kacheln (Kana ist immer 1-2 Zeichen und fällt automatisch in die erste Stufe). Bleibt bewusst innerhalb der Standard-Tailwind-Skala (keine beliebigen Werte); lange Floskeln brechen stattdessen mehrzeilig um (`text-center` auf der Zeichen-Zeile):

| Zeichenlänge | Klassen |
|---|---|
| ≤ 4 | `text-sm leading-none` |
| > 4 | `text-xs leading-tight` |

### Tabs (Lektions-Reiter)

Statistikseite: horizontal scrollbare Reiter-Leiste, ein Reiter pro Lektionsart, volle Labels (kein Abkürzen). Nur die Sektion des aktiven Reiters wird angezeigt (`LessonTabs.tsx`).

```
Leiste:  flex gap-2 overflow-x-auto pb-2 -mx-1 px-1
Reiter:  shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors

Aktiv:   bg-indigo-500 text-white
Inaktiv: bg-gray-100 text-gray-600 hover:bg-gray-200
         dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
```

Aktiver Reiter immer Indigo (Primärfarbe), unabhängig von etwaigen Lektionsfarben. Der zuletzt aktive Reiter wird geräte-lokal in `localStorage` persistiert (`statsTabStorage.ts`, Key `"stats-active-tab"`, kein `japanisch-trainer:`-Prefix da bewusst nicht Teil des Server-Syncs) und beim Wiederöffnen der Seite wiederhergestellt.

### Badge / Pill

```
text-xs font-medium px-2 py-0.5 rounded-full
```

Farbe je nach Kontext (Lektionsfarbe oder `bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300` für Level-Badge).

### Toggle

```
relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200

Aktiv:   bg-indigo-500
Inaktiv: bg-gray-300  (Theme-Toggle) / bg-gray-300 dark:bg-slate-600  (Auto-Wiedergabe)

Thumb: inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200
Aktiv:   translate-x-6
Inaktiv: translate-x-1
```

### Fortschrittsbalken

```
Track: w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2
Fill:  bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500
Label: text-sm text-gray-400 dark:text-slate-500  →  "{n} / {total} gelernt"
```

### OptionsMenu

⚙️-Button öffnet ein Dropdown-Panel. Schließt bei Klick außerhalb (`pointerdown`-Listener).

```
Button (geschlossen): p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100
                      dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800
Button (offen):       bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200

Panel: absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-lg z-50 p-1.5
       bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700

Zeile: flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors
       hover:bg-gray-50 dark:hover:bg-slate-700/50
```

**Inhalte je nach Kontext:**
- **Immer:** Theme-Toggle, Navigation zu Statistik, Stimme und Konto (Anmelden bzw. E-Mail des Users)
- **Sessions zusätzlich:** Auto-Wiedergabe-Toggle

### Session-Header

```
flex items-center justify-between w-full py-1

Links:   ghost-Button (← Zurück)
Mitte:   heading-sm + optionaler Badge
Rechts:  [WaveAnimation | 🔊 icon-Button]  +  OptionsMenu (⚙️)
```

Ändert sich **nicht** mit dem Scroll — steht am oberen Rand der Seite (natürlicher Flow im `flex-col`-Layout).

### Wave-Animation (Audio läuft)

4 Balken, `bg-indigo-500 dark:bg-indigo-400`, `animate-bounce` mit versetzten Delays (0 / 120 / 240 / 120 ms). Ersetzt den 🔊-Button während Audio abspielt.

---

## Layout

### Startseite

```
min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 bg-gray-50 dark:bg-slate-950
  └── max-w-md w-full flex flex-col gap-8
        ├── Titel (zentriert)
        └── Lektions-Liste
```

OptionsMenu: `fixed top-4 right-4 z-50`

### Session-Screens (TrainingSession, NumberQuizSession)

```
main: min-h-screen flex flex-col p-6 sm:p-8 bg-white dark:bg-slate-950

  └── Wrapper: flex flex-col w-full max-w-md mx-auto flex-1
        ├── Header (oben, natürlicher Flow)
        ├── Content: flex-1 flex flex-col items-center justify-center gap-6
        │     ├── Karte
        │     ├── Fortschrittsbalken
        │     └── Fortschritts-Label
        └── Buttons: pb-4  (am unteren Rand der Seite)
              └── Nochmal + Gewusst (opacity-0 wenn nicht aufgedeckt)
```

- **Mobile:** Header oben, Karte zentriert im verbleibenden Raum, Buttons am unteren Rand
- **Desktop:** Gleiche Struktur, mehr Freiraum über/unter der Karte
- Buttons: `opacity-0 pointer-events-none` wenn nicht aufgedeckt — kein Layout-Shift

---

## Interaktionsregeln

- Alle interaktiven Elemente: `transition-colors` (kein `transition-all` außer Fortschrittsbalken)
- Karten: `select-none` (kein Text-Highlighting beim Tippen)
- Hover-States immer definiert; kein nacktes `cursor-pointer` ohne Hover-Feedback
- `duration-200` Standard; nur Fortschrittsbalken `duration-500`
- Buttons mit Gradient: `hover:opacity-90 transition-opacity` statt Farb-Hover

---

## Was NICHT verwendet wird

- Keine Schatten (`shadow-*`) außer `shadow-sm` am Toggle-Thumb und `shadow-lg` am OptionsMenu-Panel
- Kein globales State-Management — lokaler `useState` reicht (Ausnahme: `AuthContext` für den Login-Status)
- Keine CSS-Klassen-Extraktion — Tailwind direkt im JSX
- Keine beliebigen Werte (`w-[123px]`) — nur Tailwind-Skala
- `ThemeToggle.tsx` ist veraltet und nicht mehr in Verwendung (durch `OptionsMenu` ersetzt)
