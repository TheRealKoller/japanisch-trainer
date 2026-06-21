# Design System — Japanisch Trainer

Verbindliche Gestaltungsregeln für alle UI-Komponenten. Gilt für Implementierung, Code-Review und Issue-Erstellung.

---

## Farben

### Primärfarbe — Indigo
Hauptfarbe für interaktive und aktive Elemente.

| Token | Klasse | Verwendung |
|---|---|---|
| primary | `indigo-500` | Fortschrittsbalken, Wave-Animation, Toggle aktiv |
| primary-bg | `bg-indigo-50` | Karten-Vorderseite, Icon-Button Hover-Hintergrund |
| primary-border | `border-indigo-200` | Karten-Vorderseite Rahmen |
| primary-hover-bg | `bg-indigo-100` | Karten-Vorderseite Hover |
| primary-button | `bg-indigo-600` | Primärer Button |
| primary-button-hover | `bg-indigo-700` | Primärer Button Hover |
| primary-text | `text-indigo-600` | Lese-Texte auf Karten, Primär-Akzente |
| primary-text-light | `text-indigo-500` | Sekundäre Akzente (Readings auf Vorderseite) |
| primary-text-muted | `text-indigo-400` | Tertiäre Akzente (alternative Readings) |
| primary-icon | `text-indigo-600 bg-indigo-50` | Icon-Button Hover-State |

### Neutralfarben — Gray
Texthierarchie und neutrale Flächen.

| Token | Klasse | Verwendung |
|---|---|---|
| page-bg | `bg-gray-50` | Seitenhintergrund |
| card-bg | `bg-white` | Karten-Rückseite, aufgeklappte Karten |
| surface | `bg-gray-100` | Fortschrittsbalken Track, sekundärer Button |
| surface-hover | `bg-gray-200` | Sekundärer Button Hover |
| border | `border-gray-200` | Karten-Rückseite Rahmen, Trennlinien |
| text-heading | `text-gray-800` | Überschriften (h1, h2) |
| text-body | `text-gray-700` | Session-Titel, Beschriftungen |
| text-secondary | `text-gray-600` | Ergebnis-Texte, Body-Text |
| text-muted | `text-gray-500` | Sekundärer Body-Text |
| text-hint | `text-gray-400` | Hinweistexte, Labels, Back-Link |
| toggle-off | `bg-gray-300` | Toggle inaktiv |

### Semantische Farben
Ausschließlich für Feedback-Zustände.

| Verwendung | Klassen |
|---|---|
| Richtig / Erfolg | `bg-green-100 text-green-700 hover:bg-green-200` / Zahl: `text-green-600` |
| Falsch / Fehler | `bg-red-100 text-red-700 hover:bg-red-200` / Zahl: `text-red-500` |

### Lektionsfarben
Jede Lektion hat eine eigene Tintfarbe — nur auf der Startseite und für Badges.

| Lektion | Card-Klassen | Badge-Klassen |
|---|---|---|
| Zahlen | `bg-amber-50 border-amber-200 hover:bg-amber-100` | `bg-amber-100 text-amber-700` |
| Zahlen-Quiz | `bg-orange-50 border-orange-200 hover:bg-orange-100` | `bg-orange-100 text-orange-700` |
| Hiragana | `bg-rose-50 border-rose-200 hover:bg-rose-100` | `bg-rose-100 text-rose-700` |
| Katakana | `bg-sky-50 border-sky-200 hover:bg-sky-100` | `bg-sky-100 text-sky-700` |

---

## Typografie

| Token | Klassen | Verwendung |
|---|---|---|
| display | `text-4xl font-bold text-gray-800` | App-Titel (h1) |
| heading-lg | `text-2xl font-bold text-gray-800` | Ergebnis-Überschriften |
| heading-md | `text-xl font-semibold text-gray-800` | Lektions-Titel auf Startseite |
| heading-sm | `text-lg font-semibold text-gray-700` | Session-Header-Titel |
| japanese-xl | `text-7xl` | Zeichen auf Flashcard (Hiragana/Katakana) |
| japanese-lg | `text-6xl font-bold text-gray-800` | Zahlen auf Quiz-Karte |
| japanese-md | `text-2xl text-indigo-600` | Kanji-Darstellung |
| reading-lg | `text-xl text-indigo-600 font-medium` | Primäre Lesung (Rückseite) |
| reading-md | `text-lg text-indigo-500` | Lesung auf Vorderseite / Flashcard |
| reading-sm | `text-base text-indigo-400` | Alternative Lesung |
| body | `text-gray-500` | Romaji, Bedeutungen |
| body-sm | `text-sm text-gray-400` | Hinweistexte, Fortschritts-Labels |
| label | `text-xs font-medium` | Badges, kleine Labels |
| stat-number | `text-4xl font-bold` | Große Kennzahlen im Ergebnis-Screen |

