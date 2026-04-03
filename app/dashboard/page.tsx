"use client";

import { useState, useEffect, useCallback } from "react";
import { tradingStrategies } from "@/lib/trading/strategies";
import type { TradingStrategy, BacktestResult } from "@/lib/trading/types";
import type { Coin } from "@/lib/trading/coins";
import { CoinSelector } from "@/components/coin-selector";
import { CoinStats } from "@/components/coin-stats";
import { StrategyMatcher } from "@/components/strategy-matcher";
import { BacktestResults } from "@/components/backtest-results";
import { AIAnalysisPanel } from "@/components/ai-analysis-panel";
import { LivePriceChart } from "@/components/live-price-chart";
import {
  TrendingUp,
  Brain,
  Wallet,
  Play,
  Loader2,
  LogOut,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type TabType = "portfolio" | "strategies" | "analysis";

export default function DashboardPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [isLoadingCoins, setIsLoadingCoins] = useState(true);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("portfolio");

  // Fetch live coin data
  const fetchCoins = useCallback(async () => {
    setIsLoadingCoins(true);
    try {
      const res = await fetch("/api/coins");
      if (!res.ok) throw new Error("Failed to fetch coins");
      const data = await res.json();
      setCoins(data);
      
      // Auto-select first coin if none selected
      if (!selectedCoin && data.length > 0) {
        setSelectedCoin(data[0]);
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setIsLoadingCoins(false);
    }
  }, [selectedCoin]);

  useEffect(() => {
    fetchCoins();
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, [fetchCoins]);

  // Run backtest
  const runBacktest = useCallback(async () => {
    if (!selectedStrategy || !selectedCoin) return;

    setIsBacktesting(true);
    try {
      const res = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyId: selectedStrategy.id,
          coinId: selectedCoin.id,
          days: 30,
        }),
      });

      if (!res.ok) throw new Error("Failed to run backtest");

      const data = await res.json();
      setBacktestResults(data.results);
    } catch (error) {
      console.error("Backtest error:", error);
    } finally {
      setIsBacktesting(false);
    }
  }, [selectedStrategy, selectedCoin]);

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    setBacktestResults(null);
  };

  const handleStrategySelect = (strategy: TradingStrategy) => {
    setSelectedStrategy(strategy);
    setBacktestResults(null);
  };

  const tabs = [
    { id: "portfolio" as TabType, label: "Portfolio", icon: Wallet },
    { id: "strategies" as TabType, label: "Strategies", icon: Brain },
    { id: "analysis" as TabType, label: "AI Analysis", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-50">
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

            <div className="flex items-center gap-4">
              <button
                onClick={fetchCoins}
                disabled={isLoadingCoins}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn("w-4 h-4", isLoadingCoins && "animate-spin")} />
                Refresh
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "portfolio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Coin Selection */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Select Coin
                </h2>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Live prices
                </span>
              </div>
              <CoinSelector
                coins={coins}
                selectedCoin={selectedCoin}
                onSelect={handleCoinSelect}
                isLoading={isLoadingCoins}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">
              {selectedCoin && <CoinStats coin={selectedCoin} />}
              <LivePriceChart coin={selectedCoin} />
              
              {/* Quick Strategy Selection */}
              {selectedCoin && (
                <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                    Quick Strategy Match
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tradingStrategies.map((strategy) => (
                      <button
                        key={strategy.id}
                        onClick={() => {
                          handleStrategySelect(strategy);
                          setActiveTab("strategies");
                        }}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                          selectedStrategy?.id === strategy.id
                            ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]"
                            : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        )}
                      >
                        {strategy.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "strategies" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Strategy Selection */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Match Strategy to {selectedCoin?.symbol.toUpperCase() || "Coin"}
                </h2>
              </div>
              <StrategyMatcher
                coin={selectedCoin}
                selectedStrategy={selectedStrategy}
                onSelectStrategy={handleStrategySelect}
              />
            </div>

            {/* Strategy Details & Backtest */}
            <div className="lg:col-span-7 space-y-6">
              {selectedStrategy && selectedCoin ? (
                <>
                  {/* Strategy + Coin Header */}
                  <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-[var(--foreground)]">
                            {selectedStrategy.name}
                          </h3>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            for {selectedCoin.symbol.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)]">
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

                  {/* Backtest Results */}
                  <BacktestResults
                    results={backtestResults}
                    isLoading={isBacktesting}
                  />

                  {/* Price Chart */}
                  <LivePriceChart coin={selectedCoin} />
                </>
              ) : (
                <div className="p-12 text-center bg-[var(--card)] rounded-lg border border-[var(--border)]">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-40" />
                  <p className="text-[var(--muted-foreground)]">
                    {!selectedCoin
                      ? "Select a coin from the Portfolio tab first"
                      : "Select a strategy to see details and run backtest"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coin + Strategy Summary */}
            <div className="lg:col-span-4 space-y-4">
              {selectedCoin && <CoinStats coin={selectedCoin} />}
              
              {selectedStrategy && (
                <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">
                    Active Strategy
                  </h3>
                  <p className="text-lg text-[var(--primary)]">
                    {selectedStrategy.name}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    {selectedStrategy.timeframe} timeframe
                  </p>
                </div>
              )}

              {!selectedCoin && (
                <div className="p-6 text-center bg-[var(--card)] rounded-lg border border-[var(--border)]">
                  <Wallet className="w-10 h-10 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Select a coin from the Portfolio tab
                  </p>
                </div>
              )}

              {selectedCoin && !selectedStrategy && (
                <div className="p-6 text-center bg-[var(--card)] rounded-lg border border-[var(--border)]">
                  <Brain className="w-10 h-10 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Select a strategy from the Strategies tab
                  </p>
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="lg:col-span-8">
              <AIAnalysisPanel
                strategy={selectedStrategy}
                coin={selectedCoin}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
