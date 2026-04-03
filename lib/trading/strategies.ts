import type { TradingStrategy } from "./types";

export const tradingStrategies: TradingStrategy[] = [
  {
    id: "momentum",
    name: "Momentum Trading",
    description:
      "Buying assets with high upward momentum and selling when they weaken, riding the trend. This strategy capitalizes on the continuation of existing trends in the market.",
    timeframe: "1H - 4H",
    riskLevel: "medium",
    indicators: ["RSI", "MACD", "Volume", "Moving Averages"],
    bestMarketCondition: "Strong trending markets with clear directional movement",
  },
  {
    id: "breakout",
    name: "Breakout Trading",
    description:
      "Identifying support and resistance levels, then entering a trade when the price breaks through these levels with high volume. Targets significant price movements after consolidation periods.",
    timeframe: "15M - 1H",
    riskLevel: "high",
    indicators: ["Support/Resistance", "Volume", "Bollinger Bands", "ATR"],
    bestMarketCondition: "After consolidation periods with building volume",
  },
  {
    id: "scalping",
    name: "Scalping",
    description:
      "Making dozens or hundreds of trades a day to capture small, consistent profits from tiny price movements. Requires quick execution and tight risk management.",
    timeframe: "1M - 5M",
    riskLevel: "high",
    indicators: ["Order Flow", "Level 2 Data", "EMA 9/21", "VWAP"],
    bestMarketCondition: "High liquidity markets with tight spreads",
  },
  {
    id: "range",
    name: "Range Trading",
    description:
      "Buying at support levels and selling at resistance levels, ideal for sideways markets. Profits from predictable price oscillations within defined boundaries.",
    timeframe: "1H - 4H",
    riskLevel: "low",
    indicators: ["Support/Resistance", "RSI", "Stochastic", "Bollinger Bands"],
    bestMarketCondition: "Sideways/consolidating markets with clear ranges",
  },
  {
    id: "trend-following",
    name: "Trend Following",
    description:
      "Identifying the trend with 4-hour charts, then using shorter timeframes (e.g., 5-minute) to enter positions in that direction. Combines multiple timeframe analysis for optimal entries.",
    timeframe: "5M entry, 4H trend",
    riskLevel: "medium",
    indicators: ["EMA 50/200", "ADX", "Trend Lines", "Higher Highs/Lows"],
    bestMarketCondition: "Established trends with clear higher highs or lower lows",
  },
];

export function getStrategy(id: string): TradingStrategy | undefined {
  return tradingStrategies.find((s) => s.id === id);
}

export function getStrategyPrompt(strategy: TradingStrategy): string {
  return `
Strategy: ${strategy.name}
Description: ${strategy.description}
Timeframe: ${strategy.timeframe}
Risk Level: ${strategy.riskLevel}
Key Indicators: ${strategy.indicators.join(", ")}
Best Market Condition: ${strategy.bestMarketCondition}
`;
}
