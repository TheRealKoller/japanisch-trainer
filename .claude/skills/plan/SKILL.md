# /plan

Erstelle einen konkreten Implementierungsplan für ein Feature aus dem GitHub-Backlog.

## Ablauf

1. **Issue holen** — Wenn ein Issue-Nummer als Argument übergeben wurde (z.B. `/plan 3`), lade es:
   ```
   gh issue view <nummer> --repo TheRealKoller/japanisch-trainer
   ```
   Sonst: zeige offene Issues zur Auswahl:
   ```
   gh issue list --repo TheRealKoller/japanisch-trainer --state open
   ```

2. **Codebase analysieren** — Lies relevante Dateien aus `src/` um Abhängigkeiten und Einstiegspunkte zu verstehen

3. **Plan erstellen** — Strukturierter Plan mit:
   - **Ziel**: Ein Satz was am Ende anders ist
   - **Betroffene Dateien**: Welche Dateien werden geändert/neu angelegt
   - **Implementierungsschritte**: Nummerierte Liste, jeder Schritt atomar und testbar
   - **Risiken**: Was könnte schiefgehen, was braucht besondere Aufmerksamkeit
   - **Geschätzte Komplexität**: Klein / Mittel / Groß

4. **Bestätigung** — Frage ob der Plan passt bevor mit der Implementierung begonnen wird

## Hinweise
- Plane nur was das Issue beschreibt — kein Goldplating
- Schritte so klein wie möglich, so groß wie nötig
- Bei Unklarheiten lieber nachfragen als annehmen
