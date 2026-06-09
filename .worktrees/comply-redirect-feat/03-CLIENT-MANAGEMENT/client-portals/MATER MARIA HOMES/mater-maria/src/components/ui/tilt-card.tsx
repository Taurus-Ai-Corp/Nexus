"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees */
  maxTilt?: number;
  /** Perspective distance */
  perspective?: number;
  /** Scale on hover */
  hoverScale?: number;
}

export function TiltCard({
  children,
  className,
  maxTilt = 8,
  perspective = 1000,
  hoverScale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      setTransform({ rotateX, rotateY });
    },
    [maxTilt],
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border-default bg-surface/60 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg",
        className,
      )}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        scale: transform.rotateX !== 0 || transform.rotateY !== 0 ? hoverScale : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

/** Floating element inside TiltCard — translateZ lifts it above card plane */
export function TiltCardFloat({
  children,
  className,
  depth = 50,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)` }}>
      {children}
    </div>
  );
}
