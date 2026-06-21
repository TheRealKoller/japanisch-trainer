// Generates public/audio/{id}.wav for every VocabItem using the Voicevox REST API.
// Prerequisites: Voicevox engine running at http://localhost:50021
//   docker run --rm -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest
// Usage: npm run generate-audio

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = process.env.AUDIO_OUT_DIR ?? join(ROOT, "public", "audio");
const SPEAKER_ID = 1; // ずんだもん (ノーマル)
const BASE_URL = process.env.VOICEVOX_URL ?? "http://localhost:50021";

mkdirSync(OUT_DIR, { recursive: true });

function parseItems(filePath) {
  const src = readFileSync(filePath, "utf-8");
  const items = [];
  const idRe = /\bid:\s*["']([^"']+)["']/;
  const jpRe = /\bjapanese:\s*["']([^"']+)["']/;
  const readingRe = /\breading:\s*["']([^"']+)["']/;
  for (const match of src.matchAll(/\{[^}]+\}/gs)) {
    const block = match[0];
    const id = block.match(idRe)?.[1];
    const japanese = block.match(jpRe)?.[1];
    const reading = block.match(readingRe)?.[1];
    if (id && japanese) items.push({ id, japanese, reading });
  }
  return items;
}

const DATA_DIR = join(ROOT, "src", "data");
const allItems = [
  ...parseItems(join(DATA_DIR, "numbers.ts")),
  ...parseItems(join(DATA_DIR, "hiragana.ts")),
  ...parseItems(join(DATA_DIR, "katakana.ts")),
];

// For numbers: use the first kana reading (more deterministic than kanji).
// For kana characters: use the character itself (it encodes its own sound).
function ttsText(item) {
  if (item.reading) return item.reading.split(" / ")[0];
  return item.japanese;
}

const pending = allItems.filter((item) => !existsSync(join(OUT_DIR, `${item.id}.wav`)));

if (pending.length === 0) {
  console.log(`All ${allItems.length} files already exist. Nothing to do.`);
  process.exit(0);
}

console.log(`Generating ${pending.length}/${allItems.length} audio files (Voicevox speaker ${SPEAKER_ID})...\n`);

let ok = 0;
let fail = 0;

for (const item of pending) {
  const text = ttsText(item);
  const outPath = join(OUT_DIR, `${item.id}.wav`);
  try {
    const queryRes = await fetch(
      `${BASE_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${SPEAKER_ID}`,
      { method: "POST" },
    );
    if (!queryRes.ok) throw new Error(`audio_query ${queryRes.status}`);
    const query = await queryRes.json();
    query.volumeScale = 3.0;

    const synthRes = await fetch(`${BASE_URL}/synthesis?speaker=${SPEAKER_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    if (!synthRes.ok) throw new Error(`synthesis ${synthRes.status}`);

    writeFileSync(outPath, Buffer.from(await synthRes.arrayBuffer()));
    ok++;
    console.log(`  OK   ${item.id}.wav  "${text}"`);
  } catch (err) {
    fail++;
    console.error(`  FAIL ${item.id}.wav  "${text}": ${err.message}`);
  }
}

console.log(`\n${ok} generated, ${fail} failed.`);
if (fail > 0) process.exit(1);
