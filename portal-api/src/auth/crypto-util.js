/* Auth crypto using only Node built-ins — no external dependencies.
   Passwords: scrypt with per-user salt. Sessions: HS256 JWT. */

import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "node:crypto";

/* ---------------- passwords ---------------- */

export function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(String(plain), salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  try {
    const [scheme, salt, hash] = String(stored).split("$");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const got = scryptSync(String(plain), salt, 64);
    const want = Buffer.from(hash, "hex");
    return got.length === want.length && timingSafeEqual(got, want);
  } catch {
    return false;
  }
}

/* ---------------- HS256 JWT ---------------- */

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlJSON(obj) {
  return b64url(JSON.stringify(obj));
}
function fromB64url(s) {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export function signJWT(payload, secret, ttlSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + ttlSeconds };
  const head = { alg: "HS256", typ: "JWT" };
  const signing = `${b64urlJSON(head)}.${b64urlJSON(body)}`;
  const sig = b64url(createHmac("sha256", secret).update(signing).digest());
  return `${signing}.${sig}`;
}

/** Returns the payload if valid+unexpired, else null. Constant-time sig check. */
export function verifyJWT(token, secret) {
  try {
    const parts = String(token).split(".");
    if (parts.length !== 3) return null;
    const signing = `${parts[0]}.${parts[1]}`;
    const expected = createHmac("sha256", secret).update(signing).digest();
    const given = fromB64url(parts[2]);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const payload = JSON.parse(fromB64url(parts[1]).toString("utf8"));
    if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
