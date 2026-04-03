"use client";

import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { diaryEntriesAtom, diaryLoadingAtom, type DiaryEntry } from "@/stores/diaryStore";
import { sessionIdAtom } from "@/stores/authStore";
import { kimApi } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";

function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const date = new Date(entry.timestamp).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <GlassPanel className="p-4">
      <p className="text-xs text-[#a8aed3] mb-2">{date}</p>
      <p className="text-sm text-[#f4f3ff] leading-relaxed mb-3">{entry.content}</p>
      {entry.kimResponse && (
        <div className="pt-3 border-t border-[rgba(183,194,255,0.1)]">
          <p className="text-xs text-[#a8aed3] mb-1">Kim</p>
          <p className="text-sm text-[#68fff0] leading-relaxed italic">{entry.kimResponse}</p>
        </div>
      )}
    </GlassPanel>
  );
}

export function DiaryPanel() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useAtom(diaryEntriesAtom);
  const [loading, setLoading] = useAtom(diaryLoadingAtom);
  const [error, setError] = useState<string | null>(null);
  const { userId, createSession } = useAuth();
  const sessionId = useAtomValue(sessionIdAtom);

  async function handleSubmit() {
    if (!text.trim() || loading) return;
    const content = text.trim();
    setText("");
    setLoading(true);
    setError(null);
    try {
      const sid = sessionId ?? (await createSession());
      const res = await kimApi.chat({
        userId,
        sessionId: sid,
        message: `[DIARY] ${content}`,
      });
      const entry: DiaryEntry = {
        id: crypto.randomUUID(),
        content,
        timestamp: new Date().toISOString(),
        kimResponse: res.reply,
      };
      setEntries((prev) => [entry, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <GlassPanel className="p-5">
        <h2 className="text-[#f4f3ff] font-semibold mb-1">Diary</h2>
        <p className="text-xs text-[#a8aed3] mb-4">Share your thoughts — Kim will reflect with you</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write about your day, thoughts, feelings..."
          rows={4}
          className="w-full bg-[rgba(7,10,24,0.45)] border border-[rgba(179,188,251,0.2)] rounded-xl px-4 py-3 text-[#f4f3ff] placeholder-[#a8aed3] text-sm resize-none focus:outline-none focus:border-[#ff5f7c] transition-colors"
        />
        {error && <p className="text-xs text-[#ff5f7c] mt-1">{error}</p>}
        <div className="flex justify-end mt-3">
          <Button onClick={handleSubmit} disabled={loading || !text.trim()}>
            {loading ? "Sharing..." : "Share with Kim"}
          </Button>
        </div>
      </GlassPanel>
      {entries.length > 0 ? (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <DiaryEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#a8aed3] italic text-center py-2">
          Your diary entries will appear here.
        </p>
      )}
    </div>
  );
}
