export interface Level {
  level: number;
  ids: string[];
}

// Teilt eine Vokabelliste der Reihe nach in Level fester Größe auf.
export function buildLevels(items: { id: string }[], size: number): Level[] {
  const levels: Level[] = [];
  for (let i = 0; i < items.length; i += size) {
    levels.push({ level: levels.length + 1, ids: items.slice(i, i + size).map((item) => item.id) });
  }
  return levels;
}

// Kumulativ (Kana): alle Karten bis einschließlich targetLevel.
// Nicht kumulativ (Vokabeln/Floskeln): nur die Karten des gewählten Levels.
export function itemsForLevel<T extends { id: string }>(
  items: T[],
  levels: Level[],
  targetLevel: number,
  cumulative: boolean,
): T[] {
  const ids = new Set(
    levels
      .filter((l) => (cumulative ? l.level <= targetLevel : l.level === targetLevel))
      .flatMap((l) => l.ids),
  );
  return items.filter((item) => ids.has(item.id));
}
