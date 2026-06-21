import { useState, useEffect, useRef } from "react";
import { getSpeakerId, setSpeakerId } from "../utils/voicevox";

interface SpeakerStyle {
  id: number;
  name: string;
  type: string;
}

interface Speaker {
  name: string;
  speaker_uuid: string;
  styles: SpeakerStyle[];
}

interface RawStyleInfo {
  id: number;
  icon: string;
  voice_samples: string[];
}

interface SpeakerInfoData {
  portrait: string;
  styleIcons: Map<number, string>;
  styleSamples: Map<number, string[]>;
}

interface Props {
  onBack: () => void;
}

const SPEAKER_LABELS: Record<string, string> = {
  "四国めたん":        "Tsundere-Schülerin",
  "ずんだもん":        "Zunda-Maskottchen",
  "春日部つむぎ":      "Fröhliches Schulmädchen",
  "雨晴はう":          "Sanfte junge Frau",
  "波音リツ":          "Energisches Mädchen",
  "玄野武宏":          "Junger Mann",
  "白上虎太郎":        "Munterer junger Mann",
  "青山龍星":          "Mann mit tiefer Stimme",
  "冥鳴ひまり":        "Sanftes Mädchen",
  "九州そら":          "Vielseitige junge Frau",
  "もち子さん":        "Freundliche junge Frau",
  "剣崎雌雄":          "Älterer Mann",
  "WhiteCUL":          "Ruhige junge Frau",
  "後鬼":              "Oni-Fantasiefigur",
  "No.7":              "Androiden-Figur",
  "ちび式じい":        "Alter Mann",
  "櫻歌ミコ":          "Munteres Mädchen",
  "小夜/SAYO":         "Geheimnisvolles Mädchen",
  "ナースロボ＿タイプＴ": "Krankenschwester-Roboter",
  "†聖騎士 紅桜†":    "Heiliger Ritter",
  "雀松朱司":          "Junger Mann",
  "麒ヶ島宗麟":        "Reifer Mann",
  "春歌ナナ":          "Idol-Sängerin",
  "猫使アル":          "Katzen-Charakter (w)",
  "猫使ビィ":          "Katzen-Charakter (m)",
  "中国うさぎ":        "Häschen-Figur",
  "栗田まろん":        "Sanfte junge Frau",
  "あいえるたん":      "KI-Maskottchen",
  "満別花丸":          "Fröhliches Mädchen",
  "琴詠ニア":          "Junges Mädchen",
  "Voidoll":           "Puppenfigur",
  "ぞん子":            "Zombie-Figur",
  "中部つるぎ":        "Junge Frau",
};

const STYLE_LABELS: Record<string, string> = {
  "ノーマル":           "Normal",
  "ふつう":             "Normal",
  "あまあま":           "Süßlich",
  "ツンツン":           "Kratzbürstig",
  "ツンギレ":           "Wütend / Kratzbürstig",
  "セクシー":           "Sexy",
  "セクシー／あん子":   "Sexy / Anko",
  "ささやき":           "Flüstern",
  "ヒソヒソ":           "Tuscheln",
  "ヘロヘロ":           "Erschöpft",
  "へろへろ":           "Erschöpft",
  "なみだめ":           "Tränenreich",
  "クイーン":           "Königin",
  "喜び":               "Freude",
  "悲しみ":             "Traurig",
  "かなしみ":           "Traurig",
  "かなしい":           "Traurig",
  "わーい":             "Fröhlich",
  "たのしい":           "Fröhlich",
  "うきうき":           "Aufgeregt",
  "びくびく":           "Schüchtern",
  "人見知り":           "Schüchtern",
  "おこ":               "Aufgebracht",
  "怒り":               "Wütend",
  "不機嫌":             "Mürrisch",
  "びえーん":           "Weinend",
  "泣き":               "Weinend",
  "熱血":               "Feuergeist",
  "しっとり":           "Sanft",
  "囁き":               "Flüstern",
  "アナウンス":         "Ansager",
  "読み聞かせ":         "Vorlesen",
  "第二形態":           "Zweite Form",
  "ロリ":               "Kindlich",
  "楽々":               "Entspannt",
  "のんびり":           "Gemütlich",
  "ぶりっ子":           "Kokett",
  "ボーイ":             "Burschikos",
  "恐怖":               "Angst",
  "内緒話":             "Geheimnis",
  "人間ver.":           "Mensch (Var.)",
  "ぬいぐるみver.":     "Plüschtier (Var.)",
  "人間（怒り）ver.":   "Mensch, wütend",
  "鬼ver.":             "Oni (Var.)",
  "おちつき":           "Ruhig",
  "おどろき":           "Überrascht",
  "こわがり":           "Ängstlich",
  "おどおど":           "Nervös",
  "元気":               "Energisch",
  "低血圧":             "Schläfrig",
  "覚醒":               "Erwacht",
  "実況風":             "Kommentator",
  "絶望と敗北":         "Verzweiflung",
};

