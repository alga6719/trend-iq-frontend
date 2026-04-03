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
    const { strategyId, coinId, days = 30 } = await request.json();

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

    // If we have a coinId, try to fetch real historical data
    let chartData: { date: string; price: number; volume: number }[] = [];
    let startPrice = 100;

    if (coinId) {
      try {
        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
          {
            headers: { Accept: "application/json" },
            next: { revalidate: 300 },
          }
        );

        if (chartRes.ok) {
          const chartJson = await chartRes.json();
          chartData = chartJson.prices.map(
            ([timestamp, price]: [number, number], index: number) => ({
              date: new Date(timestamp).toISOString().split("T")[0],
              price,
              volume: chartJson.total_volumes[index]?.[1] || 0,
            })
          );
          startPrice = chartData[0]?.price || 100;
        }
      } catch (e) {
        console.error("Error fetching coin chart data:", e);
      }
    }

    // Generate historical data for backtest simulation
    const historicalData = generateHistoricalData(days, startPrice, 0.025);
    const results = simulateBacktest(strategyId as StrategyType, historicalData);

    // If we didn't get real chart data, generate synthetic
    if (chartData.length === 0) {
      chartData = historicalData
        .filter((_, i) => i % 24 === 0)
        .map((d) => ({
          date: d.timestamp.toISOString().split("T")[0],
          price: d.close,
          volume: d.volume,
        }));
    }

    return NextResponse.json({
      strategy,
      results,
      chartData,
      coinId,
    });
  } catch (error) {
    console.error("Error running backtest:", error);
    return NextResponse.json(
      { error: "Failed to run backtest" },
      { status: 500 }
    );
  }
}
