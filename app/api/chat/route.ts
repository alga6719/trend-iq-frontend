import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return new Response("Message is required", { status: 400 })
    }

    const systemPrompt = `You are TrendIQ AI, a sophisticated crypto trading assistant. You provide helpful, concise, and actionable trading insights.

Current Market Context:
${context || "No live market data available."}

Portfolio Summary:
- Holdings: 1.01 BTC, 10 ETH, 50 SOL
- Sharpe Ratio: 2.14
- Win Rate: 68.4%

Guidelines:
- Keep responses under 150 words unless more detail is needed
- Be specific with numbers and percentages when discussing signals
- Always mention confidence levels when giving trading recommendations
- Acknowledge risks when appropriate
- Use professional but accessible language`

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: message,
      system: systemPrompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating AI response:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
