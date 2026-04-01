import Link from "next/link";

const stats = [
  { value: "2.14x", label: "Avg Sharpe Ratio" },
  { value: "68.4%", label: "Win Rate" },
  { value: "$24M+", label: "Volume Traded" },
  { value: "99.9%", label: "Uptime" },
];

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-10 py-20 text-center">
      <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground">
        Now live: Sniper Bot v2 + ML Prediction Engine
      </div>

      <h1 className="mb-5 text-balance text-5xl font-extrabold leading-[1.03] tracking-tight md:text-7xl">
        Trade Crypto Smarter
        <br />
        <span className="gradient-text">With AI on Your Side</span>
      </h1>

      <p className="mb-10 max-w-xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
        TrendIQ combines machine learning, on-chain whale signals, and advanced
        risk management to execute profitable trades — automatically.
      </p>

      <div className="mb-14 flex justify-center gap-3">
        <Link
          href="/register"
          className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Start for Free
        </Link>
        <Link
          href="/pricing"
          className="rounded-xl border border-border/50 bg-white/[0.06] px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-white/10"
        >
          View Plans
        </Link>
      </div>

      <div className="flex overflow-hidden rounded-xl border border-border/50 bg-card">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`px-12 py-6 ${idx !== stats.length - 1 ? "border-r border-border" : ""}`}
          >
            <div className="font-mono text-3xl font-extrabold tracking-tight text-foreground">
              {stat.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground/60">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
