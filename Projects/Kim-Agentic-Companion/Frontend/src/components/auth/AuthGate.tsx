"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { isAuthenticated, isHydrated, login } = useAuth();
  const [tokenInput, setTokenInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(tokenInput);
      setTokenInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex-1 min-h-[calc(100vh-180px)] flex items-center justify-center">
        <GlassPanel className="w-full max-w-md p-6 text-center">
          <p className="text-sm text-[#f4f3ff]">Restoring session…</p>
        </GlassPanel>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-180px)] flex items-center justify-center">
      <GlassPanel className="w-full max-w-md p-6 sm:p-7 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#a8aed3]">Companion Access</p>
          <h1 className="text-2xl font-semibold text-[#f4f3ff]">Unlock Kim</h1>
          <p className="text-sm text-[#a8aed3]">
            Enter your API access token to open chat, memory, tools, voice, and wardrobe on this device.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="API Token"
            type="password"
            autoComplete="off"
            placeholder="Paste your companion access token"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            disabled={isSubmitting}
          />

          {error && <p className="text-sm text-[#ff5f7c]">{error}</p>}

          <Button type="submit" disabled={isSubmitting || !tokenInput.trim()}>
            {isSubmitting ? "Connecting…" : "Unlock"}
          </Button>
        </form>

        <p className="text-xs text-[#a8aed3] leading-relaxed">
          The token is stored only in this browser via local storage. Logout clears it from this device.
        </p>
      </GlassPanel>
    </div>
  );
}
