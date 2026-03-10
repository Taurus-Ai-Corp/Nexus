import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  goldTitle?: boolean;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  className,
  goldTitle = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-16", align === "center" && "text-center", className)}
    >
      {badge && (
        <span className="mb-4 inline-block rounded-full border border-border-accent bg-accent-default/10 px-4 py-1.5 text-sm font-medium text-accent-default">
          {badge}
        </span>
      )}
      <h2 className={cn(
        "font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
        goldTitle ? "text-gradient-gold" : "text-text-primary"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}
