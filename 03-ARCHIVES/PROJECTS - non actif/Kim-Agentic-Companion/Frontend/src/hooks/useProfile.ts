"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { personalityAtom, DEFAULT_PERSONALITY, type PersonalityConfig } from "@/stores/profileStore";

const STORAGE_KEY = "kim_personality";

export function useProfile() {
  const [personality, setPersonality] = useAtom(personalityAtom);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPersonality(JSON.parse(stored) as PersonalityConfig);
    } catch { /* ignore */ }
  }, [setPersonality]);

  function updatePersonality(updates: Partial<PersonalityConfig>) {
    const next = { ...personality, ...updates };
    setPersonality(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }

  function resetPersonality() {
    setPersonality(DEFAULT_PERSONALITY);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  return { personality, updatePersonality, resetPersonality };
}