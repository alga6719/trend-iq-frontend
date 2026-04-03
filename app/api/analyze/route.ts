import { streamText } from "ai";
import { xai } from "@ai-sdk/xai";
import type { NextRequest } from "next/server";
import { tradingStrategies, getStrategyPrompt } from "@/lib/trading/strategies";
import {
  generateHistoricalData,
  formatDataForAI,
  simulateBacktest,
} from "@/lib/trading/historical-data";
import type { StrategyType } from "@/lib/trading/types";
import { formatPrice, formatVolume, formatMarketCap } from "@/lib/trading/coins";

interface CoinData {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  market_cap: number;
}

export async function POST(request: NextRequest) {
  try {
    const { strategyId, coinId, coinData } = await request.json();

    if (!strategyId) {
      return new Response("Strategy ID is required", { status: 400 });
    }

    const strategy = tradingStrategies.find((s) => s.id === strategyId);
    if (!strategy) {
      return new Response("Invalid strategy", { status: 400 });
    }

    // Generate simulated historical data for training context
    const startPrice = coinData?.current_price || 100;
    const historicalData = generateHistoricalData(30, startPrice, 0.025);
    const backtestResults = simulateBacktest(strategyId as StrategyType, historicalData);

    // Build market data context
    let marketContext = "";
    if (coinData) {
      const coin = coinData as CoinData;
      marketContext = `
LIVE MARKET DATA FOR ${coin.name.toUpperCase()} (${coin.symbol.toUpperCase()}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Price: ${formatPrice(coin.current_price)}
24h Change: ${coin.price_change_percentage_24h >= 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%
7d Change: ${coin.price_change_percentage_7d ? (coin.price_change_percentage_7d >= 0 ? "+" : "") + coin.price_change_percentage_7d.toFixed(2) + "%" : "N/A"}
24h High: ${formatPrice(coin.high_24h)}
24h Low: ${formatPrice(coin.low_24h)}
24h Volume: ${formatVolume(coin.total_volume)}
Market Cap: ${formatMarketCap(coin.market_cap)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24h Price Range: ${formatPrice(coin.low_24h)} - ${formatPrice(coin.high_24h)}
Range Position: ${(((coin.current_price - coin.low_24h) / (coin.high_24h - coin.low_24h)) * 100).toFixed(1)}% from low
`;
    }

    // Get simulated technical indicators
    const simulatedData = formatDataForAI(historicalData);

    const systemPrompt = `You are an expert cryptocurrency trading AI analyst specializing in technical analysis and algorithmic trading strategies. You analyze real-time market data and provide actionable trading insights.

Your expertise includes:
- Technical analysis using ${strategy.indicators.join(", ")}
- The ${strategy.name} trading strategy
- Risk management and position sizing
- Market psychology and sentiment analysis

Guidelines:
1. Be specific with price levels, not vague
2. Always consider risk management
3. Provide probability-based assessments
4. Never guarantee profits - trading involves risk
5. Format your response clearly with sections and bullet points
6. Consider the coin's volatility and market conditions`;

    const userPrompt = `Analyze ${coinData?.name || "the asset"} (${coinData?.symbol?.toUpperCase() || "CRYPTO"}) using the ${strategy.name} strategy.

${marketContext}

STRATEGY DETAILS:
${getStrategyPrompt(strategy)}

HISTORICAL BACKTEST RESULTS (Simulated):
- Total Trades: ${backtestResults.totalTrades}
- Win Rate: ${(backtestResults.winRate * 100).toFixed(1)}%
- Profit Factor: ${backtestResults.profitFactor}
- Max Drawdown: ${(backtestResults.maxDrawdown * 100).toFixed(1)}%
- Sharpe Ratio: ${backtestResults.sharpeRatio}
- Total Return: ${(backtestResults.totalReturn * 100).toFixed(1)}%

SIMULATED TECHNICAL DATA:
${simulatedData}

Please provide a comprehensive analysis with:

## 1. Market Assessment
Current market condition and trend analysis for ${coinData?.symbol?.toUpperCase() || "this asset"}

## 2. ${strategy.name} Strategy Alignment
How well does ${coinData?.name || "this asset"} currently match the ${strategy.name} strategy requirements?

## 3. Trade Recommendation
- Action: (Strong Buy / Buy / Hold / Sell / Strong Sell)
- Confidence Level: (as percentage)
- Reasoning: (brief explanation)

## 4. Entry & Exit Levels
- Suggested Entry Zone: $X - $Y
- Stop Loss: $X (X% risk)
- Take Profit Target 1: $X (X% potential)
- Take Profit Target 2: $X (X% potential)

## 5. Risk Management
- Suggested Position Size: X% of portfolio
- Risk/Reward Ratio: X:X
- Key Risk Factors to watch

## 6. Key Insights
- 3-5 bullet points of actionable insights

## 7. What to Watch
- Key levels and events to monitor for your next decision`;

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error analyzing strategy:", error);
    return new Response("Failed to analyze strategy", { status: 500 });
  }
}
