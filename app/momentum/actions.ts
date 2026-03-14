"use server";

import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function generateForecast(
  ticker: string,
  name: string,
  price: number,
  change24h: number,
  rsi: number,
  macdSignal: string
) {
  try {
    const { text } = await generateText({
      model: xai("grok-3-mini"),
      prompt: `You are an expert financial analyst. Provide a brief 1-hour price forecast for ${ticker} (${name}).

Current data:
- Price: $${price.toLocaleString()}
- 24h Change: ${change24h > 0 ? "+" : ""}${change24h}%
- RSI: ${rsi}
- MACD Signal: ${macdSignal}

Provide a concise forecast in 2-3 sentences including:
1. Expected price direction (up/down/sideways)
2. Key factors driving this prediction
3. Confidence level (low/medium/high)

Keep the response brief and actionable for traders.`,
      maxTokens: 150,
    });

    return { success: true, forecast: text };
  } catch (error) {
    console.error("Forecast error:", error);
    return {
      success: false,
      forecast:
        "Unable to generate forecast at this time. Please try again later.",
    };
  }
}
