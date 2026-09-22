/**
 * Comparable Distance - 计算目标角色与市场角色的相似度
 * Phase 3: 找到真正最相似的账号，不直接映射成价值
 */

export interface RoleFeatures {
  school: string;
  server: string;
  humanCultivation: number | null;
  petCultivation: number | null;
  achievement: number | null;
  potentialFruit: number | null;
  costumeCount: number | null;
  limitedCostumeCount: number | null;
  auspiciousCount: number | null;
  experience: string | null;
}

export interface ComparableItem {
  itemId: string;
  detailUrl: string;
  fingerprint: string;
  price: number;
  features: RoleFeatures;
}

export interface DistanceResult {
  item: ComparableItem;
  similarityScore: number;
  differences: {
    cultivationDiff: number | null;
    petCultivationDiff: number | null;
    achievementDiff: number | null;
    potentialFruitDiff: number | null;
    costumeDiff: number | null;
    limitedCostumeDiff: number | null;
    auspiciousDiff: number | null;
    serverMatch: boolean;
    schoolMatch: boolean;
  };
}

// 各维度权重（总和 = 1）
const WEIGHTS = {
  school: 0.15,
  server: 0.10,
  humanCultivation: 0.20,
  petCultivation: 0.20,
  achievement: 0.10,
  potentialFruit: 0.10,
  costume: 0.05,
  limitedCostume: 0.05,
  auspicious: 0.05
};

function normalize(value: number | null, min: number, max: number): number {
  if (value === null) return 0;
  if (max === min) return 1;
  return (value - min) / (max - min);
}

export function computeDistance(
  target: RoleFeatures,
  comparables: ComparableItem[]
): DistanceResult[] {
  // 计算全局 min/max 用于归一化
  const allHC = [target.humanCultivation, ...comparables.map(c => c.features.humanCultivation)].filter((v): v is number => v !== null);
  const allPC = [target.petCultivation, ...comparables.map(c => c.features.petCultivation)].filter((v): v is number => v !== null);
  const allAch = [target.achievement, ...comparables.map(c => c.features.achievement)].filter((v): v is number => v !== null);
  const allPF = [target.potentialFruit, ...comparables.map(c => c.features.potentialFruit)].filter((v): v is number => v !== null);
  const allCostume = [target.costumeCount, ...comparables.map(c => c.features.costumeCount)].filter((v): v is number => v !== null);
  const allLimited = [target.limitedCostumeCount, ...comparables.map(c => c.features.limitedCostumeCount)].filter((v): v is number => v !== null);
  const allAusp = [target.auspiciousCount, ...comparables.map(c => c.features.auspiciousCount)].filter((v): v is number => v !== null);

  const ranges = {
    hc: { min: Math.min(...allHC), max: Math.max(...allHC) },
    pc: { min: Math.min(...allPC), max: Math.max(...allPC) },
    ach: { min: Math.min(...allAch), max: Math.max(...allAch) },
    pf: { min: Math.min(...allPF), max: Math.max(...allPF) },
    costume: { min: Math.min(...allCostume), max: Math.max(...allCostume) },
    limited: { min: Math.min(...allLimited), max: Math.max(...allLimited) },
    ausp: { min: Math.min(...allAusp), max: Math.max(...allAusp) }
  };

  return comparables.map(item => {
    const f = item.features;
    const d = {
      cultivationDiff: target.humanCultivation !== null && f.humanCultivation !== null
        ? Math.abs(target.humanCultivation - f.humanCultivation) : null,
      petCultivationDiff: target.petCultivation !== null && f.petCultivation !== null
        ? Math.abs(target.petCultivation - f.petCultivation) : null,
      achievementDiff: target.achievement !== null && f.achievement !== null
        ? Math.abs(target.achievement - f.achievement) : null,
      potentialFruitDiff: target.potentialFruit !== null && f.potentialFruit !== null
        ? Math.abs(target.potentialFruit - f.potentialFruit) : null,
      costumeDiff: target.costumeCount !== null && f.costumeCount !== null
        ? Math.abs(target.costumeCount - f.costumeCount) : null,
      limitedCostumeDiff: target.limitedCostumeCount !== null && f.limitedCostumeCount !== null
        ? Math.abs(target.limitedCostumeCount - f.limitedCostumeCount) : null,
      auspiciousDiff: target.auspiciousCount !== null && f.auspiciousCount !== null
        ? Math.abs(target.auspiciousCount - f.auspiciousCount) : null,
      serverMatch: target.server === f.server,
      schoolMatch: target.school === f.school
    };

    // 计算各维度相似度 (0-1, 1=完全相同)
    const schoolSim = d.schoolMatch ? 1 : 0;
    const serverSim = d.serverMatch ? 1 : 0;
    const hcSim = d.cultivationDiff !== null
      ? 1 - normalize(d.cultivationDiff, 0, ranges.hc.max - ranges.hc.min || 1) : 0;
    const pcSim = d.petCultivationDiff !== null
      ? 1 - normalize(d.petCultivationDiff, 0, ranges.pc.max - ranges.pc.min || 1) : 0;
    const achSim = d.achievementDiff !== null
      ? 1 - normalize(d.achievementDiff, 0, ranges.ach.max - ranges.ach.min || 1) : 0;
    const pfSim = d.potentialFruitDiff !== null
      ? 1 - normalize(d.potentialFruitDiff, 0, ranges.pf.max - ranges.pf.min || 1) : 0;
    const costumeSim = d.costumeDiff !== null
      ? 1 - normalize(d.costumeDiff, 0, ranges.costume.max - ranges.costume.min || 1) : 0;
    const limitedSim = d.limitedCostumeDiff !== null
      ? 1 - normalize(d.limitedCostumeDiff, 0, ranges.limited.max - ranges.limited.min || 1) : 0;
    const auspSim = d.auspiciousDiff !== null
      ? 1 - normalize(d.auspiciousDiff, 0, ranges.ausp.max - ranges.ausp.min || 1) : 0;

    const score =
      schoolSim * WEIGHTS.school +
      serverSim * WEIGHTS.server +
      hcSim * WEIGHTS.humanCultivation +
      pcSim * WEIGHTS.petCultivation +
      achSim * WEIGHTS.achievement +
      pfSim * WEIGHTS.potentialFruit +
      costumeSim * WEIGHTS.costume +
      limitedSim * WEIGHTS.limitedCostume +
      auspSim * WEIGHTS.auspicious;

    return { item, similarityScore: Math.round(score * 1000) / 1000, differences: d };
  }).sort((a, b) => b.similarityScore - a.similarityScore);
}
