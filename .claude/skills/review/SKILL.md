---
name: review
description: Projektspezifischer Code-Review für den Japanisch-Trainer. Aktiviere diesen Skill wenn der User `/review` schreibt oder einen Code-Review des aktuellen Feature-Branches anfordert. Delegiert die eigentliche Review-Arbeit an /code-review, das CLAUDE.md und DESIGN_SYSTEM.md automatisch liest.
---

# /review

Projektspezifischer Code-Review. Die eigentliche Arbeit übernimmt `/code-review`, das CLAUDE.md (inkl. Design System-Verweis) automatisch einliest. Dieser Skill liefert zusätzlichen Kontext, der über CLAUDE.md hinausgeht.

## Argumente

- `--comment` — Postet das Review als PR-Kommentar (wird an /code-review weitergegeben)
- `--fix` — Behebt eindeutige lokale Probleme direkt im Code nach dem Review

## Ablauf

### 1. Prüfe ob ein PR offen ist

```bash
git branch --show-current
gh pr list --repo TheRealKoller/japanisch-trainer --head $(git branch --show-current) --json number,url
```

Falls kein offener PR: kurze Meldung und abbrechen.

### 2. Zusätzlichen projektspezifischen Kontext bereitstellen

Lies `DESIGN_SYSTEM.md` und halte folgende Prüfpunkte bereit — sie ergänzen das, was `/code-review` aus CLAUDE.md zieht:

**Design System (`DESIGN_SYSTEM.md`)**
- Button-Varianten: primary / secondary / danger / success / ghost / icon — richtige Klassen verwendet?
- Karten: `rounded-2xl border-2` mit den korrekten Farb-Tokens (indigo-Vorderseite, white Rückseite)?
- Badges: `text-xs font-medium px-2 py-0.5 rounded-full`?
- Spacing: Tokens aus `gap-xs` bis `gap-xl` und `p-8` für Seiten-Padding?
- Neue Farben außerhalb der definierten Palette (indigo, gray, amber, orange, rose, sky, green, red)?

**Lernlogik**
- Karten-Shuffle: Fisher-Yates korrekt implementiert?
- Falsch beantwortete Karten kommen wieder in den Stapel?
- Fortschrittsbalken zählt nur erste richtige Antworten?

**TypeScript & React**
- Keine `any`-Typen ohne Begründung?
- `useCallback`/`useEffect` haben vollständige Dependency-Arrays?
- Keine Hooks in Bedingungen oder Schleifen?

**Datenschema**
- Neue `VocabItem`-Einträge haben alle Felder: `id`, `japanese`, `reading`, `meaning`?
- IDs eindeutig und nach Konvention (z.B. `n1`, `ha`, `kka`)?
- Neue Lektionen in `App.tsx` eingetragen?

### 3. /code-review aufrufen

Rufe `/code-review` auf. Das Plugin liest automatisch CLAUDE.md (inkl. Design System-Verweis) und führt einen Multi-Agent-Review durch. Die obigen Prüfpunkte aus Schritt 2 stehen als Kontext bereit — zitiere sie in deiner Antwort falls `/code-review` danach fragt oder falls du Findings dazu ergänzen willst.

Falls `--comment` übergeben wurde: gib das an `/code-review` weiter.

### 4. Mit --fix

Falls `--fix` übergeben wurde und es eindeutige Fixes gibt (z.B. `console.log` entfernen, fehlende Import ergänzen): direkt beheben, committen.
