---
name: run
description: Startet die App lokal via docker compose (neu bauen + starten) und zeigt sie im Browser. Verwende diesen Skill wenn der User `/run` schreibt, die App lokal starten oder neu starten möchte.
---

# /run

Startet die App via `docker compose up --build` und öffnet sie im Browser.

## Ablauf

1. **Prüfe ob docker compose verfügbar ist**:
   ```bash
   docker compose version
   ```
   Schlägt fehl → Fehlermeldung ausgeben: "`docker compose` ist nicht installiert. Bitte Docker Desktop installieren: https://docs.docker.com/desktop/" — Abbruch.

2. **Laufende Container stoppen** (falls vorhanden):
   ```bash
   docker compose ps --services --filter "status=running"
   ```
   Hat die Ausgabe Inhalt → stoppen:
   ```bash
   docker compose down
   ```

3. **Neu bauen und starten** (im Hintergrund):
   ```bash
   docker compose up --build -d
   ```

4. **Warten bis die App erreichbar ist** (max. 120 Sekunden, alle 5 Sekunden prüfen):
   ```bash
   curl -sf http://localhost:8080 > /dev/null
   ```
   Solange kein 200 → kurz warten und erneut prüfen. Nach 120 Sekunden ohne Antwort: Fehlermeldung "App nicht erreichbar — prüfe `docker compose logs app`".

5. **Screenshot aufnehmen** und dem User zeigen.
   Startseite: `http://localhost:8080`

6. **Kurzes Feedback** — 1-2 Sätze was zu sehen ist.

## Hinweise
- App läuft unter `http://localhost:8080` (konfiguriert via `APP_PORT` in `docker-compose.yml`, Standard: 8080)
- Erster Start dauert länger: VoiceVox-Image wird heruntergeladen und braucht ~60 Sekunden zum Initialisieren
- `docker compose down` stoppt alle Services (App + VoiceVox)
