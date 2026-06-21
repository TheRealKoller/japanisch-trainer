export interface LevelConfig {
  level: number;
  max: number;
  threshold: number;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, max: 10,    threshold: 1.00 },
  { level: 2, max: 100,   threshold: 0.75 },
  { level: 3, max: 1000,  threshold: 0.50 },
  { level: 4, max: 10000, threshold: 0.25 },
  { level: 5, max: 99999, threshold: 0.10 },
];

export interface LevelRecord {
  sessions: number;
  totalCards: number;
  firstTryCorrect: number;
}

export interface QuizStats {
  currentLevel: number;
  levelRecords: Partial<Record<number, LevelRecord>>;
  digitErrors: Partial<Record<number, number>>;
  recentWrongNumbers: number[];
}

const STORAGE_KEY = "japanisch-trainer:quiz-stats";
const MAX_WRONG_NUMBERS = 20;

const DEFAULT_STATS: QuizStats = {
  currentLevel: 1,
  levelRecords: {},
  digitErrors: {},
  recentWrongNumbers: [],
};

export function loadStats(): QuizStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...(JSON.parse(raw) as Partial<QuizStats>) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: QuizStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore storage quota errors
  }
}

export function extractDigits(n: number): number[] {
  return String(n).split("").map(Number);
}

export function recordSession(
  stats: QuizStats,
  level: number,
  wrongIds: Set<number>,
  quizSize: number,
): QuizStats {
  const firstTryCorrect = quizSize - wrongIds.size;

  const prev = stats.levelRecords[level] ?? { sessions: 0, totalCards: 0, firstTryCorrect: 0 };
  const levelRecords = {
    ...stats.levelRecords,
    [level]: {
      sessions: prev.sessions + 1,
      totalCards: prev.totalCards + quizSize,
      firstTryCorrect: prev.firstTryCorrect + firstTryCorrect,
    },
  };

  const digitErrors = { ...stats.digitErrors } as Record<number, number>;
  for (const n of wrongIds) {
    for (const digit of extractDigits(n)) {
      digitErrors[digit] = (digitErrors[digit] ?? 0) + 1;
    }
  }

  const recentWrongNumbers = [
    ...Array.from(wrongIds),
    ...stats.recentWrongNumbers,
  ].slice(0, MAX_WRONG_NUMBERS);

  const levelConfig = LEVELS[level - 1];
  const leveledUp = level < 5 && firstTryCorrect / quizSize >= levelConfig.threshold;

  return {
    currentLevel: leveledUp ? level + 1 : level,
    levelRecords,
    digitErrors,
    recentWrongNumbers,
  };
}
