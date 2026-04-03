"use client";

import { useState, useCallback } from "react";
import { tradingStrategies } from "@/lib/trading/strategies";
import type { TradingStrategy, BacktestResult } from "@/lib/trading/types";
import { StrategyCard } from "@/components/strategy-card";
import { BacktestResults } from "@/components/backtest-results";
import { AIAnalysisPanel } from "@/components/ai-analysis-panel";
import { PriceChart } from "@/components/price-chart";
import {
  TrendingUp,
  Brain,
  History,
  Loader2,
  Play,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface ChartData {
  date: string;
  price: number;
  volume: number;
}

export default function DashboardPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(
    null
  );
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(
    null
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isBacktesting, setIsBacktesting] = useState(false);

  const runBacktest = useCallback(async () => {
    if (!selectedStrategy) return;

    setIsBacktesting(true);
    try {
      const res = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyId: selectedStrategy.id, days: 30 }),
      });

      if (!res.ok) throw new Error("Failed to run backtest");

      const data = await res.json();
      setBacktestResults(data.results);
      setChartData(data.chartData);
    } catch (error) {
      console.error("Backtest error:", error);
    } finally {
      setIsBacktesting(false);
    }
  }, [selectedStrategy]);

  const handleStrategySelect = (strategy: TradingStrategy) => {
    setSelectedStrategy(strategy);
    setBacktestResults(null);
    setChartData([]);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--primary)]/20">
                <TrendingUp className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--foreground)]">
                  Trend IQ
                </h1>
                <p className="text-xs text-[var(--muted-foreground)]">
                  AI-Powered Trading Strategies
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Strategy Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Trading Strategies
              </h2>
            </div>
            <div className="space-y-3">
              {tradingStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  isSelected={selectedStrategy?.id === strategy.id}
                  onClick={() => handleStrategySelect(strategy)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Results & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strategy Details & Backtest Button */}
            {selectedStrategy && (
              <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {selectedStrategy.name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {selectedStrategy.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedStrategy.indicators.map((indicator) => (
                        <span
                          key={indicator}
                          className="px-2 py-1 text-xs rounded-md bg-[var(--secondary)] text-[var(--muted-foreground)]"
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={runBacktest}
                    disabled={isBacktesting}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      "bg-[var(--accent)] text-[var(--accent-foreground)]",
                      "hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isBacktesting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Backtest
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Backtest Results */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Backtest Results (30 Days)
                </h2>
              </div>
              <BacktestResults
                results={backtestResults}
                isLoading={isBacktesting}
              />
            </div>

            {/* Price Chart */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[var(--chart-1)]" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Price History
                </h2>
              </div>
              <PriceChart data={chartData} isLoading={isBacktesting} />
            </div>

            {/* AI Analysis */}
            <AIAnalysisPanel strategy={selectedStrategy} />
          </div>
        </div>
      </main>
    </div>
  );
}
