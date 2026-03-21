import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs text-[#a8aed3] font-medium">{label}</label>
      )}
      <input
        className={clsx(
          "bg-[rgba(6,8,20,0.42)] border border-[rgba(187,196,255,0.26)] rounded-xl px-4 py-2",
          "text-[#f4f3ff] placeholder-[#a8aed3] text-sm",
          "focus:outline-none focus:border-[#ff5f7c] transition-colors",
          className
        )}
        {...props}
      />
    </div>
  );
}