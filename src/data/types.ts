export interface VocabItem {
  id: string;
  japanese: string;
  reading?: string;  // Kana-Lesung — nur bei Zahlen/Kanji
  romaji: string;    // Romaji-Aussprache
  meaning: string;
  formLabel?: string; // Gefragte Konjugationsform (z.B. "て-Form") — nur Verbkonjugation, UI-Badge, nicht TTS
}
