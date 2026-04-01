"use client";

import { useState } from "react";

const connections = [
  { name: "Kraken", meta: "Live trading", connected: true },
  { name: "Binance", meta: "Live price data", connected: true },
  { name: "OpenAI", meta: "AI signals engine", connected: true },
];

const notifications = [
  { name: "Trade executed", enabled: true },
  { name: "Whale alert", enabled: true },
  { name: "Stop loss hit", enabled: true },
  { name: "Telegram alerts", enabled: true },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full border transition-colors ${enabled ? "border-primary bg-primary" : "border-border bg-accent"}`}
    >
      <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform ${enabled ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState(notifications);

  const toggleNotif = (index: number) => {
    setNotifs((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-5 text-base font-bold text-foreground">Settings</h1>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">API Connections</h3>
          {connections.map((c, i) => (
            <div key={c.name} className={`flex items-center justify-between py-2.5 ${i < connections.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <div className="text-sm font-semibold text-foreground">{c.name}</div>
                <div className="text-[11px] text-muted-foreground/60">{c.meta}</div>
              </div>
              <span className="rounded bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">Connected</span>
            </div>
          ))}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Kraken API Key</label>
            <input type="password" className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground" defaultValue="••••••••••••••••••••" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Notifications</h3>
          {notifs.map((n, i) => (
            <div key={n.name} className={`flex items-center justify-between py-2.5 ${i < notifs.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-sm font-semibold text-foreground">{n.name}</span>
              <Toggle enabled={n.enabled} onChange={() => toggleNotif(i)} />
            </div>
          ))}

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Display Name</label>
            <input className="mb-2.5 w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground" defaultValue="alexgaray5" />
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Email</label>
            <input type="email" className="mb-2.5 w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-foreground" defaultValue="alga6719@gmail.com" />
            <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
