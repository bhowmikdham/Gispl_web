/* Optional Cognito access/ID token verification (RS256 via the pool JWKS),
   using only Node built-ins (global fetch + crypto). Enabled when
   AUTH_MODE=cognito. Cognito tokens must carry a custom clientId claim
   (custom:clientId) mapping the user to their GISPL client tenant. */

import { createPublicKey, createVerify } from "node:crypto";
import { config } from "../config.js";

let jwksCache = { keys: null, at: 0 };

function b64urlToBuf(s) {
  return Buffer.from(String(s).replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

async function getJwks() {
  const fresh = jwksCache.keys && Date.now() - jwksCache.at < 3600_000;
  if (fresh) return jwksCache.keys;
  const url = `https://cognito-idp.${config.cognito.region}.amazonaws.com/${config.cognito.userPoolId}/.well-known/jwks.json`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("JWKS fetch failed: " + r.status);
  const body = await r.json();
  jwksCache = { keys: body.keys, at: Date.now() };
  return body.keys;
}

export async function verifyCognitoToken(token) {
  try {
    const [h, p, s] = String(token).split(".");
    if (!h || !p || !s) return null;
    const header = JSON.parse(b64urlToBuf(h).toString("utf8"));
    const payload = JSON.parse(b64urlToBuf(p).toString("utf8"));
    if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) return null;
    // audience binding: ID tokens carry `aud`, access tokens carry `client_id`.
    // Require a match when a client id is configured (reject if neither is present).
    if (config.cognito.clientId) {
      const aud = payload.aud || payload.client_id;
      if (aud !== config.cognito.clientId) return null;
    }
    // issuer must be this exact user pool
    const iss = `https://cognito-idp.${config.cognito.region}.amazonaws.com/${config.cognito.userPoolId}`;
    if (payload.iss && payload.iss !== iss) return null;
    if (payload.token_use && payload.token_use !== "access" && payload.token_use !== "id") return null;

    const jwk = (await getJwks()).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const pub = createPublicKey({ key: jwk, format: "jwk" });
    const v = createVerify("RSA-SHA256");
    v.update(`${h}.${p}`);
    v.end();
    if (!v.verify(pub, b64urlToBuf(s))) return null;

    return {
      sub: payload.sub,
      email: payload.email || payload.username || "",
      name: payload.name || payload.email || "",
      clientId: payload["custom:clientId"] || "",
      clientName: payload["custom:clientName"] || "",
    };
  } catch {
    return null;
  }
}
