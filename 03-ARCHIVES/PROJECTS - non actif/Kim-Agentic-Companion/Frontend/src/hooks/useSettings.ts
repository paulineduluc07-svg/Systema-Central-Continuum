"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { ttsEnabledAtom } from "@/stores/voiceStore";
import { themeModeAtom, type ThemeMode } from "@/stores/settingsStore";

const TTS_STORAGE_KEY = "kim_tts_enabled";
const THEME_STORAGE_KEY = "kim_theme_mode";

const THEME_BACKGROUNDS: Record<ThemeMode, string> = {
  rose: "linear-gradient(160deg, #050714, #13182f)",
  aqua: "linear-gradient(160deg, #04111a, #10293a)",
  sunset: "linear-gradient(160deg, #140813, #2c1636)",
};

function readThemeMode(raw: string | null): ThemeMode {
  if (raw === "aqua" || raw === "sunset" || raw === "rose") {
    return raw;
  }

  return "rose";
}

export function useSettings() {
  const [ttsEnabled, setTtsEnabled] = useAtom(ttsEnabledAtom);
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);

  useEffect(() => {
    try {
      const storedTts = window.localStorage.getItem(TTS_STORAGE_KEY);
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (storedTts === "true" || storedTts === "false") {
        setTtsEnabled(storedTts === "true");
      }

      setThemeMode(readThemeMode(storedTheme));
    } catch {
      // Ignore hydration issues and keep defaults.
    }
  }, [setThemeMode, setTtsEnabled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(TTS_STORAGE_KEY, String(ttsEnabled));
    } catch {
      // Ignore storage errors.
    }
  }, [ttsEnabled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // Ignore storage errors.
    }

    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  return {
    ttsEnabled,
    setTtsEnabled,
    themeMode,
    setThemeMode,
    backgroundStyle: THEME_BACKGROUNDS[themeMode],
  };
}
