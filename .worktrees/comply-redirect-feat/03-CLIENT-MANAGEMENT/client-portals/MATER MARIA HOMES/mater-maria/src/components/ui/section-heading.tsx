import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  goldTitle?: boolean;
  /** Set true when rendered over a dark hero image — forces white text */
  onHero?: boolean;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  className,
  goldTitle = false,
  onHero = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-16", align === "center" && "text-center", className)}
    >
      {badge && (
        <span className={cn(
          "mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-widest uppercase",
          onHero
            ? "border border-white/30 bg-white/10 text-amber-200 backdrop-blur-sm"
            : "border border-border-accent bg-accent-default/10 text-accent-default"
        )}>
          {badge}
        </span>
      )}
      <h2 className={cn(
        "font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
        goldTitle ? "text-gradient-gold" : onHero ? "text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]" : "text-text-primary"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mx-auto mt-4 max-w-2xl text-lg",
          onHero ? "text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]" : "text-text-secondary"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
