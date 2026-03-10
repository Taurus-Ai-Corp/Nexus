"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  /** Spotlight color (default: gold accent) */
  spotlightColor?: string;
  /** Spotlight radius in px */
  radius?: number;
}

export function CardSpotlight({
  children,
  className,
  spotlightColor = "hsla(42, 72%, 55%, 0.12)",
  radius = 350,
}: CardSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border-default bg-surface/80 backdrop-blur-xl transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-border-accent hover:shadow-lg hover:shadow-[var(--shadow-gold)]",
        className,
      )}
    >
      {/* Spotlight gradient */}
      <div
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
            : "none",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
