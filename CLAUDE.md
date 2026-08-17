# GISPL website

Static multi-page marketing site (vanilla HTML with inline styles). Shared `assets/css/site.css` and `assets/js/*`. Design system "Fusion": navy grounds (#07142B / #0A1A30 / #0B1E3B), orange accent #F26A21, faces Archivo (display), IBM Plex Sans (body/UI), IBM Plex Mono (labels/data). Loaded weights only: Archivo 500/600/700 (+italic 600/700), Plex Sans 400/500/600 (+italic 400), Plex Mono 400/500 — don't style with weights outside these.

## Two kinds of page

**Hand-maintained (11):** `index`, `services`, `service-vapt`, `service-ai-security`,
`vapt-methodology`, `sebi-cscrf`, `dpdp-readiness`, `industries`, `about`, `careers`, `contact`.
Edit these directly. They carry the hand-copied header/footer that
`scripts/check-header-sync.py` guards. Their internal links are **relative** (`insights/`, not
`/insights/`) so the site works served from a sub-path.

**Generated** — everything under `/insights/**` and `/careers/roles/**`, plus `sitemap.xml`,
`insights/rss.xml` and `assets/data/*.json`. These come from Markdown in `content/` via
`scripts/build-content.py` into a git-ignored `build/`. **Never hand-edit them** — edit the
Markdown. Generated pages get the shared header by extracting it from the hand-maintained pages
at build time (`lib/pageshell.donor_shell`), which refuses to build if those pages have drifted.

`article.html` and `job.html` are redirect stubs for the retired `?slug=` URLs, kept because a
CDN cannot redirect on a query string. `privacy`, `terms`, `404` and the stubs are exempt from
the header guard.

Content is **build-time only**: there is no client-side data layer. `assets/js/config.js`,
`admin.html` and `assets/data/{posts,jobs}.json` were deleted — the old localStorage provider
seeded content once per browser (`gispl:seeded:v1`), so a redeployed post never reached a
returning visitor.

Full build: `cd portal && npm run build` → `.venv/bin/python scripts/build-content.py` →
`python3 scripts/build-dist.py`. Serve `dist/`, not `build/` (only `dist/` has assets).

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
- Deploy: see the full build at the top. `build-dist.py` assembles `dist/` (hand-written pages
  + generated `build/` + `portal/`). After editing the shared header on the 11 hand-maintained
  pages, `python3 scripts/check-header-sync.py` must pass.
- The portal is served at `<site root>/portal/`. On a nested host (GitHub Pages serves this repo
  under `/Gispl_web/`) set `NEXT_PUBLIC_SITE_BASE_PATH=/Gispl_web` — `portal/next.config.ts` and
  `portal/src/lib/paths.ts` both read it and **must stay in step**; a mismatch silently 404s
  assets that `asset()` builds while `next/link` URLs keep working.

## Build scripts (`scripts/`)

`scripts/lib/` holds shared helpers. `lib/pageshell.py` owns the single definition of the shared
header/footer (the active-nav style pair, the skip list, the normalizer) — `check-header-sync.py`
imports it so the guard and any future builder cannot disagree about what a correct header is.
Content-pipeline deps are pinned in `requirements.txt` (`python3 -m venv .venv && .venv/bin/pip
install -r requirements.txt`); the shipped site itself has zero runtime dependencies.

**The external `shell.py` / `pages.py` builders are gone.** They used to re-emit `index.html`,
`careers.html` and `services.html` from a session scratchpad outside the repo, and older notes
warn about them clobbering hand-edits. Verified 2026-08-17: they no longer exist on disk. Those
three pages — and all 11 hand-maintained pages — are edited directly.
