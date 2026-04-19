"use client";

import { useSetAtom, useAtomValue } from "jotai";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { themeModeAtom, type ThemeMode } from "@/stores/settingsStore";
import { voiceAvailableAtom } from "@/stores/voiceStore";
import { messagesAtom, chatErrorAtom } from "@/stores/chatStore";
import { sessionIdAtom } from "@/stores/authStore";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const THEMES: Array<{ id: ThemeMode; label: string; description: string }> = [
  { id: "rose", label: "Rose Pulse", description: "Original Kim galaxy palette." },
  { id: "aqua", label: "Aqua Drift", description: "Cooler cyan atmosphere for long sessions." },
  { id: "sunset", label: "Sunset Glow", description: "Warmer pink-orange contrast for softer nights." },
];

function maskToken(token: string | null): string {
  if (!token) {
    return "Not connected";
  }

  if (token.length <= 10) {
    return "••••••";
  }

  return `${token.slice(0, 4)}••••${token.slice(-4)}`;
}

export function SettingsPanel() {
  const { token, userId, sessionId, logout } = useAuth();
  const { resetPersonality } = useProfile();
  const { ttsEnabled, setTtsEnabled, themeMode, setThemeMode } = useSettings();
  const voiceAvailable = useAtomValue(voiceAvailableAtom);
  const clearMessages = useSetAtom(messagesAtom);
  const clearChatError = useSetAtom(chatErrorAtom);
  const clearSessionId = useSetAtom(sessionIdAtom);

  function resetConversation(): void {
    clearMessages([]);
    clearChatError(null);
    clearSessionId(null);
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
      <GlassPanel className="p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-[#f4f3ff] font-semibold text-lg">Settings</h2>
          <p className="text-sm text-[#a8aed3] mt-1">
            Tune how Kim feels on this device and manage your current access/session state.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[rgba(183,194,255,0.14)] bg-[rgba(255,255,255,0.04)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#a8aed3]">Voice</p>
                <p className="text-sm text-[#f4f3ff] mt-1">Playback and microphone availability.</p>
              </div>
              <Badge variant={voiceAvailable ? "success" : "warning"}>
                {voiceAvailable ? "Mic ready" : "Mic unavailable"}
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#f4f3ff]">Auto-speak Kim replies</p>
                <p className="text-xs text-[#a8aed3]">Persisted locally and used across chat sessions.</p>
              </div>
              <Button
                variant={ttsEnabled ? "primary" : "outline"}
                size="sm"
                onClick={() => setTtsEnabled(!ttsEnabled)}
              >
                {ttsEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(183,194,255,0.14)] bg-[rgba(255,255,255,0.04)] p-4 flex flex-col gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#a8aed3]">Theme</p>
              <p className="text-sm text-[#f4f3ff] mt-1">Switch the global accent and atmosphere.</p>
            </div>

            <div className="grid gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeMode(theme.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                    themeMode === theme.id
                      ? "border-[#ff5f7c] bg-[rgba(255,95,124,0.14)]"
                      : "border-[rgba(183,194,255,0.14)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-[#f4f3ff] font-medium">{theme.label}</span>
                    {themeMode === theme.id && <Badge variant="success">Active</Badge>}
                  </div>
                  <p className="text-xs text-[#a8aed3] mt-1">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="p-5 flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#a8aed3]">Account</p>
          <p className="text-sm text-[#f4f3ff] mt-1">Current browser-bound access state.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(183,194,255,0.14)] p-3">
            <p className="text-xs text-[#a8aed3]">API token</p>
            <p className="text-sm text-[#f4f3ff] mt-1 break-all">{maskToken(token)}</p>
          </div>
          <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(183,194,255,0.14)] p-3">
            <p className="text-xs text-[#a8aed3]">User ID</p>
            <p className="text-sm text-[#f4f3ff] mt-1 break-all">{userId}</p>
          </div>
          <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(183,194,255,0.14)] p-3">
            <p className="text-xs text-[#a8aed3]">Session ID</p>
            <p className="text-sm text-[#f4f3ff] mt-1 break-all">{sessionId ?? "No active session yet"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resetConversation}>
            Reset conversation
          </Button>
          <Button variant="outline" onClick={resetPersonality}>
            Reset personality
          </Button>
          <Button variant="ghost" onClick={logout}>
            Logout device
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
