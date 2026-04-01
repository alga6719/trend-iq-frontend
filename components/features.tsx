import {
  TrendingUp,
  Clock,
  Shield,
  Zap,
  LayoutGrid,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "AI-Powered Signals",
    description:
      "ML models trained on years of market data surface high-probability opportunities in real time.",
  },
  {
    icon: Clock,
    title: "Sniper Bot",
    description:
      "Execute trades with surgical precision — customizable slippage, stop-loss, take-profit, and auto-compound.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Automatic hedging, drawdown limits, and position sizing to protect capital in volatile conditions.",
  },
  {
    icon: Zap,
    title: "Real-Time Execution",
    description:
      "Sub-100ms order routing through top CEX APIs — never miss an entry.",
  },
  {
    icon: LayoutGrid,
    title: "Analytics Dashboard",
    description:
      "Sharpe ratio, win rate, drawdown metrics, and full trade history in one live dashboard.",
  },
  {
    icon: Layers,
    title: "Multi-Strategy Engine",
    description:
      "Run momentum, arbitrage, and market-neutral strategies simultaneously across multiple assets.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-10 py-10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
        Platform Features
      </p>
      <h2 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">
        Everything you need to trade at an edge
      </h2>
      <p className="mb-12 max-w-md text-muted-foreground">
        Professional-grade tools, powered by AI.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/25"
          >
            <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground/60">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
