import { config } from "@/lib/config";
import { Button } from "@/components/ui/Button";

interface TopNavProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function TopNav({ onLogout, isAuthenticated }: TopNavProps) {
  return (
    <nav className="glass rounded-2xl p-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-white/[0.08] font-bold">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{
            background: "linear-gradient(145deg, rgba(255,95,124,0.34), rgba(104,255,240,0.27))",
          }}
        >
          {config.appName[0]?.toUpperCase() ?? "K"}
        </div>
        <span className="text-[#f4f3ff] text-sm">{config.appName}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#a8aed3] hidden sm:inline">
          {isAuthenticated ? "Session active" : "Locked"}
        </span>
        {isAuthenticated && onLogout && (
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
