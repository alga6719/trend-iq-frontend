export type StrategyType =
  | "momentum"
  | "breakout"
  | "scalping"
  | "range"
  | "trend-following";

export interface TradingStrategy {
  id: StrategyType;
  name: string;
  description: string;
  timeframe: string;
  riskLevel: "low" | "medium" | "high";
  indicators: string[];
  bestMarketCondition: string;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeSignal {
  type: "buy" | "sell" | "hold";
  strategy: StrategyType;
  confidence: number;
  price: number;
  timestamp: Date;
  reasoning: string;
}

export interface BacktestResult {
  strategy: StrategyType;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalReturn: number;
  trades: TradeSignal[];
}

export interface AIAnalysis {
  strategy: StrategyType;
  recommendation: "strong-buy" | "buy" | "hold" | "sell" | "strong-sell";
  confidence: number;
  analysis: string;
  keyInsights: string[];
  riskAssessment: string;
  suggestedEntry?: number;
  suggestedStopLoss?: number;
  suggestedTakeProfit?: number;
}
