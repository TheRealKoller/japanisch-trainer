import type { VocabItem } from "./types";
import { buildLevels } from "./levels";

// Verbkonjugation — 48 Karten: die 16 Verben aus coreVocab.ts (w57-w72, "Verben I"/"Verben II")
// je einmal in て-Form, ます-Form und Vergangenheit. Literale Daten wie jede andere
// Lektionsdatei (kein Import aus coreVocab.ts) — verbConjugation.test.ts prüft Kanji/Bedeutung
// gegen coreVocab.ts, um Drift zwischen den beiden Lektionen zu erkennen.
//
// Feldbelegung ist für diesen Kartentyp zweckentfremdet: japanese = Grundform (unverändert,
// TTS-sicher), formLabel = gefragte Form (UI-Badge, nicht TTS), reading/romaji = konjugierte
// Antwort, meaning = Bedeutung der Grundform (Kontext auf der Rückseite).
//
// Reihenfolge bewusst formen-blockweise (nicht verb-blockweise): Level 1-2 = て-Form,
// Level 3-4 = ます-Form, Level 5-6 = Vergangenheit (buildLevels(items, 8), 16 Verben / 8 = 2
// Level pro Form) — jedes Level übt so genau eine Konjugationsform.
export const verbConjugation: VocabItem[] = [
  // Level 1 — て-Form (Verben I)
  { id: "v1", japanese: "食べる", formLabel: "て-Form", reading: "たべて",   romaji: "tabete",    meaning: "essen" },
  { id: "v2", japanese: "飲む",   formLabel: "て-Form", reading: "のんで",   romaji: "nonde",     meaning: "trinken" },
  { id: "v3", japanese: "行く",   formLabel: "て-Form", reading: "いって",   romaji: "itte",      meaning: "gehen" },
  { id: "v4", japanese: "来る",   formLabel: "て-Form", reading: "きて",     romaji: "kite",      meaning: "kommen" },
  { id: "v5", japanese: "帰る",   formLabel: "て-Form", reading: "かえって", romaji: "kaette",    meaning: "zurückkehren, heimgehen" },
  { id: "v6", japanese: "見る",   formLabel: "て-Form", reading: "みて",     romaji: "mite",      meaning: "sehen" },
  { id: "v7", japanese: "聞く",   formLabel: "て-Form", reading: "きいて",   romaji: "kiite",     meaning: "hören, fragen" },
  { id: "v8", japanese: "話す",   formLabel: "て-Form", reading: "はなして", romaji: "hanashite", meaning: "sprechen" },
  // Level 2 — て-Form (Verben II)
  { id: "v9",  japanese: "読む",     formLabel: "て-Form", reading: "よんで",         romaji: "yonde",         meaning: "lesen" },
  { id: "v10", japanese: "書く",     formLabel: "て-Form", reading: "かいて",         romaji: "kaite",         meaning: "schreiben" },
  { id: "v11", japanese: "買う",     formLabel: "て-Form", reading: "かって",         romaji: "katte",         meaning: "kaufen" },
  { id: "v12", japanese: "する",     formLabel: "て-Form", reading: "して",           romaji: "shite",         meaning: "machen, tun" },
  { id: "v13", japanese: "勉強する", formLabel: "て-Form", reading: "べんきょうして", romaji: "benkyoushite", meaning: "lernen" },
  { id: "v14", japanese: "寝る",     formLabel: "て-Form", reading: "ねて",           romaji: "nete",          meaning: "schlafen" },
  { id: "v15", japanese: "起きる",   formLabel: "て-Form", reading: "おきて",         romaji: "okite",         meaning: "aufstehen" },
  { id: "v16", japanese: "働く",     formLabel: "て-Form", reading: "はたらいて",     romaji: "hataraite",     meaning: "arbeiten" },
  // Level 3 — ます-Form (Verben I)
  { id: "v17", japanese: "食べる", formLabel: "ます-Form", reading: "たべます",   romaji: "tabemasu",    meaning: "essen" },
  { id: "v18", japanese: "飲む",   formLabel: "ます-Form", reading: "のみます",   romaji: "nomimasu",    meaning: "trinken" },
  { id: "v19", japanese: "行く",   formLabel: "ます-Form", reading: "いきます",   romaji: "ikimasu",     meaning: "gehen" },
  { id: "v20", japanese: "来る",   formLabel: "ます-Form", reading: "きます",     romaji: "kimasu",      meaning: "kommen" },
  { id: "v21", japanese: "帰る",   formLabel: "ます-Form", reading: "かえります", romaji: "kaerimasu",   meaning: "zurückkehren, heimgehen" },
  { id: "v22", japanese: "見る",   formLabel: "ます-Form", reading: "みます",     romaji: "mimasu",      meaning: "sehen" },
  { id: "v23", japanese: "聞く",   formLabel: "ます-Form", reading: "ききます",   romaji: "kikimasu",    meaning: "hören, fragen" },
  { id: "v24", japanese: "話す",   formLabel: "ます-Form", reading: "はなします", romaji: "hanashimasu", meaning: "sprechen" },
  // Level 4 — ます-Form (Verben II)
  { id: "v25", japanese: "読む",     formLabel: "ます-Form", reading: "よみます",       romaji: "yomimasu",         meaning: "lesen" },
  { id: "v26", japanese: "書く",     formLabel: "ます-Form", reading: "かきます",       romaji: "kakimasu",         meaning: "schreiben" },
  { id: "v27", japanese: "買う",     formLabel: "ます-Form", reading: "かいます",       romaji: "kaimasu",          meaning: "kaufen" },
  { id: "v28", japanese: "する",     formLabel: "ます-Form", reading: "します",         romaji: "shimasu",          meaning: "machen, tun" },
  { id: "v29", japanese: "勉強する", formLabel: "ます-Form", reading: "べんきょうします", romaji: "benkyoushimasu", meaning: "lernen" },
  { id: "v30", japanese: "寝る",     formLabel: "ます-Form", reading: "ねます",         romaji: "nemasu",           meaning: "schlafen" },
  { id: "v31", japanese: "起きる",   formLabel: "ます-Form", reading: "おきます",       romaji: "okimasu",          meaning: "aufstehen" },
  { id: "v32", japanese: "働く",     formLabel: "ます-Form", reading: "はたらきます",   romaji: "hatarakimasu",     meaning: "arbeiten" },
  // Level 5 — Vergangenheit (Verben I)
  { id: "v33", japanese: "食べる", formLabel: "Vergangenheit", reading: "たべた",   romaji: "tabeta",    meaning: "essen" },
  { id: "v34", japanese: "飲む",   formLabel: "Vergangenheit", reading: "のんだ",   romaji: "nonda",     meaning: "trinken" },
  { id: "v35", japanese: "行く",   formLabel: "Vergangenheit", reading: "いった",   romaji: "itta",      meaning: "gehen" },
  { id: "v36", japanese: "来る",   formLabel: "Vergangenheit", reading: "きた",     romaji: "kita",      meaning: "kommen" },
  { id: "v37", japanese: "帰る",   formLabel: "Vergangenheit", reading: "かえった", romaji: "kaetta",    meaning: "zurückkehren, heimgehen" },
  { id: "v38", japanese: "見る",   formLabel: "Vergangenheit", reading: "みた",     romaji: "mita",      meaning: "sehen" },
  { id: "v39", japanese: "聞く",   formLabel: "Vergangenheit", reading: "きいた",   romaji: "kiita",     meaning: "hören, fragen" },
  { id: "v40", japanese: "話す",   formLabel: "Vergangenheit", reading: "はなした", romaji: "hanashita", meaning: "sprechen" },
  // Level 6 — Vergangenheit (Verben II)
  { id: "v41", japanese: "読む",     formLabel: "Vergangenheit", reading: "よんだ",         romaji: "yonda",        meaning: "lesen" },
  { id: "v42", japanese: "書く",     formLabel: "Vergangenheit", reading: "かいた",         romaji: "kaita",        meaning: "schreiben" },
  { id: "v43", japanese: "買う",     formLabel: "Vergangenheit", reading: "かった",         romaji: "katta",        meaning: "kaufen" },
  { id: "v44", japanese: "する",     formLabel: "Vergangenheit", reading: "した",           romaji: "shita",        meaning: "machen, tun" },
  { id: "v45", japanese: "勉強する", formLabel: "Vergangenheit", reading: "べんきょうした", romaji: "benkyoushita", meaning: "lernen" },
  { id: "v46", japanese: "寝る",     formLabel: "Vergangenheit", reading: "ねた",           romaji: "neta",         meaning: "schlafen" },
  { id: "v47", japanese: "起きる",   formLabel: "Vergangenheit", reading: "おきた",         romaji: "okita",        meaning: "aufstehen" },
  { id: "v48", japanese: "働く",     formLabel: "Vergangenheit", reading: "はたらいた",     romaji: "hataraita",    meaning: "arbeiten" },
];

export const verbConjugationLevels = buildLevels(verbConjugation, 8);
