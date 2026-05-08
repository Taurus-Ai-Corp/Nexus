"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WingsBackgroundProps {
  /** Size relative to viewport width, e.g. "70vw" */
  size?: string;
  /** Vertical position, CSS top value */
  top?: string;
  /** Rotate slightly for dynamic feel */
  rotate?: number;
  className?: string;
}

/**
 * Ghost wings background — the MM wings SVG rendered at large scale with
 * near-zero opacity, multiple layered shades, and a soft radial shadow glow.
 * Creates the "protective wings" atmosphere from Psalm 91:4.
 *
 * Place inside a `relative overflow-hidden` section, BEFORE content.
 */
export function WingsBackground({
  size = "72vw",
  top = "50%",
  rotate = 0,
  className,
}: WingsBackgroundProps) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "pointer-events-none absolute left-1/2 z-0 select-none",
        className
      )}
      style={{
        width: size,
        top,
        transform: `translateX(-50%) translateY(-50%) rotate(${rotate}deg)`,
      }}
    >
      {/* Outer glow layer — widest, most transparent */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 120"
        fill="none"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.018, filter: "blur(8px)" }}
      >
        <WingsPaths shade="hsl(42, 72%, 60%)" />
      </svg>

      {/* Mid layer — soft diffused */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 120"
        fill="none"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.028, filter: "blur(3px)" }}
      >
        <WingsPaths shade="hsl(42, 72%, 55%)" />
      </svg>

      {/* Sharp layer — most defined, lowest opacity */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 120"
        fill="none"
        className="relative h-full w-full"
        style={{ opacity: 0.042 }}
      >
        <WingsPaths shade="hsl(42, 78%, 65%)" />
      </svg>
    </motion.div>
  );
}

/** Reusable wing paths so we can layer them at different opacities */
function WingsPaths({ shade }: { shade: string }) {
  return (
    <g transform="translate(10, 10)">
      {/* Left M wing */}
      <path
        d="M 0 90 L 0 10 L 22 55 L 44 10 L 66 55 L 66 90 L 56 90 L 56 40 L 44 65 L 33 65 L 22 40 L 22 90 Z"
        fill={shade}
      />
      {/* Right M wing (mirrored) */}
      <path
        d="M 114 90 L 114 10 L 136 55 L 158 10 L 180 55 L 180 90 L 170 90 L 170 40 L 158 65 L 147 65 L 136 40 L 136 90 Z"
        fill={shade}
      />
      {/* Centre wing bridge */}
      <path
        d="M 55 30 Q 90 0 125 30 Q 90 15 55 30 Z"
        fill={shade}
        opacity={0.6}
      />
      {/* Decorative cross at peak */}
      <line x1="90" y1="8" x2="90" y2="22" stroke={shade} strokeWidth="2" opacity={0.5} />
      <line x1="84" y1="15" x2="96" y2="15" stroke={shade} strokeWidth="2" opacity={0.5} />
    </g>
  );
}
