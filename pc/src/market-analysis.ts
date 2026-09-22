/**
 * 市场统计分析 - 对独立样本计算价格分布
 * Phase 3: 简单统计，不上机器学习
 */

export interface MarketSample {
  itemId: string;
  detailUrl: string;
  fingerprint: string;
  price: number;
  level: number;
  school: string;
  server: string;
  achievement: number | null;
  humanCultivation: number | null;
  petCultivation: number | null;
  potentialFruit: number | null;
  costumeCount: number | null;
  limitedCostumeCount: number | null;
  auspiciousCount: number | null;
}

export interface MarketStats {
  count: number;
  min: number;
  p10: number;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  max: number;
  mean: number;
}

export function computeStats(prices: number[]): MarketStats | null {
  if (prices.length === 0) return null;

  const sorted = [...prices].sort((a, b) => a - b);
  const n = sorted.length;

  const percentile = (p: number) => {
    const idx = (p / 100) * (n - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
  };

  return {
    count: n,
    min: sorted[0],
    p10: percentile(10),
    p25: percentile(25),
    median: percentile(50),
    p75: percentile(75),
    p90: percentile(90),
    max: sorted[n - 1],
    mean: sorted.reduce((a, b) => a + b, 0) / n
  };
}

export function filterSamples(
  samples: MarketSample[],
  filters: {
    school?: string;
    level?: number;
    humanCultivationRange?: [number, number];
    petCultivationRange?: [number, number];
    priceRange?: [number, number];
  }
): MarketSample[] {
  return samples.filter(s => {
    if (filters.school && s.school !== filters.school) return false;
    if (filters.level && s.level !== filters.level) return false;
    if (filters.priceRange) {
      if (s.price < filters.priceRange[0] || s.price > filters.priceRange[1]) return false;
    }
    if (filters.humanCultivationRange) {
      if (s.humanCultivation === null) return false;
      if (s.humanCultivation < filters.humanCultivationRange[0] ||
          s.humanCultivation > filters.humanCultivationRange[1]) return false;
    }
    if (filters.petCultivationRange) {
      if (s.petCultivation === null) return false;
      if (s.petCultivation < filters.petCultivationRange[0] ||
          s.petCultivation > filters.petCultivationRange[1]) return false;
    }
    return true;
  });
}

export function generateFingerprint(sample: Omit<MarketSample, 'itemId' | 'detailUrl' | 'fingerprint' | 'price'>): string {
  const key = [
    sample.level,
    sample.school,
    sample.server,
    sample.achievement ?? 0,
    sample.humanCultivation ?? 0,
    sample.petCultivation ?? 0,
    sample.potentialFruit ?? 0,
    sample.costumeCount ?? 0,
    sample.limitedCostumeCount ?? 0,
    sample.auspiciousCount ?? 0
  ].join('|');

  // Simple hash
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
