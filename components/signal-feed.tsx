"use client";

const signals = [
  { coin: "BTC", action: "BUY", reason: "RSI oversold + whale accumulation", confidence: 87, time: "2m ago" },
  { coin: "SOL", action: "BUY", reason: "Breakout on volume spike", confidence: 82, time: "5m ago" },
  { coin: "ETH", action: "HOLD", reason: "Neutral momentum", confidence: 65, time: "8m ago" },
  { coin: "ARB", action: "SELL", reason: "Overbought, resistance hit", confidence: 78, time: "12m ago" },
];

export function SignalFeed() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <span className="text-sm font-semibold text-foreground">
          Live Signal Feed
        </span>
        <span className="flex items-center gap-1.5 text-xs text-success">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />
          Live
        </span>
      </div>
      <div>
        {signals.map((signal, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2.5 px-4 py-3 ${idx !== signals.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-[10px] font-bold text-muted-foreground">
              {signal.coin}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    signal.action === "BUY"
                      ? "bg-success/10 text-success"
                      : signal.action === "SELL"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                  }`}
                >
                  {signal.action}
                </span>
                <span className="text-muted-foreground">{signal.reason}</span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div
                className={`text-xs font-semibold ${
                  signal.confidence >= 80
                    ? "text-success"
                    : signal.confidence >= 65
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                {signal.confidence}%
              </div>
              <div className="text-[11px] text-muted-foreground/60">
                {signal.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
