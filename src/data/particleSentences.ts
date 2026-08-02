// Partikel-Übung — 40 Lückensätze (8 pro Partikel: は, が, を, に, で), Einsteiger-Niveau
// (Vokabular überwiegend aus coreVocab.ts). Eigenes Interface statt VocabItem, da die Karte
// hier keine Vorder-/Rückseite hat, sondern einen Multiple-Choice-Lückensatz darstellt.
//
// Feldbedeutung: sentence enthält genau einmal GAP_MARKER an der Partikel-Stelle (wird beim
// Rendern durch einen Platzhalter ersetzt, nicht durch die Antwort). reading ist der
// vollständige, korrekt aufgelöste Satz (inkl. richtigem Partikel) für die Voicevox-Aussprache —
// wird bewusst erst nach der Beantwortung abgespielt, sonst würde die Aussprache die Lösung
// verraten. translation wird ebenfalls erst nach der Beantwortung eingeblendet.
export type Particle = "は" | "が" | "を" | "に" | "で";

export const PARTICLES: Particle[] = ["は", "が", "を", "に", "で"];

// IDs für die generische Item-Statistik (utils/itemStats.ts) — ein Item pro Partikel,
// analog zu d0..d9 im Zahlen-Quiz.
export const PARTICLE_STAT_ID: Record<Particle, string> = {
  "は": "p-ha",
  "が": "p-ga",
  "を": "p-wo",
  "に": "p-ni",
  "で": "p-de",
};

export const GAP_MARKER = "___";

export interface ParticleSentence {
  id: string;
  sentence: string;
  reading: string;
  correctParticle: Particle;
  translation: string;
}

