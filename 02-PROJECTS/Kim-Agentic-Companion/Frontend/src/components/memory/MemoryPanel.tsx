"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { useMemory } from "@/hooks/useMemory";

export function MemoryPanel() {
  const { memory, loading, error, loadMemory } = useMemory();
  const [search, setSearch] = useState("");

  const lines = memory ? memory.split("\n").filter((l) => l.trim()) : [];
  const filtered = search
    ? lines.filter((l) => l.toLowerCase().includes(search.toLowerCase()))
    : lines;

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <GlassPanel className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[#f4f3ff] font-semibold">Memory</h2>
            <p className="text-xs text-[#a8aed3] mt-0.5">What Kim remembers about you</p>
          </div>
          <Button size="sm" onClick={loadMemory} disabled={loading}>
            {loading ? "Loading..." : memory ? "Refresh" : "Ask Kim"}
          </Button>
        </div>
        {error && <p className="text-xs text-[#ff5f7c] mb-3">{error}</p>}
        {!memory && !loading && (
          <p className="text-sm text-[#a8aed3] italic py-4 text-center">
            Click &quot;Ask Kim&quot; to see what she remembers about you.
          </p>
        )}
        {memory && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories..."
              className="w-full mb-4 bg-[rgba(6,8,20,0.42)] border border-[rgba(187,196,255,0.26)] rounded-xl px-4 py-2 text-[#f4f3ff] placeholder-[#a8aed3] text-sm focus:outline-none focus:border-[#ff5f7c] transition-colors"
            />
            {filtered.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filtered.map((line, i) => (
                  <div
                    key={i}
                    className="text-sm text-[#f4f3ff] px-3 py-2.5 rounded-xl bg-[rgba(111,130,240,0.15)] border border-[rgba(146,161,252,0.2)] leading-relaxed"
                  >
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#a8aed3] text-center py-2">No results for &quot;{search}&quot;</p>
            )}
          </>
        )}
      </GlassPanel>
    </div>
  );
}
