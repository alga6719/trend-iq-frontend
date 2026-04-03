"use client";

import { cn } from "@/lib/utils";
import {
  formatPrice,
  formatPercentage,
  formatMarketCap,
  type Coin,
} from "@/lib/trading/coins";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import Image from "next/image";

interface CoinSelectorProps {
  coins: Coin[];
  selectedCoin: Coin | null;
  onSelect: (coin: Coin) => void;
  isLoading: boolean;
}

export function CoinSelector({
  coins,
  selectedCoin,
  onSelect,
  isLoading,
}: CoinSelectorProps) {
  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mb-3" />
        <p className="text-sm text-[var(--muted-foreground)]">Loading live prices...</p>
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--muted-foreground)] bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <p>Unable to load coin data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {coins.map((coin) => {
        const isPositive = coin.price_change_percentage_24h >= 0;
        const isSelected = selectedCoin?.id === coin.id;

        return (
          <button
            key={coin.id}
            onClick={() => onSelect(coin)}
            className={cn(
              "w-full p-3 rounded-lg border transition-all text-left",
              "hover:border-[var(--primary)]/50",
              isSelected
                ? "bg-[var(--primary)]/10 border-[var(--primary)]"
                : "bg-[var(--card)] border-[var(--border)]"
            )}
          >
            <div className="flex items-center gap-3">
              <Image
                src={coin.image}
                alt={coin.name}
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--foreground)]">
                      {coin.symbol.toUpperCase()}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] truncate">
                      {coin.name}
                    </span>
                  </div>
                  <span className="font-medium text-[var(--foreground)]">
                    {formatPrice(coin.current_price)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    MCap: {formatMarketCap(coin.market_cap)}
                  </span>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      isPositive ? "text-[var(--success)]" : "text-[var(--destructive)]"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
