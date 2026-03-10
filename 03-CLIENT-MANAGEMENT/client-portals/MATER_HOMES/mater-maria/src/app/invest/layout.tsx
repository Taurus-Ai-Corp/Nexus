"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { LenisProvider } from "@/components/invest/LenisProvider";
import { CurrencyProvider } from "@/lib/currency-context";

/**
 * Forces dark theme for all /invest/* routes.
 * Sets data-theme="dark" on <html> via next-themes, which cascades
 * to the navbar, footer, and all child components.
 * Restores the previous theme on unmount (when navigating away).
 */
export default function InvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const prev = resolvedTheme;
    setTheme("dark");

    return () => {
      // Restore previous theme when leaving /invest
      if (prev && prev !== "dark") {
        setTheme(prev);
      }
    };
    // Only run once on mount — don't re-trigger on theme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CurrencyProvider>
      <LenisProvider>{children}</LenisProvider>
    </CurrencyProvider>
  );
}
