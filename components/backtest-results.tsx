"use client";

import { cn } from "@/lib/utils";
import type { BacktestResult } from "@/lib/trading/types";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  BarChart2,
  Activity,
} from "lucide-react";

interface BacktestResultsProps {
  results: BacktestResult | null;
  isLoading: boolean;
}

export function BacktestResults({ results, isLoading }: BacktestResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] animate-pulse"
          >
            <div className="h-4 w-20 bg-[var(--secondary)] rounded mb-2" />
            <div className="h-6 w-16 bg-[var(--secondary)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-8 text-center text-[var(--muted-foreground)] bg-[var(--card)] rounded-lg border border-[var(--border)]">
        Select a strategy and run backtest to see results
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Trades",
      value: results.totalTrades,
      icon: Activity,
      color: "text-[var(--accent)]",
    },
    {
      label: "Win Rate",
      value: `${(results.winRate * 100).toFixed(1)}%`,
      icon: results.winRate >= 0.5 ? TrendingUp : TrendingDown,
      color: results.winRate >= 0.5 ? "text-[var(--success)]" : "text-[var(--destructive)]",
    },
    {
      label: "Profit Factor",
      value: results.profitFactor.toFixed(2),
      icon: Target,
      color: results.profitFactor >= 1.5 ? "text-[var(--success)]" : "text-[var(--warning)]",
    },
    {
      label: "Max Drawdown",
      value: `${(results.maxDrawdown * 100).toFixed(1)}%`,
      icon: AlertTriangle,
      color: results.maxDrawdown <= 0.15 ? "text-[var(--success)]" : "text-[var(--destructive)]",
    },
    {
      label: "Sharpe Ratio",
      value: results.sharpeRatio.toFixed(2),
      icon: BarChart2,
      color: results.sharpeRatio >= 1 ? "text-[var(--success)]" : "text-[var(--warning)]",
    },
    {
      label: "Total Return",
      value: `${(results.totalReturn * 100).toFixed(1)}%`,
      icon: results.totalReturn >= 0 ? TrendingUp : TrendingDown,
      color: results.totalReturn >= 0 ? "text-[var(--success)]" : "text-[var(--destructive)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]"
        >
          <div className="flex items-center gap-2 mb-1">
            <metric.icon className={cn("w-4 h-4", metric.color)} />
            <span className="text-xs text-[var(--muted-foreground)]">
              {metric.label}
            </span>
          </div>
          <p className={cn("text-xl font-semibold", metric.color)}>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
