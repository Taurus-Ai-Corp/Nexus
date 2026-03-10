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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-16">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group transition-opacity hover:opacity-80"
          aria-label={`${SITE.shortName} - Home`}
        >
          <BrandLogo height={44} className="text-text-primary" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface"
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
                  <BrandLogo height={40} className="text-text-primary" />
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
