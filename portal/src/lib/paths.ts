/** Prefix a public/ asset path with the configured basePath.
    next/link and next/image do this automatically; plain hrefs and
    CSS url()s do not — always route static assets through here. */
const BASE = "/portal";

export function asset(p: string): string {
  return BASE + (p.startsWith("/") ? p : "/" + p);
}
