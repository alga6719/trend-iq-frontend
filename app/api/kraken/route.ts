import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const KR_KEY = process.env.KRAKEN_API_KEY || ""
const KR_SECRET = process.env.KRAKEN_API_SECRET || ""

function krakenSign(path: string, nonce: string, postData: string): string {
  const secretBuffer = Buffer.from(KR_SECRET, "base64")
  const sha256Hash = crypto.createHash("sha256").update(nonce + postData).digest()
  const hmac = crypto.createHmac("sha512", secretBuffer)
  hmac.update(Buffer.from(path))
  hmac.update(sha256Hash)
  return hmac.digest("base64")
}

async function krakenPost(path: string, params: Record<string, string>): Promise<unknown> {
  const nonce = Date.now().toString()
  params.nonce = nonce
  const postData = new URLSearchParams(params).toString()
  const sign = krakenSign(path, nonce, postData)

  const response = await fetch(`https://api.kraken.com${path}`, {
    method: "POST",
    headers: {
      "API-Key": KR_KEY,
      "API-Sign": sign,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: postData,
  })

  return response.json()
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(request: NextRequest) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  try {
    const body = await request.json()
    const { endpoint, params } = body

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400, headers })
    }

    const allowed = [
      "/0/private/Balance",
      "/0/private/OpenOrders",
      "/0/private/TradesHistory",
      "/0/private/ClosedOrders",
    ]

    if (!allowed.includes(endpoint)) {
      return NextResponse.json({ error: "Endpoint not allowed" }, { status: 403, headers })
    }

    const data = await krakenPost(endpoint, params || {})
    return NextResponse.json(data, { status: 200, headers })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500, headers })
  }
}
