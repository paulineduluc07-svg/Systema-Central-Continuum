"use client";

import { useAtom } from "jotai";
import { messagesAtom, isTypingAtom, chatErrorAtom, type ChatMessage } from "@/stores/chatStore";
import { sessionIdAtom } from "@/stores/authStore";
import { kimApi } from "@/lib/api/client";
import { resolveToolCommandPermissionRequest } from "@/lib/tools/toolHelpers";
import { useAuth } from "./useAuth";

export function useChat() {
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isTyping, setIsTyping] = useAtom(isTypingAtom);
  const [error, setError] = useAtom(chatErrorAtom);
  const [sessionId, setSessionId] = useAtom(sessionIdAtom);
  const { userId, createSession } = useAuth();

  async function sendMessage(content: string): Promise<void> {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    try {
      let sid = sessionId;
      if (!sid) {
        sid = await createSession();
      }
      const message = content.trim();
      const permissionRequest = resolveToolCommandPermissionRequest(message);
      const res = await kimApi.chat({ userId, sessionId: sid, message, ...permissionRequest });
      if (res.sessionId && !sessionId) setSessionId(res.sessionId);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.reply,
        timestamp: new Date().toISOString(),
        tool: res.tool,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsTyping(false);
    }
  }

  function clearMessages(): void {
    setMessages([]);
  }

  return { messages, isTyping, error, sendMessage, clearMessages };
}
