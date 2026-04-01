import Link from "next/link";
import { SignalFeed } from "./signal-feed";

export function WhySection() {
  return (
    <section className="mx-auto max-w-6xl px-10 py-5">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Why TrendIQ
          </p>
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            The intelligence layer your portfolio needs
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Most trading bots react. TrendIQ anticipates. Our models analyze
            on-chain data, social sentiment, and order book depth to stay one
            step ahead.
          </p>
          <div className="mt-7">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore the Dashboard
            </Link>
          </div>
        </div>
        <SignalFeed />
      </div>
    </section>
  );
}
