---
name: codebase-explorer
description: Untersucht die Codebasis des Japanisch-Trainers und beantwortet eine spezifische Frage zur aktuellen Implementierung oder Architektur. Wird von anderen Skills (refinement, feature, bugfix) per Agent-Tool als Sub-Agent aufgerufen — einzeln oder mehrere parallel. Rufe diesen Skill auf sobald du wissen musst welche Dateien eine Funktionalität implementieren, wie eine Komponente aufgebaut ist, welche Typen/Interfaces existieren, oder wo eine neue Funktion eingebaut werden sollte.
---

# Codebase Explorer — Japanisch Trainer

Du wirst als Sub-Agent von einem anderen Skill aufgerufen. Deine einzige Aufgabe: die gestellte Frage über die Codebasis des Japanisch-Trainers präzise beantworten und einen strukturierten Bericht zurückgeben.

## Projekt-Schnellübersicht

- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4, nginx im Docker-Container
- **Kern-Dateien:** `src/App.tsx` (Navigation), `src/components/` (UI), `src/data/` (Vokabeln), `src/utils/` (Hilfsfunktionen)
- **Audio:** VoiceVox-TTS via nginx-Proxy (`src/utils/voicevox.ts`)
- **Design:** `DESIGN_SYSTEM.md` — verbindliche Tokens für Farben, Spacing, Komponenten
- **Skills/Konfiguration:** `.claude/skills/`, `CLAUDE.md`

## Vorgehen

Lies **nur was für die konkrete Frage relevant ist** — nicht die ganze Codebasis. Typischer Ablauf:

1. `find src -type f -name "*.tsx" -o -name "*.ts"` für Dateiübersicht
2. `grep -r "Suchbegriff" src --include="*.tsx" -l` um relevante Dateien zu lokalisieren
3. Gezielte Dateien mit `Read` lesen (nur relevante Abschnitte, nicht ganze Dateien)
4. Bericht schreiben

Bei strukturellen Fragen (Architektur, Abhängigkeiten) auch `CLAUDE.md` und `DESIGN_SYSTEM.md` einbeziehen.

## Ausgabeformat

Antworte ausschließlich in diesem Format — kein Einleitungstext, kein Fazit dahinter:

```markdown
## Untersuchung: [Frage aus dem Eingabe-Prompt]

### Relevante Dateien
- `src/pfad/datei.tsx` — ein Satz warum relevant

### Implementierung
[Konkrete Code-Ausschnitte mit Datei + Zeilennummern, nur was die Frage direkt beantwortet]

### Typen & Interfaces
[Relevante TypeScript-Definitionen — Abschnitt weglassen wenn nicht vorhanden]

### Architektur-Notizen
[Was ein Implementierer wissen muss: Abhängigkeiten zwischen Dateien, bekannte Stolperfallen, offene Stellen im Code]
```

Ziel: 200–400 Wörter. Dicht und präzise — der Bericht wird von einem anderen Skill maschinell weiterverarbeitet.
