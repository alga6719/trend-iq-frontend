"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function SniperPage() {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [1200, 1800, -400, 2100, 1600, 2400, 1520],
        backgroundColor: (ctx: { raw: number }) => (ctx.raw >= 0 ? "#22c55e" : "#ef4444"),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#454d6a", font: { size: 11 } }, grid: { display: false }, border: { display: false } },
      y: { ticks: { color: "#454d6a", font: { size: 11 }, callback: (v: string | number) => `$${v}` }, grid: { color: "rgba(255,255,255,0.025)" }, border: { display: false } },
    },
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">Sniper Bot</h1>

      <div className="mb-4 grid grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Bot P&L (7d)</div>
          <div className="mt-2 font-mono text-xl font-bold text-success">+$8,420</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Trades (7d)</div>
          <div className="mt-2 font-mono text-xl font-bold text-foreground">247</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Win Rate</div>
          <div className="mt-2 font-mono text-xl font-bold text-foreground">68%</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Status</div>
          <div className="mt-2 text-base font-bold text-success">Running</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Configuration</h3>
          <div className="mt-3.5 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[11px] text-muted-foreground/60">MIN CONFIDENCE</label>
              <input className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground" defaultValue="72%" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] text-muted-foreground/60">MAX SLIPPAGE</label>
              <input className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground" defaultValue="0.5%" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] text-muted-foreground/60">STOP LOSS</label>
              <input className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground" defaultValue="-5%" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] text-muted-foreground/60">TAKE PROFIT</label>
              <input className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground" defaultValue="+12%" />
            </div>
          </div>
          <button className="mt-3.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
            Save Config
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Daily P&L (7d)</h3>
          <div className="h-[180px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
