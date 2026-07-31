export interface Level {
  level: number;
  ids: string[];
}

// Teilt eine Vokabelliste der Reihe nach in Level fester Größe auf. Levels dienen nur
// noch der Gruppierung auf der Statistikseite (siehe StatsSections.tsx), nicht mehr der
// Freischaltung (Level-Unlock-System entfernt, Issue #143).
export function buildLevels(items: { id: string }[], size: number): Level[] {
  const levels: Level[] = [];
  for (let i = 0; i < items.length; i += size) {
    levels.push({ level: levels.length + 1, ids: items.slice(i, i + size).map((item) => item.id) });
  }
  return levels;
}
