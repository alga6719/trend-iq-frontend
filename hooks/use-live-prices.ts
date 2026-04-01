"use client";

import { useEffect, useState } from "react";

export interface LivePrice {
  symbol: string;
  id: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

const CG_IDS = "bitcoin,ethereum,solana,avalanche-2,binancecoin,arbitrum,optimism,dogwifcoin,jupiter-exchange-solana";

const ID_TO_SYMBOL: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  "avalanche-2": "AVAX",
  binancecoin: "BNB",
  arbitrum: "ARB",
  optimism: "OP",
  dogwifcoin: "WIF",
  "jupiter-exchange-solana": "JUP",
};

export function useLivePrices(refreshInterval = 30000) {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CG_IDS}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`,
          { headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" } }
        );
        
        if (!res.ok) throw new Error("Failed to fetch prices");
        
        const data = await res.json();
        const processed: LivePrice[] = data.map((coin: {
          id: string;
          current_price: number;
          price_change_percentage_24h: number;
          total_volume: number;
          market_cap: number;
        }) => ({
          id: coin.id,
          symbol: ID_TO_SYMBOL[coin.id] || coin.id.toUpperCase(),
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h || 0,
          volume: coin.total_volume,
          marketCap: coin.market_cap,
        }));
        
        setPrices(processed);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.warn("Price fetch error:", err);
        setError("Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { prices, loading, error, lastUpdate };
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export function formatPercent(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
  return `$${volume.toLocaleString()}`;
}
