"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { ChatLog } from "./ChatLog";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";

export function ChatPanel() {
  const { messages, isTyping, error, sendMessage } = useChat();
  return (
    <GlassPanel className="flex flex-col gap-3 p-4 h-full">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold text-[#f4f3ff]">Chat</h2>
        {error && <Badge variant="error">Error</Badge>}
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatLog messages={messages} isTyping={isTyping} />
      </div>
      {error && <p className="text-xs text-[#ff5f7c] shrink-0">{error}</p>}
      <div className="shrink-0">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </GlassPanel>
  );
}