"use client";

const history = [
  { date: "Apr 1, 14:32", pair: "BTC/USD", side: "BUY", strategy: "Momentum", entry: "$67,842", exit: "$68,240", size: "0.012", pnl: "+$214" },
  { date: "Apr 1, 12:18", pair: "ETH/USD", side: "SELL", strategy: "RSI Reversal", entry: "$3,480", exit: "$3,412", size: "1.5", pnl: "-$102" },
  { date: "Apr 1, 09:45", pair: "SOL/USD", side: "BUY", strategy: "Whale Follow", entry: "$138.20", exit: "$142.30", size: "25", pnl: "+$102" },
  { date: "Mar 31, 22:10", pair: "AVAX/USD", side: "SELL", strategy: "Take Profit", entry: "$38.20", exit: "$35.80", size: "40", pnl: "+$96" },
  { date: "Mar 31, 18:55", pair: "ARB/USD", side: "BUY", strategy: "Momentum", entry: "$1.12", exit: "$1.18", size: "500", pnl: "+$30" },
  { date: "Mar 31, 15:22", pair: "BNB/USD", side: "SELL", strategy: "Stop Loss", entry: "$580", exit: "$565", size: "2", pnl: "-$30" },
  { date: "Mar 31, 11:08", pair: "SOL/USD", side: "BUY", strategy: "DCA", entry: "$135.40", exit: "$138.20", size: "20", pnl: "+$56" },
  { date: "Mar 30, 23:45", pair: "ETH/USD", side: "BUY", strategy: "ML Signal", entry: "$3,380", exit: "$3,480", size: "3", pnl: "+$300" },
];

export default function HistoryPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">Trade History</h1>

      <div className="rounded-xl border border-border bg-card p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              <th className="pb-2">Date</th>
              <th className="pb-2">Pair</th>
              <th className="pb-2">Side</th>
              <th className="pb-2">Strategy</th>
              <th className="pb-2">Entry</th>
              <th className="pb-2">Exit</th>
              <th className="pb-2">Size</th>
              <th className="pb-2">P&L</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b border-border last:border-b-0 hover:bg-white/[0.015]">
                <td className="py-2.5 text-xs text-muted-foreground/60">{h.date}</td>
                <td className="py-2.5 font-semibold text-foreground">{h.pair}</td>
                <td className="py-2.5">
                  <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${h.side === "BUY" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {h.side}
                  </span>
                </td>
                <td className="py-2.5 text-xs text-muted-foreground/60">{h.strategy}</td>
                <td className="py-2.5 font-mono">{h.entry}</td>
                <td className="py-2.5 font-mono">{h.exit}</td>
                <td className="py-2.5 font-mono">{h.size}</td>
                <td className={`py-2.5 font-mono font-semibold ${h.pnl.startsWith("+") ? "text-success" : "text-destructive"}`}>{h.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
