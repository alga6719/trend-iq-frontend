"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const strategies = [
  { name: "Momentum Long", meta: "BTC/USD · 15m · Min 72% confidence", status: "Running" },
  { name: "DCA Accumulator", meta: "ETH/USD · Daily · $50/trade", status: "Running" },
  { name: "Whale Follower", meta: "SOL/USD · Event-driven", status: "Paused" },
  { name: "RSI Reversal", meta: "AVAX/USD · 1h", status: "Running" },
];

export default function StrategiesPage() {
  const chartData = {
    labels: ["Momentum", "DCA", "Whale", "RSI"],
    datasets: [
      {
        data: [72, 68, 54, 66],
        backgroundColor: ["#22c55e", "#8b5cf6", "#f59e0b", "#3b82f6"],
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
      x: { ticks: { color: "#454d6a", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.025)" }, border: { display: false }, max: 100 },
      y: { ticks: { color: "#8890aa", font: { size: 11 } }, grid: { display: false }, border: { display: false } },
    },
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">Strategies</h1>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Active strategies</h3>
          {strategies.map((s, i) => (
            <div key={s.name} className={`flex items-center justify-between py-2.5 ${i < strategies.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <div className="text-sm font-semibold text-foreground">{s.name}</div>
                <div className="text-[11px] text-muted-foreground/60">{s.meta}</div>
              </div>
              <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${s.status === "Running" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {s.status}
              </span>
            </div>
          ))}
          <button className="mt-4 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
            + New Strategy
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Win Rate by Strategy</h3>
          <div className="h-[180px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
