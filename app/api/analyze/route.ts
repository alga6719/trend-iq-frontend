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

export async function POST(request: NextRequest) {
  try {
    const { strategyId } = await request.json();

    if (!strategyId) {
      return new Response("Strategy ID is required", { status: 400 });
    }

    const strategy = tradingStrategies.find((s) => s.id === strategyId);
    if (!strategy) {
      return new Response("Invalid strategy", { status: 400 });
    }

    // Generate historical data for training context
    const historicalData = generateHistoricalData(30, 100, 0.025);
    const marketData = formatDataForAI(historicalData);
    const backtestResults = simulateBacktest(strategyId as StrategyType, historicalData);

    const systemPrompt = `You are an expert trading AI analyst specializing in technical analysis and algorithmic trading strategies. You have been trained on historical market data and are now providing analysis for the ${strategy.name} strategy.

Your role is to:
1. Analyze the provided market data using the strategy's principles
2. Identify potential trade setups based on the strategy
3. Provide clear, actionable recommendations
4. Assess risk levels and suggest position sizing
5. Explain your reasoning in a way traders can understand

Always be realistic about market uncertainty and never guarantee profits. Provide probability-based assessments when possible.`;

    const userPrompt = `Analyze the following market data using the ${strategy.name} strategy and provide a comprehensive trading analysis.

STRATEGY DETAILS:
${getStrategyPrompt(strategy)}

HISTORICAL BACKTEST RESULTS:
- Total Trades: ${backtestResults.totalTrades}
- Win Rate: ${(backtestResults.winRate * 100).toFixed(1)}%
- Profit Factor: ${backtestResults.profitFactor}
- Max Drawdown: ${(backtestResults.maxDrawdown * 100).toFixed(1)}%
- Sharpe Ratio: ${backtestResults.sharpeRatio}
- Total Return: ${(backtestResults.totalReturn * 100).toFixed(1)}%

${marketData}

Please provide:
1. **Current Market Assessment**: Overall market condition and trend analysis
2. **Strategy Alignment**: How well current conditions match the ${strategy.name} strategy
3. **Trade Recommendation**: Specific action (Strong Buy, Buy, Hold, Sell, Strong Sell) with confidence level
4. **Entry/Exit Levels**: Suggested entry price, stop loss, and take profit levels
5. **Risk Assessment**: Current risk level and position sizing recommendation
6. **Key Insights**: 3-5 bullet points of important observations
7. **Watch Points**: What to monitor for the next trading decision

Format your response in a clear, structured way that traders can quickly scan and act upon.`;

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
