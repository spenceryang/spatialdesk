"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-brass text-ink hover:bg-[#d8bd82]",
        variant === "secondary" && "border border-line bg-white/5 text-foreground hover:bg-white/10",
        variant === "ghost" && "text-muted hover:bg-white/8 hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
