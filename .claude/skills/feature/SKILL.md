# /feature

Workflow für die Implementierung neuer Features und bekannter Bugs (wenn das Problem bereits klar ist).

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

Rufe `/refinement` auf. Dieser Skill führt ein strukturiertes Gespräch und erstellt am Ende ein GitHub-Issue. Die neue Issue-Nummer liegt danach vor — weiter mit Schritt 1c.

### 1c. Branch erstellen und Issue auf "In Progress" setzen

Branch immer von `main` aus erstellen:
```bash
git checkout main && git pull origin main
git checkout -b feature/<kurzname>
```

Issue im GitHub Project auf "In Progress" setzen:
```bash
# Item-ID des Issues im Project ermitteln
ITEM_ID=$(gh project item-list 6 --owner TheRealKoller --format json \
  | python3 -c "import json,sys; items=json.load(sys.stdin)['items']; \
    print(next(i['id'] for i in items if i['content'].get('number') == <issue-nr>))")

# Status auf "In Progress" setzen
gh project item-edit \
  --id "$ITEM_ID" \
  --field-id PVTSSF_lAHOAdvbTs4BbM1pzhV_Dbk \
  --project-id 6 \
  --single-select-option-id 47fc9ee4
```

### 2. Feature entwickeln → /feature-dev:feature-dev

Rufe `/feature-dev:feature-dev` auf. Übergib die Issue-Nummer als Kontext.

Dieser Skill deckt ab:
- Codebase-Exploration
- Klärende Fragen
- Architektur-Entscheidung
- Implementierung
- Quality Review

Warte auf den vollständigen Abschluss bevor du weitergehst.

### 3. Code Review → /code-review:code-review

Rufe `/code-review:code-review` auf dem aktuellen Branch auf.

Warte auf den Abschluss und adressiere kritische Findings bevor du weitergehst.

### 4. PR erstellen → /pr-ready

Rufe `/pr-ready` auf. Stelle sicher dass der PR mit `Closes #<nr>` verknüpft wird.

## Hinweise
- Dieser Workflow gilt für Features und Bug-Issues, bei denen das Problem und die Lösung bereits klar sind
- Issue kann ein Feature-Issue oder ein Bug-Issue sein
- Branch immer von `main` aus erstellen, nie von einem anderen Feature-Branch
- Warte nach jedem Schritt auf den Abschluss bevor du weitermachst
