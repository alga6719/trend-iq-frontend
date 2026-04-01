"use client";

import { useEffect, useState } from "react";
import { useLivePrices, formatPrice } from "@/hooks/use-live-prices";
import { RefreshCw } from "lucide-react";

interface Trade {
  date: string;
  pair: string;
  side: "BUY" | "SELL";
  strategy: string;
  entry: string;
  exit: string;
  size: string;
  pnl: string;
  pnlValue: number;
}

const STRATEGIES = ["Momentum", "RSI Reversal", "Whale Follow", "DCA", "ML Signal", "Take Profit", "Stop Loss"];

function generateTrades(prices: { symbol: string; price: number; change24h: number }[]): Trade[] {
  const trades: Trade[] = [];
  const now = new Date();
  
  // Generate trades for the past 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);
    
    // 2-4 trades per day
    const numTrades = 2 + Math.floor(Math.random() * 3);
    
    for (let t = 0; t < numTrades; t++) {
      const coin = prices[Math.floor(Math.random() * Math.min(5, prices.length))];
      if (!coin) continue;
      
      const side: "BUY" | "SELL" = Math.random() > 0.45 ? "BUY" : "SELL";
      const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];
      
      // Price variance based on time ago
      const priceVariance = 1 + (Math.random() - 0.5) * 0.05 * (day + 1);
      const entryPrice = coin.price * priceVariance;
      
      // Exit price based on side and win/loss
      const isWin = Math.random() > 0.35; // 65% win rate
      const movement = 0.01 + Math.random() * 0.04; // 1-5% move
      let exitPrice: number;
      
      if (side === "BUY") {
        exitPrice = isWin ? entryPrice * (1 + movement) : entryPrice * (1 - movement);
      } else {
        exitPrice = isWin ? entryPrice * (1 - movement) : entryPrice * (1 + movement);
      }
      
      // Size scales with price
      let size: number;
      if (coin.price > 10000) size = 0.01 + Math.random() * 0.05;
      else if (coin.price > 1000) size = 0.5 + Math.random() * 2;
      else if (coin.price > 100) size = 5 + Math.random() * 30;
      else size = 50 + Math.random() * 200;
      
      const pnlValue = side === "BUY" 
        ? (exitPrice - entryPrice) * size
        : (entryPrice - exitPrice) * size;
      
      // Random time during the day
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));
      
      trades.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + 
              ", " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        pair: `${coin.symbol}/USD`,
        side,
        strategy,
        entry: `$${formatPrice(entryPrice)}`,
        exit: `$${formatPrice(exitPrice)}`,
        size: size.toFixed(size < 1 ? 3 : 1),
        pnl: (pnlValue >= 0 ? "+" : "") + `$${Math.abs(pnlValue).toFixed(0)}`,
        pnlValue,
      });
    }
  }
  
  // Sort by date descending (most recent first)
  return trades.sort((a, b) => {
    const dateA = new Date(a.date.replace(",", ""));
    const dateB = new Date(b.date.replace(",", ""));
    return dateB.getTime() - dateA.getTime();
  });
}

export default function HistoryPage() {
  const { prices, loading } = useLivePrices();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [useKraken, setUseKraken] = useState(false);
  const [krakenError, setKrakenError] = useState<string | null>(null);

  useEffect(() => {
    // Try to fetch from Kraken first
    async function fetchKrakenHistory() {
      try {
        const res = await fetch("/api/kraken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: "/0/private/TradesHistory", params: {} }),
        });
        
        const data = await res.json();
        
        if (data.error && data.error.length > 0) {
          throw new Error(data.error[0]);
        }
        
        if (data.result && Object.keys(data.result.trades || {}).length > 0) {
          setUseKraken(true);
          // Transform Kraken data format
          const krakenTrades: Trade[] = Object.entries(data.result.trades).map(([id, t]: [string, { pair: string; type: string; price: string; cost: string; vol: string; time: number }]) => ({
            date: new Date(t.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
                  ", " + new Date(t.time * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
            pair: t.pair.replace("X", "").replace("Z", "").replace("USD", "/USD"),
            side: t.type.toUpperCase() as "BUY" | "SELL",
            strategy: "Manual",
            entry: `$${parseFloat(t.price).toFixed(2)}`,
            exit: `$${parseFloat(t.price).toFixed(2)}`,
            size: parseFloat(t.vol).toFixed(4),
            pnl: `$${parseFloat(t.cost).toFixed(2)}`,
            pnlValue: parseFloat(t.cost),
          }));
          setTrades(krakenTrades);
          return;
        }
      } catch (err) {
        setKrakenError(err instanceof Error ? err.message : "Kraken API unavailable");
      }
      
      // Fallback to simulated data
      if (prices.length > 0) {
        setTrades(generateTrades(prices));
      }
    }
    
    fetchKrakenHistory();
  }, [prices]);

  // Regenerate simulated trades when prices update (if not using Kraken)
  useEffect(() => {
    if (!useKraken && prices.length > 0 && trades.length === 0) {
      setTrades(generateTrades(prices));
    }
  }, [prices, useKraken, trades.length]);

  const totalPnl = trades.reduce((acc, t) => acc + t.pnlValue, 0);
  const winRate = trades.length > 0 
    ? Math.round((trades.filter(t => t.pnlValue > 0).length / trades.length) * 100)
    : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Trade History</h1>
          <p className="text-sm text-muted-foreground">
            {useKraken ? "Live data from Kraken" : "Simulated trades based on live prices"}
            {krakenError && !useKraken && (
              <span className="ml-2 text-warning text-xs">({krakenError})</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total P&L</div>
            <div className={`font-mono font-bold ${totalPnl >= 0 ? "text-success" : "text-destructive"}`}>
              {totalPnl >= 0 ? "+" : ""}${Math.abs(totalPnl).toFixed(0)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="font-mono font-bold text-foreground">{winRate}%</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              <th className="pb-2">Date</th>
              <th className="pb-2">Pair</th>
              <th className="pb-2">Side</th>
              <th className="pb-2">Strategy</th>
              <th className="pb-2">Entry</th>
              <th className="pb-2">Exit</th>
              <th className="pb-2">Size</th>
              <th className="pb-2">P&L</th>
            </tr>
          </thead>
          <tbody>
            {loading && trades.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-muted-foreground">
                  Loading trade history...
                </td>
              </tr>
            ) : trades.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-muted-foreground">
                  No trades found
                </td>
              </tr>
            ) : (
              trades.map((h, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-b-0 hover:bg-white/[0.015]"
                >
                  <td className="py-2.5 text-xs text-muted-foreground/60">{h.date}</td>
                  <td className="py-2.5 font-semibold text-foreground">{h.pair}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                        h.side === "BUY"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {h.side}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground/60">{h.strategy}</td>
                  <td className="py-2.5 font-mono">{h.entry}</td>
                  <td className="py-2.5 font-mono">{h.exit}</td>
                  <td className="py-2.5 font-mono">{h.size}</td>
                  <td
                    className={`py-2.5 font-mono font-semibold ${
                      h.pnlValue >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {h.pnl}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
