"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";
import type { Coin } from "@/lib/trading/coins";

interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

interface LivePriceChartProps {
  coin: Coin | null;
}

const timeframes = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export function LivePriceChart({ coin }: LivePriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(30);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    if (!coin) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/coins/${coin.id}/chart?days=${selectedTimeframe}`
      );
      if (!res.ok) throw new Error("Failed to fetch chart data");

      const data = await res.json();
      setChartData(data.chartData);
    } catch (err) {
      setError("Failed to load chart data");
      console.error("Chart fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [coin, selectedTimeframe]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  if (!coin) {
    return (
      <div className="h-[350px] bg-[var(--card)] rounded-lg border border-[var(--border)] flex items-center justify-center">
        <p className="text-[var(--muted-foreground)]">
          Select a coin to view price chart
        </p>
      </div>
    );
  }

  const priceChange =
    chartData.length > 1
      ? ((chartData[chartData.length - 1]?.price - chartData[0]?.price) /
          chartData[0]?.price) *
        100
      : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.days}
              onClick={() => setSelectedTimeframe(tf.days)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                selectedTimeframe === tf.days
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <button
          onClick={fetchChartData}
          disabled={isLoading}
          className="p-2 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </button>
      </div>

      {isLoading ? (
        <div className="h-[280px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : error ? (
        <div className="h-[280px] flex items-center justify-center">
          <p className="text-[var(--muted-foreground)]">{error}</p>
        </div>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="liveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? "var(--success)" : "var(--destructive)"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? "var(--success)" : "var(--destructive)"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (selectedTimeframe <= 1) {
                    return date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `$${(value / 1000).toFixed(1)}k`
                    : `$${value.toFixed(2)}`
                }
                domain={["auto", "auto"]}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                labelFormatter={(value) =>
                  new Date(value).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                formatter={(value: number) => [
                  `$${value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}`,
                  "Price",
                ]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "var(--success)" : "var(--destructive)"}
                strokeWidth={2}
                fill="url(#liveGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
