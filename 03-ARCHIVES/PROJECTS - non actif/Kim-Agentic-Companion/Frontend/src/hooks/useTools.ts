"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { toolsAtom, toolsLoadingAtom, toolsErrorAtom } from "@/stores/toolStore";
import { kimApi } from "@/lib/api/client";
import { parseToolsResponse } from "@/lib/api/tools";

export function useTools() {
  const [tools, setTools] = useAtom(toolsAtom);
  const [loading, setLoading] = useAtom(toolsLoadingAtom);
  const [error, setError] = useAtom(toolsErrorAtom);

  const loadTools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await kimApi.getTools();
      const parsed = parseToolsResponse(res);
      setTools(parsed.tools);
      setError(parsed.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tools");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setTools]);

  return { tools, loading, error, loadTools };
}
