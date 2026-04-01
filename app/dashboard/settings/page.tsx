"use client";

import { useEffect, useState } from "react";
import { RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Connection {
  name: string;
  meta: string;
  status: "connected" | "disconnected" | "checking";
  envKey?: string;
}

const notificationDefaults = [
  { name: "Trade executed", enabled: true },
  { name: "Whale alert", enabled: true },
  { name: "Stop loss hit", enabled: true },
  { name: "Telegram alerts", enabled: false },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full border transition-colors ${
        enabled ? "border-primary bg-primary" : "border-border bg-accent"
      }`}
    >
      <span
        className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform ${
          enabled ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState(notificationDefaults);
  const [connections, setConnections] = useState<Connection[]>([
    { name: "Kraken", meta: "Live trading", status: "checking", envKey: "KRAKEN_API_KEY" },
    { name: "CoinGecko", meta: "Live price data", status: "checking" },
    { name: "Grok AI", meta: "AI signals engine", status: "checking", envKey: "XAI_API_KEY" },
  ]);

  useEffect(() => {
    checkConnections();
  }, []);

  async function checkConnections() {
    // Check CoinGecko
    try {
      const cgRes = await fetch(
        "https://api.coingecko.com/api/v3/ping",
        { headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" } }
      );
      updateConnectionStatus("CoinGecko", cgRes.ok ? "connected" : "disconnected");
    } catch {
      updateConnectionStatus("CoinGecko", "disconnected");
    }

    // Check Kraken API
    try {
      const krakenRes = await fetch("/api/kraken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: "/0/private/Balance", params: {} }),
      });
      const krakenData = await krakenRes.json();
      const krakenConnected = !krakenData.error || krakenData.error.length === 0;
      updateConnectionStatus("Kraken", krakenConnected ? "connected" : "disconnected");
    } catch {
      updateConnectionStatus("Kraken", "disconnected");
    }

    // Check AI API
    try {
      const aiRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "ping", context: "" }),
      });
      updateConnectionStatus("Grok AI", aiRes.ok ? "connected" : "disconnected");
    } catch {
      updateConnectionStatus("Grok AI", "disconnected");
    }
  }

  function updateConnectionStatus(name: string, status: "connected" | "disconnected") {
    setConnections((prev) =>
      prev.map((c) => (c.name === name ? { ...c, status } : c))
    );
  }

  const toggleNotif = (index: number) => {
    setNotifs((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const getStatusIcon = (status: Connection["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Connection["status"]) => {
    switch (status) {
      case "connected":
        return (
          <span className="rounded bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">
            Connected
          </span>
        );
      case "disconnected":
        return (
          <span className="rounded bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive">
            Not Connected
          </span>
        );
      default:
        return (
          <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
            Checking...
          </span>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage API connections and notifications
          </p>
        </div>
        <button
          onClick={checkConnections}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">API Connections</h3>
            {connections.map((c, i) => (
              <div
                key={c.name}
                className={`flex items-center justify-between py-3 ${
                  i < connections.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(c.status)}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground/60">{c.meta}</div>
                  </div>
                </div>
                {getStatusBadge(c.status)}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">API Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Kraken API Key
                </label>
                <input
                  type="password"
                  placeholder="Set via environment variable KRAKEN_API_KEY"
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60"
                  disabled
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Kraken API Secret
                </label>
                <input
                  type="password"
                  placeholder="Set via environment variable KRAKEN_API_SECRET"
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60"
                  disabled
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  xAI API Key (Grok)
                </label>
                <input
                  type="password"
                  placeholder="Set via environment variable XAI_API_KEY"
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60"
                  disabled
                />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              API keys are configured via environment variables for security. Contact your
              administrator to update these settings.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Notifications</h3>
            {notifs.map((n, i) => (
              <div
                key={n.name}
                className={`flex items-center justify-between py-2.5 ${
                  i < notifs.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-sm font-semibold text-foreground">{n.name}</span>
                <Toggle enabled={n.enabled} onChange={() => toggleNotif(i)} />
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Account</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Display Name
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground"
                  defaultValue="Trader"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground"
                  defaultValue="trader@example.com"
                />
              </div>
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
