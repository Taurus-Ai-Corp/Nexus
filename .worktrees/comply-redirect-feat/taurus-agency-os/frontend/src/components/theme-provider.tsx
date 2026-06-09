'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Schedule setMounted to run after browser paint to avoid synchronous setState in effect
    const timeoutId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timeoutId);
  }, []);

  if (!mounted) return null;

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="transition-colors duration-200">
        {children}
      </div>
    </NextThemesProvider>
  );
}