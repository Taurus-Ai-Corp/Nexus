"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GhostWordProps {
  word: string;
  /** Horizontal anchor within the section */
  align?: "left" | "center" | "right";
  /** Vertical position as CSS top value, e.g. "40%" or "auto" */
  top?: string;
  /** Extra Tailwind / inline classes */
  className?: string;
}

/**
 * Vistal-style oversized ghost typography — sits behind section content
 * at near-zero opacity, creating architectural depth without competing.
 *
 * Usage: place inside a `relative overflow-hidden` section BEFORE the main
 * content so z-ordering puts it behind everything else.
 */
export function GhostWord({
  word,
  align = "center",
  top = "50%",
  className,
}: GhostWordProps) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        // Positioning — sits behind all content
        "pointer-events-none absolute z-0 select-none",
        // Typography — ultra-thin Cormorant at display scale
        "font-display font-light leading-none tracking-[-0.03em]",
        // Colour — barely visible, adjusted per theme
        "text-text-primary opacity-[0.055] dark:opacity-[0.035]",
        // Horizontal anchor (no Tailwind translate — Framer Motion owns transforms)
        align === "left" && "-left-[4vw]",
        align === "right" && "right-0",
        className
      )}
      style={{
        fontSize: "clamp(4.5rem, 20vw, 17rem)",
        top,
        // Use Framer Motion x/y motion values so the entrance animation isn't overridden
        left: align === "center" ? "50%" : undefined,
        x: align === "center" ? "-50%" : undefined,
        y: "-50%",
        whiteSpace: "nowrap",
      }}
    >
      {word}
    </motion.span>
  );
}
