"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { messagesAtom, chatErrorAtom } from "@/stores/chatStore";
import { toolsAtom, toolsErrorAtom } from "@/stores/toolStore";
import { tokenAtom, sessionIdAtom, userIdAtom, isAuthenticatedAtom, authHydratedAtom } from "@/stores/authStore";
import { getToken, setToken as persistToken, clearToken, getUserId } from "@/lib/auth/token";
import { kimApi } from "@/lib/api/client";
import { clearStoredToolPermissions } from "@/lib/tools/toolHelpers";

export function useAuth() {
  const [token, setTokenAtom] = useAtom(tokenAtom);
  const [sessionId, setSessionId] = useAtom(sessionIdAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [isHydrated, setAuthHydrated] = useAtom(authHydratedAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const resetMessages = useSetAtom(messagesAtom);
  const resetChatError = useSetAtom(chatErrorAtom);
  const resetTools = useSetAtom(toolsAtom);
  const resetToolsError = useSetAtom(toolsErrorAtom);

  useEffect(() => {
    const stored = getToken();
    if (stored) setTokenAtom(stored);
    setUserId(getUserId());
    setAuthHydrated(true);
  }, [setTokenAtom, setUserId, setAuthHydrated]);

  async function login(authToken: string): Promise<void> {
    const normalizedToken = authToken.trim();
    if (!normalizedToken) {
      throw new Error("API token required");
    }

    const resolvedUserId = userId !== "user_init" ? userId : getUserId();

    persistToken(normalizedToken);
    setTokenAtom(normalizedToken);
    setUserId(resolvedUserId);
    setSessionId(null);

    try {
      const session = await kimApi.createSession({ userId: resolvedUserId });
      setSessionId(session.sessionId);
    } catch (error) {
      clearToken();
      setTokenAtom(null);
      setSessionId(null);
      throw error;
    }
  }

  async function createSession(): Promise<string> {
    const resolvedUserId = userId !== "user_init" ? userId : getUserId();
    setUserId(resolvedUserId);
    const session = await kimApi.createSession({ userId: resolvedUserId });
    setSessionId(session.sessionId);
    return session.sessionId;
  }

  function logout(): void {
    clearToken();
    clearStoredToolPermissions();
    setTokenAtom(null);
    setSessionId(null);
    resetMessages([]);
    resetChatError(null);
    resetTools([]);
    resetToolsError(null);
  }

  return { token, userId, sessionId, isAuthenticated, isHydrated, login, logout, createSession };
}
