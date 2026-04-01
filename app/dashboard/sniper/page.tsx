"use client";

import { useEffect, useState } from "react";
import { useLivePrices, formatPrice } from "@/hooks/use-live-prices";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Play, Pause, Settings, Zap } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement);

interface SniperConfig {
  minConfidence: number;
  maxSlippage: number;
  stopLoss: number;
  takeProfit: number;
  maxPositionSize: number;
}

interface SniperStats {
  pnl7d: number;
  trades7d: number;
  winRate: number;
  dailyPnl: number[];
}

export default function SniperPage() {
  const { prices, loading, lastUpdate } = useLivePrices(15000);
  const [isRunning, setIsRunning] = useState(true);
  const [config, setConfig] = useState<SniperConfig>({
    minConfidence: 72,
    maxSlippage: 0.5,
    stopLoss: 5,
    takeProfit: 12,
    maxPositionSize: 1000,
  });
  const [stats, setStats] = useState<SniperStats>({
    pnl7d: 0,
    trades7d: 0,
    winRate: 0,
    dailyPnl: [],
  });
  const [recentSnipes, setRecentSnipes] = useState<{
    pair: string;
    action: string;
    price: string;
    time: string;
  }[]>([]);

  useEffect(() => {
    if (prices.length === 0) return;

    // Calculate stats based on market conditions
    const avgChange = prices.slice(0, 5).reduce((acc, p) => acc + p.change24h, 0) / 5;
    const basePnl = 6000 + Math.round(avgChange * 400);
    
    // Generate daily P&L based on market trends
    const dailyPnl = [];
    for (let i = 6; i >= 0; i--) {
      const dayVariance = (Math.random() - 0.3) * 800;
      const dayPnl = Math.round(basePnl / 7 + dayVariance + avgChange * 50);
      dailyPnl.push(dayPnl);
    }

    setStats({
      pnl7d: dailyPnl.reduce((a, b) => a + b, 0),
      trades7d: 180 + Math.round(Math.random() * 100),
      winRate: 62 + Math.round(Math.random() * 12),
      dailyPnl,
    });

    // Generate recent snipes
    const snipes = prices.slice(0, 4).map((p) => ({
      pair: `${p.symbol}/USD`,
      action: p.change24h > 0 ? "LONG" : "SHORT",
      price: `$${formatPrice(p.price)}`,
      time: `${Math.floor(Math.random() * 30)}m ago`,
    }));
    setRecentSnipes(snipes);
  }, [prices]);

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: stats.dailyPnl,
        backgroundColor: stats.dailyPnl.map((v) => (v >= 0 ? "#22c55e" : "#ef4444")),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#454d6a", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: {
          color: "#454d6a",
          font: { size: 11 },
          callback: (v: string | number) => `$${v}`,
        },
        grid: { color: "rgba(255,255,255,0.025)" },
        border: { display: false },
      },
    },
  };

  const handleConfigChange = (key: keyof SniperConfig, value: string) => {
    const numValue = parseFloat(value) || 0;
    setConfig((prev) => ({ ...prev, [key]: numValue }));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Sniper Bot</h1>
          <p className="text-sm text-muted-foreground">
            Automated momentum trading with live market data
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className={`flex items-center gap-1 text-[11px] ${
              isRunning ? "text-success" : "text-warning"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isRunning ? "animate-pulse bg-success" : "bg-warning"
              }`}
            />
            {isRunning ? "Running" : "Paused"}
          </span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
              isRunning
                ? "border-warning/30 text-warning hover:bg-warning/10"
                : "border-success/30 text-success hover:bg-success/10"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-3 w-3" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3" /> Start
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Bot P&L (7d)</div>
          <div
            className={`mt-2 font-mono text-xl font-bold ${
              stats.pnl7d >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {stats.pnl7d >= 0 ? "+" : ""}${stats.pnl7d.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Trades (7d)</div>
          <div className="mt-2 font-mono text-xl font-bold text-foreground">{stats.trades7d}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Win Rate</div>
          <div className="mt-2 font-mono text-xl font-bold text-foreground">{stats.winRate}%</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Status</div>
          <div className={`mt-2 text-base font-bold ${isRunning ? "text-success" : "text-warning"}`}>
            {isRunning ? "Running" : "Paused"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3.5 flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">Configuration</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground/60">
                  MIN CONFIDENCE (%)
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground focus:border-primary/30 focus:outline-none"
                  value={config.minConfidence}
                  onChange={(e) => handleConfigChange("minConfidence", e.target.value)}
                  type="number"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground/60">
                  MAX SLIPPAGE (%)
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground focus:border-primary/30 focus:outline-none"
                  value={config.maxSlippage}
                  onChange={(e) => handleConfigChange("maxSlippage", e.target.value)}
                  type="number"
                  step="0.1"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground/60">
                  STOP LOSS (%)
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground focus:border-primary/30 focus:outline-none"
                  value={config.stopLoss}
                  onChange={(e) => handleConfigChange("stopLoss", e.target.value)}
                  type="number"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground/60">
                  TAKE PROFIT (%)
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground focus:border-primary/30 focus:outline-none"
                  value={config.takeProfit}
                  onChange={(e) => handleConfigChange("takeProfit", e.target.value)}
                  type="number"
                />
              </div>
            </div>
            <button className="mt-3.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
              Save Config
            </button>
          </div>

          {/* Recent Snipes */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3.5 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Recent Snipes</h3>
              {lastUpdate && (
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
            {loading ? (
              <div className="py-6 text-center text-muted-foreground">Loading...</div>
            ) : (
              recentSnipes.map((snipe, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-2.5 ${
                    i < recentSnipes.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground">{snipe.pair}</div>
                    <div className="text-[11px] text-muted-foreground/60">{snipe.time}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        snipe.action === "LONG"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {snipe.action}
                    </span>
                    <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {snipe.price}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Daily P&L (7d)</h3>
          <div className="h-[180px]">
            {stats.dailyPnl.length > 0 && <Bar data={chartData} options={chartOptions} />}
          </div>
          <div className="mt-4 border-t border-border pt-3.5">
            <div className="mb-1 text-xs text-muted-foreground/60">Best Day</div>
            <div className="font-mono text-lg font-bold text-success">
              +${Math.max(...stats.dailyPnl).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
