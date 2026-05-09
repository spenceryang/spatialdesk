import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-1 text-xs font-semibold", className || "bg-white/8 text-muted")}>
      {children}
    </span>
  );
}
