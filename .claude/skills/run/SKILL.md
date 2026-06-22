---
name: run
description: Startet die App lokal und zeigt die URL. Verwende diesen Skill wenn der User `/run` schreibt, die App lokal starten oder neu starten möchte. Unterstützt zwei Modi: Docker (Standard) und Vite Dev-Server (schnell, für reine Frontend-Entwicklung).
---

# /run

Startet die App lokal und gibt die URL aus.

## Modi

- **`/run`** — Docker-Build (nginx, produktionsnah, Standard)
- **`/run dev`** — Vite Dev-Server (schnell, HMR, nur Frontend)

---

## Docker-Modus (Standard)

### 1. docker compose verfügbar?

```bash
docker compose version
```

Schlägt fehl → Fehlermeldung: "`docker compose` ist nicht installiert." — Abbruch.

### 2. Laufende Container stoppen

```bash
docker compose ps --services --filter "status=running"
```

Hat die Ausgabe Inhalt → stoppen:

```bash
docker compose down
```

### 3. Bauen und starten

```bash
docker compose up --build -d
```

### 4. Warten bis erreichbar (max. 120 Sekunden)

```bash
until curl -sf http://localhost:8080 > /dev/null; do sleep 3; done
```

Nach 120 Sekunden ohne Antwort:

```bash
docker compose logs --tail=30
```

Logs ausgeben und Fehlermeldung: "App nicht erreichbar — siehe Logs oben."

### 5. URL ausgeben

```
App läuft unter: http://localhost:8080
```

---

## Dev-Modus (`/run dev`)

Startet den Vite Dev-Server direkt (kein Docker, kein Build, ~1 Sekunde Startzeit).

### 1. Abhängigkeiten installiert?

```bash
test -d node_modules || npm install
```

### 2. Dev-Server starten

```bash
npm run dev
```

Warte auf die Ausgabe `Local:` im Terminal (Vite gibt die URL selbst aus).

### 3. URL ausgeben

Vite gibt die URL direkt aus (typisch `http://localhost:5173`). Diese dem User zeigen.

**Hinweis:** Im Dev-Modus läuft kein VoiceVox — TTS funktioniert nicht.

---

## Hinweise

- Docker-App läuft unter `http://localhost:8080`
- `docker compose down` stoppt alle Services (App + VoiceVox)
- Erster Docker-Start dauert länger wenn VoiceVox noch nicht gecacht ist (~60s)
