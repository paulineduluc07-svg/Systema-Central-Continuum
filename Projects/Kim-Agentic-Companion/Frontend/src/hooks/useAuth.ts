"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { tokenAtom, sessionIdAtom, userIdAtom, isAuthenticatedAtom } from "@/stores/authStore";
import { getToken, setToken as persistToken, clearToken, getUserId } from "@/lib/auth/token";
import { kimApi } from "@/lib/api/client";

export function useAuth() {
  const [token, setTokenAtom] = useAtom(tokenAtom);
  const [sessionId, setSessionId] = useAtom(sessionIdAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  useEffect(() => {
    const stored = getToken();
    if (stored) setTokenAtom(stored);
    setUserId(getUserId());
  }, [setTokenAtom, setUserId]);

  async function login(authToken: string): Promise<void> {
    persistToken(authToken);
    setTokenAtom(authToken);
  }

  async function createSession(): Promise<string> {
    const session = await kimApi.createSession({ userId });
    setSessionId(session.sessionId);
    return session.sessionId;
  }

  function logout(): void {
    clearToken();
    setTokenAtom(null);
    setSessionId(null);
  }

  return { token, userId, sessionId, isAuthenticated, login, logout, createSession };
}