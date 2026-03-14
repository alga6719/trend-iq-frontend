"use client";

import { useState, useMemo, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  momentumAssets,
  allTickers,
  type MomentumAsset,
} from "@/lib/momentum-data";
import { generateForecast } from "./actions";
import { DashboardLayout } from "@/components/dashboard-layout";

type FilterType = "all" | "hot" | "fading" | "stocks" | "crypto";

export default function MomentumPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MomentumAsset | null>(
    null
  );
  const [forecast, setForecast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredAssets = useMemo(() => {
    let result = momentumAssets;

    if (filter === "hot") {
      result = result.filter((a) => a.status === "hot");
    } else if (filter === "fading") {
      result = result.filter((a) => a.status === "fading");
    } else if (filter === "stocks") {
      result = result.filter((a) => a.type === "stock");
    } else if (filter === "crypto") {
      result = result.filter((a) => a.type === "crypto");
    }

    return result;
  }, [filter]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allTickers
      .filter(
        (t) =>
          t.ticker.toLowerCase().includes(query) ||
          t.name.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery]);

  const handleAssetClick = (asset: MomentumAsset) => {
    setSelectedAsset(asset);
    setForecast(null);
  };

  const handleSearchSelect = (ticker: string) => {
    const asset = momentumAssets.find((a) => a.ticker === ticker);
    if (asset) {
      setSelectedAsset(asset);
      setForecast(null);
    }
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleGenerateForecast = () => {
    if (!selectedAsset) return;

    startTransition(async () => {
      const result = await generateForecast(
        selectedAsset.ticker,
        selectedAsset.name,
        selectedAsset.price,
        selectedAsset.change24h,
        selectedAsset.rsi,
        selectedAsset.macdSignal
      );
      setForecast(result.forecast);
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Momentum Strategy
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track top-performing assets by momentum score and get AI-powered
            forecasts
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Leaderboard Section */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card">
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                <div className="flex flex-wrap gap-2">
                  {(
                    ["all", "hot", "fading", "stocks", "crypto"] as FilterType[]
                  ).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                        filter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {f === "all"
                        ? "All"
                        : f === "hot"
                          ? "Hot"
                          : f === "fading"
                            ? "Fading"
                            : f === "stocks"
                              ? "Stocks"
                              : "Crypto"}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    placeholder="Search ticker..."
                    className="w-48 rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-border bg-card shadow-lg">
                      {searchSuggestions.map((s) => (
                        <button
                          key={s.ticker}
                          onClick={() => handleSearchSelect(s.ticker)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50"
                        >
                          <span className="font-mono font-semibold">
                            {s.ticker}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {s.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Asset</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">24h</th>
                      <th className="px-4 py-3 text-right">Score</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => (
                      <tr
                        key={asset.ticker}
                        onClick={() => handleAssetClick(asset)}
                        className={cn(
                          "cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30",
                          selectedAsset?.ticker === asset.ticker &&
                            "bg-primary/10"
                        )}
                      >
                        <td className="px-4 py-4 font-mono text-muted-foreground">
                          #{asset.rank}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs font-bold",
                                asset.type === "crypto"
                                  ? "bg-amber-500/20 text-amber-500"
                                  : "bg-blue-500/20 text-blue-500"
                              )}
                            >
                              {asset.ticker.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {asset.ticker}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {asset.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-mono">
                          $
                          {asset.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={cn(
                            "px-4 py-4 text-right font-mono font-medium",
                            asset.change24h >= 0
                              ? "text-success"
                              : "text-destructive"
                          )}
                        >
                          {asset.change24h >= 0 ? "+" : ""}
                          {asset.change24h}%
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  asset.momentumScore >= 80
                                    ? "bg-success"
                                    : asset.momentumScore >= 50
                                      ? "bg-warning"
                                      : "bg-destructive"
                                )}
                                style={{ width: `${asset.momentumScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-sm font-semibold">
                              {asset.momentumScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                              asset.status === "hot"
                                ? "bg-success/20 text-success"
                                : asset.status === "fading"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-muted/20 text-muted-foreground"
                            )}
                          >
                            {asset.status === "hot"
                              ? "Hot"
                              : asset.status === "fading"
                                ? "Fading"
                                : "Neutral"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="space-y-6">
            {/* Asset Detail Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Asset Detail
              </h3>
              {selectedAsset ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl font-mono font-bold",
                        selectedAsset.type === "crypto"
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-blue-500/20 text-blue-500"
                      )}
                    >
                      {selectedAsset.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xl font-bold">
                        {selectedAsset.ticker}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedAsset.name}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-secondary/30 p-3">
                      <div className="text-xs text-muted-foreground">
                        Volume
                      </div>
                      <div className="font-mono font-semibold">
                        {selectedAsset.volume}
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/30 p-3">
                      <div className="text-xs text-muted-foreground">RSI</div>
                      <div
                        className={cn(
                          "font-mono font-semibold",
                          selectedAsset.rsi > 70
                            ? "text-destructive"
                            : selectedAsset.rsi < 30
                              ? "text-success"
                              : "text-foreground"
                        )}
                      >
                        {selectedAsset.rsi}
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/30 p-3">
                      <div className="text-xs text-muted-foreground">MACD</div>
                      <div
                        className={cn(
                          "font-semibold capitalize",
                          selectedAsset.macdSignal === "bullish"
                            ? "text-success"
                            : selectedAsset.macdSignal === "bearish"
                              ? "text-destructive"
                              : "text-muted-foreground"
                        )}
                      >
                        {selectedAsset.macdSignal}
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/30 p-3">
                      <div className="text-xs text-muted-foreground">
                        Bollinger
                      </div>
                      <div className="font-semibold capitalize">
                        {selectedAsset.bollingerPosition}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
                  Select an asset from the leaderboard to view details
                </div>
              )}
            </div>

            {/* AI Forecast Card */}
            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-6">
              <div className="mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  AI Forecast
                </h3>
              </div>

              {selectedAsset ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Get an AI-powered 1-hour price prediction for{" "}
                    <span className="font-semibold text-foreground">
                      {selectedAsset.ticker}
                    </span>
                  </p>

                  <button
                    onClick={handleGenerateForecast}
                    disabled={isPending}
                    className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      "Generate Forecast"
                    )}
                  </button>

                  {forecast && (
                    <div className="rounded-lg border border-border bg-card/50 p-4">
                      <p className="text-sm leading-relaxed">{forecast}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center text-center text-sm text-muted-foreground">
                  Select an asset to generate a forecast
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
