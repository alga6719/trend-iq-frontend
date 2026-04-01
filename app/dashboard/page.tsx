"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SentimentGauge } from "@/components/dashboard/sentiment-gauge";
import { RecentTrades } from "@/components/dashboard/recent-trades";

interface PriceData {
  price: number;
  change24h: number;
}

export default function DashboardPage() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&sparkline=false&price_change_percentage=24h",
          {
            headers: {
              "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa",
            },
          }
        );
        const data = await res.json();
        const newPrices: Record<string, PriceData> = {};
        for (const coin of data) {
          newPrices[coin.symbol.toUpperCase()] = {
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h || 0,
          };
        }
        setPrices(newPrices);
      } catch (err) {
        console.warn("CoinGecko fetch error:", err);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) =>
    `$${price.toLocaleString("en-US", { maximumFractionDigits: price >= 1000 ? 0 : 2 })}`;

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="animate-fade-in">
      {/* Metrics Grid */}
      <div className="mb-5 grid grid-cols-4 gap-3.5">
        <MetricCard
          label="BTC Price"
          value={prices.BTC ? formatPrice(prices.BTC.price) : "..."}
          change={prices.BTC ? formatChange(prices.BTC.change24h) : undefined}
          changeType={prices.BTC?.change24h >= 0 ? "up" : "down"}
          live
          liveSource="Binance Live"
        />
        <MetricCard
          label="ETH Price"
          value={prices.ETH ? formatPrice(prices.ETH.price) : "..."}
          change={prices.ETH ? formatChange(prices.ETH.change24h) : undefined}
          changeType={prices.ETH?.change24h >= 0 ? "up" : "down"}
        />
        <MetricCard
          label="SOL Price"
          value={prices.SOL ? formatPrice(prices.SOL.price) : "..."}
          change={prices.SOL ? formatChange(prices.SOL.change24h) : undefined}
          changeType={prices.SOL?.change24h >= 0 ? "up" : "down"}
        />
        <MetricCard label="Win Rate" value="68%" change="100 total trades" />
      </div>

      {/* Charts Row */}
      <div className="mb-4 grid grid-cols-[1fr_340px] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-bold text-foreground">
            Portfolio Performance
          </h3>
          <PerformanceChart />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">
            Market Sentiment
          </h3>
          <SentimentGauge />
        </div>
      </div>

      {/* Recent Trades */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-1 text-sm font-bold text-foreground">Recent Trades</h3>
        <p className="mb-3.5 text-xs text-muted-foreground/60">
          Latest executed trades
        </p>
        <RecentTrades />
      </div>
    </div>
  );
}
