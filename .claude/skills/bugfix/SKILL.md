# /bugfix

Workflow zum Untersuchen und Spezifizieren eines unbekannten Bugs. Das Ergebnis ist ein sauberes Bug-Ticket und ein dokumentierter Debug-Branch — kein Merge in main.

## Ablauf

### 1. Bug beschreiben

Stelle dem User folgende Fragen:
- Was ist das beobachtete Verhalten?
- Was wäre das erwartete Verhalten?
- In welchem Kontext tritt der Bug auf (Lektion, Gerät, Browser)?
- Was wurde bereits versucht?

Fasse die Antworten zusammen und bestätige sie mit dem User bevor du weitermachst.

### 2. Debug-Branch anlegen

Erstelle einen Branch nach dem Schema `debug/<kurze-beschreibung>` (2–4 Wörter, Englisch, Kebab-Case):
```bash
git checkout -b debug/<name>
```

Beispiel: `debug/audio-not-playing-ios`

### 3. Untersuchung

Analysiere den Code systematisch: Suche nach möglichen Ursachen basierend auf der Bugbeschreibung. Füge bei Bedarf temporäre Debug-Ausgaben oder Test-Code ein — alle Änderungen sind rein investigativer Natur.

Lege parallel `BUG_INVESTIGATION.md` im Projekt-Root des Branches an und halte sie laufend aktuell:

```markdown
# Bug-Untersuchung: <Titel>

## Problem
**Beobachtet:** <was passiert>
**Erwartet:** <was sollte passieren>
**Kontext:** <Browser, Gerät, OS>

## Reproduktionsschritte
1. ...

## Untersuchungsschritte
- <Schritt> → <Ergebnis>

## Erkenntnisse
<Was wurde herausgefunden>

## Mögliche Ursachen
- <Hypothese> — <Einschätzung>

## Nächste Schritte
- <Was bleibt zu klären>
```

### 4. Stand committen und Branch pushen

```bash
git add -A
git commit -m "debug: <kurze beschreibung der untersuchung>"
git push -u origin debug/<name>
```

Dieser Branch wird **nicht** gemerged. Er dient nur der Dokumentation und späteren Fortsetzung.

Wenn die Untersuchung mehrere Runden braucht, können weitere Commits im selben Branch gemacht werden.

### 5. Bug-Ticket erstellen

Erstelle ein GitHub-Issue mit Label `bug` basierend auf den Erkenntnissen aus `BUG_INVESTIGATION.md`:

```bash
gh issue create \
  --repo TheRealKoller/japanisch-trainer \
  --label bug \
  --title "[Bug] <präziser Titel>" \
  --body "..."
```

Der Issue-Body soll enthalten:
- Beobachtetes vs. erwartetes Verhalten
- Reproduktionsschritte
- Erkenntnisse aus der Untersuchung
- Mögliche Ursachen (falls gefunden)
- Link zum Debug-Branch: `Debug-Branch: \`debug/<name>\``

### 6. Abschluss

Gib dem User aus:
- Issue-URL (für spätere Implementierung)
- Branch-URL (für Fortsetzung der Untersuchung)
- Empfehlung: Sobald die Ursache klar ist, mit `/feature <issue-nr>` zur Implementierung übergehen

## Hinweise
- Keine Änderungen an main oder feature-branches — nur im debug-branch arbeiten
- Temporärer Debug-Code muss als solcher erkennbar sein (Kommentar: `// DEBUG`)
- `BUG_INVESTIGATION.md` immer im Projekt-Root ablegen, nicht in Unterordnern
- Der Workflow kann in mehreren Sessions fortgesetzt werden (debug-branch bleibt bestehen)
- Debug-branches werden manuell gelöscht wenn das Bug-Issue geschlossen ist
