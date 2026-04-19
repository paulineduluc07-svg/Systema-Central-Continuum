"use client";

import { useEffect, useRef } from "react";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "@/stores/chatStore";

interface ChatLogProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatLog({ messages, isTyping }: ChatLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#a8aed3] text-sm italic">
        Start a conversation with Kim…
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 pr-1">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} role={msg.role} content={msg.content} tool={msg.tool} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}