const KANJI_DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const KANA_DIGITS =  ["れい", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"];
const ROMAJI_DIGITS = ["rei", "ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu"];

// Irregular readings for hundreds and thousands
const KANA_HYAKU  = ["", "ひゃく",   "にひゃく",  "さんびゃく", "よんひゃく", "ごひゃく",   "ろっぴゃく", "ななひゃく", "はっぴゃく", "きゅうひゃく"];
const ROMAJI_HYAKU = ["", "hyaku",   "nihyaku",   "sanbyaku",  "yonhyaku",  "gohyaku",   "roppyaku",  "nanahyaku", "happyaku",  "kyuuhyaku"];
const KANA_SEN    = ["", "せん",     "にせん",    "さんぜん",   "よんせん",   "ごせん",     "ろくせん",   "ななせん",   "はっせん",   "きゅうせん"];
const ROMAJI_SEN  = ["", "sen",      "nisen",     "sanzen",    "yonsen",    "gosen",     "rokusen",   "nanasen",   "hassen",    "kyuusen"];

export function numberToKanji(n: number): string {
  if (n === 0) return "零";

  let result = "";
  const man  = Math.floor(n / 10000);
  const rest = n % 10000;

  if (man > 0) result += KANJI_DIGITS[man] + "万";

  const sen  = Math.floor(rest / 1000);
  const hyak = Math.floor((rest % 1000) / 100);
  const juu  = Math.floor((rest % 100) / 10);
  const ichi = rest % 10;

  if (sen  > 0) result += (sen  === 1 && man === 0 ? "" : KANJI_DIGITS[sen]) + "千";
  if (hyak > 0) result += (hyak === 1 ? "" : KANJI_DIGITS[hyak]) + "百";
  if (juu  > 0) result += (juu  === 1 ? "" : KANJI_DIGITS[juu])  + "十";
  if (ichi > 0) result += KANJI_DIGITS[ichi];

  return result;
}

export function numberToHiragana(n: number): string {
  if (n === 0) return "れい / ゼロ";

  let result = "";
  const man  = Math.floor(n / 10000);
  const rest = n % 10000;

  if (man > 0) result += KANA_DIGITS[man] + "まん";

  const sen  = Math.floor(rest / 1000);
  const hyak = Math.floor((rest % 1000) / 100);
  const juu  = Math.floor((rest % 100) / 10);
  const ichi = rest % 10;

  if (sen  > 0) result += KANA_SEN[sen];
  if (hyak > 0) result += KANA_HYAKU[hyak];
  if (juu  > 0) result += (juu === 1 ? "" : KANA_DIGITS[juu]) + "じゅう";
  if (ichi > 0) result += KANA_DIGITS[ichi];

  return result;
}

export function numberToRomaji(n: number): string {
  if (n === 0) return "rei / zero";

  let result = "";
  const man  = Math.floor(n / 10000);
  const rest = n % 10000;

  if (man > 0) result += ROMAJI_DIGITS[man] + "man";

  const sen  = Math.floor(rest / 1000);
  const hyak = Math.floor((rest % 1000) / 100);
  const juu  = Math.floor((rest % 100) / 10);
  const ichi = rest % 10;

  if (sen  > 0) result += ROMAJI_SEN[sen];
  if (hyak > 0) result += ROMAJI_HYAKU[hyak];
  if (juu  > 0) result += (juu === 1 ? "" : ROMAJI_DIGITS[juu]) + "juu";
  if (ichi > 0) result += ROMAJI_DIGITS[ichi];

  return result;
}

// Alternate readings for 4, 7, 9 in context (し/よん, しち/なな, く/きゅう)
export function numberToHiraganaAlt(n: number): string | null {
  const base = numberToHiragana(n);
  const alt = base
    .replace(/よん/g, "し")
    .replace(/なな/g, "しち")
    .replace(/きゅう/g, "く");
  return alt !== base ? alt : null;
}

export function numberToRomajiAlt(n: number): string | null {
  const base = numberToRomaji(n);
  const alt = base
    .replace(/yon/g, "shi")
    .replace(/nana/g, "shichi")
    .replace(/kyuu/g, "ku");
  return alt !== base ? alt : null;
}
