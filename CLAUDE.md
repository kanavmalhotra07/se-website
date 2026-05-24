# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Static build to dist/
npm run preview   # Serve the production build locally
```

No test runner, no linter config. TypeScript errors surface at build time via Astro's built-in checker.

## Project overview

Static marketing site for **Sanchi Enterprises** — exhibition carpet supplier, India. Astro 4, zero JS frameworks, everything is `.astro`. Deployed as fully static HTML.

## Routing

```
/           → src/pages/index.astro
/products   → src/pages/products/index.astro   (editorial catalogue, all 6 types)
/products/non-woven-carpet
/products/ribbed-carpet
/products/velour-carpet
/products/caution-carpet
/products/designer-carpet
/about      → src/pages/about.astro            (benchmark quality — read this first)
/contact    → src/pages/contact.astro
```

## Layout shell

`src/layouts/Layout.astro` is the only shared wrapper. It takes `title` and `description` props for per-page SEO. **All shared client-side JS lives in one `<script>` block inside it:**

- Navbar transparent → glass blur at 60px scroll (adds `.is-scrolled`)
- `IntersectionObserver` scroll-reveal on every `[data-animate]` element
- Parallax on `.about-pg-hero__bg img` (rate 0.16) and `.contact-hero__bg img` (rate 0.12) — rAF-throttled with `will-change` primed and released via `transitionend`
- Mobile menu open/close
- Animated counters: elements with `data-count-to` (integer) and `data-count-suffix` (string) animate from 0 on first scroll-in

Page-specific JS (product hero parallax, gallery spotlight, FAQ accordion, contact form) goes in a `<script>` block on the individual page file, not in the layout.

## CSS architecture

`src/styles/global.css` (≈4930 lines) owns all design tokens, global utilities, every component's base classes, and all responsive rules. Component-specific overrides go in colocated `<style>` blocks inside `.astro` files.

**Design tokens:**
```css
--color-navy-dark:  #0C1230   /* dark hero backgrounds */
--color-navy:       #1B2A6B   /* mid-dark, process numbers */
--color-gold:       #B8963A   /* accent lines, eyebrow rules, CTA hover */
--color-warm-white: #F7F6F3   /* default page background */
--color-stone:      #EFEDE8   /* alternate light sections */
--font-display:     'DM Sans' /* all headings, numbers, prominent UI */
--font-body:        'Inter'   /* body copy, labels, nav */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)  /* all major transitions */
--sp-1 … --sp-9:   8px … 120px
```

**Breakpoints:** `1024px` (tablet) and `768px` (mobile) — both defined at the bottom of `global.css`. At `768px` the spacing tokens `--sp-7/8/9` are reduced and the navbar collapses to hamburger.

## Animation system

Three `data-animate` variants — pick the right one for each element:

| Attribute | Effect | Use for |
|---|---|---|
| `data-animate` | opacity + translateY(20px) | Text blocks, cards, headers |
| `data-animate="image"` | opacity + scale(0.97) | Photo panels, hero backgrounds |
| `data-animate="from-left"` | opacity + translateX(-22px) | Sidebars, pull-quotes |

Stagger siblings with `data-delay="1"` through `"7"` (80ms → 530ms increments). The eyebrow gold underline (`eyebrow--line::after`) grows via `scaleX(0→1)` automatically when its parent gets `.is-visible`.

All transitions use `--ease-out`. Images always need an `overflow: hidden` wrapper for the scale-bloom to be clipped.

Disable everything gracefully via `@media (prefers-reduced-motion: reduce)` — already wired in `global.css`.

## Reusable CSS patterns

These classes in `global.css` should be used before writing new styles:

**Page sections:**
- `.prod-hero` — dark navy hero with radial glow, back-link, h1, intro. Used by all 5 product detail pages.
- `.prod-section` / `.prod-section--stone` / `.prod-section--dark` — alternate content blocks with consistent padding and `.prod-section__header` subpattern.
- `.prod-cta` — horizontal dark CTA bar (title + sub + buttons). Used on every product and about page.

**Content components:**
- `.prod-features` — 3-col spec grid (label/value pairs); collapses to 2-col at 1024px, 1-col at 768px.
- `.prod-apps-grid` + `.prod-app-item` — 2-col dotted application list with gold dots.
- `.shade-section` + `.shade-grid` + `.shade-card` — responsive swatch grid (`auto-fill, minmax(160px, 1fr)`).
- `.dc-*` — designer carpet page system (gallery, alternating rows, scope band).
- `.about-pg-*` — about page system (hero, marquee, scale metrics, story split, ops, quality, gallery).

**Typography utilities:**
- `.eyebrow` + `.eyebrow--line` + `.eyebrow--inverse` — small-caps section labels.
- `.section-title` / `.section-title--inverse` — responsive display heading.

**Buttons:** `.btn--hero-primary`, `.btn--ghost-light`, `.btn--ghost-dark`, `.btn--whatsapp`, `.btn--whatsapp-primary`.

**Placeholder cards:** `.cat-card__img-wrap--blank` and `.prod-listing-card__img-wrap--blank` render a crosshatch textile weave pattern over a navy gradient when no image is available. Use for products with no photo yet.

## Image organisation

Production images served from `public/images/`:
```
hero/           — full-bleed hero backgrounds
catalogue/      — swatch shots (nw-*, ribbed-*, velour-*, lp-*, caution-*)
about/          — editorial event photography
projects/       — project card thumbnails
designer-carpet/ — designer carpet installation shots
contact/        — contact hero
```

Root-level folders (`Catalogue/`, `Exhibition Photos/`, `Aesthetic Bunch photos/`, `Dual carpet photos/`) are **raw source archives — not served**. Copy and rename files into `public/images/` before referencing them in code.

Swatch naming convention: `{type}-{colour-name}.jpg` (e.g. `ribbed-powder-blue.jpg`). Use `loading="lazy" decoding="async"` on all images below the fold; `loading="eager" fetchpriority="high"` on hero images.

## Quality benchmark

`src/pages/about.astro` is the benchmark for design and interaction quality. Before shipping changes to any other page, check them against the About page standard. Key patterns it establishes:
- Full-bleed cinematic hero with parallax, dot-grid overlay, scan-line animation, and watermark year
- Seamless dark-to-light section sequencing
- Stats integrated into the bottom of an image (`.about-pg-story__stats-strip`)
- Autoplay WIP installation video with poster fallback
- Gallery cursor spotlight via CSS custom properties (`--gal-x/y` set in JS)
- Scrollable venue cards with drag hint

## Contact

WhatsApp number `+91 99581 32189` is hardcoded in: `Navbar.astro`, `ContactCTA.astro`, and every product page CTA. Update all locations if it changes.

Contact emails: `sanchienterprises@yahoo.com` and `kanav@sanchienterprises.com` (in `Footer.astro` and `contact.astro`).

Deployed domain: `https://sanchienterprises.com` (set in `astro.config.mjs`).
