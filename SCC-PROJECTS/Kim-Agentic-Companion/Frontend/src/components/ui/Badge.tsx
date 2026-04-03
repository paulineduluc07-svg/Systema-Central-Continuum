import clsx from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-white/10 text-[#f4f3ff]": variant === "default",
          "bg-[rgba(104,255,240,0.2)] text-[#68fff0]": variant === "success",
          "bg-[rgba(255,200,100,0.2)] text-yellow-300": variant === "warning",
          "bg-[rgba(255,95,124,0.2)] text-[#ff5f7c]": variant === "error",
        },
        className
      )}
    >
      {children}
    </span>
  );
}