import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  variant?: "fade" | "wave" | "curve" | "peak";
}

export function SectionDivider({ className, variant = "fade" }: SectionDividerProps) {
  if (variant === "wave") {
    return (
      <div className={cn("relative -mt-1 overflow-hidden", className)}>
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-12"
          aria-hidden="true"
        >
          <path
            d="M0 48h1440V20c-240 20-480-20-720 0S240 0 0 20v28z"
            className="fill-bg-base dark:fill-surface"
          />
        </svg>
      </div>
    );
  }

  if (variant === "curve") {
    return (
      <div className={cn("relative -mt-1 overflow-hidden", className)}>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-20"
          aria-hidden="true"
        >
          <path
            d="M0 80c240-40 480 40 720 0s480-40 720 0v-80H0v80z"
            className="fill-bg-base dark:fill-surface"
          />
        </svg>
      </div>
    );
  }

  if (variant === "peak") {
    return (
      <div className={cn("relative -mt-1 overflow-hidden", className)}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-[60px]"
          aria-hidden="true"
        >
          <path
            d="M0 60l120-40 120 25 120-30 120 20 120-35 120 15 120-25 120 30 120-15 120 20 120-15 120 10v60H0z"
            className="fill-bg-base dark:fill-surface"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn("h-16 bg-gradient-to-b from-transparent to-surface", className)}
      aria-hidden="true"
    />
  );
}
