/** Prefix a public/ asset path with the configured basePath.
    next/link and next/image do this automatically; plain hrefs and
    CSS url()s do not — always route static assets through here.

    This MUST stay in step with `basePath` in next.config.ts. Both derive from
    NEXT_PUBLIC_SITE_BASE_PATH so a nested deploy (GitHub Pages serves this repo
    under /Gispl_web/) can't leave one prefixed and the other not. */
const SITE_PREFIX = (process.env.NEXT_PUBLIC_SITE_BASE_PATH || "").replace(/\/+$/, "");
const BASE = `${SITE_PREFIX}/portal`;

export function asset(p: string): string {
  return BASE + (p.startsWith("/") ? p : "/" + p);
}
