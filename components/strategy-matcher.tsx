"use client";

import { cn } from "@/lib/utils";
import { tradingStrategies } from "@/lib/trading/strategies";
import type { TradingStrategy } from "@/lib/trading/types";
import type { Coin } from "@/lib/trading/coins";
import {
  Target,
  Zap,
  TrendingUp,
  BarChart2,
  Activity,
  CheckCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface StrategyMatcherProps {
  coin: Coin | null;
  selectedStrategy: TradingStrategy | null;
  onSelectStrategy: (strategy: TradingStrategy) => void;
}

const strategyIcons: Record<string, React.ReactNode> = {
  momentum: <TrendingUp className="w-5 h-5" />,
  breakout: <Zap className="w-5 h-5" />,
  scalping: <Activity className="w-5 h-5" />,
  range: <BarChart2 className="w-5 h-5" />,
  "trend-following": <Target className="w-5 h-5" />,
};

const riskColors: Record<string, string> = {
  low: "text-[var(--success)] bg-[var(--success)]/10",
  medium: "text-[var(--warning)] bg-[var(--warning)]/10",
  high: "text-[var(--destructive)] bg-[var(--destructive)]/10",
};

export function StrategyMatcher({
  coin,
  selectedStrategy,
  onSelectStrategy,
}: StrategyMatcherProps) {
  if (!coin) {
    return (
      <div className="p-6 text-center text-[var(--muted-foreground)] bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <Target className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p>Select a coin to match with a strategy</p>
      </div>
    );
  }

  // Calculate strategy recommendations based on coin metrics
  const getStrategyScore = (strategy: TradingStrategy): number => {
    const volatility = Math.abs(coin.price_change_percentage_24h);
    const trend7d = coin.price_change_percentage_7d_in_currency ?? 0;
    
    switch (strategy.id) {
      case "momentum":
        // Good for strong trends
        return Math.abs(trend7d) > 10 ? 90 : Math.abs(trend7d) > 5 ? 70 : 50;
      case "breakout":
        // Good for high volatility
        return volatility > 5 ? 85 : volatility > 3 ? 65 : 45;
      case "scalping":
        // Works well with any liquid market
        return coin.total_volume > 1_000_000_000 ? 80 : 60;
      case "range":
        // Better for sideways markets
        return Math.abs(trend7d) < 5 ? 85 : Math.abs(trend7d) < 10 ? 60 : 40;
      case "trend-following":
        // Good when there's a clear trend
        const hasTrend = Math.abs(trend7d) > 3;
        return hasTrend ? 85 : 55;
      default:
        return 50;
    }
  };

  const sortedStrategies = [...tradingStrategies].sort(
    (a, b) => getStrategyScore(b) - getStrategyScore(a)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-2">
        <Shield className="w-4 h-4" />
        <span>Strategies ranked by market fit for {coin.symbol.toUpperCase()}</span>
      </div>
      
      {sortedStrategies.map((strategy, index) => {
        const score = getStrategyScore(strategy);
        const isSelected = selectedStrategy?.id === strategy.id;
        const isRecommended = index === 0;

        return (
          <button
            key={strategy.id}
            onClick={() => onSelectStrategy(strategy)}
            className={cn(
              "w-full p-4 rounded-lg border transition-all text-left",
              "hover:border-[var(--primary)]/50",
              isSelected
                ? "bg-[var(--primary)]/10 border-[var(--primary)]"
                : "bg-[var(--card)] border-[var(--border)]"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isSelected
                    ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                    : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                )}
              >
                {strategyIcons[strategy.id]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[var(--foreground)]">
                    {strategy.name}
                  </span>
                  {isRecommended && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-medium">
                      Best Match
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-2">
                  {strategy.description}
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-full font-medium capitalize",
                      riskColors[strategy.riskLevel]
                    )}
                  >
                    {strategy.riskLevel} risk
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {strategy.timeframe}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    <div className="w-16 h-1.5 rounded-full bg-[var(--secondary)] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          score >= 80
                            ? "bg-[var(--success)]"
                            : score >= 60
                            ? "bg-[var(--warning)]"
                            : "bg-[var(--muted-foreground)]"
                        )}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">
                      {score}%
                    </span>
                  </div>
                </div>
              </div>
              {isSelected && (
                <CheckCircle className="w-5 h-5 text-[var(--primary)] shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
