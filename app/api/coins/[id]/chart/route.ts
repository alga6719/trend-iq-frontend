import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get("days") || "30";

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data for chart
    const chartData = data.prices.map(([timestamp, price]: [number, number], index: number) => ({
      date: new Date(timestamp).toISOString(),
      price,
      volume: data.total_volumes[index]?.[1] || 0,
    }));

    return NextResponse.json({ chartData, raw: data });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
