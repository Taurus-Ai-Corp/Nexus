"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, Phone } from "lucide-react";
import { SITE, FOOTER } from "@/lib/constants";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Container } from "@/components/ui/container";


const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Phone, label: "WhatsApp", href: SITE.whatsapp },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <Container size="lg" className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link
              href="/"
              aria-label={`${SITE.shortName} - Home`}
              className="inline-flex transition-opacity hover:opacity-80"
            >
              <BrandLogo height={80} onDark={true} />
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              {SITE.tagline}
            </p>
            <p className="text-sm leading-relaxed text-text-muted">
              {SITE.description}
            </p>
            {/* Social icons */}
            <div className="mt-2 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-accent hover:text-accent-default"
                  aria-label={`${social.label} (opens in new tab)`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-primary">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-accent-default"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-border-subtle">
        <Container size="lg" className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Designed by{" "}
            <span className="font-medium text-accent-default">NeoVibe Studio</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}
