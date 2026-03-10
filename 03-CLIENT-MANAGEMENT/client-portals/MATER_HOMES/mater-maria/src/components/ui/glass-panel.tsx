"use client";

import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Blur strength */
  blur?: "sm" | "md" | "lg";
}

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
};

export function GlassPanel({
  children,
  className,
  blur = "md",
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-default bg-surface/60 saturate-150",
        blurMap[blur],
        className,
      )}
    >
      {children}
    </div>
  );
}
