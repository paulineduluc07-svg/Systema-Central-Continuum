import { useGlobalSyncStatus } from "@/hooks/useGlobalSyncStatus";
import { AlertTriangle, Cloud, CloudOff, Loader2 } from "lucide-react";

export function GlobalSyncIndicator() {
  const status = useGlobalSyncStatus();

  const icon =
    status.phase === "local" ? (
      <CloudOff className="h-4 w-4 text-white/85" />
    ) : status.phase === "syncing" ? (
      <Loader2 className="h-4 w-4 animate-spin text-[#8cc8ff]" />
    ) : status.phase === "error" ? (
      <AlertTriangle className="h-4 w-4 text-[#ffb3aa]" />
    ) : (
      <Cloud className="h-4 w-4 text-[#b8ffd9]" />
    );

  const toneClass =
    status.phase === "error"
      ? "border-[#f5a9a0]/50 bg-[#471d1d]/70"
      : status.phase === "syncing"
        ? "border-[#8cc8ff]/45 bg-[#1d3147]/65"
        : status.phase === "synced"
          ? "border-[#9ddfbb]/45 bg-[#1b3c31]/65"
          : "border-white/35 bg-[#2d3140]/70";

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50">
      <div
        className={`flex min-w-[200px] items-center gap-2 rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl ${toneClass}`}
      >
        <div className="shrink-0">{icon}</div>
        <div className="leading-tight">
          <p className="text-[11px] font-semibold tracking-wide text-white">{status.label}</p>
          <p className="text-[10px] text-white/80">{status.detail}</p>
        </div>
      </div>
    </div>
  );
}

