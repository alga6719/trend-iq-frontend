import { NextResponse } from "next/server";
import { SUPPORTED_COINS } from "@/lib/trading/coins";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const coinIds = SUPPORTED_COINS.map((c) => c.id).join(",");
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=true&price_change_percentage=7d`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching coins:", error);
    return NextResponse.json(
      { error: "Failed to fetch coin data" },
      { status: 500 }
    );
  }
}
