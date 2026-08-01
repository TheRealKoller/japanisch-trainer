export interface VocabItem {
  id: string;
  japanese: string;
  reading?: string;  // Kana-Lesung — nur bei Zahlen/Kanji; bei Verbkonjugation stattdessen
                     // die Kana-Form der konjugierten Antwort (siehe verbConjugation.ts)
  romaji: string;    // Romaji-Aussprache
  meaning: string;
  formLabel?: string; // Gefragte Konjugationsform (z.B. "て-Form") — nur Verbkonjugation, UI-Badge, nicht TTS
}
