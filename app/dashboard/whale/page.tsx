"use client";

const whales = [
  { type: "BUY", pair: "BTC/USD", amount: "$4.2M", meta: "Binance", exchange: "2m ago" },
  { type: "SELL", pair: "ETH/USD", amount: "$1.8M", meta: "Coinbase", exchange: "5m ago" },
  { type: "BUY", pair: "SOL/USD", amount: "$890K", meta: "Kraken", exchange: "8m ago" },
  { type: "BUY", pair: "AVAX/USD", amount: "$2.1M", meta: "Binance", exchange: "12m ago" },
  { type: "SELL", pair: "BNB/USD", amount: "$1.4M", meta: "Binance", exchange: "15m ago" },
];

export default function WhalePage() {
  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">Whale Alerts</h1>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Live transactions</h3>
          {whales.map((w, i) => (
            <div key={i} className={`flex items-center gap-3.5 py-3.5 ${i < whales.length - 1 ? "border-b border-border" : ""}`}>
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[9px] font-bold ${w.type === "BUY" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {w.type}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{w.pair}</div>
                <div className="text-[11px] text-muted-foreground/60">{w.meta} &middot; {w.exchange}</div>
              </div>
              <div className={`ml-auto font-mono text-sm font-bold ${w.type === "BUY" ? "text-success" : "text-destructive"}`}>
                {w.amount}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Whale stats (24h)</h3>
          <div className="mb-2.5 rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground">Large buys</div>
            <div className="mt-2 font-mono text-xl font-bold text-success">14</div>
          </div>
          <div className="mb-2.5 rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground">Large sells</div>
            <div className="mt-2 font-mono text-xl font-bold text-destructive">9</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground">Net whale flow</div>
            <div className="mt-2 font-mono text-xl font-bold text-success">+$18.4M</div>
          </div>
        </div>
      </div>
    </div>
  );
}
