"use client";

import { useEffect, useState } from "react";

interface WatchlistItem {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  signal: "BUY" | "HOLD" | "SELL";
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,arbitrum,avalanche-2,binancecoin,optimism,dogwifcoin,jupiter-exchange-solana&order=market_cap_desc&sparkline=false&price_change_percentage=24h",
          { headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" } }
        );
        const data = await res.json();
        const processed = data.map((c: { symbol: string; current_price: number; price_change_percentage_24h: number; total_volume: number }) => {
          const chg = c.price_change_percentage_24h || 0;
          let signal: "BUY" | "HOLD" | "SELL" = "HOLD";
          if (chg >= 3) signal = "BUY";
          else if (chg <= -3) signal = "SELL";
          return {
            symbol: c.symbol.toUpperCase() + "/USD",
            price: c.current_price,
            change24h: chg,
            volume: c.total_volume,
            signal,
          };
        });
        setItems(processed);
        setLastUpdate("Binance live · " + new Date().toLocaleTimeString());
      } catch (err) {
        console.warn("Fetch error:", err);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-bold text-foreground">Watchlist</h1>
        <span className="text-[11px] text-success">{lastUpdate}</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              <th className="pb-2">Token</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">24h %</th>
              <th className="pb-2">Volume</th>
              <th className="pb-2">Signal</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-muted-foreground/60">Loading...</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.symbol} className="border-b border-border last:border-b-0 hover:bg-white/[0.015]">
                  <td className="py-2.5 font-semibold text-foreground">{item.symbol}</td>
                  <td className="py-2.5 font-mono">${item.price >= 1000 ? item.price.toLocaleString("en-US", { maximumFractionDigits: 0 }) : item.price.toFixed(2)}</td>
                  <td className={`py-2.5 font-semibold ${item.change24h >= 0 ? "text-success" : "text-destructive"}`}>{item.change24h >= 0 ? "+" : ""}{item.change24h.toFixed(2)}%</td>
                  <td className="py-2.5 text-xs text-muted-foreground">${(item.volume / 1e9).toFixed(2)}B</td>
                  <td className="py-2.5">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${item.signal === "BUY" ? "bg-success/10 text-success" : item.signal === "SELL" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                      {item.signal}
                    </span>
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
