import type { HistoricalDataPoint, BacktestResult, StrategyType } from "./types";

// Generate realistic historical price data for training
export function generateHistoricalData(
  days: number = 90,
  startPrice: number = 100,
  volatility: number = 0.02
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  let currentPrice = startPrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate 24 hourly candles per day
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(date);
      timestamp.setHours(hour, 0, 0, 0);

      // Random walk with trend
      const trend = Math.sin(i / 30) * 0.001; // Slight cyclical trend
      const change = (Math.random() - 0.5) * volatility + trend;
      
      const open = currentPrice;
      const closeChange = change * currentPrice;
      const close = open + closeChange;
      
      // High and low based on volatility
      const range = Math.abs(closeChange) + Math.random() * volatility * currentPrice;
      const high = Math.max(open, close) + range * Math.random();
      const low = Math.min(open, close) - range * Math.random();
      
      // Volume varies with price movement
      const baseVolume = 1000000;
      const volumeMultiplier = 1 + Math.abs(change) * 10;
      const volume = Math.floor(baseVolume * volumeMultiplier * (0.5 + Math.random()));

      data.push({
        timestamp,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });

      currentPrice = close;
    }
  }

  return data;
}

// Calculate technical indicators
export function calculateRSI(data: HistoricalDataPoint[], period: number = 14): number[] {
  const rsi: number[] = [];
  const changes = data.map((d, i) => (i === 0 ? 0 : d.close - data[i - 1].close));

  for (let i = period; i < data.length; i++) {
    const relevantChanges = changes.slice(i - period + 1, i + 1);
    const gains = relevantChanges.filter((c) => c > 0).reduce((a, b) => a + b, 0) / period;
    const losses = Math.abs(relevantChanges.filter((c) => c < 0).reduce((a, b) => a + b, 0)) / period;
    
    const rs = losses === 0 ? 100 : gains / losses;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
}

export function calculateSMA(data: HistoricalDataPoint[], period: number): number[] {
  const sma: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b.close, 0);
    sma.push(Number((sum / period).toFixed(2)));
  }
  return sma;
}

