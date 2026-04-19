"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useTools } from "@/hooks/useTools";
import { kimApi } from "@/lib/api/client";
import type { McpTool, ToolResult } from "@/lib/api/types";
import {
  getToolExampleInput,
  readStoredToolPermissions,
  writeStoredToolPermissions,
  type ToolPermissionMode,
} from "@/lib/tools/toolHelpers";
import { ConfirmationDialog } from "@/components/tools/ConfirmationDialog";
import { ToolCard } from "@/components/tools/ToolCard";

interface PendingConfirmation {
  tool: McpTool;
  parsedInput: Record<string, unknown>;
}

export function ToolsPanel() {
  const { tools, loading, error, loadTools } = useTools();
  const [permissions, setPermissions] = useState<Record<string, ToolPermissionMode>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [parseErrors, setParseErrors] = useState<Record<string, string | null>>({});
  const [results, setResults] = useState<Record<string, ToolResult | null>>({});
  const [runningToolName, setRunningToolName] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);

  useEffect(() => {
    void loadTools();
    setPermissions(readStoredToolPermissions());
  }, [loadTools]);

  useEffect(() => {
    setInputValues((current) => {
      const next = { ...current };
      for (const tool of tools) {
        if (!next[tool.name]) {
          next[tool.name] = JSON.stringify(getToolExampleInput(tool), null, 2);
        }
      }
      return next;
    });
  }, [tools]);

  function updatePermission(toolName: string, mode: ToolPermissionMode): void {
    setPermissions((current) => {
      const next = { ...current, [toolName]: mode };
      writeStoredToolPermissions(next);
      return next;
    });
  }

  function resetInput(tool: McpTool): void {
    setInputValues((current) => ({
      ...current,
      [tool.name]: JSON.stringify(getToolExampleInput(tool), null, 2),
    }));
    setParseErrors((current) => ({ ...current, [tool.name]: null }));
  }

  function parseToolInput(tool: McpTool): Record<string, unknown> | null {
    const raw = inputValues[tool.name] ?? "{}";

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setParseErrors((current) => ({ ...current, [tool.name]: "Input must be a JSON object" }));
        return null;
      }

      setParseErrors((current) => ({ ...current, [tool.name]: null }));
      return parsed as Record<string, unknown>;
    } catch {
      setParseErrors((current) => ({ ...current, [tool.name]: "Invalid JSON payload" }));
      return null;
    }
  }

  async function executeTool(
    tool: McpTool,
    parsedInput: Record<string, unknown>,
    options: { grant: boolean; confirm: boolean }
  ): Promise<void> {
    setRunningToolName(tool.name);
    setResults((current) => ({ ...current, [tool.name]: null }));

    try {
      const response = await kimApi.invokeToolDirect({
        toolName: tool.name,
        input: parsedInput,
        grantedTools: options.grant ? [tool.name] : undefined,
        confirmationProvided: options.confirm,
      });

      setResults((current) => ({ ...current, [tool.name]: response.tool }));
    } catch (invokeError) {
      const detail = invokeError instanceof Error ? invokeError.message : "Tool invocation failed";
      setResults((current) => ({
        ...current,
        [tool.name]: {
          name: tool.name,
          status: "error",
          detail,
        },
      }));
    } finally {
      setRunningToolName(null);
      setPendingConfirmation(null);
    }
  }

  function handleRun(tool: McpTool): void {
    const parsedInput = parseToolInput(tool);
    if (!parsedInput) {
      return;
    }

    const permission = permissions[tool.name] ?? "ask";
    if (permission === "always") {
      void executeTool(tool, parsedInput, { grant: true, confirm: true });
      return;
    }

    setPendingConfirmation({ tool, parsedInput });
  }

  function handleReviewPermission(tool: McpTool): void {
    const parsedInput = parseToolInput(tool) ?? getToolExampleInput(tool);
    setPendingConfirmation({ tool, parsedInput });
  }

  const cards = useMemo(
    () =>
      tools.map((tool) => (
        <ToolCard
          key={tool.name}
          tool={tool}
          permission={permissions[tool.name] ?? "ask"}
          inputValue={inputValues[tool.name] ?? JSON.stringify(getToolExampleInput(tool), null, 2)}
          onInputChange={(value) => setInputValues((current) => ({ ...current, [tool.name]: value }))}
          onResetInput={() => resetInput(tool)}
          onRun={() => handleRun(tool)}
          onReviewPermission={() => handleReviewPermission(tool)}
          running={runningToolName === tool.name}
          parseError={parseErrors[tool.name]}
          result={results[tool.name]}
        />
      )),
    [tools, permissions, inputValues, runningToolName, parseErrors, results]
  );

  return (
    <>
      <GlassPanel className="p-3 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[#a8aed3] font-medium uppercase tracking-wide">Tools</p>
            <p className="text-xs text-[#a8aed3] mt-1">Run MCP tools with explicit permission memory.</p>
          </div>
        </div>

        {loading && <p className="text-xs text-[#a8aed3]">Loading…</p>}
        {error && <p className="text-xs text-[#ff5f7c]">{error}</p>}
        {!loading && !error && tools.length === 0 && <p className="text-xs text-[#a8aed3]">No tools available</p>}

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">{cards}</div>
      </GlassPanel>

      <ConfirmationDialog
        open={Boolean(pendingConfirmation)}
        toolName={pendingConfirmation?.tool.name ?? ""}
        busy={runningToolName === pendingConfirmation?.tool.name}
        onAllowOnce={() => {
          if (pendingConfirmation) {
            void executeTool(pendingConfirmation.tool, pendingConfirmation.parsedInput, { grant: true, confirm: true });
          }
        }}
        onAlwaysAllow={() => {
          if (pendingConfirmation) {
            updatePermission(pendingConfirmation.tool.name, "always");
            void executeTool(pendingConfirmation.tool, pendingConfirmation.parsedInput, { grant: true, confirm: true });
          }
        }}
        onDeny={() => {
          if (pendingConfirmation) {
            updatePermission(pendingConfirmation.tool.name, "denied");
            setResults((current) => ({
              ...current,
              [pendingConfirmation.tool.name]: {
                name: pendingConfirmation.tool.name,
                status: "blocked",
                detail: "denied_in_client_preferences",
              },
            }));
          }
          setPendingConfirmation(null);
        }}
        onCancel={() => setPendingConfirmation(null)}
      />
    </>
  );
}
