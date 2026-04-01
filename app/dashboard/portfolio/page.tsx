"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface PriceData {
  price: number;
}

export default function PortfolioPage() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&sparkline=false",
          { headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" } }
        );
        const data = await res.json();
        const newPrices: Record<string, PriceData> = {};
        for (const coin of data) {
          newPrices[coin.symbol.toUpperCase()] = { price: coin.current_price };
        }
        setPrices(newPrices);
      } catch (err) {
        console.warn("CoinGecko fetch error:", err);
      }
    }
    fetchPrices();
  }, []);

  const btcValue = prices.BTC ? prices.BTC.price * 1.01 : 0;
  const ethValue = prices.ETH ? prices.ETH.price * 10 : 0;
  const solValue = prices.SOL ? prices.SOL.price * 50 : 0;
  const total = btcValue + ethValue + solValue;

  const formatUSD = (n: number) =>
    `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        fill: true,
        data: [100000, 108000, 104000, 118000, 125000, 132000, 142840],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#8b5cf6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#454d6a", font: { size: 11 } }, grid: { display: false }, border: { display: false } },
      y: { ticks: { color: "#454d6a", font: { size: 11 }, callback: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k` }, grid: { color: "rgba(255,255,255,0.025)" }, border: { display: false } },
    },
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">Portfolio</h1>

      <div className="mb-5 grid grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2.5 text-xs font-medium text-muted-foreground">Total Invested</div>
          <div className="font-mono text-xl font-bold text-foreground">$108,000</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2.5 text-xs font-medium text-muted-foreground">Total Return</div>
          <div className="font-mono text-xl font-bold text-success">+$34,840</div>
          <div className="text-xs font-medium text-success">+32.3% all-time</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2.5 text-xs font-medium text-muted-foreground">Best Trade</div>
          <div className="font-mono text-xl font-bold text-foreground">SOL</div>
          <div className="text-xs font-medium text-success">+122% in 60d</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2.5 text-xs font-medium text-muted-foreground">Sharpe Ratio</div>
          <div className="font-mono text-xl font-bold text-foreground">2.14</div>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Cumulative Return</h3>
          <div className="h-[200px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Holdings</h3>
          <div className="mb-3.5 rounded-lg bg-accent p-3.5">
            <div className="mb-1 text-[11px] text-muted-foreground/60">TOTAL VALUE</div>
            <div className="font-mono text-2xl font-bold text-foreground">
              {total > 0 ? formatUSD(total) : "Loading..."}
            </div>
          </div>
          {[
            { name: "Bitcoin", symbol: "BTC", amount: "1.01", value: btcValue },
            { name: "Ethereum", symbol: "ETH", amount: "10.0", value: ethValue },
            { name: "Solana", symbol: "SOL", amount: "50.0", value: solValue },
          ].map((h, i) => (
            <div key={h.symbol} className={`flex items-center justify-between py-2.5 ${i < 2 ? "border-b border-border" : ""}`}>
              <div>
                <div className="text-sm font-semibold text-foreground">{h.name}</div>
                <div className="text-[11px] text-muted-foreground/60">{h.symbol} &middot; {h.amount}</div>
              </div>
              <div className="font-mono text-sm font-semibold text-foreground">
                {h.value > 0 ? formatUSD(h.value) : "..."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
