import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    tier: "Try First",
    name: "Demo",
    tag: "Free · 1 day",
    price: "$0",
    features: ["Full dashboard 24hrs", "Live AI signals", "Bot simulation"],
    cta: "Start Demo",
    href: "/register",
    primary: false,
  },
  {
    tier: "Pro",
    name: "Pro",
    tag: "For traders ready to automate",
    price: "$9",
    period: "/mo",
    features: ["20 tokens watchlist", "AI signal feed", "Bot execution 20/day"],
    cta: "Get Pro",
    href: "/register",
    primary: false,
  },
  {
    tier: "Max",
    name: "Max",
    tag: "Full power, no limits",
    price: "$15",
    period: "/mo",
    features: ["Unlimited watchlist", "Sniper bot 100/day", "Whale alert feed"],
    cta: "Go Max",
    href: "/register",
    primary: true,
    best: true,
  },
  {
    tier: "Enterprise",
    name: "Enterprise",
    tag: "For funds",
    price: "Custom",
    features: ["Everything in Max", "SLA guarantees", "Dedicated manager"],
    cta: "Contact Sales",
    href: "/contact",
    primary: false,
  },
];

export function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-10 py-5">
      <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
        Pick your plan
      </h2>
      <p className="mx-auto mb-11 max-w-md text-center text-muted-foreground">
        No hidden fees. Cancel anytime.
      </p>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-xl border p-6 ${
              plan.best
                ? "border-primary/45 bg-gradient-to-b from-primary/10 to-card"
                : "border-border bg-card"
            }`}
          >
            {plan.best && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                Best Value
              </span>
            )}
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {plan.tier}
            </p>
            <h3 className="mb-1 text-xl font-extrabold text-foreground">
              {plan.name}
            </h3>
            <p className="mb-4 text-xs text-muted-foreground/60">{plan.tag}</p>
            <div className="mb-5 font-mono text-3xl font-semibold tracking-tight text-foreground">
              {plan.price}
              {plan.period && (
                <span className="font-sans text-sm text-muted-foreground/60">
                  {plan.period}
                </span>
              )}
            </div>
            <ul className="mb-5 flex flex-1 flex-col gap-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"
                >
                  <span className="mt-0.5 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-2 w-2 text-success" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                plan.primary
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border/50 bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
