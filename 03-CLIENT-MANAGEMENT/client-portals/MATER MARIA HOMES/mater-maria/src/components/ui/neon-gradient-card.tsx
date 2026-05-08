"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface NeonGradientCardProps {
  children: React.ReactNode;
  className?: string;
  /** Border width in px */
  borderSize?: number;
  /** Gradient colors [start, end] */
  gradientColors?: [string, string];
  /** Animation speed in seconds */
  animationSpeed?: number;
}

export function NeonGradientCard({
  children,
  className,
  borderSize = 2,
  gradientColors = ["hsl(42, 78%, 60%)", "hsl(36, 65%, 45%)"],
  animationSpeed = 4,
}: NeonGradientCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const animate = useCallback(() => {
    setRotation((prev) => (prev + 1) % 360);
  }, []);

  useEffect(() => {
    const interval = setInterval(animate, (animationSpeed * 1000) / 360);
    return () => clearInterval(interval);
  }, [animate, animationSpeed]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Outer glow */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-75 blur-sm"
        style={{
          background: `conic-gradient(from ${rotation}deg, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[0]})`,
          padding: borderSize,
        }}
      />
      {/* Animated border */}
      <div
        className="absolute -inset-[1px] rounded-2xl"
        style={{
          background: `conic-gradient(from ${rotation}deg, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[0]})`,
          padding: borderSize,
        }}
      >
        <div className="h-full w-full rounded-2xl bg-surface" />
      </div>
      {/* Content */}
      <div className="relative z-10 rounded-2xl bg-surface/90 backdrop-blur-xl">{children}</div>
    </div>
  );
}
