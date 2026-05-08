import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export function GradientText({
  children,
  from,
  to,
  className,
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag
      className={cn("bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from || "var(--accent-300)"}, ${to || "var(--accent-600)"})`,
      }}
    >
      {children}
    </Tag>
  );
}
