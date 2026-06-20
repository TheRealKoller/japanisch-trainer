export interface VocabItem {
  id: string;
  japanese: string;
  reading?: string;  // Kana-Lesung — nur bei Zahlen/Kanji
  romaji: string;    // Romaji-Aussprache
  meaning: string;
}
