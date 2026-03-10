"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Total height budget in pixels */
  height?: number;
}

export function BrandLogo({ className, height = 52 }: BrandLogoProps) {
  const iconH = Math.round(height * 0.50);
  const iconW = Math.round((iconH / 125) * 227);

  return (
    <div
      className={cn("flex flex-col items-center gap-0", className)}
      role="img"
      aria-label="Mater Maria Homes"
      style={{ lineHeight: 1 }}
    >
      {/* Wings */}
      <svg
        viewBox="83 90 227 125"
        width={iconW}
        height={iconH}
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <path
          d="M251.38,134.66
             c-20.51-1.01-40.78,6.67-54.81,27.65
             c-14.03-20.98-34.3-28.66-54.81-27.65
             c-30.73,1.51-45.86,22.78-45.86,22.78
             s18.23-15.89,54.88,1.63
             c26.59,12.71,42.04,43.6,45.79,51.87
             c3.75-8.28,19.19-39.16,45.79-51.87
             c36.66-17.52,54.88-1.63,54.88-1.63
             S282.11,133.15,251.38,134.66Z"
          fill="#e8d080"
        />
        <path
          d="M244.31,95.06
             c-34.89,0-47.43,17.32-47.74,17.07
             c-0.31,0.25-13,-17.07-47.89,-17.07
             c-49.07,0-64.85,40.29-64.85,40.29
             s58.64-45.16,112.73,8.93
             c54.09-54.09,112.58-8.93,112.58-8.93
             S293.38,95.06,244.31,95.06Z"
          fill="#C9A84C"
        />
      </svg>

      {/* MATER MARIA HOMES */}
      <span
        style={{
          fontFamily: 'var(--font-heading, "Didot", Georgia, serif)',
          fontSize: Math.round(height * 0.21),
          letterSpacing: "0.18em",
          fontWeight: 800,
          color: "#C9A84C",
          marginTop: Math.round(height * 0.04),
          whiteSpace: "nowrap",
          textShadow: "0 1px 12px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.3)",
        }}
      >
        MATER MARIA HOMES
      </span>

      {/* LIVING REFINED */}
      <span
        style={{
          fontFamily: 'var(--font-heading, "Didot", Georgia, serif)',
          fontStyle: "italic",
          fontSize: Math.round(height * 0.13),
          letterSpacing: "0.26em",
          fontWeight: 500,
          color: "rgba(201,168,76,0.90)",
          textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          marginTop: Math.round(height * 0.02),
          whiteSpace: "nowrap",
        }}
      >
        LIVING REFINED
      </span>
    </div>
  );
}
