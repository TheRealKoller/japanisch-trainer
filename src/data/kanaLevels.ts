export interface KanaLevel {
  level: number;
  ids: string[];
}

export const hiraganaLevels: KanaLevel[] = [
  { level: 1,  ids: ["ha", "hi", "hu", "he", "ho"] },
  { level: 2,  ids: ["hka", "hki", "hku", "hke", "hko"] },
  { level: 3,  ids: ["hsa", "hsi", "hsu", "hse", "hso"] },
  { level: 4,  ids: ["hta", "hchi", "htsu", "hte", "hto"] },
  { level: 5,  ids: ["hna", "hni", "hnu", "hne", "hno"] },
  { level: 6,  ids: ["hha", "hhi", "hfu", "hhe", "hho"] },
  { level: 7,  ids: ["hma", "hmi", "hmu", "hme", "hmo"] },
  { level: 8,  ids: ["hya", "hyu", "hyo"] },
  { level: 9,  ids: ["hra", "hri", "hru", "hre", "hro"] },
  { level: 10, ids: ["hwa", "hwo", "hnn"] },
  { level: 11, ids: ["hga", "hgi", "hgu", "hge", "hgo"] },
  { level: 12, ids: ["hza", "hji", "hzu", "hze", "hzo"] },
  { level: 13, ids: ["hda", "hdi", "hdu", "hde", "hdo"] },
  { level: 14, ids: ["hba", "hbi", "hbu", "hbe", "hbo"] },
  { level: 15, ids: ["hpa", "hpi", "hpu", "hpe", "hpo"] },
  { level: 16, ids: ["hkya","hkyu","hkyo","hsha","hshu","hsho","hcha","hchu","hcho","hnya","hnyu","hnyo","hhya","hhyu","hhyo","hmya","hmyu","hmyo","hrya","hryu","hryo","hgya","hgyu","hgyo","hja","hju","hjo","hbya","hbyu","hbyo","hpya","hpyu","hpyo"] },
];

export const katakanaLevels: KanaLevel[] = [
  { level: 1,  ids: ["ka", "ki", "ku", "ke", "ko"] },
  { level: 2,  ids: ["kka", "kki", "kku", "kke", "kko"] },
  { level: 3,  ids: ["ksa", "ksi", "ksu", "kse", "kso"] },
  { level: 4,  ids: ["kta", "kchi", "ktsu", "kte", "kto"] },
  { level: 5,  ids: ["kna", "kni", "knu", "kne", "kno"] },
  { level: 6,  ids: ["kha", "khi", "kfu", "khe", "kho"] },
  { level: 7,  ids: ["kma", "kmi", "kmu", "kme", "kmo"] },
  { level: 8,  ids: ["kya", "kyu", "kyo"] },
  { level: 9,  ids: ["kra", "kri", "kru", "kre", "kro"] },
  { level: 10, ids: ["kwa", "kwo", "knn"] },
  { level: 11, ids: ["kga", "kgi", "kgu", "kge", "kgo"] },
  { level: 12, ids: ["kza", "kji", "kzu", "kze", "kzo"] },
  { level: 13, ids: ["kda", "kdi", "kdu", "kde", "kdo"] },
  { level: 14, ids: ["kba", "kbi", "kbu", "kbe", "kbo"] },
  { level: 15, ids: ["kpa", "kpi", "kpu", "kpe", "kpo"] },
  { level: 16, ids: ["kkya","kkyu","kkyo","ksha","kshu","ksho","kcha","kchu","kcho","knya","knyu","knyo","khya","khyu","khyo","kmya","kmyu","kmyo","krya","kryu","kryo","kgya","kgyu","kgyo","kja","kju","kjo","kbya","kbyu","kbyo","kpya","kpyu","kpyo"] },
];
