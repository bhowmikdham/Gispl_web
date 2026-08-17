# GISPL website audit — 2026-07-11

Full-site scan: all 16 pages + admin, all 14 JS files, shared CSS, data files, images, repo hygiene.
Method: every file read line-by-line (4 parallel auditors + cross-page mechanical checks); the
high-severity findings below were independently re-verified. Fix plan = workstreams P0–P6.

Legend: severity ▲ high · ● medium · ○ low

**Progress 2026-07-12 (round 2):** P2 done except domain-blocked items — added favicon.svg + link tags, theme-color, og:title/description/type/site_name + twitter:card on all 15 public pages (canonical, og:url/og:image and sitemap.xml still NEED THE PRODUCTION DOMAIN); robots.txt (admin disallowed), 404.html, privacy.html + terms.html drafts (marked for counsel review — grievance-officer name/address are placeholders) with footer legal links sitewide; images recompressed under 256 KiB; 12 MB source PNGs + .DS_Store untracked (staged deletions, files remain on disk); logo width/height everywhere. P4 done — mega-menus, hero tabs and admin modals keyboard-operable, skip links on all pages, burger/search ARIA, apply-form labels associated, assistant gets aria-live log + focus return (left non-modal by design, no focus trap), admin login submits on Enter + page h1, reduced-motion covers hero crossfade, assistant footnote contrast raised. P5 done — globe runs on rAF and pauses off-screen/hidden + DPR-aware, hero slides 2-4 lazy-load (~700 KB deferred) and the carousel pauses when the tab is hidden, insights/article guard a missing data layer and reuse the not-found state, DPDP math unified (IST whole-days everywhere, past-deadline text), config.js on all pages so site search is consistent, roles sorted newest-first with fixed careers location options, admin modals close on Escape + data:-validated résumé link, assistant CTA href sanitized + esc hardened. P6 — .gitignore added, clean worktree removed (quizzical-kepler KEPT: it has an uncommitted about.html edit worth reviewing), scripts/check-header-sync.py guards future header drift; baseline commit still awaits user go-ahead. Deliberately skipped (noted): admin note-add modal state loss, assistant nudge session policy / FAB reveal threshold / z-index (design decisions), about.html nested wrappers.

**Progress 2026-07-11 (round 1):** P0 complete (contact + newsletter now hand off to a composed
mailto:info@gisconsulting.in — interim until the AWS backend; apply flow surfaces CV-drop failures and
no longer claims emails were sent; all dead CTAs are real links; Client Login/LinkedIn removed
pending real destinations; roles links + article nav unified). P1 partially done (spec labels
removed, CERT-IN/24×7 casing unified — names/images decision still open). P3 done (faux weights
normalized, fonts URL trimmed+unified with italic 600 Archivo + italic 400 Plex Sans added,
mandatory eyebrow removals, residue cleaned, CLAUDE.md/site.css refreshed; about.html's
redundant nested heading wrappers left as-is — harmless; eyebrow edge cases awaiting decision).
Verified: node --check on all changed JS, tag balance on all 16 pages, zero leftover patterns,
all links resolve.

---

## P0 — Broken user-facing functionality (fix first)

**Every lead-generation path on the site is currently dead or fake:**

- [x] ▲ **Contact/RFP form fakes success** — `assets/js/contact.js:16-28`: validates, then does
  nothing (`/* real submission goes here once the backend lands */`) and always shows
  "request received". Every proposal enquiry is silently discarded. Interim fix options: mailto
  handoff, a form service, or honest copy + prominent email/phone. (AWS backend is deferred.)
- [x] ▲ **Home primary CTA dead** — `index.html:326` `#proposal` "Request a proposal →" is a
  `<div cursor:pointer>` with no href/handler. Make it `<a href="contact.html">`.
- [x] ● **All 6 home service cards dead** — `index.html:264-269` "Explore →" footers are divs;
  nothing on the card is clickable. Link: VAPT→service-vapt.html, others→services.html (anchors).
