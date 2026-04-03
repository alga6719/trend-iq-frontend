"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import type { TradingStrategy } from "@/lib/trading/types";

interface AIAnalysisPanelProps {
  strategy: TradingStrategy | null;
}

export function AIAnalysisPanel({ strategy }: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const runAnalysis = useCallback(async () => {
    if (!strategy) return;

    setIsLoading(true);
    setAnalysis("");
    setHasAnalyzed(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyId: strategy.id }),
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
    } catch (error) {
      setAnalysis("Error: Failed to get analysis from AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [strategy]);

  if (!strategy) {
    return (
      <div className="p-8 text-center text-[var(--muted-foreground)] bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p>Select a strategy to get AI-powered analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-semibold text-[var(--foreground)]">
            AI Analysis - {strategy.name}
          </h3>
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
          "p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] min-h-[300px]",
          "overflow-auto max-h-[500px]"
        )}
      >
        {!hasAnalyzed ? (
          <div className="flex flex-col items-center justify-center h-[268px] text-[var(--muted-foreground)]">
            <Sparkles className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-center">
              Click &quot;Run AI Analysis&quot; to get insights
              <br />
              based on historical data and {strategy.name} strategy
            </p>
          </div>
        ) : isLoading && !analysis ? (
          <div className="flex flex-col items-center justify-center h-[268px]">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mb-4" />
            <p className="text-[var(--muted-foreground)]">
              Analyzing market data with AI...
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
