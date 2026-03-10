"use client";

import { cn } from "@/lib/utils";

interface SectionWatermarkProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  /** Override watermark text (default: "MATER MARIA HOMES") */
  text?: string;
  /** Force dark background */
  forceDark?: boolean;
  /** Forwarded ref (React 19 ref-as-prop) */
  ref?: React.Ref<HTMLElement>;
}

export function SectionWatermark({
  children,
  className,
  text = "MATER MARIA HOMES",
  forceDark = false,
  ref,
  ...rest
}: SectionWatermarkProps) {
  return (
    <section
      ref={ref}
      className={cn("relative overflow-hidden grain-surface", forceDark && "bg-bg-base", className)}
      {...rest}
    >
      {/* Watermark text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center"
      >
        <span
          className="whitespace-nowrap font-heading font-black tracking-widest"
          style={{
            fontSize: "clamp(4rem, 15vw, 14rem)",
            opacity: 0.04,
            WebkitTextStroke: "1px hsla(42, 72%, 55%, 0.08)",
            color: "transparent",
            lineHeight: 1,
          }}
        >
          {text}
        </span>
      </div>
      {/* Section content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