- [x] ● **Newsletter signup is a dummy** — `insights.html` (~line 129): `onsubmit="return false"`,
  input lacks `type="email"`/name/label. Wire it or remove it.
- [x] ● **Apply flow silently loses CVs** — `assets/js/config.js:223-229` (STORAGE_FULL drops
  résumé bytes but resolves success) and `:236` (FileReader error → application stored with no
  CV, still success). Surface a warning state to the candidate in both cases.
- [x] ● **Apply-flow copy lies** — `job.html:172` says "max 5MB" but cap is 2MB
  (`config.js:30`); `job.html:182` success copy claims "emailed you a confirmation" but local
  mode sends nothing (and seeds `emailSent:true`, so admin shows "· emailed" for unsent mail).
- [x] ● **"Client Login" + "LinkedIn" dead on all 15 pages** — header spans (`index.html:23-24`
  and equivalents) with cursor:pointer, no href/handler. Link them or drop them.
- [x] ○ **Home insights section dead** — `index.html:280` "All insights →" and `:293`
  "Read article →" are spans; featured headline unlinked. Link to insights.html /
  article.html?slug=… (titles appear to match posts.json seeds).
- [x] ○ **Header drift: careers menu target** — most pages link `careers.html#roles`, but
  vapt-methodology/article/job/roles link `roles.html`. Pick one (recommend roles.html, the
  dedicated page) and sync all headers.
- [x] ○ **article.html wrong active-nav** — `article.html:70-73` highlights Careers instead of
  Insights.

## P1 — Content integrity / trust

- [x] ● **Placeholder frame labels ship to users** — visible spec text inside gradient stand-in
  boxes: "IMAGE 16:9" (industries ×5, insights cards + `insights.js:18` emits it, home featured),
  "IMAGE 4:3" (`service-vapt.html:129`), "PHOTO 16:10" ×3 + "TEAM PHOTO 4:5" + "PORTRAIT 3:4"
  (`careers.html:189,202,215,257,275`), "TEAM PHOTO 4:3" + "PORTRAIT 3:4" ×4 (about leadership).
  Either drop in real images or restyle the frames so no spec label is visible.
- [ ] ● **DECISION NEEDED — are these real people?** about.html leadership (Rajesh Kumar CEO,
  Aisha Rahman CISO, Vikram Nair, Meera Iyer) and careers testimonial (Priya Sharma) all have
  placeholder portraits. If dummy names → replace before launch.
- [x] ○ Brand casing drift: `sebi-cscrf.html` uses "CERT-In" (title/meta/hero ×4) vs "CERT-IN"
  everywhere else; "24/7" (services, vapt) vs "24×7" (menu, service-ai-security) for same claim.

## P2 — Launch / SEO / deploy hygiene (all systematic, all pages)

- [x] ● No favicon (no file, no link tags) — browser 404s and blank tab icons.
- [ ] ● No canonical URLs, no Open Graph / Twitter meta on any page (title+description exist).
  Needs a production domain decision to write canonicals.
- [x] ● No robots.txt, no sitemap.xml, no 404.html.
- [x] ● **No privacy policy or terms pages** — footer has no legal links. For a firm selling
  DPDP readiness this is a real credibility gap.
- [x] ● **admin.html ships publicly** — not linked anywhere but guessable; dev login accepts
  any credentials (`admin.js:59-62` ignores the password field entirely). Data is per-browser
  localStorage so nothing leaks, but: add noindex, exclude from deploy, keep the "Development
  mode" notice until Cognito lands.
- [x] ● Images over the 256 KiB budget: `hero-city.jpg` 373 KB, `assessment-boardroom.jpg` 278 KB.
- [x] ● `assets/images/source/` = 12 MB of AI-source PNGs tracked in git and deployed. Remove
  from repo (or at least exclude from deploy); add `.gitignore` (also `.DS_Store` ×2 tracked).
- [x] ○ Logo `<img>` has no width/height (CLS) on 15 pages ×2 (header+footer).

## P3 — Typography & design system

