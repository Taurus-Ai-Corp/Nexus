import { cn } from "@/lib/utils";

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-2xl",
  full: "max-w-none",
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
}

export function Container({ children, className, size = "lg" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-8 lg:px-16", sizes[size], className)}>
      {children}
    </div>
  );
}
