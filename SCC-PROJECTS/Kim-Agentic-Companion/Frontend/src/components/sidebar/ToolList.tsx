"use client";

import { useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { useTools } from "@/hooks/useTools";

export function ToolList() {
  const { tools, loading, error, loadTools } = useTools();

  useEffect(() => {
    void loadTools();
  }, [loadTools]);

  return (
    <GlassPanel className="p-3 flex flex-col gap-2">
      <p className="text-xs text-[#a8aed3] font-medium uppercase tracking-wide">MCP Tools</p>
      {loading && <p className="text-xs text-[#a8aed3]">Loading…</p>}
      {error && <p className="text-xs text-[#ff5f7c]">{error}</p>}
      {!loading && !error && tools.length === 0 && (
        <p className="text-xs text-[#a8aed3]">No tools available</p>
      )}
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <div key={tool.name} className="flex items-start gap-2">
            <Badge variant="success" className="shrink-0 mt-0.5">
              {tool.name.split(".")[0]}
            </Badge>
            <div className="min-w-0">
              <p className="text-xs text-[#f4f3ff] font-medium truncate">{tool.name}</p>
              {tool.description && (
                <p className="text-xs text-[#a8aed3] line-clamp-2">{tool.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}