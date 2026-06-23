---
name: challenge
description: Hinterfrage eine Idee, ein geplantes Feature oder einen Bug-Fix kritisch (Devil's Advocate), decke Schwachstellen und Risiken auf, und erarbeite gemeinsam eine verbesserte Version die dann als GitHub Issue landet. Verwende diesen Skill immer wenn der User /challenge schreibt, eine Idee oder ein Konzept kritisch prüfen lassen möchte, fragt "Ist das eine gute Idee?", "Macht das Sinn?", "Lohnt sich das?", oder bevor er ein Feature formalisiert.
---

# /challenge

Kritische Ideenprüfung → verbesserte Version → GitHub Issue (via `/refinement`).

## Einstieg

Der User hat eine Idee beschrieben. Starte **sofort parallel**:

1. Spawne Codebase-Analyse-Agent(en) (→ "Codebase-Analyse")
2. Formuliere inzwischen die Challenger-Fragen (→ "Challenge-Runde")

## Codebase-Analyse

Direkt nach der ersten User-Beschreibung, parallel zur eigenen Vorbereitung:

```
Agent(
  description: "Challenge-Analyse: [Thema]",
  prompt: "Lies .claude/skills/codebase-explorer/SKILL.md und beantworte dann: [spezifische Frage zur aktuellen Implementierung]"
)
```

Typische Fragen an den Agent:
- Gibt es bereits ähnliche Funktionalität? Wo?
- Welche Dateien/Komponenten wären betroffen?
- Was könnte mit der vorgeschlagenen Änderung brechen?

Ergebnisse fließen in die Challenge-Fragen ein: Widersprüche zwischen Wunsch und Realität benennen, konkrete Dateinamen einbauen.

## Challenge-Runde

Stelle **3–5 gezielte, unbequeme Fragen/Einwände** — nicht freundlich-bestätigend, sondern ehrlich kritisch. Jede Challenge soll eine echte Schwachstelle oder ein ungeprüftes Annahme aufdecken.

**Welche Winkel lohnen sich?**

- **Notwendigkeit** — Welches konkrete Problem löst das? Wer hat dieses Problem wirklich? Passiert es oft genug, um den Aufwand zu rechtfertigen?
- **Einfachheit** — Gibt es einen einfacheren Weg zum gleichen Ziel? Das Projekt ist bewusst simpel gehalten (kein Backend, keine Persistenz) — bricht diese Idee dieses Prinzip?
- **Scope** — Wo hört dieses Feature auf und fängt das nächste an? Ist es ein Issue oder drei?
- **Annahmen** — Was wird als selbstverständlich angenommen, das sich als falsch herausstellen könnte?
- **Lernwert** — Hilft das dem User beim Japanisch lernen, oder ist es nur nett-zu-haben?
- **Komplexität vs. Nutzen** — Wie hoch ist der Implementierungsaufwand? Steht er im Verhältnis zum Mehrwert?
- **Codebase-Widersprüche** — Was zeigt die Analyse, das gegen die Idee spricht?

Nicht alle Winkel sind bei jeder Idee relevant — wähle die 3–5 die am meisten treffen. Formuliere sie als konkrete Einwände, keine allgemeinen "Was denkst du über..."-Fragen.

**Beispiel — Feature "Lernstatistik speichern":**
> 1. Das Projekt speichert bewusst nichts (CLAUDE.md: "Kein Backend, kein Persistenz"). LocalStorage wäre ein Paradigmenwechsel — ist das gewollt?
> 2. Wer schaut sich Statistiken an? Nutzer die nur 5 Minuten täglich lernen oder echte Power-User? Wir kennen das Nutzungsverhalten nicht.
> 3. Was zählt als "gelernt"? Einmal richtig beantwortet, dreimal hintereinander, oder nach Leitner-System?

## User-Verteidigung

Der User antwortet auf die Challenges. Höre aktiv zu:

- **Gute Antwort** → Hake ab, stelle keine Folgefrage dazu
- **Vage oder ausweichend** → Eine gezielte Nachfrage, maximal
- **"Stimmt, daran hatte ich nicht gedacht"** → Notiere als offenen Punkt

Maximal **eine Runde** Nachfragen — das ist kein Verhör, sondern eine Schärfungsübung.

## Synthese

Nach der Verteidigung: Fasse zusammen was die Idee überlebt hat und was neu gedacht werden muss.

**Format:**

```
## Was den Challenge bestanden hat
- [Kern der Idee der stark ist]
- [Annahmen die sich als valide erwiesen haben]

## Was überarbeitet werden sollte
- [Schwachstelle] → Vorschlag wie man damit umgeht
- [Offener Punkt] → Mögliche Lösung oder bewusste Einschränkung

## Empfehlung
[Ein Satz: Lohnt sich das Issue? Aufteilen? Erst validieren?]
```

Wenn die Idee grundlegend schwach ist: Sag das klar. Manchmal ist "nicht bauen" die beste Antwort.

## Übergabe an /refinement

Frage am Ende:

> "Soll ich das jetzt an `/refinement` übergeben, damit wir ein sauberes GitHub Issue daraus machen?"

- **Ja** → Starte `/refinement` mit der überarbeiteten Idee als Kontext. Übergib explizit: was die ursprüngliche Idee war, was beim Challenge herausgekommen ist, und was die beschlossenen Einschränkungen sind.
- **Nein / Noch nicht** → Beende mit der Synthese. Der User kann jederzeit selbst `/refinement` aufrufen.

## Tonalität

Sei direkt und ehrlich, nicht höflich-ausweichend. Ein guter Challenge-Partner sagt "Das überzeugt mich nicht, weil..." — nicht "Interessanter Gedanke, aber vielleicht könnte man auch...".

Gleichzeitig: Das Ziel ist eine **bessere Idee**, nicht eine zerstörte. Jeder Einwand soll konstruktiv sein — "das schwächt die Idee" ist nur nützlich wenn du auch sagst wie man es stärken könnte.
