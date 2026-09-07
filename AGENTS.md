# GISPL website

Static multi-page marketing site (vanilla HTML with inline styles). Shared `assets/css/site.css` and `assets/js/*`. Design system "Fusion": navy grounds (#07142B / #0A1A30 / #0B1E3B), orange accent #F26A21, faces Archivo (display), IBM Plex Sans (body/UI), IBM Plex Mono (labels/data). Loaded weights only: Archivo 500/600/700 (+italic 600/700), Plex Sans 400/500/600 (+italic 400), Plex Mono 400/500 — don't style with weights outside these.

## Typography conventions

**Eyebrow / kicker text** — the small mono, uppercase, letter-spaced label, e.g.
`font:500 12px 'IBM Plex Mono';letter-spacing:.18em;color:#F26A21`.
The name for this style is an **eyebrow** (also called a *kicker* or *overline*).

- ✅ Use it ONLY for genuinely small, secondary meta: reading time ("7 min read"), post dates, category/tag labels, card badges, breadcrumb-level captions.
- ❌ Do NOT use it as a section eyebrow sitting above a heading (e.g. "CAPABILITIES", "INSIGHTS", "OVERVIEW", "METHODOLOGY", "WHAT'S INCLUDED"). Let the heading carry the section on its own; a stack of tiny orange caps above every `<h2>` reads as clutter, not hierarchy.

When a section needs a label, prefer a real heading hierarchy over an eyebrow. Reserve the eyebrow treatment for the small stuff.

## Client portal (`portal/`)

A separate **Next.js 15 + TypeScript + Tailwind v4** app (App Router, static export) served at
`/portal/` — the "My GISPL" client portal (dashboard · engagements · findings · documents). It is
independent of the vanilla-HTML site: its own build, its own `<head>`, linked from the header
utility bar ("Client Login" → `portal/`). Ships in **demo mode** (fictional Meridian First Bank
data in localStorage) with an AWS seam (Cognito + API) that flips via env vars — see
`portal/README.md`.

- Fusion tokens are **duplicated** in `portal/src/app/globals.css` (`@theme`). Never import
  `assets/css/site.css` into the portal (preflight/global-selector bleed); a palette change must
  touch both files.
- `next/font` bundles italic 500/600 Plex Sans that the site doesn't load — **don't style with
  those weights** or it faux-renders on the main site.
- Deploy: `cd portal && npm run build` then `python3 scripts/build-dist.py` assembles `dist/`
  (site + `portal/`, excludes `admin.html`). After editing the shared header on the 15 public
  pages, `python3 scripts/check-header-sync.py` must pass.
