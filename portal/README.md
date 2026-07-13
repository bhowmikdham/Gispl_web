# GISPL Client Portal

A "My EY"-style client portal (dashboard · engagements · findings · documents) for GISPL,
served at **`/portal/`** beside the vanilla-HTML marketing site.

Built with **Next.js 15 (App Router) + TypeScript + Tailwind v4**, exported as **static files**
(`output: 'export'`) — no Node server runs in production. Ships in **demo mode** (fictional client
data in `localStorage`) with a clean seam to a future **AWS backend** (Cognito Hosted UI + API
Gateway/Lambda/DynamoDB/S3) that flips on with env vars and a rebuild — no UI changes.

## Develop

```bash
cd portal
npm install
npm run dev        # http://localhost:3000/portal/
```

Demo credentials (shown on the login screen):
`priya.nair@meridianfirst.example` / `GisplDemo!2026`.
Meridian First Bank Ltd. is a **fictional** organisation; all data is invented.

## Build & deploy

```bash
cd portal && npm run build         # → portal/out/ (static export)
cd ..     && python3 scripts/build-dist.py   # → dist/ (site + portal/, excludes admin.html)
python3 -m http.server 8080 -d dist          # preview the whole site at http://localhost:8080/
```

`dist/` is the deployable tree. Later: `aws s3 sync dist/ s3://<bucket>/ --delete`.

## Checks

```bash
npm run lint
npm run typecheck        # tsc --noEmit
```

## Flip to the AWS backend (later)

The portal reads its mode from build-time env vars (`src/lib/config.ts`). Set these and rebuild:

```bash
NEXT_PUBLIC_PORTAL_MODE=api
NEXT_PUBLIC_API_BASE=https://api.gispl.com
NEXT_PUBLIC_COGNITO_DOMAIN=<pool>.auth.<region>.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=<app-client-id>
```

- `src/lib/providers/index.ts` is the *only* file that branches on mode; pages call
  `getData()`/`getAuth()` and never know which backend is live.
- `providers/api.ts` already implements the REST calls and the Cognito Hosted UI **PKCE** flow
  (verifier/challenge via WebCrypto, `/portal/callback/` exchanges the code, refresh-aware token).
  Backend endpoints to implement mirror the `DataProvider` interface (`/portal/engagements`,
  `/portal/findings`, `/portal/documents`, presigned `.../url`).
- Cognito app-client callback URL must be `https://<domain>/portal/callback/`.

## Notes / gotchas

- **basePath**: `next/link`/`next/image` auto-prefix `/portal`; plain asset hrefs go through
  `src/lib/paths.ts::asset()`. After a build, `out/` must contain **no** root-absolute `/_next`
  paths (all should be `/portal/_next/...`).
- **Static-export routing**: `trailingSlash: true`, so every route is `.../index.html` and deep
  links/refreshes work on a dumb file host. On S3+CloudFront, add a viewer-request function that
  rewrites `/portal/foo/` → `/portal/foo/index.html` (S3 *website* endpoints do this natively).
- **Hydration**: `localStorage`/session are read only inside `useEffect` (never during render);
  dates are formatted with a fixed `en-IN`/UTC formatter so build-time HTML matches the client.
- **Fonts**: self-hosted via `next/font` (no Google CDN request). `next/font` can't express the
  site's asymmetric weight sets, so italic 500/600 Plex Sans is bundled but **must not be used**
  (it would faux-render on the main site). Keep to Archivo 500/600/700 + italic 600/700,
  Plex Sans 400/500/600 + italic 400, Plex Mono 400/500.
- **Fusion tokens** live in `src/app/globals.css` (`@theme`), duplicated from the site's
  `assets/css/site.css` on purpose — **never import site.css here** (Tailwind preflight and the
  site's global selectors would interbleed). A palette change must touch both files.
- **Demo seed**: editing `src/lib/seed/seed-data.ts` requires bumping the `gispl:portal:seeded:v1`
  sentinel in `src/lib/providers/local.ts`, or returning browsers keep the stale demo.
- **CSP**: the exported HTML includes Next's inline bootstrap scripts; a strict CloudFront CSP
  needs `script-src 'self'` + hashes (or `'unsafe-inline'`). Fonts/assets are all same-origin.
- **noindex**: set in `src/app/layout.tsx` metadata *and* `robots.txt` (`Disallow: /portal/`).
