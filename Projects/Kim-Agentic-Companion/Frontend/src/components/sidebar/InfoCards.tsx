"use client";

import { useAtomValue } from "jotai";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { messagesAtom } from "@/stores/chatStore";
import { config } from "@/lib/config";

export function InfoCards() {
  const messages = useAtomValue(messagesAtom);
  const total = messages.length;
  const fromUser = messages.filter((m) => m.role === "user").length;
  return (
    <div className="flex flex-col gap-3">
      <GlassPanel className="p-3">
        <p className="text-xs text-[#a8aed3] mb-1">Session</p>
        <p className="text-sm text-[#f4f3ff] font-medium">{total} messages</p>
        <p className="text-xs text-[#a8aed3]">{fromUser} from you</p>
      </GlassPanel>
      <GlassPanel className="p-3">
        <p className="text-xs text-[#a8aed3] mb-1">Companion</p>
        <p className="text-sm text-[#f4f3ff] font-medium">{config.appName}</p>
        <p className="text-xs text-[#68fff0]">● active</p>
      </GlassPanel>
    </div>
  );
}