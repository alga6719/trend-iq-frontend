"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

interface PriceChartProps {
  data: ChartDataPoint[];
  isLoading: boolean;
}

export function PriceChart({ data, isLoading }: PriceChartProps) {
  if (isLoading) {
    return (
      <div className="h-[300px] bg-[var(--card)] rounded-lg border border-[var(--border)] animate-pulse flex items-center justify-center">
        <div className="text-[var(--muted-foreground)]">Loading chart...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] bg-[var(--card)] rounded-lg border border-[var(--border)] flex items-center justify-center">
        <div className="text-[var(--muted-foreground)]">
          Run backtest to see price chart
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px] bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
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
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
