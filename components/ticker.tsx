"use client";

import { useEffect, useState } from "react";

interface TickerData {
  symbol: string;
  price: number;
  change24h: number;
}

const SYMBOLS = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "AVAX/USD",
  "BNB/USD",
  "ARB/USD",
  "OP/USD",
  "WIF/USD",
];

const CG_IDS =
  "bitcoin,ethereum,solana,avalanche-2,binancecoin,arbitrum,optimism,dogwifcoin";

const CG_MAP: Record<string, string> = {
  bitcoin: "BTC/USD",
  ethereum: "ETH/USD",
  solana: "SOL/USD",
  "avalanche-2": "AVAX/USD",
  binancecoin: "BNB/USD",
  arbitrum: "ARB/USD",
  optimism: "OP/USD",
  dogwifcoin: "WIF/USD",
};

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function formatPercent(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function Ticker() {
  const [prices, setPrices] = useState<Record<string, TickerData>>({});

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CG_IDS}&order=market_cap_desc&per_page=20&sparkline=false&price_change_percentage=24h`,
          {
            headers: {
              "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa",
            },
          }
        );
        const data = await res.json();
        const newPrices: Record<string, TickerData> = {};
        for (const coin of data) {
          const sym = CG_MAP[coin.id];
          if (sym) {
            newPrices[sym] = {
              symbol: sym,
              price: coin.current_price,
              change24h: coin.price_change_percentage_24h || 0,
            };
          }
        }
        setPrices(newPrices);
      } catch (err) {
        console.warn("CoinGecko fetch error:", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const items = SYMBOLS.map((sym) => {
    const data = prices[sym];
    return {
      symbol: sym,
      price: data ? `$${formatPrice(data.price)}` : "...",
      change: data ? formatPercent(data.change24h) : "...",
      isUp: data ? data.change24h >= 0 : true,
    };
  });

  // Triple the items for seamless scrolling
  const tripled = [...items, ...items, ...items];

  return (
    <div className="relative flex h-9 items-center overflow-hidden border-b border-border bg-card">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[60px] bg-gradient-to-r from-card to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[60px] bg-gradient-to-l from-card to-transparent" />
      <div className="flex animate-scroll-ticker whitespace-nowrap">
        {tripled.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 border-r border-border px-4 font-mono text-xs"
          >
            <span className="text-muted-foreground">{item.symbol}</span>
            <span className="text-foreground">{item.price}</span>
            <span className={item.isUp ? "text-success" : "text-destructive"}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
