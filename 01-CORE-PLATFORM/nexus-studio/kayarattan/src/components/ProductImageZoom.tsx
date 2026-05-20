"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MotionProps, Variants } from "framer-motion";

export default function ProductImageZoom({
  mainImage,
  zoomImages,
  alt,
}: {
  mainImage: string;
  zoomImages: string[];
  alt: string;
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to percentage
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    setZoomPosition({ x: percentX, y: percentY });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 1), 3));
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      setZoomLevel(1);
    };
    
    imageRef.current?.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      imageRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const imageVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: zoomLevel },
  };

  return (
    <div
      ref={imageRef}
                  className="relative w-full h-[500px] bg-[#F5F1EB] overflow-hidden rounded-xl border border-[1px] border-[rgba(212,184,150,0.2)]"
                  onMouseMove={handleMouseMove}
                  onWheel={handleWheel}
                  onMouseLeave={() => setZoomLevel(1)}
                >
                  <div
                    ref={zoomRef}
                    className={`absolute inset-0 overflow-hidden ${
                      zoomLevel > 1 ? "transition-transform duration-300" : ""
                    }`}
                    style={{
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transform: `scale(${zoomLevel})`,
                    }}
                  >
                    <Image
                      src={mainImage}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Zoom indicator */}
                  {zoomLevel > 1 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 border-2 border-white/[0.7] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">+</span>
                      </div>
                    </div>
                  )}
                </div>
);
}