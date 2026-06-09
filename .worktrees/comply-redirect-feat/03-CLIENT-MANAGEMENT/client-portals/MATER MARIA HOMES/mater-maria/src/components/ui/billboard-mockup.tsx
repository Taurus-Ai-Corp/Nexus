"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface BillboardMockupProps {
  className?: string;
}

export function BillboardMockup({ className }: BillboardMockupProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        perspective: "1400px",
      }}
    >
      {/* ── Billboard face (tilted) ─────────────────────────── */}
      <div
        style={{
          width: "min(480px, 90vw)",
          aspectRatio: "4 / 5",
          transform: "rotateY(-14deg) rotateX(3deg)",
          transformStyle: "preserve-3d",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3), inset 0 0 0 6px rgba(30,30,30,0.9)",
          position: "relative",
          background: "#0d1e3b",
        }}
      >
        {/* Metal frame border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "8px solid",
            borderColor: "#2a2a2a",
            borderRadius: "4px",
            zIndex: 10,
            pointerEvents: "none",
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.5)",
          }}
        />

        {/* Spotlight hooks at top */}
        {[-38, 0, 38].map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              top: -2,
              left: `calc(50% + ${x}%)`,
              transform: "translateX(-50%)",
              width: "10px",
              height: "22px",
              background: "linear-gradient(180deg, #555 0%, #333 100%)",
              borderRadius: "2px 2px 6px 6px",
              zIndex: 11,
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            }}
          />
        ))}

        {/* Billboard content */}
        <div
          style={{
            position: "absolute",
            inset: "8px",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(155deg, #0d1e3b 0%, #0a1628 60%, #111d35 100%)",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 40px)",
              zIndex: 0,
            }}
          />

          {/* Gold vertical accent bar */}
          <div
            style={{
              position: "absolute",
              right: "22%",
              top: 0,
              bottom: 0,
              width: "3px",
              background: "linear-gradient(180deg, transparent 0%, #C9A84C 20%, #C9A84C 80%, transparent 100%)",
              opacity: 0.5,
              zIndex: 1,
            }}
          />

          {/* Top-left small labels */}
          <div style={{ position: "absolute", top: "12px", left: "14px", zIndex: 5 }}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.4 }}>
              Kerala&apos;s First
            </p>
            <p style={{ fontSize: "8px", color: "#C9A84C", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.4, marginTop: "8px" }}>
              AI-Powered
            </p>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.4, marginTop: "8px" }}>
              Net-Zero Estate
            </p>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.4, marginTop: "8px" }}>
              High Serenity
            </p>
          </div>

          {/* Logo mark — large silhouette zone */}
          <div
            style={{
              position: "absolute",
              bottom: "28%",
              right: "22%",
              width: "62%",
              height: "66%",
              opacity: 0.12,
              zIndex: 2,
            }}
          >
            <Image
              src="/assets-2025/images/mater-maria-logo.svg"
              alt=""
              fill
              className="object-contain object-center"
              aria-hidden
            />
          </div>

          {/* Vertical estate name — right side bold */}
          <div
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              bottom: "0",
              width: "22%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
              background: "rgba(201,168,76,0.06)",
            }}
          >
            <span
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                fontFamily: "var(--font-heading, Georgia, serif)",
                fontWeight: 700,
                fontSize: "clamp(32px, 7vw, 52px)",
                color: "#FAECC2",
                letterSpacing: "-0.02em",
                textShadow:
                  "1px 1px 0 #c9a84c, 2px 2px 0 #b8931a, 3px 3px 0 #9a7810, 4px 4px 8px rgba(0,0,0,0.6)",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Mater Maria
            </span>
          </div>

          {/* Bottom info strip */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: "22%",
              height: "28%",
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: "6px",
              zIndex: 5,
              borderTop: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-heading, Georgia, serif)",
                fontWeight: 300,
                fontSize: "clamp(11px, 3vw, 16px)",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Homes
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
              <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Kanjirappally · Kottayam · Kerala
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: "7px", color: "rgba(201,168,76,0.6)", letterSpacing: "0.08em" }}>
                matermariakerala.com
              </span>
              <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
                2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Walkway platform ───────────────────────────────── */}
      <div style={{ position: "relative", width: "min(520px, 95vw)", height: "18px", transform: "rotateY(-14deg)" }}>
        {/* Platform surface */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "5%",
            right: "5%",
            height: "10px",
            background: "linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%)",
            borderRadius: "2px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        />
        {/* Railing posts */}
        {[10, 20, 80, 90].map((left) => (
          <div
            key={left}
            style={{
              position: "absolute",
              bottom: "10px",
              left: `${left}%`,
              width: "3px",
              height: "16px",
              background: "#333",
              borderRadius: "1px",
            }}
          />
        ))}
      </div>

      {/* ── Pole ───────────────────────────────────────────── */}
      <div style={{ position: "relative", transform: "rotateY(-14deg)" }}>
        <div
          style={{
            width: "22px",
            height: "120px",
            background: "linear-gradient(90deg, #555 0%, #888 30%, #aaa 50%, #777 70%, #444 100%)",
            borderRadius: "3px",
            boxShadow: "2px 0 8px rgba(0,0,0,0.4), -2px 0 4px rgba(0,0,0,0.2)",
            margin: "0 auto",
          }}
        />
        {/* Pole base taper */}
        <div
          style={{
            width: "34px",
            height: "16px",
            background: "linear-gradient(90deg, #444 0%, #777 50%, #444 100%)",
            borderRadius: "2px",
            margin: "0 auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        />
      </div>
    </motion.div>
  );
}
