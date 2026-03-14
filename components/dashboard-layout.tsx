"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "Momentum",
    href: "/momentum",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    badge: "NEW",
  },
  {
    name: "Portfolio & Trading",
    href: "/portfolio",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    name: "Ask AI",
    href: "/ask-ai",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.97-4.03 9-9 9a9 9 0 01-9-9 9 9 0 019-9c4.97 0 9 4.03 9 9z"
        />
      </svg>
    ),
  },
  {
    name: "Strategies",
    href: "/strategies",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143z"
        />
      </svg>
    ),
  },
  {
    name: "ML Predictions",
    href: "/predictions",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" />
        <path
          strokeLinecap="round"
          d="M19.07 4.93l-1.42 1.42M4.93 4.93l1.42 1.42M12 2v2m0 18v-2m7.07-14.07l-1.42 1.42M6.34 17.66l-1.42 1.42M22 12h-2M4 12H2"
        />
      </svg>
    ),
  },
  {
    name: "Whale Alerts",
    href: "/whale-alerts",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" d="M3 4h18M3 8h18M3 12h18M3 16h10" />
      </svg>
    ),
  },
  {
    name: "Risk Manager",
    href: "/risk",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        />
      </svg>
    ),
  },
  {
    name: "Trade History",
    href: "/history",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    name: "Watchlist",
    href: "/watchlist",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
  },
  {
    name: "Sniper Bot",
    href: "/sniper",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" />
        <path
          strokeLinecap="round"
          d="M12 2L9.09 8.26L2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L17 14.14l5-4.87-7.09-1.01L12 2z"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <svg
              className="h-4 w-4 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="font-sans text-sm font-bold leading-tight">
            <span className="block">TrendIQ</span>
          </div>
        </div>

        <span className="rounded bg-primary px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide text-primary-foreground">
          BETA
        </span>

        <div className="mx-1 h-7 w-px bg-border" />

        {/* Trading Controls */}
        <button className="flex items-center gap-1.5 rounded-md border border-border bg-transparent px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted hover:bg-secondary hover:text-foreground">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          Auto-Trade
        </button>

        <div className="flex flex-col gap-0 rounded-md border border-border px-2.5 py-1">
          <span className="text-[9px] tracking-wide text-muted-foreground">DAILY P&L</span>
          <span className="font-mono text-xs font-bold text-success">+$2,847.50</span>
        </div>

        <button className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-green-600 to-green-700 px-2.5 py-1.5 text-xs font-bold text-white transition-all hover:brightness-110">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-300" />
          Live Trading
        </button>

        <div className="flex-1" />

        {/* User */}
        <button className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-muted-foreground">
            PRO
          </span>
          alex@trendiq.io
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </header>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-52 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-border bg-card p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-sm transition-all",
                  isActive
                    ? "border-white/10 bg-primary font-semibold text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className={cn("h-4 w-4 shrink-0", isActive ? "opacity-100" : "opacity-80")}>
                  {item.icon}
                </span>
                {item.name}
                {item.badge && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
