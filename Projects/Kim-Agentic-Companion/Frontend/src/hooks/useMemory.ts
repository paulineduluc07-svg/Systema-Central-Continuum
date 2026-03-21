"use client";

import { useState, useCallback } from "react";
import { useAtomValue } from "jotai";
import { kimApi } from "@/lib/api/client";
import { sessionIdAtom } from "@/stores/authStore";
import { useAuth } from "./useAuth";

export function useMemory() {
  const [memory, setMemory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, createSession } = useAuth();
  const sessionId = useAtomValue(sessionIdAtom);

  const loadMemory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sid = sessionId ?? (await createSession());
      const res = await kimApi.chat({
        userId,
        sessionId: sid,
        message: "Please summarize everything you remember about me and our conversations.",
      });
      setMemory(res.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load memory");
    } finally {
      setLoading(false);
    }
  }, [userId, sessionId, createSession]);

  return { memory, loading, error, loadMemory };
}