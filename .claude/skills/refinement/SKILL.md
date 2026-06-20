---
name: refinement
description: Führe ein strukturiertes Refinement-Gespräch für den Japanisch-Trainer und erstelle oder überarbeite danach ein GitHub Issue. Unterstützt neue Issues (feature/bug/refactor) und bestehende Issues die verbessert werden sollen. Verwende diesen Skill immer wenn der User ein Feature, einen Bug oder eine Refaktorierung besprechen möchte, ein GitHub Issue erstellen oder überarbeiten will, oder `/refinement` schreibt – auch mit einer Issue-Nummer wie `/refinement #42`.
---

# /refinement

Strukturiertes Refinement-Gespräch → GitHub Issue erstellen oder überarbeiten.

## Einstieg

Wurde eine Issue-Nummer übergeben (z.B. `/refinement #42`)?

- **Ja** → Issue laden und analysieren (→ "Bestehendes Issue")
- **Nein** → Frage: "Möchtest du ein neues Issue erstellen oder ein bestehendes überarbeiten?"
  - Bestehendes: Issue-Nummer erfragen, dann → "Bestehendes Issue"
  - Neues: → "Neues Issue"

## Neues Issue

1. Frage: "Was soll das Feature / der Bug / die Refaktorierung bewirken?"
2. Leite den **Typ** aus der Antwort ab (feature / bug / refactor). Wenn unklar: nachfragen.
3. Stelle gezielte Rückfragen um offene Punkte zu klären — **immer nur eine Frage auf einmal**. Typische Themen:
   - Wer ist betroffen, was löst es aus?
   - Abhängigkeiten zu anderen Issues?
   - Was ist explizit nicht Teil dieses Issues?
   - (Bei Bugs) Wie wird es reproduziert?
4. Zeige Zusammenfassung im Issue-Format (→ unten)
5. Frage: "Passt das so, oder soll etwas angepasst werden?"
6. Issue erstellen (→ GitHub-Kommandos)

## Bestehendes Issue

1. Issue laden:
   ```bash
   gh issue view <nummer> --json number,title,body,labels
   ```
2. Prüfe das Issue gegen das Issue-Format (→ unten). Was fehlt, ist vage oder stimmt nicht?
3. Kläre fehlende Informationen durch Rückfragen — **immer nur eine Frage auf einmal**.
4. Zeige überarbeitete Zusammenfassung im Issue-Format.
5. Frage: "Passt das so, oder soll etwas angepasst werden?"
6. Issue aktualisieren (→ GitHub-Kommandos)

## Issue-Format

### Feature

```markdown
## User Story
Als [Wer] möchte ich [Was], damit [Warum].

## Akzeptanzkriterien
- [ ] Kriterium 1
- [ ] Kriterium 2

## Out of Scope
- Nicht-Ziel 1

## Technische Hinweise
- Betroffene Dateien / Komponenten
- Potenzielle Stolperfallen

## Abhängigkeiten
- Hängt ab von #X
- Blockiert #Y
```

### Bug

```markdown
## Beschreibung
[Was geht falsch – ein Satz]

## Reproduktionsschritte
1. Schritt 1
2. Schritt 2

## Erwartetes Verhalten
[Was sollte passieren]

## Tatsächliches Verhalten
[Was passiert stattdessen]

## Akzeptanzkriterien
- [ ] Bug tritt nicht mehr auf
- [ ] Weitere Kriterien falls nötig

## Technische Hinweise
- Betroffene Dateien / Komponenten

## Abhängigkeiten
- Hängt ab von #X
```

### Refactor

```markdown
## Motivation
[Warum wird refaktoriert]

## Umfang
- Was genau ändert sich
- Was bleibt unverändert

## Akzeptanzkriterien
- [ ] Kriterium 1
- [ ] Alle bestehenden Tests bestehen weiterhin

## Technische Hinweise
- Betroffene Dateien / Komponenten

## Abhängigkeiten
- Hängt ab von #X
```

*Den Abschnitt "Abhängigkeiten" weglassen, wenn keine vorhanden.*

## Qualitätskriterien für Issues

- Checklisten statt Fließtext — so knapp wie möglich, so ausführlich wie nötig
- Akzeptanzkriterien sind konkret und überprüfbar (kein "funktioniert gut")
- Ein Issue = ein abgrenzbares Problem; bei zu großem Scope aufteilen vorschlagen
- Abhängigkeiten zwischen Issues immer in beide Richtungen vermerken

## GitHub-Kommandos

**Neues Issue erstellen:**
```bash
gh issue create \
  --title "[Feature|Bug|Refactor] <Titel>" \
  --body "<formatierter Body>" \
  --label "feature|bug|refactor" \
  --repo TheRealKoller/japanisch-trainer
```

Dann dem Projekt hinzufügen:
```bash
gh project item-add 6 --owner TheRealKoller --url <issue-url>
```

**Bestehendes Issue aktualisieren:**
```bash
gh issue edit <nummer> \
  --title "[Feature|Bug|Refactor] <Titel>" \
  --body "<formatierter Body>" \
  --add-label "feature|bug|refactor" \
  --repo TheRealKoller/japanisch-trainer
```
