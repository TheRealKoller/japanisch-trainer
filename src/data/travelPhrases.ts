import type { VocabItem } from "./types";
import { buildLevels } from "./levels";

// Reise-Floskeln — 40 Wendungen in 5 thematischen Leveln à 8 Karten.
export const travelPhrases: VocabItem[] = [
  // Level 1 — Grundlagen
  { id: "r1", japanese: "トイレはどこですか",                                                romaji: "toire wa doko desu ka",         meaning: "Wo ist die Toilette?" },
  { id: "r2", japanese: "駅はどこですか",           reading: "えきはどこですか",             romaji: "eki wa doko desu ka",           meaning: "Wo ist der Bahnhof?" },
  { id: "r3", japanese: "いくらですか",                                                      romaji: "ikura desu ka",                 meaning: "Wie viel kostet das?" },
  { id: "r4", japanese: "これをください",                                                    romaji: "kore o kudasai",                meaning: "Das hier, bitte" },
  { id: "r5", japanese: "英語を話せますか",         reading: "えいごをはなせますか",         romaji: "eigo o hanasemasu ka",          meaning: "Sprechen Sie Englisch?" },
  { id: "r6", japanese: "日本語が少しできます",     reading: "にほんごがすこしできます",     romaji: "nihongo ga sukoshi dekimasu",   meaning: "Ich kann ein bisschen Japanisch" },
  { id: "r7", japanese: "ゆっくりお願いします",     reading: "ゆっくりおねがいします",       romaji: "yukkuri onegaishimasu",         meaning: "Langsam, bitte" },
  { id: "r8", japanese: "写真を撮ってもいいですか", reading: "しゃしんをとってもいいですか", romaji: "shashin o totte mo ii desu ka", meaning: "Darf ich ein Foto machen?" },
  // Level 2 — Unterwegs
  { id: "r9",  japanese: "切符",                   reading: "きっぷ",                       romaji: "kippu",                          meaning: "Fahrkarte" },
  { id: "r10", japanese: "電車は何時に来ますか",   reading: "でんしゃはなんじにきますか",   romaji: "densha wa nanji ni kimasu ka",   meaning: "Wann kommt der Zug?" },
  { id: "r11", japanese: "空港",                   reading: "くうこう",                     romaji: "kuukou",                         meaning: "Flughafen" },
  { id: "r12", japanese: "タクシーを呼んでください", reading: "タクシーをよんでください",   romaji: "takushii o yonde kudasai",       meaning: "Bitte rufen Sie ein Taxi" },
  { id: "r13", japanese: "ここで止めてください",   reading: "ここでとめてください",         romaji: "koko de tomete kudasai",         meaning: "Bitte halten Sie hier" },
  { id: "r14", japanese: "まっすぐ行ってください", reading: "まっすぐいってください",       romaji: "massugu itte kudasai",           meaning: "Gehen Sie geradeaus" },
  { id: "r15", japanese: "右に曲がってください",   reading: "みぎにまがってください",       romaji: "migi ni magatte kudasai",        meaning: "Biegen Sie rechts ab" },
  { id: "r16", japanese: "左に曲がってください",   reading: "ひだりにまがってください",     romaji: "hidari ni magatte kudasai",      meaning: "Biegen Sie links ab" },
  // Level 3 — Hotel
  { id: "r17", japanese: "予約しています",             reading: "よやくしています",                 romaji: "yoyaku shite imasu",             meaning: "Ich habe eine Reservierung" },
  { id: "r18", japanese: "チェックインお願いします",   reading: "チェックインおねがいします",       romaji: "chekkuin onegaishimasu",         meaning: "Check-in, bitte" },
  { id: "r19", japanese: "部屋",                       reading: "へや",                             romaji: "heya",                           meaning: "Zimmer" },
  { id: "r20", japanese: "鍵",                         reading: "かぎ",                             romaji: "kagi",                           meaning: "Schlüssel" },
  { id: "r21", japanese: "Wi-Fiはありますか",          reading: "ワイファイはありますか",           romaji: "waifai wa arimasu ka",           meaning: "Gibt es WLAN?" },
  { id: "r22", japanese: "朝食は何時ですか",           reading: "ちょうしょくはなんじですか",       romaji: "choushoku wa nanji desu ka",     meaning: "Wann gibt es Frühstück?" },
  { id: "r23", japanese: "荷物を預かってもらえますか", reading: "にもつをあずかってもらえますか",   romaji: "nimotsu o azukatte moraemasu ka", meaning: "Können Sie mein Gepäck aufbewahren?" },
  { id: "r24", japanese: "チェックアウトお願いします", reading: "チェックアウトおねがいします",     romaji: "chekkuauto onegaishimasu",       meaning: "Check-out, bitte" },
  // Level 4 — Restaurant & Einkaufen
  { id: "r25", japanese: "おすすめは何ですか",   reading: "おすすめはなんですか",     romaji: "osusume wa nan desu ka",   meaning: "Was empfehlen Sie?" },
  { id: "r26", japanese: "メニューをください",                                        romaji: "menyuu o kudasai",         meaning: "Die Speisekarte, bitte" },
  { id: "r27", japanese: "お水をください",       reading: "おみずをください",         romaji: "o-mizu o kudasai",         meaning: "Wasser, bitte" },
  { id: "r28", japanese: "お会計お願いします",   reading: "おかいけいおねがいします", romaji: "o-kaikei onegaishimasu",   meaning: "Die Rechnung, bitte" },
  { id: "r29", japanese: "カードで払えますか",   reading: "カードではらえますか",     romaji: "kaado de haraemasu ka",    meaning: "Kann ich mit Karte zahlen?" },
  { id: "r30", japanese: "おいしかったです",                                          romaji: "oishikatta desu",          meaning: "Es war lecker" },
  { id: "r31", japanese: "これは何ですか",       reading: "これはなんですか",         romaji: "kore wa nan desu ka",      meaning: "Was ist das?" },
  { id: "r32", japanese: "袋をください",         reading: "ふくろをください",         romaji: "fukuro o kudasai",         meaning: "Eine Tüte, bitte" },
  // Level 5 — Notfall
  { id: "r33", japanese: "助けて",                 reading: "たすけて",                   romaji: "tasukete",                    meaning: "Hilfe!" },
  { id: "r34", japanese: "警察を呼んでください",   reading: "けいさつをよんでください",   romaji: "keisatsu o yonde kudasai",    meaning: "Rufen Sie die Polizei" },
  { id: "r35", japanese: "病院はどこですか",       reading: "びょういんはどこですか",     romaji: "byouin wa doko desu ka",      meaning: "Wo ist das Krankenhaus?" },
  { id: "r36", japanese: "道に迷いました",         reading: "みちにまよいました",         romaji: "michi ni mayoimashita",       meaning: "Ich habe mich verlaufen" },
  { id: "r37", japanese: "パスポートをなくしました",                                    romaji: "pasupooto o nakushimashita",  meaning: "Ich habe meinen Pass verloren" },
  { id: "r38", japanese: "痛いです",               reading: "いたいです",                 romaji: "itai desu",                   meaning: "Es tut weh" },
  { id: "r39", japanese: "薬局はどこですか",       reading: "やっきょくはどこですか",     romaji: "yakkyoku wa doko desu ka",    meaning: "Wo ist die Apotheke?" },
  { id: "r40", japanese: "気分が悪いです",         reading: "きぶんがわるいです",         romaji: "kibun ga warui desu",         meaning: "Mir ist schlecht" },
];

export const travelPhraseLevels = buildLevels(travelPhrases, 8);
