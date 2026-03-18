import type React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[rgba(198,102,52,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]",
        className
      )}
      {...props}
    />
  );
}
