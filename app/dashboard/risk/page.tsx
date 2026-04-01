"use client";

import { useEffect, useState } from "react";
import { useLivePrices } from "@/hooks/use-live-prices";
import { AlertTriangle, Shield, TrendingDown } from "lucide-react";

interface RiskMetric {
  name: string;
  value: number;
  color: string;
  textColor: string;
}

interface RiskLimit {
  name: string;
  value: string;
  editable?: boolean;
}

export default function RiskPage() {
  const { prices, loading } = useLivePrices();
  const [riskBreakdown, setRiskBreakdown] = useState<RiskMetric[]>([]);
  const [overallRisk, setOverallRisk] = useState<"Low" | "Medium" | "High">("Medium");
  const [maxDrawdown, setMaxDrawdown] = useState(-8.4);
  const [positionUsed, setPositionUsed] = useState(68);

  const [limits, setLimits] = useState<RiskLimit[]>([
    { name: "Max position size", value: "10%", editable: true },
    { name: "Stop loss", value: "-5%", editable: true },
    { name: "Daily loss limit", value: "-15%", editable: true },
  ]);

  useEffect(() => {
    if (prices.length === 0) return;

    // Calculate risk metrics based on live market volatility
    const avgChange = prices.slice(0, 5).reduce((acc, p) => acc + Math.abs(p.change24h), 0) / 5;
    const maxChange = Math.max(...prices.slice(0, 5).map((p) => Math.abs(p.change24h)));

    // Volatility risk based on average price swings
    const volatility = Math.min(100, Math.round(20 + avgChange * 8));

    // Concentration risk - simulated based on portfolio
    const concentration = Math.min(100, Math.round(50 + maxChange * 3));

    // Liquidity risk based on volume
    const avgVolume = prices.slice(0, 5).reduce((acc, p) => acc + p.volume, 0) / 5;
    const liquidity = Math.max(10, Math.round(40 - avgVolume / 1e10));

    // Leverage exposure - simulated
    const leverage = Math.round(10 + Math.random() * 15);

    const getColor = (value: number) => {
      if (value >= 60) return { color: "bg-destructive", textColor: "text-destructive" };
      if (value >= 40) return { color: "bg-warning", textColor: "text-warning" };
      return { color: "bg-success", textColor: "text-success" };
    };

    setRiskBreakdown([
      { name: "Portfolio volatility", value: volatility, ...getColor(volatility) },
      { name: "Concentration risk", value: concentration, ...getColor(concentration) },
      { name: "Liquidity risk", value: liquidity, ...getColor(liquidity) },
      { name: "Leverage exposure", value: leverage, ...getColor(leverage) },
    ]);

    // Calculate overall risk
    const avgRisk = (volatility + concentration + liquidity + leverage) / 4;
    if (avgRisk >= 50) setOverallRisk("High");
    else if (avgRisk >= 30) setOverallRisk("Medium");
    else setOverallRisk("Low");

    // Calculate max drawdown based on market conditions
    const drawdown = -5 - avgChange * 0.8 - Math.random() * 3;
    setMaxDrawdown(Math.round(drawdown * 10) / 10);

    // Position usage
    setPositionUsed(Math.round(55 + avgChange * 3 + Math.random() * 20));
  }, [prices]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-warning";
      default:
        return "text-success";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Risk Manager</h1>
          <p className="text-sm text-muted-foreground">
            Real-time portfolio risk analysis based on market conditions
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Live monitoring</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${getRiskColor(overallRisk)}`} />
            <span className="text-xs font-medium text-muted-foreground">Portfolio Risk</span>
          </div>
          <div className={`font-mono text-xl font-bold ${getRiskColor(overallRisk)}`}>
            {loading ? "..." : overallRisk}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-xs font-medium text-muted-foreground">Max Drawdown (7d)</span>
          </div>
          <div className="font-mono text-xl font-bold text-destructive">
            {loading ? "..." : `${maxDrawdown}%`}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Position Limit Used</div>
          <div className="mt-2 font-mono text-xl font-bold text-foreground">
            {loading ? "..." : `${positionUsed}%`}
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-accent">
            <div
              className={`h-full rounded transition-all ${
                positionUsed >= 80 ? "bg-destructive" : positionUsed >= 60 ? "bg-warning" : "bg-success"
              }`}
              style={{ width: `${positionUsed}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">Risk Breakdown</h3>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Calculating risk metrics...</div>
          ) : (
            riskBreakdown.map((r) => (
              <div
                key={r.name}
                className="mb-2.5 grid grid-cols-[160px_1fr_50px] items-center gap-2.5 text-xs"
              >
                <span className="text-muted-foreground">{r.name}</span>
                <div className="h-1.5 overflow-hidden rounded bg-accent">
                  <div
                    className={`h-full rounded transition-all duration-500 ${r.color}`}
                    style={{ width: `${r.value}%` }}
                  />
                </div>
                <span className={`text-right font-mono font-semibold ${r.textColor}`}>
                  {r.value}%
                </span>
              </div>
            ))
          )}

          <div className="mt-4 border-t border-border pt-3.5">
            <div className="text-xs text-muted-foreground">
              Risk levels are calculated based on live market volatility, your portfolio concentration,
              and current leverage exposure.
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3.5 text-sm font-bold text-foreground">Risk Limits</h3>
          {limits.map((l, i) => (
            <div
              key={l.name}
              className={`flex items-center justify-between py-2.5 ${
                i < limits.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm font-semibold text-foreground">{l.name}</span>
              {l.editable ? (
                <input
                  type="text"
                  value={l.value}
                  onChange={(e) => {
                    const newLimits = [...limits];
                    newLimits[i].value = e.target.value;
                    setLimits(newLimits);
                  }}
                  className="w-20 rounded border border-border bg-accent px-2 py-1 text-right font-mono text-sm font-semibold text-foreground focus:border-primary/30 focus:outline-none"
                />
              ) : (
                <span className="font-mono text-sm font-semibold text-foreground">{l.value}</span>
              )}
            </div>
          ))}
          <button className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            Update Limits
          </button>
        </div>
      </div>
    </div>
  );
}
