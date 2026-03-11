"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/brand-logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isInvestRoute = pathname === "/invest";
  const useBlendMode = isInvestRoute && !scrolled;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Close mobile nav on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg-base/80 shadow-sm backdrop-blur-[12px] border-b border-border-subtle"
          : "bg-transparent"
      )}
      style={useBlendMode ? { mixBlendMode: "difference" } : undefined}
    >
      {/* Top gradient scrim — always visible, ensures logo contrast over any hero image */}
      {!scrolled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 70%, transparent 100%)" }}
          aria-hidden="true"
        />
      )}
      <nav className="relative mx-auto flex h-24 w-full max-w-screen-2xl items-center justify-between px-6 sm:px-10 lg:px-20">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group transition-opacity hover:opacity-80"
          aria-label={`${SITE.shortName} - Home`}
        >
          <BrandLogo height={88} onDark={!scrolled} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-colors",
                scrolled
                  ? "text-text-secondary hover:text-text-primary hover:bg-surface"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button
            className="rounded-full px-5 font-medium text-text-inverse"
            style={{ background: "var(--accent-gradient)" }}
            aria-label="Schedule a Visit"
          >
            Schedule a Visit
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-bg-base border-border-default w-72">
              <SheetHeader>
                <SheetTitle>
                  <BrandLogo height={40} onDark={false} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pt-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border-default pt-4">
                  <Button
                    className="w-full rounded-full font-medium text-text-inverse"
                    style={{ background: "var(--accent-gradient)" }}
                    aria-label="Schedule a Visit"
                    onClick={() => setMobileOpen(false)}
                  >
                    Schedule a Visit
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
