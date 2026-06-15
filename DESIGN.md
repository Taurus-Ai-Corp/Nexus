# DESIGN.md — nexus.taurusai.io

## Theme

Editorial creative-agency landing page for a campaign-generation SaaS. Warm paper ground, cinematic image-led sections, asymmetric editorial rhythm, and precise Swiss-like typography. The page must feel like a finished magazine spread that happens to sell a product.

## Color strategy

Restrained with one strong accent.

| Role | Value | Usage |
| --- | --- | --- |
| `--bg` | #F6F4EF | page background, warm paper |
| `--surface` | #FFFFFF | cards, lab panel, input fields |
| `--ink` | #14110F | primary text, headings |
| `--ink-muted` | #6B655E | secondary text, captions |
| `--accent` | #B85C38 | primary CTA, active states, editorial underline |
| `--accent-warm` | #C97B5C | hover states |
| `--border` | #E3DED4 | hairlines, separators |
| `--dark` | #1A1714 | footer, inverted sections |
| `--cream` | #FAF8F4 | subtle section backgrounds |

## Typography

- Display: `"DM Serif Display", Georgia, serif` — large editorial headlines
- Body: `"Inter", "Sohne", system-ui, sans-serif` — clean, slightly geometric
- Mono/labels: `"IBM Plex Mono", monospace` — captions, kicker labels, metadata

Headings use tight tracking (`-0.02em`), body uses `text-wrap: pretty`, display headings use `text-wrap: balance`.

## Layout

- Single continuous scroll with named sections.
- Macro-whitespace: sections `padding: clamp(5rem, 10vw, 8rem) 0`.
- Max content width `1280px`, generous lateral padding `clamp(1rem, 4vw, 3rem)`.
- Asymmetric editorial split: text block + image block, alternating left/right across sections.
- Avoid identical card grids; use bento-style feature group when needed.

## Components

### Primary button

- Pill shape, dark ink background (#14110F), off-white text.
- Padding `0.9rem 1.6rem`, font-weight 500.
- `:hover` → background `--accent`, slight `translateY(-1px)`.
- `:active` → `scale(0.97)` (Emil rule).
- Transition `transform 160ms var(--ease-out), background 200ms var(--ease-out)`.

### Secondary button / ghost

- Transparent background, 1.5px border `--border`, ink text.
- Hover: background `--cream`, border ink-muted.

### Editorial card

- No heavy shadow. Use 1px `--border` and subtle background shift.
- Inner padding `1.5rem`.
- No nested cards.

### Kicker label

- Mono, uppercase, letter-spacing `0.18em`, size `0.7rem`.
- Used sparingly — not above every section. One deliberate brand system voice.

## Motion

- Custom easing: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
- Entrance animations only for below-fold sections; hero loads instantly.
- IntersectionObserver-driven `fade-up` (transform + opacity only).
- Reduced-motion: disable transforms, keep opacity crossfade only.
- No animation on keyboard-initiated actions; fast feedback on button press.

## Imagery

- Cinematic editorial crops, warm film-grade treatment.
- Image-first sections: full-bleed or near-full-bleed photo with text overlaid in safe area.
- SVG campaign studies stay as implementation-friendly placeholders until real photo API is connected.

## Anti-patterns enforced

- No gradient text.
- No glassmorphism as default.
- No identical icon-heading-text card grids.
- No tiny uppercase eyebrow above every section.
- No side-stripe accent borders.
- No hero metric template.

## Responsive

- Mobile: single column, `w-full`, `px-4`, stack image before or after text per section.
- Avoid full-height sections; use `min-height` only for hero.
- Test headline overflow at every breakpoint.

## Domain / brand

- Surface lives at `nexus.taurusai.io`.
- Email CTA: `nexus@taurusai.io`.
- All page copy references "Nexus Creative" / "NEXUS" as the campaign studio.