- [x] ● **Faux font renders** (weight/style used but not loaded):
  - IBM Plex Sans 700 — index.html:280 area, insights.html, service-vapt.html, services.html (1 each)
  - IBM Plex Mono 600 — `job.html:152,156`; `admin.js:263,264,266`
  - Archivo italic at weight 600 — `industries.html:129`, `careers.html:278` (only italic-700 loads)
  - Article body `*italic*`/`**bold**` (`article.js:8-13`) — Plex Sans loads no italic/700
  Fix by loading the weights or normalizing usage (recommend: normalize to loaded weights).
- [x] ○ Archivo 800 loaded on all 16 pages, used nowhere — trim from the fonts URL.
- [x] ○ admin.html loads a different fonts URL variant than the other 15 pages — unify.
- [x] ● **Eyebrow-rule sweep (CLAUDE.md)** — remaining label-above-heading instances:
  - Mega-menu "CAPABILITIES" (:41) and "CAREERS AT GISPL" (:78) above `<h3>`s — CLAUDE.md's
    literal forbidden examples; recurs in the duplicated header on all 15 pages.
  - contact.html "ACTIVE INCIDENT · 24×7" above `<h2>`.
  - industries.html "CROSS-SECTOR" above a heading styled as `<p>` (also fix the semantics).
  - DECISION: hero-slide kickers (index ×4), footer column labels, card kickers
    (careers LEARN/BALANCE/…, path cards), category tags above dynamic `<h1>`s
    (`article.html #artCat`, `job.html #jobTeam`) — defensible as meta/tags; recommend keeping.
- [x] ○ **Stale design docs after Newsreader→Archivo migration**: CLAUDE.md still says
  "Newsreader (serif display)"; `site.css:1-4` header comment says "Newsreader (serif accents)"
  and "Used by index.html (home) and careers.html" (it's sitewide now). Update both.
- [x] ○ Eyebrow-removal residue: blank lines before headings — careers.html:138,179,231,267,308,
  326,340,365; index.html:323; roles.html:149; redundant nested wrappers in about.html; stray
  trailing space in `class="sv-card sv-rv "` (services.html ×6).

## P4 — Accessibility

- [x] ● **Mega-menus unusable by keyboard** — Services/Careers triggers are non-focusable
  `<span>`s (index.html:36,73 + all pages); site.js wires click only. Make them buttons/links
  with tabindex + Enter/Space handling (Industries works because its trigger is an `<a>`).
- [x] ● Hero carousel tabs keyboard-inaccessible, no role/aria-selected (`index.html:232`,
  `home.js:31-33`).
- [x] ● Assistant widget (`assistant.js`): dialog lacks aria-modal + focus trap (:181), focus
  not returned to FAB on close (:270-278), chat log has no aria-live (:192).
- [x] ○ Burger button: icon-only, no aria-label/aria-expanded (all 15 pages). Desktop
  `#navSearch` input: placeholder only, no aria-label.
- [x] ○ Apply-form labels not associated (no for/id): `job.html:166-174`; same in admin forms.
- [x] ○ Admin modals: no Escape close, no focus trap/restore (`admin.js:41-47`); login inputs
  not in a `<form>` so Enter doesn't submit (:56-58); page has no `<h1>`.
- [x] ○ insights.html heading skip (h1→h3); industries heading-as-`<p>`; no skip-to-content
  link sitewide; `.gx-ai-note` 9px text at rgba(255,255,255,.28) is unreadably low-contrast.
- [x] ○ Reduced-motion: hero manual-click crossfade + globe ignore prefers-reduced-motion
  (auto-advance already respects it).

## P5 — Performance & JS robustness

- [x] ● Globe canvas (`home.js:104`): 30 fps setInterval runs forever — never paused on tab
  blur or off-screen, sorts+draws 264 dots continuously. Switch to rAF + IntersectionObserver/
  visibilitychange pause. Also no DPR/resize handling (:71-74) → blurry after monitor moves.
- [x] ○ All 4 hero slide images load eagerly (~1.1 MB); slides 2-4 could lazy-load.
- [x] ○ Data-layer guards: `insights.js:44` stuck on "Loading articles…" and `article.js:4`
  throws if config.js fails; article error state never uses the #artNotFound block (:37-40).
- [x] ○ DPDP deadline math drift: `services.js:47` (Math.ceil, incl. time) vs `dpdp.js:10`
  (Math.round, IST-midnight) vs `home.js:58` fallback — same date can show ±1 day across pages;
  services' span goes blank once past. Single-source the constant + math (dates: mandate
  2026-11-13, enforcement 2027-05-13 — currently correct, 125 days out).
