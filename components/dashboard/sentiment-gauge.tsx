"use client";

import { useEffect, useRef } from "react";

const sources = [
  { name: "Twitter", weight: "40%", score: -70, fill: 85 },
  { name: "News", weight: "35%", score: -52, fill: 65 },
  { name: "Reddit", weight: "25%", score: -49, fill: 60 },
];

export function SentimentGauge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Score arc (bearish = red side)
    const score = -58;
    const pct = (score + 100) / 200; // normalize -100 to 100 -> 0 to 1
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * pct, false);
    ctx.lineWidth = lw;
    ctx.strokeStyle = "#ef4444";
    ctx.lineCap = "round";
    ctx.stroke();
  }, []);

  return (
    <div className="flex flex-col items-center py-2.5">
      <div className="relative mx-auto h-[130px] w-[240px]">
        <canvas ref={canvasRef} width={240} height={130} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <div className="font-mono text-4xl font-extrabold tracking-tighter text-destructive">
            -58
          </div>
          <div className="text-sm font-semibold text-destructive">
            Very Bearish
          </div>
        </div>
      </div>

      <div className="mt-4 w-full">
        {sources.map((source) => (
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
                className="h-full rounded-sm bg-destructive"
                style={{ width: `${source.fill}%` }}
              />
            </div>
            <span className="w-7 text-right font-mono text-xs font-semibold text-destructive">
              {source.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
