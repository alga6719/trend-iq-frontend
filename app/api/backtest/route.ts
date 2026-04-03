import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { tradingStrategies } from "@/lib/trading/strategies";
import {
  generateHistoricalData,
  simulateBacktest,
} from "@/lib/trading/historical-data";
import type { StrategyType } from "@/lib/trading/types";

export async function POST(request: NextRequest) {
  try {
    const { strategyId, days = 30 } = await request.json();

    if (!strategyId) {
      return NextResponse.json(
        { error: "Strategy ID is required" },
        { status: 400 }
      );
    }

    const strategy = tradingStrategies.find((s) => s.id === strategyId);
    if (!strategy) {
      return NextResponse.json(
        { error: "Invalid strategy" },
        { status: 400 }
      );
    }

    // Generate historical data and run backtest
    const historicalData = generateHistoricalData(days, 100, 0.025);
    const results = simulateBacktest(strategyId as StrategyType, historicalData);

    // Generate chart data for visualization
    const chartData = historicalData
      .filter((_, i) => i % 24 === 0) // Daily data points
      .map((d) => ({
        date: d.timestamp.toISOString().split("T")[0],
        price: d.close,
        volume: d.volume,
      }));

    return NextResponse.json({
      strategy,
      results,
      chartData,
    });
  } catch (error) {
    console.error("Error running backtest:", error);
    return NextResponse.json(
      { error: "Failed to run backtest" },
      { status: 500 }
    );
  }
}
