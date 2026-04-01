interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  live?: boolean;
  liveSource?: string;
}

export function MetricCard({
  label,
  value,
  change,
  changeType,
  live,
  liveSource,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2.5 flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          {live && liveSource && (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-success">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />
              {liveSource}
            </div>
          )}
        </div>
      </div>
      <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
        {value}
      </div>
      {change && (
        <div
          className={`mt-1 text-xs font-medium ${
            changeType === "up"
              ? "text-success"
              : changeType === "down"
                ? "text-destructive"
                : "text-muted-foreground"
          }`}
        >
          {change}
        </div>
      )}
    </div>
  );
}
