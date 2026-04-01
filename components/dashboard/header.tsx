"use client";

import Link from "next/link";
import { TrendingUp, RefreshCw, Square, Play } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 flex-shrink-0 items-center gap-2.5 border-b border-border bg-card px-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-bold text-foreground"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span>Quantum Trading Bot</span>
      </Link>

      <span className="rounded bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
        LIVE
      </span>

      <button className="flex items-center gap-1.5 rounded-lg bg-[#16a34a] px-3 py-1.5 text-xs font-medium text-white">
        <Play className="h-3 w-3" />
        Live Trade
      </button>

      <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
        Sim Trade
      </button>

      <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
        <RefreshCw className="h-3 w-3" />
        Refresh
      </button>

      <button className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground">
        <Square className="h-3 w-3" />
        Stop Bot
      </button>

      <div className="ml-auto flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-[10px] font-bold text-primary">
          AG
        </div>
        <span>alexgaray5</span>
        <span className="rounded border border-border bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground/60">
          FREE
        </span>
      </div>
    </header>
  );
}
