"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) return <div className="flex gap-2 h-9 w-[72px]" />;

  const isClarity = theme === "clarity";

  return (
    <div className="flex items-center gap-1 p-1 rounded-full border border-border-default bg-surface/50 backdrop-blur-md">
      {/* Light/Dark Toggle */}
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={cn(
          "relative rounded-full p-2 transition-colors hover:bg-bg-elevated",
          !isClarity && "bg-bg-elevated shadow-sm"
        )}
        aria-label="Toggle theme"
        title="Toggle Theme"
      >
        <Sun className={cn(
          "h-[18px] w-[18px] transition-all",
          resolvedTheme === "dark" ? "hidden" : "block"
        )} />
        <Moon className={cn(
          "h-[18px] w-[18px] transition-all",
          resolvedTheme === "light" ? "hidden" : "block"
        )} />
      </button>

      {/* Clarity / High-Contrast Toggle */}
      <button
        onClick={() => setTheme(isClarity ? (resolvedTheme === "dark" ? "dark" : "light") : "clarity")}
        className={cn(
          "relative rounded-full p-2 transition-colors hover:bg-bg-elevated",
          isClarity && "bg-accent-default text-text-inverse shadow-sm"
        )}
        title="Toggle Clarity Mode (High Contrast)"
        aria-label="Toggle Clarity Mode (High Contrast)"
      >
        <Eye className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