const WAVE_BARS = [
  { delay: "0ms",   h: "h-2" },
  { delay: "120ms", h: "h-3" },
  { delay: "240ms", h: "h-4" },
  { delay: "120ms", h: "h-2" },
];

function WaveAnimation() {
  return (
    <div className="flex items-center gap-px h-4">
      {WAVE_BARS.map((bar, i) => (
        <div
          key={i}
          className={`w-px ${bar.h} bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce`}
          style={{ animationDelay: bar.delay }}
        />
      ))}
    </div>
  );
}

export function SettingsPage({ onBack }: Props) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState(getSpeakerId);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [speakerInfoMap, setSpeakerInfoMap] = useState<Map<string, SpeakerInfoData>>(new Map());
  const [expandedUuids, setExpandedUuids] = useState<Set<string>>(new Set());

  const previewAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/voicevox/speakers", { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: Speaker[]) => {
        setSpeakers(data);
        data.forEach(speaker => {
          fetch(`/voicevox/speaker_info?speaker_uuid=${speaker.speaker_uuid}`, { signal: controller.signal })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((info: { portrait: string; style_infos: RawStyleInfo[] }) => {
              const styleIcons = new Map(info.style_infos.map(si => [si.id, si.icon]));
              const styleSamples = new Map(info.style_infos.map(si => [si.id, si.voice_samples]));
              setSpeakerInfoMap(prev => {
                const next = new Map(prev);
                next.set(speaker.speaker_uuid, { portrait: info.portrait, styleIcons, styleSamples });
                return next;
              });
            })
            .catch(() => {});
        });
      })
      .catch((e: unknown) => { if ((e as { name?: string })?.name !== "AbortError") setError(true); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      previewAudio.current?.pause();
      previewAudio.current = null;
    };
  }, []);

  function stopPreview() {
    previewAudio.current?.pause();
    previewAudio.current = null;
    setPlayingKey(null);
  }

  function handlePreview(style: SpeakerStyle, speakerUuid: string, sampleIndex: number) {
    const key = `${style.id}-${sampleIndex}`;
    if (playingKey === key) { stopPreview(); return; }
    stopPreview();

    const samples = speakerInfoMap.get(speakerUuid)?.styleSamples.get(style.id);
    if (!samples?.[sampleIndex]) return;

    const audio = new Audio(`data:audio/wav;base64,${samples[sampleIndex]}`);
    previewAudio.current = audio;
    setPlayingKey(key);
    audio.onended = () => { previewAudio.current = null; setPlayingKey(null); };
    audio.onerror = () => { previewAudio.current = null; setPlayingKey(null); };
    audio.play().catch(() => { previewAudio.current = null; setPlayingKey(null); });
  }

  function toggleSpeaker(uuid: string) {
    setExpandedUuids(prev => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }

  function selectStyle(id: number) {
    setSpeakerId(id);
    setSelectedId(id);
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto flex-1">
      <div className="flex items-center justify-between w-full py-1">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Stimme</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {loading && (
          <p className="text-center text-gray-400 dark:text-slate-500 text-sm mt-8">Lädt Stimmen…</p>
        )}
        {error && (
          <p className="text-center text-gray-400 dark:text-slate-500 text-sm mt-8">VoiceVox ist nicht erreichbar.</p>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-1">
            {speakers.map(speaker => {
              const info = speakerInfoMap.get(speaker.speaker_uuid);
              const isExpanded = expandedUuids.has(speaker.speaker_uuid);
              const hasSelected = speaker.styles.some(s => s.id === selectedId);
              const selectedStyle = hasSelected
                ? speaker.styles.find(s => s.id === selectedId)
                : null;

              return (
                <div key={speaker.speaker_uuid}>
                  {/* Speaker header — clickable toggle */}
                  <button
                    onClick={() => toggleSpeaker(speaker.speaker_uuid)}
                    className={`flex items-center gap-3 w-full text-left px-2 py-2 rounded-xl transition-colors
                      ${hasSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/15"
                        : "hover:bg-gray-50 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    {info?.portrait ? (
                      <img
                        src={`data:image/png;base64,${info.portrait}`}
                        alt={speaker.name}
                        className="w-12 h-16 rounded-xl object-cover object-top shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0 animate-pulse" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-tight ${
                        hasSelected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-slate-300"
                      }`}>
                        {speaker.name}
                      </p>
                      {SPEAKER_LABELS[speaker.name] && (
                        <p className={`text-xs mt-0.5 ${
                          hasSelected ? "text-indigo-400 dark:text-indigo-500" : "text-gray-400 dark:text-slate-500"
                        }`}>
                          {SPEAKER_LABELS[speaker.name]}
                        </p>
                      )}
                      {hasSelected && selectedStyle && !isExpanded && (
                        <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
                          ✓ {selectedStyle.name}
                          {STYLE_LABELS[selectedStyle.name] && (
                            <span className="text-indigo-400 dark:text-indigo-500 ml-1">
                              · {STYLE_LABELS[selectedStyle.name]}
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    <span className={`text-gray-400 dark:text-slate-500 text-base shrink-0 transition-transform duration-200 leading-none ${
                      isExpanded ? "rotate-90" : ""
                    }`}>
                      ›
                    </span>
                  </button>

                  {/* Style rows — only when expanded */}
                  {isExpanded && (
                    <div className="flex flex-col gap-1 mt-1 ml-3">
                      {speaker.styles.map(style => {
                        const isSelected = selectedId === style.id;
                        const label = STYLE_LABELS[style.name];
                        const icon = info?.styleIcons.get(style.id);
                        const samples = info?.styleSamples.get(style.id) ?? [];

                        return (
                          <div
                            key={style.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-colors
                              ${isSelected
                                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/15 dark:border-indigo-400/60"
                                : "border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600"
                              }`}
                          >
                            {icon ? (
                              <img
                                src={`data:image/png;base64,${icon}`}
                                alt={style.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 shrink-0" />
                            )}

                            <button
                              onClick={() => selectStyle(style.id)}
                              className="flex-1 text-left min-w-0"
                            >
                              <span className={`font-medium text-sm ${
                                isSelected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-slate-300"
                              }`}>
                                {style.name}
                              </span>
                              {label && (
                                <span className={`ml-2 text-xs ${
                                  isSelected ? "text-indigo-400 dark:text-indigo-500" : "text-gray-400 dark:text-slate-500"
                                }`}>
                                  {label}
                                </span>
                              )}
                            </button>

                            <div className="flex items-center gap-1 shrink-0">
                              {[0, 1, 2].map(i => {
                                const key = `${style.id}-${i}`;
                                const isThisPlaying = playingKey === key;
                                const available = samples.length > i;
                                return (
                                  <button
                                    key={i}
                                    onClick={() => handlePreview(style, speaker.speaker_uuid, i)}
                                    disabled={!available}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-sm
                                      ${isThisPlaying
                                        ? "bg-indigo-100 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400"
                                        : !available
                                          ? "opacity-20 text-gray-400 dark:text-slate-500"
                                          : "text-gray-400 hover:bg-gray-100 dark:text-slate-500 dark:hover:bg-slate-700"
                                      }`}
                                    title={`Beispiel ${i + 1}`}
                                  >
                                    {isThisPlaying ? <WaveAnimation /> : "▶"}
                                  </button>
                                );
                              })}
                            </div>

                            {isSelected && (
                              <span className="text-indigo-500 dark:text-indigo-400 text-sm shrink-0">✓</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
