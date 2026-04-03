"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";

interface ConfirmationDialogProps {
  open: boolean;
  toolName: string;
  onAllowOnce: () => void;
  onAlwaysAllow: () => void;
  onDeny: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export function ConfirmationDialog({
  open,
  toolName,
  onAllowOnce,
  onAlwaysAllow,
  onDeny,
  onCancel,
  busy = false,
}: ConfirmationDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(4,6,18,0.72)] backdrop-blur-sm flex items-center justify-center p-4">
      <GlassPanel className="w-full max-w-lg p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a8aed3]">Tool Confirmation</p>
          <h2 className="text-lg font-semibold text-[#f4f3ff]">{toolName}</h2>
          <p className="text-sm text-[#a8aed3]">
            This tool can act outside the chat UI. Choose whether Kim can use it once, remember your permission, or stay blocked.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button onClick={onAllowOnce} disabled={busy}>
            Allow once
          </Button>
          <Button variant="outline" onClick={onAlwaysAllow} disabled={busy}>
            Always allow
          </Button>
          <Button variant="ghost" onClick={onDeny} disabled={busy}>
            Deny
          </Button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="text-xs text-[#a8aed3] hover:text-[#f4f3ff] transition-colors self-end disabled:opacity-50"
        >
          Cancel
        </button>
      </GlassPanel>
    </div>
  );
}
