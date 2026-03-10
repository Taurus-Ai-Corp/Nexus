"use client";

import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  /** Shimmer color */
  shimmerColor?: string;
  /** Background gradient */
  background?: string;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = "hsla(42, 80%, 70%, 0.3)",
  background = "linear-gradient(135deg, hsl(42, 72%, 55%), hsl(36, 65%, 42%))",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold text-text-inverse transition-all duration-300",
        "hover:brightness-110 hover:shadow-[var(--accent-glow-strong)]",
        "active:scale-[0.98] active:brightness-95",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      style={{ background }}
      {...props}
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
