/**
 * 利润模型 - 计算角色交易的预期收益
 * Phase 3: 删除 Quick Sell = 85% 硬编码，改为市场模型输入
 */

export interface ProfitInput {
  purchasePrice: number;
  targetListPrice: number | null;
  expectedSalePrice: number | null;
  quickSellValue: number | null; // 来自市场模型，不再硬编码
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
    quickSellValue,
    saleFeeRate,
    quickSellFeeRate,
    otherCosts,
  } = input;

  const purchaseCost = purchasePrice + otherCosts;

  if (saleFeeRate === null || quickSellFeeRate === null) {
    return {
      purchasePrice, targetListPrice, expectedSalePrice,
      purchaseCost, saleFee: null, quickSellFee: null,
      otherCost: otherCosts, netProceeds: null, netProfit: null, roi: null,
      breakEvenSalePrice: null,
      quickSell: { salePrice: null, fee: null, netProceeds: null, netProfit: null, roi: null },
      base: { salePrice: null, fee: null, netProceeds: null, netProfit: null, roi: null },
      optimistic: { salePrice: null, fee: null, netProceeds: null, netProfit: null, roi: null },
      maxPurchasePrice: null
    };
  }

  // Quick Sell 情景 - 使用市场模型提供的 quickSellValue
  const qsPrice = quickSellValue;
  const qsFee = qsPrice !== null ? qsPrice * quickSellFeeRate : null;
  const qsNet = qsPrice !== null && qsFee !== null ? qsPrice - qsFee : null;
  const qsProfit = qsNet !== null ? qsNet - purchaseCost : null;
  const qsROI = qsProfit !== null ? (qsProfit / purchaseCost) * 100 : null;

  // Base 情景
  const basePrice = expectedSalePrice;
  const baseFee = basePrice !== null ? basePrice * saleFeeRate : null;
  const baseNet = basePrice !== null && baseFee !== null ? basePrice - baseFee : null;
  const baseProfit = baseNet !== null ? baseNet - purchaseCost : null;
  const baseROI = baseProfit !== null ? (baseProfit / purchaseCost) * 100 : null;

  // Optimistic 情景
  const optPrice = targetListPrice;
  const optFee = optPrice !== null ? optPrice * saleFeeRate : null;
  const optNet = optPrice !== null && optFee !== null ? optPrice - optFee : null;
  const optProfit = optNet !== null ? optNet - purchaseCost : null;
  const optROI = optProfit !== null ? (optProfit / purchaseCost) * 100 : null;

  const breakEven = saleFeeRate < 1 ? purchaseCost / (1 - saleFeeRate) : null;
  const maxPurchase = qsNet !== null ? qsNet - otherCosts : null;

  return {
    purchasePrice, targetListPrice, expectedSalePrice,
    purchaseCost, saleFee: baseFee, quickSellFee: qsFee,
    otherCost: otherCosts, netProceeds: baseNet, netProfit: baseProfit, roi: baseROI,
    breakEvenSalePrice: breakEven,
    quickSell: { salePrice: qsPrice, fee: qsFee, netProceeds: qsNet, netProfit: qsProfit, roi: qsROI },
    base: { salePrice: basePrice, fee: baseFee, netProceeds: baseNet, netProfit: baseProfit, roi: baseROI },
    optimistic: { salePrice: optPrice, fee: optFee, netProceeds: optNet, netProfit: optProfit, roi: optROI },
    maxPurchasePrice: maxPurchase
  };
}
