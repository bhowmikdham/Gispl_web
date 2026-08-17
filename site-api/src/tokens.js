/* HMAC-signed, self-contained links — the double opt-in confirmation and the
   one-click unsubscribe. Node built-ins only, no JWT library.

   These are capability tokens sent to an inbox, so they carry a purpose and
   are verified against it: a confirmation link can never be replayed as an
   unsubscribe, and vice versa. Rotating SITE_SECRET invalidates every link
   already in someone's inbox — including unsubscribe links, which is why the
   unsubscribe endpoint also accepts a plain email + address confirmation. */

import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "./config.js";

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s) {
  return Buffer.from(String(s).replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

/** ttlSeconds of 0 (or omitted) mints a token that does not expire. */
export function signToken(purpose, data, ttlSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { p: purpose, ...data, iat: now };
  if (ttlSeconds) payload.exp = now + ttlSeconds;
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac("sha256", config.secret).update(body).digest());
  return `${body}.${sig}`;
}

/** Returns the payload when the signature, purpose and expiry all check out. */
export function verifyToken(token, purpose) {
  try {
    const [body, sig] = String(token).split(".");
    if (!body || !sig) return null;
    const expected = createHmac("sha256", config.secret).update(body).digest();
    const given = fromB64url(sig);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const payload = JSON.parse(fromB64url(body).toString("utf8"));
    if (payload.p !== purpose) return null;
    if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export const PURPOSE = {
  CONFIRM: "subscribe-confirm",
  UNSUBSCRIBE: "unsubscribe",
};

/** Absolute link a subscriber clicks in their inbox. */
export function confirmLink(email) {
  const t = signToken(PURPOSE.CONFIRM, { e: email }, 7 * 24 * 3600);
  return `${config.apiBase}/v1/subscribe/confirm?token=${encodeURIComponent(t)}`;
}

export function unsubscribeLink(email) {
  const t = signToken(PURPOSE.UNSUBSCRIBE, { e: email }, 0);
  return `${config.apiBase}/v1/unsubscribe?token=${encodeURIComponent(t)}`;
}
