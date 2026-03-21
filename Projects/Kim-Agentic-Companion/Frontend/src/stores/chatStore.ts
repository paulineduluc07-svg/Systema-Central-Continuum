import { atom } from "jotai";
import type { ToolResult } from "@/lib/api/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tool?: ToolResult;
}

export const messagesAtom = atom<ChatMessage[]>([]);
export const isTypingAtom = atom(false);
export const chatErrorAtom = atom<string | null>(null);