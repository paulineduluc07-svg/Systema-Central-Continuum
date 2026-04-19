import { Badge } from "@/components/ui/Badge";
import { getToolPermissionLabel, type ToolPermissionMode } from "@/lib/tools/toolHelpers";

interface PermissionBadgeProps {
  mode: ToolPermissionMode;
}

export function PermissionBadge({ mode }: PermissionBadgeProps) {
  const variant = mode === "always" ? "success" : mode === "denied" ? "error" : "warning";
  return <Badge variant={variant}>{getToolPermissionLabel(mode)}</Badge>;
}
