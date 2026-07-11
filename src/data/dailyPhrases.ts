import type { VocabItem } from "./types";
import { buildLevels } from "./levels";

// Alltags-Floskeln — 40 Wendungen in 5 thematischen Leveln à 8 Karten.
export const dailyPhrases: VocabItem[] = [
  // Level 1 — Begrüßung & Abschied
  { id: "a1", japanese: "おはようございます",                                      romaji: "ohayou gozaimasu",       meaning: "Guten Morgen" },
  { id: "a2", japanese: "こんにちは",                                              romaji: "konnichiwa",             meaning: "Guten Tag / Hallo" },
  { id: "a3", japanese: "こんばんは",                                              romaji: "konbanwa",               meaning: "Guten Abend" },
  { id: "a4", japanese: "おやすみなさい",                                          romaji: "oyasuminasai",           meaning: "Gute Nacht" },
  { id: "a5", japanese: "さようなら",                                              romaji: "sayounara",              meaning: "Auf Wiedersehen" },
  { id: "a6", japanese: "またね",                                                  romaji: "mata ne",                meaning: "Bis bald" },
  { id: "a7", japanese: "はじめまして",                                            romaji: "hajimemashite",          meaning: "Freut mich (beim Kennenlernen)" },
  { id: "a8", japanese: "よろしくお願いします", reading: "よろしくおねがいします", romaji: "yoroshiku onegaishimasu", meaning: "Auf gute Zusammenarbeit (beim Kennenlernen)" },
  // Level 2 — Höflichkeit
  { id: "a9",  japanese: "ありがとうございます",                                          romaji: "arigatou gozaimasu",       meaning: "Vielen Dank" },
  { id: "a10", japanese: "どういたしまして",                                              romaji: "dou itashimashite",        meaning: "Gern geschehen" },
  { id: "a11", japanese: "すみません",                                                    romaji: "sumimasen",                meaning: "Entschuldigung" },
  { id: "a12", japanese: "ごめんなさい",                                                  romaji: "gomen nasai",              meaning: "Es tut mir leid" },
  { id: "a13", japanese: "お願いします",         reading: "おねがいします",               romaji: "onegaishimasu",            meaning: "Bitte (um etwas bitten)" },
  { id: "a14", japanese: "どうぞ",                                                        romaji: "douzo",                    meaning: "Bitte sehr (etwas anbieten)" },
  { id: "a15", japanese: "大丈夫です",           reading: "だいじょうぶです",             romaji: "daijoubu desu",            meaning: "Alles in Ordnung" },
  { id: "a16", japanese: "気にしないでください", reading: "きにしないでください",         romaji: "ki ni shinaide kudasai",   meaning: "Machen Sie sich keine Sorgen" },
  // Level 3 — Gespräch
  { id: "a17", japanese: "はい",                                                            romaji: "hai",                        meaning: "Ja" },
  { id: "a18", japanese: "いいえ",                                                          romaji: "iie",                        meaning: "Nein" },
  { id: "a19", japanese: "わかりました",                                                    romaji: "wakarimashita",              meaning: "Verstanden" },
  { id: "a20", japanese: "わかりません",                                                    romaji: "wakarimasen",                meaning: "Ich verstehe nicht" },
  { id: "a21", japanese: "もう一度お願いします",   reading: "もういちどおねがいします",     romaji: "mou ichido onegaishimasu",   meaning: "Noch einmal, bitte" },
  { id: "a22", japanese: "ゆっくり話してください", reading: "ゆっくりはなしてください",     romaji: "yukkuri hanashite kudasai",  meaning: "Bitte sprechen Sie langsam" },
  { id: "a23", japanese: "お元気ですか",           reading: "おげんきですか",               romaji: "o-genki desu ka",            meaning: "Wie geht es Ihnen?" },
  { id: "a24", japanese: "元気です",               reading: "げんきです",                   romaji: "genki desu",                 meaning: "Mir geht es gut" },
  // Level 4 — Essen
  { id: "a25", japanese: "いただきます",                                                romaji: "itadakimasu",           meaning: "Guten Appetit (vor dem Essen)" },
  { id: "a26", japanese: "ごちそうさまでした",                                          romaji: "gochisousama deshita",  meaning: "Danke für das Essen (nach dem Essen)" },
  { id: "a27", japanese: "おなかがすきました",                                          romaji: "onaka ga sukimashita",  meaning: "Ich habe Hunger" },
  { id: "a28", japanese: "のどがかわきました",                                          romaji: "nodo ga kawakimashita", meaning: "Ich habe Durst" },
  { id: "a29", japanese: "おいしいです",                                                romaji: "oishii desu",           meaning: "Das schmeckt gut" },
  { id: "a30", japanese: "乾杯",               reading: "かんぱい",                     romaji: "kanpai",                meaning: "Prost" },
  { id: "a31", japanese: "何か食べましょう",   reading: "なにかたべましょう",           romaji: "nanika tabemashou",     meaning: "Lass uns etwas essen" },
  { id: "a32", japanese: "おなかがいっぱいです",                                        romaji: "onaka ga ippai desu",   meaning: "Ich bin satt" },
  // Level 5 — Alltag
  { id: "a33", japanese: "いってきます",                                        romaji: "ittekimasu",            meaning: "Ich gehe los (beim Verlassen)" },
  { id: "a34", japanese: "いってらっしゃい",                                    romaji: "itterasshai",           meaning: "Komm gut hin (Antwort auf いってきます)" },
  { id: "a35", japanese: "ただいま",                                            romaji: "tadaima",               meaning: "Ich bin zurück" },
  { id: "a36", japanese: "おかえりなさい",                                      romaji: "okaerinasai",           meaning: "Willkommen zurück" },
  { id: "a37", japanese: "お疲れ様です",       reading: "おつかれさまです",     romaji: "otsukaresama desu",     meaning: "Danke für die Mühe" },
  { id: "a38", japanese: "頑張って",           reading: "がんばって",           romaji: "ganbatte",              meaning: "Viel Erfolg / Streng dich an" },
  { id: "a39", japanese: "おめでとうございます",                                romaji: "omedetou gozaimasu",    meaning: "Herzlichen Glückwunsch" },
  { id: "a40", japanese: "お大事に",           reading: "おだいじに",           romaji: "odaiji ni",             meaning: "Gute Besserung" },
];

export const dailyPhraseLevels = buildLevels(dailyPhrases, 8);
