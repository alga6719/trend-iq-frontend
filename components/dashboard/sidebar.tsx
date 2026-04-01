"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  TrendingUp,
  MessageSquare,
  LineChart,
  Target,
  Flame,
  Fish,
  Shield,
  Clock,
  Eye,
  Crosshair,
  Settings,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { id: "portfolio", label: "Portfolio", icon: TrendingUp, href: "/dashboard/portfolio" },
  { id: "askai", label: "Ask AI", icon: MessageSquare, href: "/dashboard/ask-ai" },
  { id: "strategies", label: "Strategies", icon: LineChart, href: "/dashboard/strategies" },
  { id: "ml", label: "ML Predictions", icon: Target, href: "/dashboard/ml" },
  { id: "momentum", label: "Momentum", icon: Flame, href: "/dashboard/momentum" },
  { id: "whale", label: "Whale Alerts", icon: Fish, href: "/dashboard/whale" },
  { id: "risk", label: "Risk Manager", icon: Shield, href: "/dashboard/risk" },
  { id: "history", label: "Trade History", icon: Clock, href: "/dashboard/history" },
  { id: "watchlist", label: "Watchlist", icon: Eye, href: "/dashboard/watchlist" },
  { id: "sniper", label: "Sniper Bot", icon: Crosshair, href: "/dashboard/sniper" },
];

const settingsItem = { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" };

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[220px] flex-shrink-0 overflow-y-auto border-r border-border bg-card">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </Link>
        );
      })}
      <div className="my-1 h-px bg-border" />
      <Link
        href={settingsItem.href}
        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
          isActive(settingsItem.href)
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
        }`}
      >
        <settingsItem.icon className="h-4 w-4 flex-shrink-0" />
        {settingsItem.label}
      </Link>
    </aside>
  );
}