---

## Spacing

Alle Abstände folgen dem 4px-Raster (Tailwind-Standard).

| Token | Klasse | Verwendung |
|---|---|---|
| gap-xs | `gap-2` | Inline-Elemente (Icon + Text, Badge-Gruppe) |
| gap-sm | `gap-3` | Enge Komponenten-Gruppen |
| gap-md | `gap-4` | Button-Gruppen, Karten-Inhalte |
| gap-lg | `gap-6` | Flashcard + Buttons |
| gap-xl | `gap-8` | Haupt-Layout-Abschnitte |
| page-padding | `p-8` | Seiten-Padding |
| card-padding-md | `p-5` | Lektions-Karten (Startseite) |
| card-padding-lg | `p-6` | Quiz-Karten |

---

## Border Radius

| Token | Klasse | Verwendung |
|---|---|---|
| radius-sm | `rounded-lg` | Icon-Buttons, kleine Elemente |
| radius-md | `rounded-xl` | Buttons, Stats-Kacheln |
| radius-lg | `rounded-2xl` | Karten, Lektions-Kacheln |
| radius-full | `rounded-full` | Badges, Fortschrittsbalken, Toggle |

---

## Komponenten

### Button

Alle Buttons: `font-medium transition-colors`

| Variante | Klassen | Verwendung |
|---|---|---|
| primary | `px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700` | Hauptaktion (Nochmal, Quiz starten) |
| secondary | `px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200` | Sekundäraktion (Zurück) |
| danger | `px-6 py-3 rounded-xl bg-red-100 text-red-700 hover:bg-red-200` | Falsch-Button |
| success | `px-6 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200` | Richtig-Button |
| ghost | `text-gray-400 hover:text-gray-600 transition-colors text-sm` | Navigation (← Zurück) |
| icon | `p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors` | 🔊-Button |

### Flashcard / Lernkarte

```
Vorderseite: w-{size} h-{size} rounded-2xl border-2 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer
Rückseite:   w-{size} h-{size} rounded-2xl border-2 bg-white border-gray-200 cursor-default
```

- Flashcard (Hiragana/Katakana): `w-64 h-64`
- Quiz-Karte (Zahlen): `w-72 min-h-64`
- Übergangsanimation: `transition-colors duration-200`
- Hinweis auf Vorderseite: `text-gray-400 text-sm` — "Tippen zum Umdrehen"

### Badge / Pill

```
text-xs font-medium px-2 py-0.5 rounded-full
```

Farbe je nach Kontext (Lektionsfarbe oder `bg-orange-100 text-orange-700` für Level-Badge).

### Toggle (Auto-Play)

```
relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none
Aktiv:   bg-indigo-500
Inaktiv: bg-gray-300

Thumb: inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200
Aktiv:   translate-x-6
Inaktiv: translate-x-1
```

### Fortschrittsbalken

```
Track: w-full max-w-md bg-gray-100 rounded-full h-2
Fill:  bg-indigo-500 h-2 rounded-full transition-all duration-500
Label: text-sm text-gray-400  →  "{n} / {total} gelernt"
```

### Session-Header

```
flex items-center justify-between w-full max-w-md
Links:  ghost-Button (← Zurück)
Mitte:  heading-sm + optionaler Badge
Rechts: [WaveAnimation | 🔊-Button] + Toggle
```

### Wave-Animation (Audio läuft)

4 Balken, `bg-indigo-500`, `animate-bounce` mit versetzten Delays (0 / 120 / 240 / 120 ms).
Ersetzt den 🔊-Button während Audio abspielt.

---

## Layout

- **Max-Breite:** `max-w-md` für alle zentrierten Inhalte
- **Zentrierung:** `min-h-screen flex flex-col items-center justify-center p-8`
- **Startseite:** zusätzlich `bg-gray-50`

---

## Interaktionsregeln

- Alle interaktiven Elemente: `transition-colors` (kein `transition-all` außer Fortschrittsbalken)
- Karten: `select-none` (kein Text-Highlighting beim Tippen)
- Hover-States immer definiert; kein nacktes `cursor-pointer` ohne Hover-Feedback
- `duration-200` Standard; nur Fortschrittsbalken `duration-500`

---

## Was NICHT verwendet wird

- Keine Schatten (`shadow-*`) außer `shadow-sm` am Toggle-Thumb
- Kein Dark Mode (bewusst einfach gehalten)
- Kein globales State-Management
- Keine CSS-Klassen-Extraktion — Tailwind direkt im JSX
- Keine beliebigen Werte (`w-[123px]`) — nur Tailwind-Skala
