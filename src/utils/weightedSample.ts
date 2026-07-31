// Gewichtete Ziehung ohne Zurücklegen (Efraimidis-Spirakis A-Res-Verfahren): jedem Item
// wird ein Schlüssel random()^(1/Gewicht) zugewiesen, absteigend sortiert, die obersten
// `count` gewinnen. Höheres Gewicht → tendenziell höherer Schlüssel → höhere Ziehwahr-
// scheinlichkeit, ohne Duplikate und ohne den O(n²)-Aufwand von "ziehen, entfernen,
// wiederholen". Gewichte müssen > 0 sein (sonst 1/Gewicht = Infinity).
export function weightedSampleWithoutReplacement<T>(
  pool: T[],
  weightOf: (item: T) => number,
  count: number,
): T[] {
  if (count >= pool.length) return pool;
  return pool
    .map((item) => ({ item, key: Math.random() ** (1 / weightOf(item)) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, count)
    .map((entry) => entry.item);
}