- [x] ○ Search inconsistency: 9 pages don't load config.js, so site search there lacks
  Role/Insight results (about, industries, contact, dpdp, sebi, both service pages, services,
  index). Add config.js everywhere (it's localStorage-cheap) or lazy-load in site.js.
- [x] ○ roles.js: no explicit sort (:62-63) — order is seed-order by luck; careers hero offers
  "Maryland" (0 roles → always empty) and "Remote" doesn't match the "Remote · India" dropdown
  option (careers.html:157-158 vs roles.js:52).
- [x] ○ admin.js: adding a note re-renders the modal and discards in-progress stage-move edits
  (:289); `resumeDataUrl` interpolated into href unescaped (:240); `isSignedIn()` ternary has
  identical branches (`config.js:306`).
- [x] ○ assistant.js: latent href-injection if `GISPL_BOT_ENDPOINT` is ever configured
  (:234,249 — escape/validate ctaHref); local esc() skips quotes (:16); nudge re-fires every
  new tab (sessionStorage) and one page's nudge suppresses all others (:306-310); FAB never
  reveals on index if user doesn't scroll >420px (:298); FAB z-index (80) sits above the open
  mobile menu; scroll listener removed without matching options arg (:296/:299).
- [x] ○ Hero auto-advance interval never cleared and tick-based → drifts in background tabs
  (`home.js:39-45`).

## P6 — Repo & maintenance

- [ ] **Commit the in-flight Archivo migration first** (17 modified files) so fixes land on a
  clean baseline.
- [x] Stale worktrees: `.claude/worktrees/elastic-williamson-d6914a` and
  `quizzical-kepler-99d3b3` are full site copies — remove (`git worktree remove`).
- [x] Add `.gitignore` (`.DS_Store`, worktrees); untrack the 2 committed `.DS_Store` files.
- [x] **Header duplication strategy**: the ~100-line header is hand-copied into 15 pages and
  has already drifted (9 variants: active-state per page is intended, roles-link + font drift
  is not). Options: (a) tiny build/sync script that stamps the shared header per page,
  (b) JS-injected header, (c) keep manual + document the rule. Recommend (a).

---

## Decisions needed (can't be made from the code)

1. Contact form + newsletter: what should they do until the AWS backend lands?
2. Leadership/testimonial names on about/careers — real or placeholders?
3. Real images available for the placeholder frames? (Or restyle frames label-free.)
4. LinkedIn URL and "Client Login" destination — or remove both?
5. Production domain (needed for canonical/OG/sitemap).
6. Eyebrow policy edge cases: hero-slide kickers, footer column labels, card tags — keep as
   "small meta" (recommended) or purge?

## Verified clean (no action)

All internal links + in-page anchors resolve · footer identical on all 15 pages · no duplicate
IDs · XSS: all public render paths escape via GISPL.util.esc (admin included, one low-risk href
noted above) · jobs.json/posts.json internally consistent (12 published jobs — live-counted, not
hard-coded; 9 posts, slugs/dates/categories align) · DPDP dates future-proof with past-date
guards (home) · SEBI "deadline has passed" copy is correct for 2026-07-11 · double-submit
protection + confirm() on admin deletes · services capability counts reconcile with the menu
taxonomy (39) · company facts consistent sitewide (15+ years, 200+ engagements, 120+
specialists, 4 offices).
