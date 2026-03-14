"use client";

import { DashboardLayout } from "@/components/dashboard-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your trading portfolio and market insights
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Balance", value: "$124,847.50", change: "+12.4%", up: true },
            { label: "Today's P&L", value: "+$2,847.50", change: "+3.2%", up: true },
            { label: "Open Positions", value: "12", change: "-2", up: false },
            { label: "Win Rate", value: "68.5%", change: "+2.1%", up: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <div className="mt-2 font-mono text-2xl font-bold tracking-tight">
                {stat.value}
              </div>
              <div
                className={`mt-1 flex items-center gap-1 font-mono text-xs ${
                  stat.up ? "text-success" : "text-destructive"
                }`}
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {stat.up ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  )}
                </svg>
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Content placeholder */}
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
            <h2 className="text-base font-bold">Portfolio Performance</h2>
            <div className="mt-4 flex h-56 items-center justify-center rounded-lg bg-secondary/30 text-sm text-muted-foreground">
              Chart coming soon
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-bold">Market Sentiment</h2>
            <div className="mt-4 flex h-56 items-center justify-center rounded-lg bg-secondary/30 text-sm text-muted-foreground">
              Gauge coming soon
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-bold">Recent Trades</h2>
          <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-secondary/30 text-sm text-muted-foreground">
            Trade history coming soon
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
