"use client";

import { cn } from "@/lib/utils";
import type { TradingStrategy } from "@/lib/trading/types";
import {
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Activity,
} from "lucide-react";

const strategyIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  momentum: TrendingUp,
  breakout: Zap,
  scalping: Activity,
  range: BarChart3,
  "trend-following": Target,
};

const riskColors = {
  low: "text-[var(--success)]",
  medium: "text-[var(--warning)]",
  high: "text-[var(--destructive)]",
};

interface StrategyCardProps {
  strategy: TradingStrategy;
  isSelected: boolean;
  onClick: () => void;
}

export function StrategyCard({ strategy, isSelected, onClick }: StrategyCardProps) {
  const Icon = strategyIcons[strategy.id] || TrendingUp;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all duration-200",
        "bg-[var(--card)] hover:bg-[var(--secondary)]",
        isSelected
          ? "border-[var(--primary)] ring-1 ring-[var(--primary)]"
          : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2 rounded-lg",
            isSelected ? "bg-[var(--primary)]/20" : "bg-[var(--secondary)]"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              isSelected ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-[var(--foreground)] truncate">
              {strategy.name}
            </h3>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--secondary)]",
                riskColors[strategy.riskLevel]
              )}
            >
              {strategy.riskLevel}
            </span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
            {strategy.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-[var(--muted-foreground)]">
              {strategy.timeframe}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">|</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {strategy.indicators.slice(0, 2).join(", ")}
              {strategy.indicators.length > 2 && ` +${strategy.indicators.length - 2}`}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
