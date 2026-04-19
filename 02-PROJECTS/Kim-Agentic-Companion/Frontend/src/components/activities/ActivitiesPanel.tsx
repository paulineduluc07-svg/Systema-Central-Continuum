"use client";

import { useAtomValue } from "jotai";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { messagesAtom, type ChatMessage } from "@/stores/chatStore";

function ActivityItem({ msg }: { msg: ChatMessage }) {
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isKim = msg.role === "assistant";

  return (
    <div className="flex gap-3 items-start py-2.5">
      <div
        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
        style={{ background: isKim ? "#68fff0" : "#ff5f7c" }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-[#f4f3ff]">{isKim ? "Kim" : "You"}</span>
          <span className="text-xs text-[#a8aed3]">{time}</span>
          {msg.tool && (
            <span className="text-xs text-[#68fff0] bg-[rgba(104,255,240,0.1)] px-1.5 py-0.5 rounded-full">
              {msg.tool.name}
            </span>
          )}
        </div>
        <p className="text-sm text-[#a8aed3] line-clamp-2 leading-relaxed">{msg.content}</p>
      </div>
    </div>
  );
}

export function ActivitiesPanel() {
  const messages = useAtomValue(messagesAtom);
  const reversed = [...messages].reverse();

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <GlassPanel className="p-5">
        <div className="mb-4">
          <h2 className="text-[#f4f3ff] font-semibold">Activities</h2>
          <p className="text-xs text-[#a8aed3] mt-0.5">
            {messages.length} message{messages.length !== 1 ? "s" : ""} this session
          </p>
        </div>
        {messages.length === 0 ? (
          <p className="text-sm text-[#a8aed3] italic py-4 text-center">
            Your conversation history will appear here.
          </p>
        ) : (
          <div className="divide-y divide-[rgba(183,194,255,0.08)]">
            {reversed.map((msg) => (
              <ActivityItem key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
