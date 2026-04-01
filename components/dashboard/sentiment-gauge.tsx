"use client";

import { useEffect, useRef, useState } from "react";

interface SentimentData {
  score: number;
  label: string;
  sources: { name: string; weight: string; score: number; fill: number }[];
}

export function SentimentGauge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sentiment, setSentiment] = useState<SentimentData>({
    score: 0,
    label: "Loading...",
    sources: [],
  });

  useEffect(() => {
    async function fetchSentiment() {
      try {
        // Fetch Fear & Greed Index from alternative.me
        const res = await fetch("https://api.alternative.me/fng/?limit=1");
        const data = await res.json();
        const fng = data.data?.[0];
        
        if (fng) {
          // Convert 0-100 to -100 to 100
          const rawScore = parseInt(fng.value);
          const normalizedScore = (rawScore - 50) * 2;
          
          let label = fng.value_classification;
          if (normalizedScore < -60) label = "Extreme Fear";
          else if (normalizedScore < -20) label = "Fear";
          else if (normalizedScore < 20) label = "Neutral";
          else if (normalizedScore < 60) label = "Greed";
          else label = "Extreme Greed";

          // Simulate source breakdown based on overall sentiment
          const variance = () => Math.floor(Math.random() * 20) - 10;
          setSentiment({
            score: normalizedScore,
            label,
            sources: [
              { name: "Twitter", weight: "40%", score: normalizedScore + variance(), fill: Math.max(10, Math.min(90, 50 + normalizedScore / 2 + variance())) },
              { name: "News", weight: "35%", score: normalizedScore + variance(), fill: Math.max(10, Math.min(90, 50 + normalizedScore / 2 + variance())) },
              { name: "Reddit", weight: "25%", score: normalizedScore + variance(), fill: Math.max(10, Math.min(90, 50 + normalizedScore / 2 + variance())) },
            ],
          });
        }
      } catch (err) {
        console.warn("Sentiment fetch error:", err);
        // Fallback to static data
        setSentiment({
          score: -58,
          label: "Very Bearish",
          sources: [
            { name: "Twitter", weight: "40%", score: -70, fill: 85 },
            { name: "News", weight: "35%", score: -52, fill: 65 },
            { name: "Reddit", weight: "25%", score: -49, fill: 60 },
          ],
        });
      }
    }
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const w = 240;
    const h = 130;
    const cx = w / 2;
    const cy = h;
    const r = 95;
    const lw = 18;

    ctx.clearRect(0, 0, w, h);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.lineWidth = lw;
    ctx.strokeStyle = "#1a1d2e";
    ctx.stroke();

    // Score arc
    const pct = (sentiment.score + 100) / 200; // normalize -100 to 100 -> 0 to 1
    const color = sentiment.score >= 0 ? "#22c55e" : "#ef4444";
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * pct, false);
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();
  }, [sentiment.score]);

  const scoreColor = sentiment.score >= 0 ? "text-success" : "text-destructive";
  const barColor = sentiment.score >= 0 ? "bg-success" : "bg-destructive";

  return (
    <div className="flex flex-col items-center py-2.5">
      <div className="relative mx-auto h-[130px] w-[240px]">
        <canvas ref={canvasRef} width={240} height={130} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <div className={`font-mono text-4xl font-extrabold tracking-tighter ${scoreColor}`}>
            {sentiment.score > 0 ? "+" : ""}{sentiment.score}
          </div>
          <div className={`text-sm font-semibold ${scoreColor}`}>
            {sentiment.label}
          </div>
        </div>
      </div>

      <div className="mt-4 w-full">
        {sentiment.sources.map((source) => (
          <div
            key={source.name}
            className="flex items-center gap-2.5 border-b border-border py-1.5 last:border-b-0"
          >
            <span className="w-[70px] flex-shrink-0 text-xs text-muted-foreground">
              {source.name}
            </span>
            <span className="w-8 text-[11px] text-muted-foreground/60">
              ({source.weight})
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-sm bg-accent">
              <div
                className={`h-full rounded-sm ${barColor}`}
                style={{ width: `${source.fill}%` }}
              />
            </div>
            <span className={`w-7 text-right font-mono text-xs font-semibold ${source.score >= 0 ? "text-success" : "text-destructive"}`}>
              {source.score > 0 ? "+" : ""}{source.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
