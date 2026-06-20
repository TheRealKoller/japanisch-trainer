# /deploy

Baue das Docker-Image und starte den Container lokal.

## Ablauf

1. **Bestehenden Container stoppen** (falls einer läuft):
   ```bash
   docker stop japanisch-trainer 2>/dev/null || true
   docker rm japanisch-trainer 2>/dev/null || true
   ```

2. **Image bauen**:
   ```bash
   docker build -t japanisch-trainer .
   ```

3. **Container starten**:
   ```bash
   docker run -d --name japanisch-trainer -p 8080:80 japanisch-trainer
   ```

4. **Smoke-Test**:
   ```bash
   sleep 1 && curl -s -o /dev/null -w "%{http_code}" http://localhost:8080
   ```
   - `200` → Erfolgreich, App läuft auf http://localhost:8080
   - Sonst → Container-Logs ausgeben: `docker logs japanisch-trainer`

5. **Ergebnis melden** — URL und ob der Start erfolgreich war.

## Hinweise
- Container heißt immer `japanisch-trainer` (für einfaches Stoppen)
- Port 8080 auf dem Host → Port 80 im Container (nginx)
- Das ist ein lokaler Deploy, kein Produktions-Deploy
