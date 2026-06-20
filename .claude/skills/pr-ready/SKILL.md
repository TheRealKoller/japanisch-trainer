# /pr-ready

Führe einen lokalen Qualitätscheck durch und erstelle danach automatisch einen Pull Request.

## Ablauf

### 1. Kontext ermitteln

Aktuellen Branch und verknüpftes Issue herausfinden:
```bash
git branch --show-current
git log main..HEAD --oneline
```

Frage den User nach der Issue-Nummer falls nicht aus dem Branch-Namen erkennbar (z.B. `feature/mein-feature` → frage nach `#nr`).

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

### 4. PR erstellen

Nach Bestätigung:
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
