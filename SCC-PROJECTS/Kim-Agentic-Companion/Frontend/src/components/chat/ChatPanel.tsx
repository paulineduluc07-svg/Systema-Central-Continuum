"use client";

import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { ChatLog } from "./ChatLog";
import { ChatInput } from "./ChatInput";
import { TTSToggle } from "@/components/voice/TTSToggle";
import { VoiceWaveform } from "@/components/voice/VoiceWaveform";
import { useChat } from "@/hooks/useChat";
import { useTTS } from "@/hooks/useTTS";
import { ttsEnabledAtom } from "@/stores/voiceStore";

export function ChatPanel() {
  const { messages, isTyping, error, sendMessage } = useChat();
  const { speak } = useTTS();
  const ttsEnabled = useAtomValue(ttsEnabledAtom);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (!ttsEnabled) return;
    if (messages.length <= prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      return;
    }
    prevLengthRef.current = messages.length;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    speak(last.content);
  }, [messages, ttsEnabled, speak]);

  return (
    <GlassPanel className="flex flex-col gap-3 p-4 h-full">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold text-[#f4f3ff]">Chat</h2>
        <div className="flex items-center gap-2">
          <VoiceWaveform />
          <TTSToggle />
          {error && <Badge variant="error">Error</Badge>}
        </div>
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
