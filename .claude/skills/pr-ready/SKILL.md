# /pr-ready

Führe einen lokalen Qualitätscheck durch und erstelle danach automatisch einen Pull Request.

## Ablauf

### 1. Kontext ermitteln

Aktuellen Branch, verknüpftes Issue und einen eventuell bereits bestehenden PR herausfinden:
```bash
git branch --show-current
git log main..HEAD --oneline
gh pr list --repo TheRealKoller/japanisch-trainer --head $(git branch --show-current) --json number,url,isDraft,title
```

Frage den User nach der Issue-Nummer falls nicht aus dem Branch-Namen erkennbar (z.B. `feature/mein-feature` → frage nach `#nr`).

Falls die `gh pr list`-Abfrage bereits einen PR liefert (Regelfall innerhalb von `/feature`, das in Schritt 1c einen Draft-PR anlegt): Nummer, Draft-Status und Titel notieren — wird in Schritt 4 gebraucht, um den bestehenden PR zu aktualisieren statt einen zweiten anzulegen.

### 2. Qualitätschecks lokal ausführen

Führe diese Schritte der Reihe nach aus und stoppe bei erstem Fehler:

```bash
# TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

Bei **Fehler**: Zeige genau was fehlgeschlagen ist und was zu fixen ist. Erstelle **keinen** PR. Frage den User ob die Fehler behoben werden sollen.

Bei **Erfolg**: Weiter zu Schritt 3.

### 3. PR-Titel und Body vorschlagen

Lade das verknüpfte Issue:
```bash
gh issue view <nr> --repo TheRealKoller/japanisch-trainer
```

Schlage einen PR-Titel vor (knapp, auf Englisch) und einen Body nach diesem Format:

```markdown
## Änderungen
- <Was wurde geändert>

## Hinweise
- <Optionale technische Hinweise>

Closes #<nr>
```

Zeige Titel und Body dem User zur Bestätigung.

### 4. PR erstellen bzw. fertigstellen

Nach Bestätigung, abhängig vom Ergebnis aus Schritt 1:

**Falls bereits ein PR existiert** (Nummer aus Schritt 1 bekannt):
```bash
gh pr edit <pr-nr> --title "<titel>" --body "<body>" --repo TheRealKoller/japanisch-trainer
gh pr ready <pr-nr> --repo TheRealKoller/japanisch-trainer
```
Entfernt damit auch ein eventuelles `WIP:`-Präfix aus dem Titel und markiert den PR als ready-for-review — Voraussetzung dafür, dass der nachfolgende `/review`-Schritt den PR überhaupt prüft (`/code-review` überspringt Draft-PRs und PRs mit `WIP:`-Titel automatisch).

**Falls noch kein PR existiert** (Standalone-Aufruf von `/pr-ready` außerhalb von `/feature`):
```bash
gh pr create \
  --title "<titel>" \
  --body "<body>" \
  --repo TheRealKoller/japanisch-trainer
```

Gib die PR-URL aus.

### 5. CI-Status abwarten (optional)

Frage ob der User auf den CI-Check warten möchte. Falls ja:
```bash
sleep 20 && gh pr checks <pr-nr> --repo TheRealKoller/japanisch-trainer
```

## Hinweise
- Niemals `--draft` Flag ohne explizite Anfrage des Users
- Den PR immer mit `Closes #<nr>` verknüpfen damit das Issue automatisch geschlossen wird
- Wenn kein Issue existiert, PR ohne `Closes` erstellen
