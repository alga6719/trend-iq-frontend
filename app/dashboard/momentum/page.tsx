"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface MomentumData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  score: number;
  outlook: string;
}

export default function MomentumPage() {
  const [data, setData] = useState<MomentumData[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,avalanche-2,binancecoin,arbitrum,optimism,dogwifcoin,jupiter-exchange-solana&order=market_cap_desc&sparkline=false&price_change_percentage=24h",
        { headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" } }
      );
      const coins = await res.json();
      const processed = coins.map((c: { symbol: string; current_price: number; price_change_percentage_24h: number; total_volume: number }) => {
        const chg = c.price_change_percentage_24h || 0;
        const volScore = Math.min(5, c.total_volume / 500000000);
        const score = Math.round(Math.min(99, Math.max(5, 50 + chg * 3.5 + volScore * 6)));
        let outlook = "Flat";
        if (score >= 80) outlook = "Strong Up";
        else if (score >= 65) outlook = "Likely Up";
        else if (score >= 50) outlook = "Neutral/Up";
        else if (score < 35) outlook = "Fading";
        return {
          symbol: c.symbol.toUpperCase() + "/USD",
          price: c.current_price,
          change24h: chg,
          volume: c.total_volume,
          score,
          outlook,
        };
      });
      processed.sort((a: MomentumData, b: MomentumData) => b.score - a.score);
      setData(processed);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const getScoreColor = (s: number) => (s >= 80 ? "text-success" : s >= 60 ? "text-primary" : s >= 40 ? "text-warning" : "text-destructive");
  const getScoreBg = (s: number) => (s >= 80 ? "bg-success" : s >= 60 ? "bg-primary" : s >= 40 ? "bg-warning" : "bg-destructive");

  const filteredData = data.filter((d) => {
    if (filter === "hot") return d.score > 80;
    if (filter === "rising") return d.score >= 60 && d.score <= 80;
    if (filter === "watch") return d.score < 60;
    return true;
  });

  const top3 = data.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Momentum Scanner</h1>
          <p className="text-sm text-muted-foreground">Ranked by probability of continuing upward in the next 30 min &middot; <span className="text-success">{lastUpdate || "Binance live"}</span></p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1 text-[11px] text-success">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />Live
          </span>
          <button onClick={fetchData} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
            <RefreshCw className="h-3 w-3" />Refresh
          </button>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="mb-4 grid grid-cols-3 gap-3.5">
        {top3.map((d, i) => (
          <div key={d.symbol} className={`rounded-xl border p-4 ${i === 0 ? "border-success/30" : i === 1 ? "border-primary/25" : "border-border"} bg-card`}>
            <div className="mb-2.5 flex items-start justify-between">
              <div>
                <div className={`mb-1 text-[10px] font-bold uppercase ${i === 0 ? "text-success" : i === 1 ? "text-primary" : "text-muted-foreground/60"}`}>#{i + 1} {i === 0 ? "Hottest" : "Mover"}</div>
                <div className="text-lg font-extrabold text-foreground">{d.symbol}</div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-2xl font-extrabold ${getScoreColor(d.score)}`}>{d.score}</div>
                <div className="text-[10px] text-muted-foreground/60">/100</div>
              </div>
            </div>
            <div className="mb-2.5 h-1 overflow-hidden rounded bg-accent">
              <div className={`h-full rounded ${getScoreBg(d.score)}`} style={{ width: `${d.score}%` }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground/60">24h</span>
              <span className={`font-mono font-semibold ${d.change24h >= 0 ? "text-success" : "text-destructive"}`}>{d.change24h >= 0 ? "+" : ""}{d.change24h.toFixed(2)}%</span>
              <span className="text-muted-foreground/60">Vol</span>
              <span className="font-mono font-semibold text-primary">${(d.volume / 1e9).toFixed(2)}B</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-sm font-bold text-foreground">Full Rankings</div>
          <div className="flex gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Hot (>80)", value: "hot" },
              { label: "Rising (60-80)", value: "rising" },
              { label: "Watch (<60)", value: "watch" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs ${filter === f.value ? "bg-primary/15 text-primary border-primary/35" : "text-muted-foreground/60 border-border"} border`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              <th className="pb-2">#</th>
              <th className="pb-2">Ticker</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">24h %</th>
              <th className="pb-2">Vol (USD)</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">30m Outlook</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-10 text-center text-muted-foreground/60">Loading...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={8} className="py-10 text-center text-muted-foreground/60">No tickers match this filter</td></tr>
            ) : (
              filteredData.map((d, i) => (
                <tr key={d.symbol} className="border-b border-border last:border-b-0 hover:bg-white/[0.015]">
                  <td className="py-2.5 font-semibold text-muted-foreground/60">{i + 1}</td>
                  <td className="py-2.5 font-bold text-foreground">{d.symbol}</td>
                  <td className="py-2.5 font-mono">${d.price >= 1000 ? d.price.toLocaleString("en-US", { maximumFractionDigits: 0 }) : d.price.toFixed(2)}</td>
                  <td className={`py-2.5 font-mono font-semibold ${d.change24h >= 0 ? "text-success" : "text-destructive"}`}>{d.change24h >= 0 ? "+" : ""}{d.change24h.toFixed(2)}%</td>
                  <td className="py-2.5 text-xs text-muted-foreground">${(d.volume / 1e9).toFixed(2)}B</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-[60px] overflow-hidden rounded bg-accent">
                        <div className={`h-full rounded ${getScoreBg(d.score)}`} style={{ width: `${d.score}%` }} />
                      </div>
                      <span className={`font-mono font-bold ${getScoreColor(d.score)}`}>{d.score}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${d.outlook === "Strong Up" ? "bg-success/10 text-success" : d.outlook === "Likely Up" ? "bg-primary/10 text-primary" : d.outlook === "Neutral/Up" ? "bg-warning/10 text-warning" : d.outlook === "Fading" ? "bg-destructive/10 text-destructive" : "bg-accent text-muted-foreground/60"}`}>
                      {d.outlook}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <button className="rounded-lg border border-success/30 px-2.5 py-1 text-[11px] font-medium text-success hover:bg-success/10">Snipe</button>
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
