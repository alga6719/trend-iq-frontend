const trades = [
  { side: "buy", pair: "BTC/USD", strat: "ML Momentum", price: "$67,842", detail: "0.012 BTC", pnl: "+$214" },
  { side: "sell", pair: "ETH/USD", strat: "RSI Reversal", price: "$3,412", detail: "1.5 ETH", pnl: "-$82" },
  { side: "buy", pair: "SOL/USD", strat: "Whale Follow", price: "$142.30", detail: "25 SOL", pnl: "+$156" },
  { side: "sell", pair: "AVAX/USD", strat: "Take Profit", price: "$35.80", detail: "40 AVAX", pnl: "+$92" },
];

export function RecentTrades() {
  return (
    <div>
      {trades.map((trade, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-3.5 py-3.5 ${idx !== trades.length - 1 ? "border-b border-border" : ""}`}
        >
          <span
            className={`min-w-[46px] flex-shrink-0 rounded px-2.5 py-1 text-center text-[11px] font-bold uppercase ${
              trade.side === "buy"
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {trade.side}
          </span>
          <div>
            <div className="text-sm font-bold text-foreground">{trade.pair}</div>
            <div className="text-xs text-muted-foreground/60">{trade.strat}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="font-mono text-sm text-foreground">{trade.price}</div>
            <div className="text-[11px] text-muted-foreground/60">{trade.detail}</div>
          </div>
          <div
            className={`flex-shrink-0 font-mono text-sm font-bold ${
              trade.pnl.startsWith("+") ? "text-success" : "text-destructive"
            }`}
          >
            {trade.pnl}
          </div>
        </div>
      ))}
    </div>
  );
}
