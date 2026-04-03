import { atom } from "jotai";
import type { McpTool } from "@/lib/api/types";

export const toolsAtom = atom<McpTool[]>([]);
export const toolsLoadingAtom = atom(false);
export const toolsErrorAtom = atom<string | null>(null);