"use client";

import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { messagesAtom } from "@/stores/chatStore";
import { useSceneStore } from "@/stores/sceneStore";

/**
 * Bridges Jotai chat state → Zustand scene animation state.
 * Call this OUTSIDE the R3F Canvas (e.g. in AppShell) so it has
 * access to both React contexts.
 */
export function useAvatar() {
  const messages = useAtomValue(messagesAtom);
  const { setAvatarAnimation } = useSceneStore();
  const prevLengthRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (messages.length <= prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      return;
    }
    prevLengthRef.current = messages.length;

    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;

    // Kim just replied — trigger wave, return to idle after 3.2 s
    setAvatarAnimation("wave");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAvatarAnimation("idle");
    }, 3200);
  }, [messages, setAvatarAnimation]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}