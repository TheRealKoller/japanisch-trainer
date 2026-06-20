# /refinement

Führe ein strukturiertes Refinement-Gespräch für ein neues Feature des Japanisch-Trainers und erstelle danach automatisch ein GitHub Issue.

## Ablauf

1. **Feature erfragen** — Frage den User: Was soll das Feature tun? Wer nutzt es? Was ist der Auslöser?
2. **Klärungsfragen** — Stelle maximal 3 gezielte Rückfragen um Unklarheiten zu beseitigen (Umfang, Edge Cases, Abhängigkeiten zu bestehenden Features)
3. **Zusammenfassung vorlegen** — Zeige dem User eine strukturierte Zusammenfassung:
   - **User Story**: Als [Wer] möchte ich [Was], damit [Warum]
   - **Akzeptanzkriterien**: Liste mit konkreten, testbaren Bedingungen (Checkbox-Format)
   - **Out of Scope**: Was explizit NICHT Teil dieses Features ist
   - **Technische Hinweise**: Relevante Dateien, Abhängigkeiten, mögliche Stolperfallen
4. **Bestätigung** — Frage ob die Zusammenfassung passt oder ob etwas angepasst werden soll
5. **GitHub Issue erstellen** — Erstelle das Issue mit:
   ```
   gh issue create \
     --title "[Feature] <Titel>" \
     --body "<formatierter Body>" \
     --label "enhancement" \
     --repo TheRealKoller/japanisch-trainer
   ```
   Füge das Issue dann dem GitHub Project hinzu:
   ```
   gh project item-add 6 --owner TheRealKoller --url <issue-url>
   ```

## Issue-Format (Body)

```markdown
## User Story
Als [Wer] möchte ich [Was], damit [Warum].

## Akzeptanzkriterien
- [ ] Kriterium 1
- [ ] Kriterium 2

## Out of Scope
- Nicht-Ziel 1

## Technische Hinweise
- Hinweis 1
```

## Hinweise
- Bleib fokussiert: ein Issue = ein abgrenzbares Feature
- Akzeptanzkriterien müssen konkret und überprüfbar sein, keine vagen Formulierungen
- Wenn der User ein zu großes Feature beschreibt, schlage vor es aufzuteilen
