---
name: feature
description: Workflow für die Implementierung neuer Features und bekannter Bugs. Verwende diesen Skill immer wenn der User `/feature` schreibt, ein Feature implementieren oder einen bekannten Bug fixen will.
---

# /feature

Workflow für die Implementierung neuer Features und bekannter Bugs (wenn das Problem bereits klar ist).

**Wichtig:** Überspringe keinen Schritt, auch wenn die Lösung einfach oder offensichtlich erscheint. Implementiere das Feature niemals selbst — jeder Schritt delegiert an einen spezialisierten Sub-Skill.

## Ablauf

### 1. Issue prüfen

Falls `/feature` mit einer Issue-Nummer aufgerufen wurde (z.B. `/feature 42`), lade das Issue:
```bash
gh issue view <nummer> --repo TheRealKoller/japanisch-trainer
```

Falls keine Nummer angegeben wurde, zeige offene Issues zur Auswahl:
```bash
gh issue list --repo TheRealKoller/japanisch-trainer --state open
```

Frage den User: Gibt es ein passendes Issue (Feature oder Bug)?
- **Ja, Issue #X** → direkt zu Schritt 2
- **Nein** → weiter mit Schritt 1b

### 1b. Kein Issue vorhanden → /refinement

Rufe jetzt den `refinement`-Skill auf — verwende dazu das Skill-Tool mit `skill: "refinement"`. Warte auf den vollständigen Abschluss. Die neue Issue-Nummer liegt danach vor — weiter mit Schritt 1c.

### 1c. Branch erstellen und Draft-PR anlegen

Branch immer von `main` aus erstellen:
```bash
git checkout main && git pull origin main
git checkout -b feature/<kurzname>
```

Einen leeren initialen Commit erstellen (damit der PR sofort angelegt werden kann):
```bash
git commit --allow-empty -m "chore: start feature/<kurzname>"
git push -u origin feature/<kurzname>
```

Draft-PR erstellen und mit dem Issue verknüpfen:
```bash
gh pr create \
  --draft \
  --title "WIP: <kurzer Titel aus dem Issue>" \
  --body "Closes #<issue-nr>" \
  --repo TheRealKoller/japanisch-trainer
```

### 2. Feature entwickeln

Rufe jetzt den `feature-dev:feature-dev`-Skill auf — verwende dazu das Skill-Tool mit `skill: "feature-dev:feature-dev"`. Übergib die Issue-Nummer als Kontext im Prompt. Implementiere das Feature nicht selbst. Warte auf den vollständigen Abschluss bevor du weitergehst.

### 3. Code Review

Rufe jetzt den `review`-Skill auf — verwende dazu das Skill-Tool mit `skill: "review"`. Warte auf den Abschluss und adressiere kritische Findings bevor du weitergehst.

### 4. PR erstellen

Rufe jetzt den `pr-ready`-Skill auf — verwende dazu das Skill-Tool mit `skill: "pr-ready"`. Stelle sicher dass der PR mit `Closes #<nr>` verknüpft wird.

## Hinweise
- Branch immer von `main` aus erstellen, nie von einem anderen Feature-Branch
- Kein Schritt darf übersprungen werden — auch nicht bei einfachen Änderungen
- Die Implementierung gehört ausschließlich in Schritt 2 (`feature-dev:feature-dev`)
