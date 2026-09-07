/* Per-IP, per-route rate limiting.

   The counter key is an HMAC of the address, not the address itself, so the
   rate-limit partition of the table never becomes a log of who visited the
   site. The raw IP is kept only inside a consent record, where it is evidence
   the person actually gave consent.

   Failure policy is FAIL-OPEN: if the counter store is unavailable, the
   submission is accepted. Losing a real proposal request is a worse outcome
   than admitting spam during an outage, and the honeypot plus timing checks
   still apply. */

import { createHmac } from "node:crypto";
import { config } from "./config.js";

function keyFor(route, ip) {
  const h = createHmac("sha256", config.secret).update(String(ip || "unknown")).digest("hex").slice(0, 32);
  return `${route}:${h}`;
}

/**
 * Returns { limited, hits, retryAfter }. `retryAfter` is seconds until the
 * current window closes, suitable for a Retry-After header.
 */
export async function checkRate(store, route, ip) {
  const { windowSeconds, max } = config.rateLimit;
  if (!max) return { limited: false, hits: 0, retryAfter: 0 };

  let hits;
  try {
    hits = await store.bumpRate(keyFor(route, ip), windowSeconds);
  } catch (err) {
    console.error("rate-limit store unavailable, allowing request", err);
    return { limited: false, hits: 0, retryAfter: 0 };
  }

  const now = Math.floor(Date.now() / 1000);
  const retryAfter = windowSeconds - (now % windowSeconds);
  return { limited: hits > max, hits, retryAfter };
}
