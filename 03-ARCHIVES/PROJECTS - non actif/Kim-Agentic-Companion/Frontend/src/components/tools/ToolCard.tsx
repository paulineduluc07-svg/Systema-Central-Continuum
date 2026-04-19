"use client";

import { useMemo } from "react";
import type { McpTool, ToolResult } from "@/lib/api/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PermissionBadge } from "./PermissionBadge";
import { formatToolOutput, type ToolPermissionMode } from "@/lib/tools/toolHelpers";

interface ToolCardProps {
  tool: McpTool;
  permission: ToolPermissionMode;
  inputValue: string;
  onInputChange: (value: string) => void;
  onResetInput: () => void;
  onRun: () => void;
  onReviewPermission: () => void;
  running?: boolean;
  parseError?: string | null;
  result?: ToolResult | null;
}

function getResultBadgeVariant(result: ToolResult | null | undefined): "default" | "success" | "warning" | "error" {
  if (!result) {
    return "default";
  }

  if (result.status === "executed") {
    return "success";
  }

  if (result.status === "needs_confirmation") {
    return "warning";
  }

  return "error";
}

export function ToolCard({
  tool,
  permission,
  inputValue,
  onInputChange,
  onResetInput,
  onRun,
  onReviewPermission,
  running = false,
  parseError,
  result,
}: ToolCardProps) {
  const outputText = useMemo(() => formatToolOutput(result?.output), [result]);
  const namespace = tool.name.split(".")[0] ?? "tool";
  const runLabel = permission === "denied" ? "Review access" : "Run tool";

  return (
    <div className="rounded-2xl border border-[rgba(183,194,255,0.16)] bg-[rgba(10,13,32,0.42)] p-3 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success">{namespace}</Badge>
            <PermissionBadge mode={permission} />
            {result && <Badge variant={getResultBadgeVariant(result)}>{result.status}</Badge>}
          </div>
          <p className="text-sm font-medium text-[#f4f3ff]">{tool.name}</p>
          {tool.description && <p className="text-xs text-[#a8aed3] mt-1 leading-relaxed">{tool.description}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#a8aed3]">Input JSON</p>
          <button
            type="button"
            onClick={onResetInput}
            className="text-xs text-[#a8aed3] hover:text-[#f4f3ff] transition-colors"
          >
            Reset example
          </button>
        </div>
        <textarea
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full bg-[rgba(6,8,20,0.45)] border border-[rgba(187,196,255,0.2)] rounded-xl px-3 py-2 text-[#f4f3ff] text-xs font-mono resize-y focus:outline-none focus:border-[#ff5f7c] transition-colors"
        />
        {parseError && <p className="text-xs text-[#ff5f7c]">{parseError}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onRun} disabled={running}>
          {running ? "Running…" : runLabel}
        </Button>
        <Button variant="ghost" onClick={onReviewPermission} disabled={running}>
          Permissions
        </Button>
      </div>

      {result && (
        <div className="rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(183,194,255,0.12)] p-3 flex flex-col gap-2">
          <p className="text-xs text-[#f4f3ff]">
            {result.detail}
          </p>
          {outputText && (
            <pre className="max-h-48 overflow-auto text-[11px] leading-relaxed text-[#a8aed3] whitespace-pre-wrap break-words">
              {outputText}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
