import clsx from "clsx";
import type { ToolResult } from "@/lib/api/types";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  tool?: ToolResult;
}

export function ChatBubble({ role, content, tool }: ChatBubbleProps) {
  const isKim = role === "assistant";
  const toolTone =
    tool?.status === "executed"
      ? "text-[#7be7bf]"
      : tool?.status === "needs_confirmation"
        ? "text-[#ffd27f]"
        : "text-[#ff8ea5]";

  return (
    <div className={clsx("flex flex-col gap-1 max-w-[80%]", isKim ? "self-start" : "self-end")}>
      <div
        className={clsx(
          "rounded-2xl px-4 py-2 text-sm text-[#f4f3ff] leading-relaxed",
          isKim
            ? "bg-[rgba(111,130,240,0.33)] border border-[rgba(146,161,252,0.36)] rounded-tl-sm"
            : "bg-[rgba(255,113,149,0.28)] border border-[rgba(255,154,182,0.45)] rounded-tr-sm"
        )}
      >
        {content}
      </div>
      {tool && (
        <p className={clsx("text-xs px-1", toolTone)}>
          Tool: {tool.name} — {tool.status}
        </p>
      )}
    </div>
  );
}
