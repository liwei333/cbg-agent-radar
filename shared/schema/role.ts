/**
 * 梦幻西游藏宝阁角色 Schema v2
 * 每个商品单独保存为 data/details/{itemId}.json
 */

export interface CharacterBase {
  achievement: number | null;
  potentialFruit: number | null;
  opportunity: number | null;
  skills: Record<string, number> | null;
  humanCultivation: {
    attack: number | null;
    defense: number | null;
    spellAttack: number | null;
    spellDefense: number | null;
    healing: number | null;
    resistance: number | null;
  } | null;
  petCultivation: {
    attack: number | null;
    defense: number | null;
    spellAttack: number | null;
    spellDefense: number | null;
    healing: number | null;
    resistance: number | null;
  } | null;
  auxiliarySkills: Record<string, number> | null;
}

export interface Equipment {
  slot: 'weapon' | 'helmet' | 'armor' | 'belt' | 'shoes' | 'necklace';
  name: string | null;
  level: number | null;
  attributes: string | null;
  price: number | null;
}

export interface Accessory {
  slot: 'ring' | 'earring' | 'bracelet' | 'pendant';
  name: string | null;
  level: number | null;
  attributes: string | null;
  price: number | null;
}

export interface Summon {
  name: string | null;
  type: string | null;
  skillCount: number | null;
  keySkills: string[] | null;
  aptitude: string | null;
  growth: number | null;
  advancement: number | null;
  specialSkills: string[] | null;
  price: number | null;
}

export interface Fashion {
  limitedCostumes: string[] | null;
  costumes: string[] | null;
  mounts: string[] | null;
  limitedMounts: string[] | null;
}

export interface Role {
  itemId: string;
  url: string;
  collectedAt: string;

  price: number | null;
  level: number | null;
  school: string;
  server: string;
  race: string;

  base: CharacterBase;
  cultivation: Record<string, unknown>;
  equipment: Equipment[];
  pets: Summon[];
  accessories: Accessory[];
  cosmetics: Fashion;

  valuation: {
    fairValue: number | null;
    quickSellValue: number | null;
    discount: number | null;
  } | null;

  score: {
    total: number | null;
    base: number | null;
    equipment: number | null;
    pets: number | null;
    cosmetics: number | null;
    liquidity: number | null;
    grade: 'A' | 'B' | 'C' | null;
  } | null;

  source: {
    collector: string;
    screenshots: string[];
  };
}
