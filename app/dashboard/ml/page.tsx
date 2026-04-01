"use client";

const mlSignals = [
  { pair: "BTC/USD", reason: "Strong bullish divergence on 4h RSI, volume confirmation", signal: "BUY", confidence: 87 },
  { pair: "ETH/USD", reason: "Consolidation phase, waiting for breakout direction", signal: "HOLD", confidence: 65 },
  { pair: "SOL/USD", reason: "Bearish engulfing on daily, high sell pressure", signal: "SELL", confidence: 78 },
  { pair: "AVAX/USD", reason: "Accumulation zone, whale activity detected", signal: "BUY", confidence: 72 },
];

const gauges = [
  { label: "Technical Analysis", value: 82 },
  { label: "On-chain Metrics", value: 75 },
  { label: "Social Sentiment", value: 68 },
  { label: "Whale Activity", value: 89 },
];

export default function MLPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">ML Predictions</h1>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary w-fit">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
            ML Engine &middot; Updated 1m ago
          </div>
          {mlSignals.map((s, i) => (
            <div key={s.pair} className={`flex items-start justify-between gap-2.5 py-2.5 ${i < mlSignals.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <div className="mb-1 text-sm font-semibold text-foreground">{s.pair}</div>
                <div className="text-[11px] leading-relaxed text-muted-foreground/60">{s.reason}</div>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${s.signal === "BUY" ? "bg-success/10 text-success" : s.signal === "SELL" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                  {s.signal}
                </span>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">{s.confidence}%</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Confluence Engine</h3>
          {gauges.map((g) => (
            <div key={g.label} className="mb-2.5 grid grid-cols-[130px_1fr_42px] items-center gap-2.5 text-xs">
              <span className="text-muted-foreground">{g.label}</span>
              <div className="h-1.5 overflow-hidden rounded bg-accent">
                <div className="h-full rounded bg-primary" style={{ width: `${g.value}%` }} />
              </div>
              <span className="text-right font-mono font-semibold text-primary">{g.value}%</span>
            </div>
          ))}
          <div className="mt-4 border-t border-border pt-3.5">
            <div className="mb-1 text-xs text-muted-foreground/60">Overall Confluence Score</div>
            <div className="font-mono text-2xl font-bold text-primary">78.6 <span className="text-sm text-muted-foreground/60">/100</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
