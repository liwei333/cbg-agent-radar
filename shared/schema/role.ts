/**
 * 梦幻西游藏宝阁角色 Schema v3
 * Phase 3: 修正状态机、null/empty 语义、数据质量评分
 */

// 状态机
export type RoleStatus =
  | 'DISCOVERED'           // 仅列表页发现
  | 'LIST_COLLECTED'       // 列表页基础信息采集完成
  | 'DETAIL_PARTIAL'       // 进入详情页但关键字段缺失
  | 'DETAIL_COMPLETE'      // 详情采集完整
  | 'COMPARABLES_PARTIAL'  // 有少量可比样本
  | 'COMPARABLES_READY'    // 有足够可比样本
  | 'VALUED'               // 已生成估值
  | 'PROFITABLE'           // 已生成利润测算
  | 'READY_TO_BUY'         // 满足购买条件
  | 'USER_APPROVAL_REQUIRED' // 等待用户确认
  | 'PURCHASED'            // 已购买
  | 'HOLDING'              // 持有中
  | 'READY_TO_RELIST'      // 准备重新挂牌
  | 'LISTED'               // 已挂牌
  | 'SOLD'                 // 已售
  | 'PROFIT_RECORDED';     // 利润已记录

// 采集完整度
export type CollectionCompleteness =
  | 'NONE'           // 未采集
  | 'UNKNOWN'        // 无法确认
  | 'PARTIAL'        // 部分采集
  | 'COMPLETE';      // 完整采集

export interface CharacterBase {
  achievement: number | null;
  potentialFruit: number | null;
  opportunity: number | null;
  opportunityTotal: number | null;
  qianYuanDan: number | null;
  experience: string | null;
  isPrettyNumber: boolean | null;
  historicalSchools: number | null;
  skills: Record<string, number> | null;
  humanCultivation: {
    attack: number | null;
    defense: number | null;
    spellAttack: number | null;
    spellDefense: number | null;
    personCultivationCount: number | null;
    personCultivationFull: boolean | null;
  } | null;
  petCultivation: {
    attack: number | null;
    defense: number | null;
    spellAttack: number | null;
    spellDefense: number | null;
    petCultivationCount: number | null;
    petCultivationFull: boolean | null;
  } | null;
  auxiliarySkills: {
    lifeSkills: number | null;
    lifeSkillsFull: boolean | null;
    qiangShen: boolean | null;
    mingLian: boolean | null;
  } | null;
}

export interface Equipment {
  slot: 'weapon' | 'helmet' | 'armor' | 'belt' | 'shoes' | 'necklace';
  name: string | null;
  level: number | null;
  element: string | null;
  attributes: Record<string, number | string> | null;
  specialEffects: string[];
  specialSkills: string[];
  setEffect: string | null;
  gem: string | null;
  gemLevel: number | null;
  repair: number | null;
  failureCount: number | null;
  socketCount: string | null;
  runeStones: string[];
  runeStoneSet: string | null;
  runeStoneBonus: string | null;
  smeltingEffect: string | null;
  isNeverWear: boolean;
  isPersonal: boolean;
  personalPlayerId: string | null;
  estimatedValue: number | null;
}

export interface Accessory {
  slot: 'ring' | 'earring' | 'bracelet' | 'pendant';
  name: string | null;
  level: number | null;
  mainAttribute: string | null;
  subAttributes: string[];
  starLevel: number | null;
  specialEffect: string | null;
  setEffect: string | null;
  estimatedValue: number | null;
}

export interface Summon {
  name: string | null;
  type: string | null;
  level: number | null;
  skillCount: number | null;
  skills: string[];
  specialSkills: string[];
  attackAptitude: number | null;
  defenseAptitude: number | null;
  physicalAptitude: number | null;
  magicAptitude: number | null;
  speedAptitude: number | null;
  dodgeAptitude: number | null;
  growth: number | null;
  advancement: number | null;
  element: string | null;
  lifespan: number | null;
  isBaby: boolean | null;
  innerElixir: string | null;
  characteristic: string | null;
  splitSalePrice: number | null;
  estimatedValue: number | null;
  unknown: boolean;
}

export interface Fashion {
  costumeCount: number | null;
  limitedCostumeCount: number | null;
  identifiedLimitedCostumes: string[];
  identifiedNormalCostumes: string[];
  identificationComplete: boolean;
  auspiciousCount: number | null;
  limitedAuspiciousCount: number | null;
  identifiedLimitedAuspicious: string[];
  titleEffects: string[];
  bubbleFrame: string[];
  avatarFrame: string[];
  teamBadges: string[];
  xianYu: number | null;
  xianYuPoints: number | null;
  qiCaiPoints: number | null;
  dyeFruitCount: number | null;
  dyeSchemeSaved: number | null;
}

export interface DataQuality {
  base: number;
  equipment: number;
  pets: number;
  accessories: number;
  cosmetics: number;
  comparables: number;
  overall: number;
}

export interface Valuation {
  fairValueLow: number | null;
  fairValueMid: number | null;
  fairValueHigh: number | null;
  quickSellValue: number | null;
  discount: number | null;
  confidence: 'insufficient-data' | 'low' | 'medium' | 'high';
  method: string;
}

export interface PriceObservation {
  timestamp: string;
  price: number;
  status: 'listed' | 'not_found' | 'sold' | 'unknown_exit';
  note: string;
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

  firstSeenAt: string | null;
  lastSeenAt: string | null;
  listingRemainingTime: string | null;
  observedListingAgeHours: number | null;

  status: RoleStatus;
  isSplitSale: boolean;

  base: CharacterBase;
  cultivation: Record<string, unknown>;
  equipment: Equipment[] | null;
  equipmentCollectionStatus: CollectionCompleteness;
  pets: Summon[] | null;
  petsCollectionStatus: CollectionCompleteness;
  accessories: Accessory[] | null;
  accessoriesCollectionStatus: CollectionCompleteness;
  cosmetics: Fashion | null;
  cosmeticsCollectionStatus: CollectionCompleteness;

  valuation: Valuation | null;
  score: {
    total: number | null;
    base: number | null;
    equipment: number | null;
    pets: number | null;
    cosmetics: number | null;
    liquidity: number | null;
    grade: 'A' | 'B' | 'C' | null;
  } | null;

  dataQuality: DataQuality | null;
  priceHistory: PriceObservation[];

  source: {
    collector: string;
    screenshots: string[];
  };
}
