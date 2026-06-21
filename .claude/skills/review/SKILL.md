# /review

Führe einen projektspezifischen Code-Review des aktuellen Branches durch.

## Argumente

- `--comment` — Postet Findings zusätzlich als Inline-Kommentare im offenen PR
- `--fix` — Behebt gefundene Probleme direkt im Code (nur eindeutige Korrekturen)

## Ablauf

### 1. Diff ermitteln

```bash
git diff main..HEAD -- src/
```

Falls der Diff leer ist: Melde dass kein veränderbarer Code gefunden wurde und beende.

### 2. Review durchführen

Analysiere den Diff anhand dieser projektspezifischen Checkliste:

**Korrektheit**
- Stimmt die Lernlogik (Karten-Shuffle, Wiederholung falscher Karten, Fortschrittsbalken)?
- Werden React-Hooks korrekt verwendet (keine Hooks in Bedingungen, korrekte Dependencies in useCallback/useEffect)?
- Gibt es mögliche Endlosschleifen in der TrainingSession-Logik?

**TypeScript**
- Werden alle Props korrekt typisiert?
- Wird `VocabItem` aus `src/data/numbers.ts` importiert statt lokal redefiniert?
- Keine `any`-Typen ohne Begründung?

**Tailwind & Design System**
- Konsistente Verwendung von Tailwind-Klassen (keine gemischte CSS-Datei-Nutzung)?
- Responsive Klassen wo sinnvoll (mobile-first)?
- Farbpalette, Spacing, Border-Radius und Komponenten-Patterns entsprechen `DESIGN_SYSTEM.md`?
  - Buttons: korrekte Variante (primary / secondary / danger / success / ghost / icon)?
  - Karten: `rounded-2xl border-2` mit den definierten Farb-Tokens?
  - Badges: `text-xs font-medium px-2 py-0.5 rounded-full`?
  - Neue Farben außerhalb der Palette ohne Begründung?
  - Abweichungen von definierten Spacing-Tokens (gap-xs bis gap-xl)?

**Daten & Konventionen**
- Neue `VocabItem`-Einträge folgen dem Schema: `id`, `japanese`, `reading`, `meaning`?
- IDs sind eindeutig und folgen der Namenskonvention (z.B. `n1`, `ha`, `kka`)?
- Neue Lektionen sind in `App.tsx` eingetragen?

**Allgemein**
- Keine auskommentierten Code-Blöcke?
- Keine `console.log`-Statements?
- Keine unnötigen Abhängigkeiten oder Imports?

### 3. Ausgabe

Strukturiere das Ergebnis so:

```
## Code Review

### ✅ Gut
- <Was gut ist>

### ⚠️ Hinweise (kein Blocker)
- `Datei:Zeile` — <Beschreibung>

### ❌ Probleme (sollte vor Merge behoben werden)
- `Datei:Zeile` — <Beschreibung>

### Fazit
<Ein Satz: bereit für Merge / nicht bereit>
```

Falls keine Probleme gefunden: Kurzes positives Feedback und "bereit für Merge".

### 4. Mit --comment: PR-Kommentare posten

Falls `--comment` übergeben wurde, lade den offenen PR:
```bash
gh pr list --repo TheRealKoller/japanisch-trainer --head $(git branch --show-current) --json number,url
```

Poste die Findings als PR-Review-Kommentar:
```bash
gh pr review <nr> --comment --body "<findings>" --repo TheRealKoller/japanisch-trainer
```

### 5. Mit --fix: Probleme beheben

Falls `--fix` übergeben wurde, behebe nur eindeutige Probleme (z.B. `console.log` entfernen, fehlende `id` ergänzen). Bei unsicheren Korrekturen frage den User zuerst.

## Hinweise
- Review nur Dateien unter `src/` — keine Konfigurationsdateien
- Sei präzise: Dateiname und Zeilennummer angeben, nicht nur vage Beschreibungen
- Kleine, unbedeutende Stil-Präferenzen nicht als Probleme listen
