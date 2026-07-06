# GISPL website

Static multi-page marketing site (vanilla HTML with inline styles). Shared `assets/css/site.css` and `assets/js/*`. Design system "Fusion": navy grounds (#07142B / #0A1A30 / #0B1E3B), orange accent #F26A21, faces Newsreader (serif display), IBM Plex Sans (body/UI), IBM Plex Mono (labels/data).

## Typography conventions

**Eyebrow / kicker text** — the small mono, uppercase, letter-spaced label, e.g.
`font:500 12px 'IBM Plex Mono';letter-spacing:.18em;color:#F26A21`.
The name for this style is an **eyebrow** (also called a *kicker* or *overline*).

- ✅ Use it ONLY for genuinely small, secondary meta: reading time ("7 min read"), post dates, category/tag labels, card badges, breadcrumb-level captions.
- ❌ Do NOT use it as a section eyebrow sitting above a heading (e.g. "CAPABILITIES", "INSIGHTS", "OVERVIEW", "METHODOLOGY", "WHAT'S INCLUDED"). Let the heading carry the section on its own; a stack of tiny orange caps above every `<h2>` reads as clutter, not hierarchy.

When a section needs a label, prefer a real heading hierarchy over an eyebrow. Reserve the eyebrow treatment for the small stuff.
