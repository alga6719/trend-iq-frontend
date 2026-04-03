"use client";

import { cn } from "@/lib/utils";
import {
  formatPrice,
  formatPercentage,
  formatMarketCap,
  formatVolume,
  type Coin,
} from "@/lib/trading/coins";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import Image from "next/image";

interface CoinStatsProps {
  coin: Coin;
}

export function CoinStats({ coin }: CoinStatsProps) {
  const isPositive24h = coin.price_change_percentage_24h >= 0;
  const isPositive7d = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

  return (
    <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={coin.image}
          alt={coin.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            {coin.name}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {coin.symbol.toUpperCase()} / USD
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {formatPrice(coin.current_price)}
          </p>
          <div
            className={cn(
              "flex items-center justify-end gap-1 text-sm font-medium",
              isPositive24h ? "text-[var(--success)]" : "text-[var(--destructive)]"
            )}
          >
            {isPositive24h ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {formatPercentage(coin.price_change_percentage_24h)} (24h)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="24h High"
          value={formatPrice(coin.high_24h)}
          icon={<TrendingUp className="w-4 h-4" />}
          color="text-[var(--success)]"
        />
        <StatCard
          label="24h Low"
          value={formatPrice(coin.low_24h)}
          icon={<TrendingDown className="w-4 h-4" />}
          color="text-[var(--destructive)]"
        />
        <StatCard
          label="24h Volume"
          value={formatVolume(coin.total_volume)}
          icon={<Activity className="w-4 h-4" />}
        />
        <StatCard
          label="Market Cap"
          value={formatMarketCap(coin.market_cap)}
          icon={<BarChart3 className="w-4 h-4" />}
        />
      </div>

      {coin.price_change_percentage_7d_in_currency !== undefined && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted-foreground)]">
              7-Day Performance
            </span>
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive7d ? "text-[var(--success)]" : "text-[var(--destructive)]"
              )}
            >
              {isPositive7d ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {formatPercentage(coin.price_change_percentage_7d_in_currency)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="p-3 rounded-lg bg-[var(--secondary)]">
      <div className={cn("flex items-center gap-2 mb-1", color || "text-[var(--muted-foreground)]")}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
