"use client";

const riskBreakdown = [
  { name: "Portfolio volatility", value: 42, color: "bg-warning", textColor: "text-warning" },
  { name: "Concentration risk", value: 68, color: "bg-destructive", textColor: "text-destructive" },
  { name: "Liquidity risk", value: 24, color: "bg-success", textColor: "text-success" },
  { name: "Leverage exposure", value: 15, color: "bg-success", textColor: "text-success" },
];

const limits = [
  { name: "Max position size", value: "10%" },
  { name: "Stop loss", value: "-5%" },
  { name: "Daily loss limit", value: "-15%" },
];

export default function RiskPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">Risk Manager</h1>

      <div className="mb-4 grid grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Portfolio Risk</div>
          <div className="mt-2 font-mono text-xl font-bold text-warning">Medium</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Max Drawdown (7d)</div>
          <div className="mt-2 font-mono text-xl font-bold text-destructive">-8.4%</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Position Limit Used</div>
          <div className="mt-2 font-mono text-xl font-bold text-foreground">68%</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">Risk Breakdown</h3>
          {riskBreakdown.map((r) => (
            <div key={r.name} className="mb-2.5 grid grid-cols-[140px_1fr_50px] items-center gap-2.5 text-xs">
              <span className="text-muted-foreground">{r.name}</span>
              <div className="h-1.5 overflow-hidden rounded bg-accent">
                <div className={`h-full rounded ${r.color}`} style={{ width: `${r.value}%` }} />
              </div>
              <span className={`text-right font-mono font-semibold ${r.textColor}`}>{r.value}%</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Risk Limits</h3>
          {limits.map((l, i) => (
            <div key={l.name} className={`flex items-center justify-between py-2.5 ${i < limits.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-sm font-semibold text-foreground">{l.name}</span>
              <span className="font-mono text-sm font-semibold text-foreground">{l.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
