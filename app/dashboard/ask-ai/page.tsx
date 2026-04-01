"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface LivePrice {
  symbol: string;
  price: number;
  change24h: number;
}

const quickQuestions = [
  "What signals are active right now?",
  "Should I buy BTC now?",
  "What is the current risk level?",
  "Which token has the best momentum?",
];

const CG_IDS = "bitcoin,ethereum,solana,avalanche-2,binancecoin";
const CG_MAP: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  "avalanche-2": "AVAX",
  binancecoin: "BNB",
};

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm TrendIQ AI, your crypto trading assistant. I have access to live market data and can help you analyze signals, assess risks, and make informed trading decisions. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [livePrices, setLivePrices] = useState<LivePrice[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CG_IDS}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`,
          { headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" } }
        );
        const data = await res.json();
        const prices: LivePrice[] = data.map((c: { id: string; current_price: number; price_change_percentage_24h: number }) => ({
          symbol: CG_MAP[c.id] || c.id.toUpperCase(),
          price: c.current_price,
          change24h: c.price_change_percentage_24h || 0,
        }));
        setLivePrices(prices);
      } catch (err) {
        console.warn("Price fetch error:", err);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const buildContext = () => {
    if (livePrices.length === 0) return "";
    return `Live Prices: ${livePrices.map(p => `${p.symbol}: $${p.price.toLocaleString()} (${p.change24h >= 0 ? "+" : ""}${p.change24h.toFixed(2)}%)`).join(", ")}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, context: buildContext() }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMessageId ? { ...m, content: fullResponse } : m
            )
          );
        }
      }
    } catch (error) {
      console.error("AI error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? { ...m, content: "I apologize, but I encountered an error. Please try again." }
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div className="animate-fade-in flex h-[calc(100vh-140px)] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Ask AI</h1>
          <p className="text-sm text-muted-foreground">
            Chat with TrendIQ intelligence engine
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          <span>Powered by Grok</span>
        </div>
      </div>

      {/* Live Prices Bar */}
      {livePrices.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
          <span className="text-xs text-muted-foreground">Live:</span>
          {livePrices.map((p) => (
            <div key={p.symbol} className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-foreground">{p.symbol}</span>
              <span className="font-mono text-muted-foreground">
                ${p.price >= 1000 ? p.price.toLocaleString("en-US", { maximumFractionDigits: 0 }) : p.price.toFixed(2)}
              </span>
              <span className={`font-mono font-medium ${p.change24h >= 0 ? "text-success" : "text-destructive"}`}>
                {p.change24h >= 0 ? "+" : ""}{p.change24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Chat Container */}
      <div
        ref={chatRef}
        className="mb-3 flex-1 overflow-y-auto rounded-xl border border-border bg-card p-5"
      >
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-xl px-3.5 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "ml-auto rounded-br-sm bg-primary/15 text-foreground"
                  : "rounded-bl-sm bg-accent text-foreground"
              }`}
            >
              {message.role === "assistant" && (
                <div className="mb-1.5 text-[10px] font-semibold text-primary">
                  TrendIQ AI
                </div>
              )}
              {message.content || (
                <span className="animate-pulse text-muted-foreground">Analyzing...</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask about signals, strategies, risk..."
          className="flex-1 rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none"
          disabled={isTyping}
        />
        <button
          onClick={sendMessage}
          disabled={isTyping || !input.trim()}
          className="flex-shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Questions */}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleQuickQuestion(q)}
            disabled={isTyping}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border/80 hover:text-foreground disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