export function calculateEMA(data: HistoricalDataPoint[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for the first value
  const sma = data.slice(0, period).reduce((a, b) => a + b.close, 0) / period;
  ema.push(sma);

  for (let i = period; i < data.length; i++) {
    const currentEMA = (data[i].close - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(Number(currentEMA.toFixed(2)));
  }

  return ema;
}

// Simulate backtest results for each strategy
export function simulateBacktest(
  strategy: StrategyType,
  data: HistoricalDataPoint[]
): BacktestResult {
  // Simulated results based on strategy characteristics
  const strategyMetrics: Record<StrategyType, Partial<BacktestResult>> = {
    momentum: {
      winRate: 0.55 + Math.random() * 0.1,
      profitFactor: 1.8 + Math.random() * 0.4,
      maxDrawdown: 0.12 + Math.random() * 0.05,
      sharpeRatio: 1.2 + Math.random() * 0.3,
      totalReturn: 0.25 + Math.random() * 0.15,
    },
    breakout: {
      winRate: 0.45 + Math.random() * 0.1,
      profitFactor: 2.0 + Math.random() * 0.5,
      maxDrawdown: 0.18 + Math.random() * 0.07,
      sharpeRatio: 1.0 + Math.random() * 0.4,
      totalReturn: 0.30 + Math.random() * 0.20,
    },
    scalping: {
      winRate: 0.65 + Math.random() * 0.1,
      profitFactor: 1.3 + Math.random() * 0.2,
      maxDrawdown: 0.08 + Math.random() * 0.04,
      sharpeRatio: 1.5 + Math.random() * 0.3,
      totalReturn: 0.15 + Math.random() * 0.10,
    },
    range: {
      winRate: 0.60 + Math.random() * 0.1,
      profitFactor: 1.5 + Math.random() * 0.3,
      maxDrawdown: 0.10 + Math.random() * 0.05,
      sharpeRatio: 1.3 + Math.random() * 0.3,
      totalReturn: 0.18 + Math.random() * 0.12,
    },
    "trend-following": {
      winRate: 0.50 + Math.random() * 0.1,
      profitFactor: 2.2 + Math.random() * 0.5,
      maxDrawdown: 0.15 + Math.random() * 0.06,
      sharpeRatio: 1.4 + Math.random() * 0.3,
      totalReturn: 0.35 + Math.random() * 0.20,
    },
  };

  const metrics = strategyMetrics[strategy];

  return {
    strategy,
    totalTrades: Math.floor(50 + Math.random() * 150),
    winRate: Number((metrics.winRate ?? 0.5).toFixed(2)),
    profitFactor: Number((metrics.profitFactor ?? 1.5).toFixed(2)),
    maxDrawdown: Number((metrics.maxDrawdown ?? 0.15).toFixed(2)),
    sharpeRatio: Number((metrics.sharpeRatio ?? 1.0).toFixed(2)),
    totalReturn: Number((metrics.totalReturn ?? 0.2).toFixed(2)),
    trades: [],
  };
}

// Format data for AI analysis
export function formatDataForAI(data: HistoricalDataPoint[]): string {
  const recentData = data.slice(-168); // Last 7 days of hourly data
  const rsi = calculateRSI(data);
  const sma20 = calculateSMA(data, 20);
  const sma50 = calculateSMA(data, 50);
  const ema9 = calculateEMA(data, 9);
  const ema21 = calculateEMA(data, 21);

  const latestPrice = data[data.length - 1];
  const latestRSI = rsi[rsi.length - 1];
  const latestSMA20 = sma20[sma20.length - 1];
  const latestSMA50 = sma50[sma50.length - 1];
  const latestEMA9 = ema9[ema9.length - 1];
  const latestEMA21 = ema21[ema21.length - 1];

  // Calculate price changes
  const priceChange24h = ((latestPrice.close - data[data.length - 25]?.close) / data[data.length - 25]?.close * 100) || 0;
  const priceChange7d = ((latestPrice.close - data[data.length - 169]?.close) / data[data.length - 169]?.close * 100) || 0;

  // Determine trend
  const trend = latestEMA9 > latestEMA21 ? "Bullish" : "Bearish";
  const strength = Math.abs(latestEMA9 - latestEMA21) / latestEMA21 * 100;

  return `
CURRENT MARKET DATA:
- Current Price: $${latestPrice.close.toFixed(2)}
- 24h Change: ${priceChange24h.toFixed(2)}%
- 7d Change: ${priceChange7d.toFixed(2)}%
- 24h High: $${Math.max(...recentData.slice(-24).map(d => d.high)).toFixed(2)}
- 24h Low: $${Math.min(...recentData.slice(-24).map(d => d.low)).toFixed(2)}
- 24h Volume: ${recentData.slice(-24).reduce((a, b) => a + b.volume, 0).toLocaleString()}

TECHNICAL INDICATORS:
- RSI (14): ${latestRSI.toFixed(2)} ${latestRSI > 70 ? "(Overbought)" : latestRSI < 30 ? "(Oversold)" : "(Neutral)"}
- SMA 20: $${latestSMA20.toFixed(2)} ${latestPrice.close > latestSMA20 ? "(Price Above)" : "(Price Below)"}
- SMA 50: $${latestSMA50.toFixed(2)} ${latestPrice.close > latestSMA50 ? "(Price Above)" : "(Price Below)"}
- EMA 9: $${latestEMA9.toFixed(2)}
- EMA 21: $${latestEMA21.toFixed(2)}
- EMA Cross: ${latestEMA9 > latestEMA21 ? "Bullish (9 above 21)" : "Bearish (9 below 21)"}

TREND ANALYSIS:
- Current Trend: ${trend}
- Trend Strength: ${strength.toFixed(2)}%
- Support Level: $${Math.min(...recentData.slice(-48).map(d => d.low)).toFixed(2)}
- Resistance Level: $${Math.max(...recentData.slice(-48).map(d => d.high)).toFixed(2)}

RECENT PRICE ACTION (Last 24 candles):
${recentData.slice(-24).map(d => 
  `${d.timestamp.toISOString().slice(11, 16)} | O: $${d.open.toFixed(2)} H: $${d.high.toFixed(2)} L: $${d.low.toFixed(2)} C: $${d.close.toFixed(2)} V: ${d.volume.toLocaleString()}`
).join('\n')}
`;
}
