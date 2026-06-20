Starte den Vite Dev-Server und zeige die App im Browser.

## Ablauf

1. **Prüfe ob Dev-Server läuft**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
   ```
   - Gibt `200` zurück → Server läuft bereits, direkt zu Schritt 3
   - Sonst → Schritt 2

2. **Dev-Server starten** (im Hintergrund):
   ```bash
   npm run dev -- --port 5173
   ```
   Warte bis der Server antwortet (max. 10 Sekunden).

3. **Screenshot aufnehmen** mit dem verfügbaren Browser-Tool und zeige ihn dem User.
   Navigiere dabei zur Startseite: `http://localhost:5173`

4. **Kurzes Feedback** — Beschreibe in 1-2 Sätzen was zu sehen ist und ob es wie erwartet aussieht.

## Hinweise
- Port ist immer 5173 (Vite-Standard)
- Dev-Server läuft im Hintergrund weiter bis der User ihn stoppt
