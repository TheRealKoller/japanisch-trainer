import type { VocabItem } from "./types";
import { hiragana } from "./hiragana";
import { katakana } from "./katakana";
import { coreVocab } from "./coreVocab";
import { dailyPhrases } from "./dailyPhrases";
import { travelPhrases } from "./travelPhrases";

// Einzige Quelle für "welche Items gehören zu welcher Lektion" — ersetzt die vormals in
// App.tsx und StatsSections.tsx parallel gepflegten Imports derselben Arrays (Issue #146).
export const lessonItems = {
  hiragana,
  katakana,
  "core-vocab": coreVocab,
  "daily-phrases": dailyPhrases,
  "travel-phrases": travelPhrases,
} satisfies Record<string, VocabItem[]>;

export type VocabLessonId = keyof typeof lessonItems;

export function isVocabLessonId(id: string): id is VocabLessonId {
  return id in lessonItems;
}
