import { NextResponse } from "next/server";

export async function GET() {
  const status: Record<string, { connected: boolean; message: string }> = {};

  // Check CoinGecko
  try {
    const cgRes = await fetch(
      "https://api.coingecko.com/api/v3/ping",
      { 
        headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" },
        signal: AbortSignal.timeout(5000)
      }
    );
    status.coingecko = {
      connected: cgRes.ok,
      message: cgRes.ok ? "Live prices active" : "API rate limited",
    };
  } catch {
    status.coingecko = { connected: false, message: "Connection failed" };
  }

  // Check Fear & Greed Index
  try {
    const fngRes = await fetch(
      "https://api.alternative.me/fng/?limit=1",
      { signal: AbortSignal.timeout(5000) }
    );
    status.fearGreed = {
      connected: fngRes.ok,
      message: fngRes.ok ? "Sentiment data active" : "API unavailable",
    };
  } catch {
    status.fearGreed = { connected: false, message: "Connection failed" };
  }

  // Check Kraken API
  const hasKrakenKeys = !!(process.env.KRAKEN_API_KEY && process.env.KRAKEN_API_SECRET);
  status.kraken = {
    connected: hasKrakenKeys,
    message: hasKrakenKeys ? "API keys configured" : "API keys not set",
  };

  // Check Grok AI
  const hasGrokKey = !!process.env.XAI_API_KEY;
  status.grok = {
    connected: hasGrokKey,
    message: hasGrokKey ? "AI chat enabled" : "XAI_API_KEY not set",
  };

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    services: status,
    overall: Object.values(status).filter((s) => s.connected).length >= 2,
  });
}
