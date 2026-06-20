export interface VocabItem {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
}

export const numbers: VocabItem[] = [
  { id: "n0",  japanese: "零",  reading: "れい / ゼロ", meaning: "0" },
  { id: "n1",  japanese: "一",  reading: "いち",        meaning: "1" },
  { id: "n2",  japanese: "二",  reading: "に",          meaning: "2" },
  { id: "n3",  japanese: "三",  reading: "さん",        meaning: "3" },
  { id: "n4",  japanese: "四",  reading: "し / よん",   meaning: "4" },
  { id: "n5",  japanese: "五",  reading: "ご",          meaning: "5" },
  { id: "n6",  japanese: "六",  reading: "ろく",        meaning: "6" },
  { id: "n7",  japanese: "七",  reading: "しち / なな", meaning: "7" },
  { id: "n8",  japanese: "八",  reading: "はち",        meaning: "8" },
  { id: "n9",  japanese: "九",  reading: "く / きゅう", meaning: "9" },
  { id: "n10", japanese: "十",  reading: "じゅう",      meaning: "10" },
  { id: "n100",japanese: "百",  reading: "ひゃく",      meaning: "100" },
  { id: "n1k", japanese: "千",  reading: "せん",        meaning: "1.000" },
  { id: "n10k",japanese: "万",  reading: "まん",        meaning: "10.000" },
];
