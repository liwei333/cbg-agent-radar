/**
 * 利润模型 - 计算角色交易的预期收益
 * 注意：所有费用规则必须从当前梦幻西游藏宝阁实际页面确认，不能猜
 */

export interface ProfitInput {
  purchasePrice: number;
  targetListPrice: number | null;
  expectedSalePrice: number | null;
  saleFeeRate: number | null;
  quickSellFeeRate: number | null;
  otherCosts: number;
  holdingDays: number;
}

export interface ProfitResult {
  purchasePrice: number;
  targetListPrice: number | null;
  expectedSalePrice: number | null;

  purchaseCost: number;
  saleFee: number | null;
  quickSellFee: number | null;
  otherCost: number;

  netProceeds: number | null;
  netProfit: number | null;
  roi: number | null;

  breakEvenSalePrice: number | null;

  quickSell: {
    salePrice: number | null;
    fee: number | null;
    netProceeds: number | null;
    netProfit: number | null;
    roi: number | null;
  };

  base: {
    salePrice: number | null;
    fee: number | null;
    netProceeds: number | null;
    netProfit: number | null;
    roi: number | null;
  };

  optimistic: {
    salePrice: number | null;
    fee: number | null;
    netProceeds: number | null;
    netProfit: number | null;
    roi: number | null;
  };

  maxPurchasePrice: number | null;
}

export function calculateProfit(input: ProfitInput): ProfitResult {
  const {
    purchasePrice,
    targetListPrice,
    expectedSalePrice,
    saleFeeRate,
    quickSellFeeRate,
    otherCosts,
    holdingDays
  } = input;

  // 买入成本
  const purchaseCost = purchasePrice + otherCosts;

  // 如果手续费率未知，无法计算
  if (saleFeeRate === null || quickSellFeeRate === null) {
    return {
      purchasePrice,
      targetListPrice,
      expectedSalePrice,
      purchaseCost,
      saleFee: null,
      quickSellFee: null,
      otherCost: otherCosts,
      netProceeds: null,
      netProfit: null,
      roi: null,
      breakEvenSalePrice: null,
      quickSell: { salePrice: null, fee: null, netProceeds: null, netProfit: null, roi: null },
      base: { salePrice: null, fee: null, netProceeds: null, netProfit: null, roi: null },
      optimistic: { salePrice: null, fee: null, netProceeds: null, netProfit: null, roi: null },
      maxPurchasePrice: null
    };
  }

  // Quick Sell 情景
  const quickSellPrice = expectedSalePrice ? expectedSalePrice * 0.85 : null;
  const quickSellFee = quickSellPrice ? quickSellPrice * quickSellFeeRate : null;
  const quickSellNet = quickSellPrice !== null && quickSellFee !== null ? quickSellPrice - quickSellFee : null;
  const quickSellProfit = quickSellNet !== null ? quickSellNet - purchaseCost : null;
  const quickSellROI = quickSellProfit !== null ? (quickSellProfit / purchaseCost) * 100 : null;

  // Base 情景
  const basePrice = expectedSalePrice;
  const baseFee = basePrice ? basePrice * saleFeeRate : null;
  const baseNet = basePrice !== null && baseFee !== null ? basePrice - baseFee : null;
  const baseProfit = baseNet !== null ? baseNet - purchaseCost : null;
  const baseROI = baseProfit !== null ? (baseProfit / purchaseCost) * 100 : null;

  // Optimistic 情景
  const optPrice = targetListPrice;
  const optFee = optPrice ? optPrice * saleFeeRate : null;
  const optNet = optPrice !== null && optFee !== null ? optPrice - optFee : null;
  const optProfit = optNet !== null ? optNet - purchaseCost : null;
  const optROI = optProfit !== null ? (optProfit / purchaseCost) * 100 : null;

  // Break-even sale price
  const breakEven = saleFeeRate < 1 ? purchaseCost / (1 - saleFeeRate) : null;

  // Max purchase price (based on quick sell not losing money)
  const maxPurchase = quickSellPrice !== null && quickSellFee !== null
    ? quickSellPrice - quickSellFee - otherCosts
    : null;

  return {
    purchasePrice,
    targetListPrice,
    expectedSalePrice,
    purchaseCost,
    saleFee: baseFee,
    quickSellFee,
    otherCost: otherCosts,
    netProceeds: baseNet,
    netProfit: baseProfit,
    roi: baseROI,
    breakEvenSalePrice: breakEven,
    quickSell: {
      salePrice: quickSellPrice,
      fee: quickSellFee,
      netProceeds: quickSellNet,
      netProfit: quickSellProfit,
      roi: quickSellROI
    },
    base: {
      salePrice: basePrice,
      fee: baseFee,
      netProceeds: baseNet,
      netProfit: baseProfit,
      roi: baseROI
    },
    optimistic: {
      salePrice: optPrice,
      fee: optFee,
      netProceeds: optNet,
      netProfit: optProfit,
      roi: optROI
    },
    maxPurchasePrice: maxPurchase
  };
}
