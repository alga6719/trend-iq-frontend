"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  "What signals are active right now?",
  "Should I buy BTC now?",
  "What is the current risk level?",
  "Which token has the best momentum right now?",
];

const mockResponses: Record<string, string> = {
  "what signals are active right now?":
    "Currently, I'm tracking 4 active signals: BTC/USD has a strong BUY signal (87% confidence) due to RSI oversold + whale accumulation. SOL/USD also has a BUY signal (82%) from a breakout on volume spike. ETH/USD is in HOLD territory with neutral momentum. ARB/USD has a SELL signal due to overbought conditions.",
  "should i buy btc now?":
    "Based on my analysis, BTC is showing bullish signals. The RSI is recovering from oversold territory, whale wallets are accumulating, and on-chain metrics show strong holder conviction. However, always consider your risk tolerance and position sizing. The current ML confidence for a BUY signal is 87%.",
  "what is the current risk level?":
    "Your portfolio risk is currently rated as MEDIUM. Portfolio volatility is at 42%, concentration risk is elevated at 68% (consider diversifying), liquidity risk is low at 24%, and leverage exposure is minimal at 15%. Your max drawdown over the past 7 days was -8.4%.",
  "which token has the best momentum right now?":
    "According to my momentum scanner, the top 3 tokens by momentum score are: 1) SOL/USD with score 89/100 - Strong Up outlook, 2) ARB/USD with score 82/100 - Likely Up outlook, 3) AVAX/USD with score 76/100 - Likely Up outlook. SOL has the strongest volume confirmation and bullish price action.",
};

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello Alex! I'm monitoring live prices via Binance. How can I help you trade smarter today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase().trim();
      let response =
        mockResponses[lowerInput] ||
        `I've analyzed your question about "${input}". Based on current market conditions, I recommend monitoring the momentum scanner and risk metrics before making any decisions. Would you like me to elaborate on any specific aspect?`;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      sendMessage();
    }, 100);
  };

  return (
    <div className="animate-fade-in flex h-[calc(100vh-140px)] flex-col">
      <div className="mb-1">
        <h1 className="text-base font-bold text-foreground">Ask AI</h1>
        <p className="text-sm text-muted-foreground/60">
          Chat with the TrendIQ intelligence engine
        </p>
      </div>

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
              {message.content}
            </div>
          ))}
          {isTyping && (
            <div className="max-w-[80%] rounded-xl rounded-bl-sm bg-accent px-3.5 py-3 text-sm text-muted-foreground">
              <div className="mb-1.5 text-[10px] font-semibold text-primary">
                TrendIQ AI
              </div>
              <span className="animate-pulse">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about signals, strategies, risk..."
          className="flex-1 rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/30 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="flex-shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground/60 transition-colors hover:border-border/80 hover:text-muted-foreground"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
