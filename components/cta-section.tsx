import Link from "next/link";

export function CTASection() {
  return (
    <section className="px-10 pb-20">
      <div className="rounded-2xl border border-border bg-card px-10 py-14 text-center md:px-14">
        <h2 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">
          Ready to trade smarter?
        </h2>
        <p className="mb-7 text-muted-foreground">
          Join thousands of traders using TrendIQ.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start for Free
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-border/50 bg-transparent px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
