---
version: alpha
name: Nexus by Taurus AI — 3D Scroll Landing Page
description: Hedera.foundation-inspired single-scroll landing page for Dubai SMBs. Deep blue-purple gradient ambience, glass/crystal 3D WebGL background, scroll-reveal sections, embedded SVG architecture diagram.
colors:
  bg_deep: "#050b14"
  bg_mid: "#0a1628"
  bg_light: "#0f2744"
  accent_cyan: "#22d3ee"
  accent_violet: "#8b5cf6"
  accent_purple: "#533afd"
  accent_pink: "#ec4899"
  text_primary: "#f8fafc"
  text_secondary: "#94a3b8"
  text_muted: "#64748b"
  glass_bg: "rgba(15, 39, 68, 0.55)"
  glass_border: "rgba(34, 211, 238, 0.25)"
  surface: "rgba(255,255,255,0.04)"
typography:
  display_hero:
    fontFamily: "Geist"
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.00
    letterSpacing: "-2.88px"
  display:
    fontFamily: "Geist"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-1.92px"
  heading:
    fontFamily: "Geist"
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: "-0.72px"
  subheading:
    fontFamily: "Geist"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.20
  body:
    fontFamily: "Geist"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.60
  caption:
    fontFamily: "Geist Mono"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.45
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  pill: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  xl: 120px
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)"
    textColor: "#050b14"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text_primary}"
    border: "1px solid {colors.glass_border}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  glass-card:
    backgroundColor: "{colors.glass_bg}"
    border: "1px solid {colors.glass_border}"
    rounded: "{rounded.md}"
    backdropFilter: "blur(16px)"
---

## Overview

A single-scroll immersive landing page inspired by hedera.foundation. Deep space-blue background, floating glass/crystal 3D shapes, and scroll-triggered reveals. The page must feel premium, futuristic, and trustworthy — like a Web3 foundation site — but the content stays grounded in Dubai SMB marketing. Sections flow continuously without visual breaks.

## Colors

- **Deep space (#050b14):** Page background.
- **Mid blue (#0a1628):** Secondary surfaces.
- **Light blue (#0f2744):** Glass card tint.
- **Cyan (#22d3ee):** Primary accent — links, highlights, CTA gradient start.
- **Violet (#8b5cf6):** Secondary accent — gradients, glows.
- **Pink (#ec4899):** Tertiary accent for energy.
- **White (#f8fafc):** Primary text.
- **Slate (#94a3b8):** Secondary text.

## Typography

Geist for headings and body; Geist Mono for captions and technical labels. Display sizes use aggressive negative tracking like Vercel/Hedera.

## Components

Primary CTA is a cyan-to-violet gradient pill. Secondary actions are glass-outline pills. Cards use glassmorphism: translucent dark-blue backgrounds, cyan-tinted borders, blur. The 3D WebGL canvas stays fixed behind content.

## Layout

Single continuous scroll. Background canvas fixed full-screen. Content sections stack with generous vertical padding (120px+). Each section fades/slides into view as it enters the viewport. Embedded SVG architecture diagram reveals mid-page.