export const particleSentences: ParticleSentence[] = [
  // は — Themamarkierung (8 Sätze)
  { id: "ps1", sentence: `これ${GAP_MARKER}本です。`,           reading: "これはほんです。",             correctParticle: "は", translation: "Das ist ein Buch." },
  { id: "ps2", sentence: `この魚${GAP_MARKER}おいしいです。`,   reading: "このさかなはおいしいです。",   correctParticle: "は", translation: "Dieser Fisch ist lecker." },
  { id: "ps3", sentence: `今日${GAP_MARKER}暑いです。`,         reading: "きょうはあついです。",         correctParticle: "は", translation: "Heute ist es heiß." },
  { id: "ps4", sentence: `わたしの家${GAP_MARKER}大きいです。`, reading: "わたしのいえはおおきいです。", correctParticle: "は", translation: "Mein Haus ist groß." },
  { id: "ps5", sentence: `あの店${GAP_MARKER}安いです。`,       reading: "あのみせはやすいです。",       correctParticle: "は", translation: "Dieser Laden ist billig." },
  { id: "ps6", sentence: `山${GAP_MARKER}きれいです。`,         reading: "やまはきれいです。",           correctParticle: "は", translation: "Der Berg ist schön." },
  { id: "ps7", sentence: `わたし${GAP_MARKER}日本語を勉強します。`, reading: "わたしはにほんごをべんきょうします。", correctParticle: "は", translation: "Ich lerne Japanisch." },
  { id: "ps8", sentence: `この電車${GAP_MARKER}新しいです。`,   reading: "このでんしゃはあたらしいです。", correctParticle: "は", translation: "Dieser Zug ist neu." },

  // が — Subjektmarkierung, Existenz, Vorlieben (8 Sätze)
  { id: "ps9",  sentence: `公園に花${GAP_MARKER}あります。`,     reading: "こうえんにはながあります。",   correctParticle: "が", translation: "Im Park gibt es Blumen." },
  { id: "ps10", sentence: `庭に木${GAP_MARKER}あります。`,       reading: "にわにきがあります。",         correctParticle: "が", translation: "Im Garten gibt es einen Baum." },
  { id: "ps11", sentence: `わたしは魚${GAP_MARKER}好きです。`,  reading: "わたしはさかながすきです。",   correctParticle: "が", translation: "Ich mag Fisch." },
  { id: "ps12", sentence: `だれ${GAP_MARKER}来ますか。`,        reading: "だれがきますか。",             correctParticle: "が", translation: "Wer kommt?" },
  { id: "ps13", sentence: `子供${GAP_MARKER}公園にいます。`,    reading: "こどもがこうえんにいます。",   correctParticle: "が", translation: "Ein Kind ist im Park." },
  { id: "ps14", sentence: `何${GAP_MARKER}おいしいですか。`,    reading: "なにがおいしいですか。",       correctParticle: "が", translation: "Was ist lecker?" },
  { id: "ps15", sentence: `わたしは日本語${GAP_MARKER}わかります。`, reading: "わたしはにほんごがわかります。", correctParticle: "が", translation: "Ich verstehe Japanisch." },
  { id: "ps16", sentence: `車${GAP_MARKER}ほしいです。`,        reading: "くるまがほしいです。",         correctParticle: "が", translation: "Ich möchte ein Auto." },

  // を — Objektmarkierung (8 Sätze)
  { id: "ps17", sentence: `わたしはご飯${GAP_MARKER}食べます。`,     reading: "わたしはごはんをたべます。",     correctParticle: "を", translation: "Ich esse eine Mahlzeit." },
  { id: "ps18", sentence: `わたしは水${GAP_MARKER}飲みます。`,       reading: "わたしはみずをのみます。",       correctParticle: "を", translation: "Ich trinke Wasser." },
  { id: "ps19", sentence: `わたしは本${GAP_MARKER}読みます。`,       reading: "わたしはほんをよみます。",       correctParticle: "を", translation: "Ich lese ein Buch." },
  { id: "ps20", sentence: `わたしは服${GAP_MARKER}買います。`,       reading: "わたしはふくをかいます。",       correctParticle: "を", translation: "Ich kaufe Kleidung." },
  { id: "ps21", sentence: `わたしはテレビ${GAP_MARKER}見ます。`,     reading: "わたしはてれびをみます。",       correctParticle: "を", translation: "Ich schaue Fernsehen." },
  { id: "ps22", sentence: `わたしはコーヒー${GAP_MARKER}飲みます。`, reading: "わたしはこーひーをのみます。",   correctParticle: "を", translation: "Ich trinke Kaffee." },
  { id: "ps23", sentence: `わたしはひらがな${GAP_MARKER}書きます。`, reading: "わたしはひらがなをかきます。",   correctParticle: "を", translation: "Ich schreibe Hiragana." },
  { id: "ps24", sentence: `わたしは魚${GAP_MARKER}食べません。`,     reading: "わたしはさかなをたべません。",   correctParticle: "を", translation: "Ich esse keinen Fisch." },

  // に — Zeitpunkt, Richtungsziel, indirektes Objekt (8 Sätze)
  { id: "ps25", sentence: `わたしは朝${GAP_MARKER}起きます。`,       reading: "わたしはあさにおきます。",         correctParticle: "に", translation: "Ich stehe morgens auf." },
  { id: "ps26", sentence: `わたしは夜${GAP_MARKER}寝ます。`,         reading: "わたしはよるにねます。",           correctParticle: "に", translation: "Ich schlafe nachts." },
  { id: "ps27", sentence: `わたしは学校${GAP_MARKER}行きます。`,     reading: "わたしはがっこうにいきます。",     correctParticle: "に", translation: "Ich gehe zur Schule." },
  { id: "ps28", sentence: `わたしは家${GAP_MARKER}帰ります。`,       reading: "わたしはいえにかえります。",       correctParticle: "に", translation: "Ich kehre nach Hause zurück." },
  { id: "ps29", sentence: `子供は公園${GAP_MARKER}います。`,         reading: "こどもはこうえんにいます。",       correctParticle: "に", translation: "Das Kind ist im Park." },
  { id: "ps30", sentence: `わたしは友達${GAP_MARKER}会います。`,     reading: "わたしはともだちにあいます。",     correctParticle: "に", translation: "Ich treffe einen Freund." },
  { id: "ps31", sentence: `わたしは友達${GAP_MARKER}本をあげます。`, reading: "わたしはともだちにほんをあげます。", correctParticle: "に", translation: "Ich gebe einem Freund ein Buch." },
  { id: "ps32", sentence: `銀行は駅の前${GAP_MARKER}あります。`,     reading: "ぎんこうはえきのまえにあります。", correctParticle: "に", translation: "Die Bank ist vor dem Bahnhof." },

  // で — Handlungsort, Mittel/Werkzeug (8 Sätze)
  { id: "ps33", sentence: `わたしは図書館${GAP_MARKER}本を読みます。`,   reading: "わたしはとしょかんでほんをよみます。",   correctParticle: "で", translation: "Ich lese ein Buch in der Bibliothek." },
  { id: "ps34", sentence: `わたしは公園${GAP_MARKER}友達に会います。`,   reading: "わたしはこうえんでともだちにあいます。", correctParticle: "で", translation: "Ich treffe einen Freund im Park." },
  { id: "ps35", sentence: `わたしは電車${GAP_MARKER}学校に行きます。`,   reading: "わたしはでんしゃでがっこうにいきます。", correctParticle: "で", translation: "Ich fahre mit dem Zug zur Schule." },
  { id: "ps36", sentence: `わたしは教室${GAP_MARKER}勉強します。`,       reading: "わたしはきょうしつでべんきょうします。", correctParticle: "で", translation: "Ich lerne im Klassenzimmer." },
  { id: "ps37", sentence: `わたしはレストラン${GAP_MARKER}ご飯を食べます。`, reading: "わたしはれすとらんでごはんをたべます。", correctParticle: "で", translation: "Ich esse im Restaurant." },
  { id: "ps38", sentence: `わたしは店${GAP_MARKER}服を買います。`,       reading: "わたしはみせでふくをかいます。",         correctParticle: "で", translation: "Ich kaufe Kleidung im Laden." },
  { id: "ps39", sentence: `わたしは鉛筆${GAP_MARKER}書きます。`,         reading: "わたしはえんぴつでかきます。",           correctParticle: "で", translation: "Ich schreibe mit einem Bleistift." },
  { id: "ps40", sentence: `わたしは日本語${GAP_MARKER}話します。`,       reading: "わたしはにほんごではなします。",         correctParticle: "で", translation: "Ich spreche auf Japanisch." },
];
