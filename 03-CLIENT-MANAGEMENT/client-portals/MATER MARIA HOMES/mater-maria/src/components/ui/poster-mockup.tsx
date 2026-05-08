"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PosterMockupProps {
  className?: string;
}

const COLLAGE_IMAGES = [
  { src: "/assets-2025/images/lifestyle/NBMBBG_MMH_001.webp", alt: "Estate view", rotate: "-3deg", top: "2%", left: "3%", w: "44%", h: "38%" },
  { src: "/assets-2025/images/lifestyle/NBMBBG_MMH_002.webp", alt: "Villa exterior", rotate: "2deg", top: "0%", left: "50%", w: "47%", h: "32%" },
  { src: "/assets-2025/images/lifestyle/elder-couple-nurse.webp", alt: "Resident care", rotate: "-1deg", top: "34%", left: "0%", w: "52%", h: "34%" },
  { src: "/assets-2025/images/lifestyle/family-tea-moment.webp", alt: "Family moment", rotate: "3deg", top: "30%", left: "48%", w: "52%", h: "30%" },
  { src: "/assets-2025/images/lifestyle/NBMBBG_MMH_005.webp", alt: "Community", rotate: "-2deg", top: "60%", left: "5%", w: "40%", h: "28%" },
  { src: "/assets-2025/images/lifestyle/mmh-new9.webp", alt: "Gardens", rotate: "1deg", top: "57%", left: "42%", w: "55%", h: "30%" },
];

export function PosterMockup({ className }: PosterMockupProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotateY: -25, y: 40 }}
      whileInView={{ opacity: 1, rotateY: -12, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* A3 poster — 1:1.414 ratio */}
      <div
        style={{
          width: "min(360px, 90vw)",
          aspectRatio: "1 / 1.414",
          background: "#faf9f6",
          borderRadius: "4px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.08)",
          overflow: "hidden",
          position: "relative",
          transform: "rotateY(-12deg) rotateX(4deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Photo collage — top 62% */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "38%", overflow: "hidden" }}>
          {COLLAGE_IMAGES.map((img, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: img.top,
                left: img.left,
                width: img.w,
                height: img.h,
                transform: `rotate(${img.rotate})`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.22)",
                border: "3px solid white",
                overflow: "hidden",
                zIndex: i,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {/* Brand section — bottom 38% */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "38%",
            background: "#faf9f6",
            padding: "12px 16px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: "6px",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* Tagline lines — typeset like DekGrafis */}
          <div style={{ fontSize: "7px", color: "#888", lineHeight: 1.6, letterSpacing: "0.04em" }}>
            Mater&nbsp;&nbsp;&nbsp;Maria is&nbsp;&nbsp;&nbsp;committed&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;delivering&nbsp;&nbsp;&nbsp;the&nbsp;&nbsp;&nbsp;premium<br />
            without&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;breaking&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;the&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;communities
          </div>

          {/* Big brand name — steel emboss */}
          <div
            style={{
              fontFamily: "var(--font-heading, Georgia, serif)",
              fontWeight: 700,
              fontSize: "clamp(28px, 8vw, 44px)",
              lineHeight: 1,
              color: "#1a2a4a",
              textShadow:
                "1px 1px 0 #c9a84c, 2px 2px 0 #b8931a, 3px 3px 0 #a07810, 4px 4px 0 #8a6508, 5px 5px 8px rgba(0,0,0,0.35)",
              letterSpacing: "-0.02em",
            }}
          >
            Mater Maria
          </div>

          {/* Estate descriptor */}
          <div style={{ fontSize: "7px", color: "#666", lineHeight: 1.7, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Mater Maria Homes is committed to delivering the premium<br />
            wellness estate in Kerala. matermariakerala.com
          </div>

          {/* Bottom stat row */}
          <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
            {[["91%", "5-YR ROI"], ["90", "RESIDENCES"], ["100%", "NET-ZERO"]].map(([v, l]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#c9a84c" }}>{v}</span>
                <span style={{ fontSize: "6px", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div
        style={{
          width: "min(360px, 90vw)",
          aspectRatio: "1 / 0.3",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)",
          transform: "rotateY(-12deg) rotateX(4deg) scaleY(-1) translateY(-2px)",
          opacity: 0.25,
          filter: "blur(4px)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
