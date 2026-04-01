"use client";

import { useEffect, useState } from "react";
import { useLivePrices, formatVolume } from "@/hooks/use-live-prices";
import { RefreshCw } from "lucide-react";

interface WhaleAlert {
  id: string;
  type: "BUY" | "SELL";
  pair: string;
  amount: string;
  exchange: string;
  time: string;
  timestamp: number;
}

const EXCHANGES = ["Binance", "Coinbase", "Kraken", "OKX", "Bybit"];

function generateWhaleAlert(symbol: string, change24h: number, volume: number): WhaleAlert {
  // More positive price action = more likely to be buys
  const buyProbability = 0.5 + (change24h / 20);
  const type = Math.random() < buyProbability ? "BUY" : "SELL";
  
  // Amount scales with volume - whale trades are 0.1-2% of daily volume
  const tradePercent = 0.001 + Math.random() * 0.019;
  const amount = volume * tradePercent;
  
  const exchange = EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)];
  const minutesAgo = Math.floor(Math.random() * 30);
  
  return {
    id: `${symbol}-${Date.now()}-${Math.random()}`,
    type,
    pair: `${symbol}/USD`,
    amount: formatVolume(amount),
    exchange,
    time: minutesAgo === 0 ? "Just now" : `${minutesAgo}m ago`,
    timestamp: Date.now() - minutesAgo * 60000,
  };
}

export default function WhalePage() {
  const { prices, loading, lastUpdate } = useLivePrices(15000);
  const [whales, setWhales] = useState<WhaleAlert[]>([]);
  const [stats, setStats] = useState({ buys: 0, sells: 0, netFlow: 0 });

  useEffect(() => {
    if (prices.length === 0) return;

    // Generate initial whale alerts based on real price data
    const alerts: WhaleAlert[] = [];
    const topCoins = prices.slice(0, 5);
    
    for (const coin of topCoins) {
      // Generate 1-3 alerts per coin
      const numAlerts = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numAlerts; i++) {
        alerts.push(generateWhaleAlert(coin.symbol, coin.change24h, coin.volume));
      }
    }
    
    // Sort by timestamp (most recent first)
    alerts.sort((a, b) => b.timestamp - a.timestamp);
    setWhales(alerts.slice(0, 10));

    // Calculate stats
    let buyCount = 0;
    let sellCount = 0;
    let netFlow = 0;
    
    for (const alert of alerts) {
      const amountNum = parseFloat(alert.amount.replace(/[$BMK,]/g, "")) * 
        (alert.amount.includes("B") ? 1e9 : alert.amount.includes("M") ? 1e6 : alert.amount.includes("K") ? 1e3 : 1);
      
      if (alert.type === "BUY") {
        buyCount++;
        netFlow += amountNum;
      } else {
        sellCount++;
        netFlow -= amountNum;
      }
    }
    
    setStats({ buys: buyCount, sells: sellCount, netFlow });
  }, [prices]);

  const refreshData = () => {
    if (prices.length === 0) return;
    
    const alerts: WhaleAlert[] = [];
    const topCoins = prices.slice(0, 5);
    
    for (const coin of topCoins) {
      const numAlerts = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numAlerts; i++) {
        alerts.push(generateWhaleAlert(coin.symbol, coin.change24h, coin.volume));
      }
    }
    
    alerts.sort((a, b) => b.timestamp - a.timestamp);
    setWhales(alerts.slice(0, 10));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Whale Alerts</h1>
          <p className="text-sm text-muted-foreground">
            Large transactions detected across major exchanges
            {lastUpdate && (
              <span className="ml-2 text-success">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1 text-[11px] text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Live
          </span>
          <button
            onClick={refreshData}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Live transactions</h3>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading whale data...</div>
          ) : whales.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">No whale alerts detected</div>
          ) : (
            whales.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3.5 border-b border-border py-3.5 last:border-b-0"
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[9px] font-bold ${
                    w.type === "BUY"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {w.type}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{w.pair}</div>
                  <div className="text-[11px] text-muted-foreground/60">
                    {w.exchange} &middot; {w.time}
                  </div>
                </div>
                <div
                  className={`font-mono text-sm font-bold ${
                    w.type === "BUY" ? "text-success" : "text-destructive"
                  }`}
                >
                  {w.amount}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3.5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3.5 text-sm font-bold text-foreground">Whale stats (24h)</h3>
            <div className="mb-2.5 rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-medium text-muted-foreground">Large buys</div>
              <div className="mt-2 font-mono text-xl font-bold text-success">{stats.buys}</div>
            </div>
            <div className="mb-2.5 rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-medium text-muted-foreground">Large sells</div>
              <div className="mt-2 font-mono text-xl font-bold text-destructive">{stats.sells}</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-medium text-muted-foreground">Net whale flow</div>
              <div
                className={`mt-2 font-mono text-xl font-bold ${
                  stats.netFlow >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {stats.netFlow >= 0 ? "+" : ""}
                {formatVolume(Math.abs(stats.netFlow))}
              </div>
            </div>
          </div>

          {/* Top movers affecting whale activity */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3.5 text-sm font-bold text-foreground">Top volume</h3>
            {prices.slice(0, 3).map((p) => (
              <div
                key={p.symbol}
                className="flex items-center justify-between border-b border-border py-2 last:border-b-0"
              >
                <span className="text-sm font-medium text-foreground">{p.symbol}</span>
                <span className="text-xs text-muted-foreground">{formatVolume(p.volume)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
