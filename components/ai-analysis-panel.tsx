"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import type { TradingStrategy } from "@/lib/trading/types";
import type { Coin } from "@/lib/trading/coins";

interface AIAnalysisPanelProps {
  strategy: TradingStrategy | null;
  coin: Coin | null;
}

export function AIAnalysisPanel({ strategy, coin }: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!strategy || !coin) return;

    setIsLoading(true);
    setAnalysis("");
    setHasAnalyzed(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyId: strategy.id,
          coinId: coin.id,
          coinData: {
            symbol: coin.symbol,
            name: coin.name,
            current_price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
            high_24h: coin.high_24h,
            low_24h: coin.low_24h,
            total_volume: coin.total_volume,
            market_cap: coin.market_cap,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get analysis");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setAnalysis(fullResponse);
        }
      }
    } catch (err) {
      setError("Failed to get analysis from AI. Please check your API key and try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [strategy, coin]);

  if (!strategy || !coin) {
    return (
      <div className="p-8 text-center text-[var(--muted-foreground)] bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium mb-1">AI Analysis</p>
        <p className="text-sm">
          {!coin
            ? "Select a coin from the Portfolio tab"
            : "Select a strategy from the Strategies tab"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-semibold text-[var(--foreground)]">
            AI Analysis
          </h3>
          <span className="text-sm text-[var(--muted-foreground)]">
            {coin.symbol.toUpperCase()} + {strategy.name}
          </span>
        </div>
        <button
          onClick={runAnalysis}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "bg-[var(--primary)] text-[var(--primary-foreground)]",
            "hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : hasAnalyzed ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Re-analyze
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run AI Analysis
            </>
          )}
        </button>
      </div>

      <div
        className={cn(
          "p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] min-h-[400px]",
          "overflow-auto max-h-[600px]"
        )}
      >
        {!hasAnalyzed ? (
          <div className="flex flex-col items-center justify-center h-[368px] text-[var(--muted-foreground)]">
            <Sparkles className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-center max-w-md">
              Click &quot;Run AI Analysis&quot; to get real-time insights using the{" "}
              <span className="font-medium text-[var(--foreground)]">
                {strategy.name}
              </span>{" "}
              strategy for{" "}
              <span className="font-medium text-[var(--foreground)]">
                {coin.name}
              </span>
            </p>
            <p className="text-sm mt-2 opacity-70">
              Analysis includes market assessment, entry/exit levels, and risk management
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[368px]">
            <AlertCircle className="w-10 h-10 text-[var(--destructive)] mb-4" />
            <p className="text-[var(--destructive)] text-center max-w-md">
              {error}
            </p>
            <button
              onClick={runAnalysis}
              className="mt-4 px-4 py-2 text-sm rounded-lg bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary)]/80 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : isLoading && !analysis ? (
          <div className="flex flex-col items-center justify-center h-[368px]">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
            <p className="text-[var(--muted-foreground)]">
              Analyzing {coin.name} with {strategy.name} strategy...
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 opacity-70">
              Using live market data and historical patterns
            </p>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-[var(--foreground)] leading-relaxed">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
