export interface VocabItem {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
}

export const hiragana: VocabItem[] = [
  // Vowels
  { id: "ha", japanese: "あ", reading: "a",  meaning: "a" },
  { id: "hi", japanese: "い", reading: "i",  meaning: "i" },
  { id: "hu", japanese: "う", reading: "u",  meaning: "u" },
  { id: "he", japanese: "え", reading: "e",  meaning: "e" },
  { id: "ho", japanese: "お", reading: "o",  meaning: "o" },
  // K-row
  { id: "hka", japanese: "か", reading: "ka", meaning: "ka" },
  { id: "hki", japanese: "き", reading: "ki", meaning: "ki" },
  { id: "hku", japanese: "く", reading: "ku", meaning: "ku" },
  { id: "hke", japanese: "け", reading: "ke", meaning: "ke" },
  { id: "hko", japanese: "こ", reading: "ko", meaning: "ko" },
  // S-row
  { id: "hsa", japanese: "さ", reading: "sa",  meaning: "sa" },
  { id: "hsi", japanese: "し", reading: "shi", meaning: "shi" },
  { id: "hsu", japanese: "す", reading: "su",  meaning: "su" },
  { id: "hse", japanese: "せ", reading: "se",  meaning: "se" },
  { id: "hso", japanese: "そ", reading: "so",  meaning: "so" },
  // T-row
  { id: "hta",  japanese: "た", reading: "ta",  meaning: "ta" },
  { id: "hchi", japanese: "ち", reading: "chi", meaning: "chi" },
  { id: "htsu", japanese: "つ", reading: "tsu", meaning: "tsu" },
  { id: "hte",  japanese: "て", reading: "te",  meaning: "te" },
  { id: "hto",  japanese: "と", reading: "to",  meaning: "to" },
  // N-row
  { id: "hna", japanese: "な", reading: "na", meaning: "na" },
  { id: "hni", japanese: "に", reading: "ni", meaning: "ni" },
  { id: "hnu", japanese: "ぬ", reading: "nu", meaning: "nu" },
  { id: "hne", japanese: "ね", reading: "ne", meaning: "ne" },
  { id: "hno", japanese: "の", reading: "no", meaning: "no" },
  // H-row
  { id: "hha", japanese: "は", reading: "ha", meaning: "ha" },
  { id: "hhi", japanese: "ひ", reading: "hi", meaning: "hi" },
  { id: "hfu", japanese: "ふ", reading: "fu", meaning: "fu" },
  { id: "hhe", japanese: "へ", reading: "he", meaning: "he" },
  { id: "hho", japanese: "ほ", reading: "ho", meaning: "ho" },
  // M-row
  { id: "hma", japanese: "ま", reading: "ma", meaning: "ma" },
  { id: "hmi", japanese: "み", reading: "mi", meaning: "mi" },
  { id: "hmu", japanese: "む", reading: "mu", meaning: "mu" },
  { id: "hme", japanese: "め", reading: "me", meaning: "me" },
  { id: "hmo", japanese: "も", reading: "mo", meaning: "mo" },
  // Y-row
  { id: "hya", japanese: "や", reading: "ya", meaning: "ya" },
  { id: "hyu", japanese: "ゆ", reading: "yu", meaning: "yu" },
  { id: "hyo", japanese: "よ", reading: "yo", meaning: "yo" },
  // R-row
  { id: "hra", japanese: "ら", reading: "ra", meaning: "ra" },
  { id: "hri", japanese: "り", reading: "ri", meaning: "ri" },
  { id: "hru", japanese: "る", reading: "ru", meaning: "ru" },
  { id: "hre", japanese: "れ", reading: "re", meaning: "re" },
  { id: "hro", japanese: "ろ", reading: "ro", meaning: "ro" },
  // W-row + N
  { id: "hwa", japanese: "わ", reading: "wa", meaning: "wa" },
  { id: "hwo", japanese: "を", reading: "wo", meaning: "wo" },
  { id: "hnn", japanese: "ん", reading: "n",  meaning: "n" },
];
