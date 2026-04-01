"use client";

import { useEffect, useState } from "react";
import { useLivePrices } from "@/hooks/use-live-prices";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Play, Pause, Plus } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement);

interface Strategy {
  id: string;
  name: string;
  meta: string;
  status: "Running" | "Paused";
  winRate: number;
  trades: number;
  pnl: number;
}

export default function StrategiesPage() {
  const { prices, loading } = useLivePrices();
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    if (prices.length === 0) return;

    // Generate strategies based on live market data
    const coins = prices.slice(0, 4);
    const newStrategies: Strategy[] = [
      {
        id: "1",
        name: "Momentum Long",
        meta: `${coins[0]?.symbol || "BTC"}/USD · 15m · Min 72% confidence`,
        status: "Running",
        winRate: 68 + Math.round(Math.random() * 10),
        trades: 120 + Math.round(Math.random() * 30),
        pnl: 2400 + Math.round(Math.random() * 800),
      },
      {
        id: "2",
        name: "DCA Accumulator",
        meta: `${coins[1]?.symbol || "ETH"}/USD · Daily · $50/trade`,
        status: "Running",
        winRate: 62 + Math.round(Math.random() * 12),
        trades: 45 + Math.round(Math.random() * 15),
        pnl: 1200 + Math.round(Math.random() * 400),
      },
      {
        id: "3",
        name: "Whale Follower",
        meta: `${coins[2]?.symbol || "SOL"}/USD · Event-driven`,
        status: Math.random() > 0.5 ? "Running" : "Paused",
        winRate: 54 + Math.round(Math.random() * 15),
        trades: 28 + Math.round(Math.random() * 12),
        pnl: 680 + Math.round(Math.random() * 300),
      },
      {
        id: "4",
        name: "RSI Reversal",
        meta: `${coins[3]?.symbol || "AVAX"}/USD · 1h`,
        status: "Running",
        winRate: 58 + Math.round(Math.random() * 14),
        trades: 65 + Math.round(Math.random() * 20),
        pnl: 890 + Math.round(Math.random() * 350),
      },
    ];

    setStrategies(newStrategies);
  }, [prices]);

  const toggleStatus = (id: string) => {
    setStrategies((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Running" ? "Paused" : "Running" }
          : s
      )
    );
  };

  const chartData = {
    labels: strategies.map((s) => s.name.split(" ")[0]),
    datasets: [
      {
        data: strategies.map((s) => s.winRate),
        backgroundColor: strategies.map((s) =>
          s.status === "Running" ? "#22c55e" : "#f59e0b"
        ),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#454d6a", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.025)" },
        border: { display: false },
        max: 100,
      },
      y: {
        ticks: { color: "#8890aa", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  const totalPnl = strategies.reduce((acc, s) => acc + s.pnl, 0);
  const avgWinRate =
    strategies.length > 0
      ? Math.round(strategies.reduce((acc, s) => acc + s.winRate, 0) / strategies.length)
      : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Strategies</h1>
          <p className="text-sm text-muted-foreground">
            Automated trading strategies with live market data
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total P&L</div>
            <div className="font-mono font-bold text-success">+${totalPnl.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Avg Win Rate</div>
            <div className="font-mono font-bold text-foreground">{avgWinRate}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Active strategies</h3>
            <span className="text-xs text-muted-foreground">
              {strategies.filter((s) => s.status === "Running").length} running
            </span>
          </div>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading strategies...</div>
          ) : (
            strategies.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center justify-between py-3 ${
                  i < strategies.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-foreground">{s.name}</div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        s.status === "Running"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground/60">{s.meta}</div>
                  <div className="mt-1 flex gap-3 text-[11px]">
                    <span className="text-muted-foreground">
                      Win: <span className="font-mono text-foreground">{s.winRate}%</span>
                    </span>
                    <span className="text-muted-foreground">
                      Trades: <span className="font-mono text-foreground">{s.trades}</span>
                    </span>
                    <span className="text-muted-foreground">
                      P&L: <span className="font-mono text-success">+${s.pnl}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(s.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                    s.status === "Running"
                      ? "border-warning/30 text-warning hover:bg-warning/10"
                      : "border-success/30 text-success hover:bg-success/10"
                  }`}
                >
                  {s.status === "Running" ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))
          )}
          <button className="mt-4 flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" />
            New Strategy
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Win Rate by Strategy</h3>
          <div className="h-[180px]">
            {strategies.length > 0 && <Bar data={chartData} options={chartOptions} />}
          </div>
          <div className="mt-4 border-t border-border pt-3.5">
            <div className="mb-1 text-xs text-muted-foreground/60">Best Performer</div>
            <div className="text-sm font-semibold text-foreground">
              {strategies.length > 0
                ? strategies.reduce((a, b) => (a.winRate > b.winRate ? a : b)).name
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
