/* Auth service: password login → our own HS256 JWT (works everywhere,
   testable locally). Optional Cognito verification when AUTH_MODE=cognito. */

import { config } from "../config.js";
import { verifyPassword, signJWT, verifyJWT, hashPassword } from "./crypto-util.js";
import { verifyCognitoToken } from "./cognito-verify.js";

// A throwaway hash so an unknown email still pays the scrypt cost — removes the
// timing side-channel that would otherwise let attackers enumerate valid emails.
const DUMMY_HASH = hashPassword("gispl-dummy-not-a-real-password");

export async function login(store, email, password) {
  const user = await store.getUserByEmail(email);
  const ok = verifyPassword(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) return null;
  const client = await store.getClient(user.clientId);
  const claims = {
    sub: user.email,
    email: user.email,
    name: user.name,
    clientId: user.clientId,
    clientName: client ? client.name : "",
  };
  const token = signJWT(claims, config.jwtSecret, config.tokenTtlSeconds);
  return { token, expiresIn: config.tokenTtlSeconds, user: { email: user.email, name: user.name, clientId: user.clientId, clientName: claims.clientName } };
}

/** Verify a bearer token → claims, or null. */
export async function authenticate(token) {
  if (!token) return null;
  if (config.authMode === "cognito") {
    return verifyCognitoToken(token);
  }
  return verifyJWT(token, config.jwtSecret);
}

export function bearerFrom(headers) {
  const h = headers["authorization"] || headers["Authorization"] || "";
  const m = /^Bearer\s+(.+)$/i.exec(String(h));
  return m ? m[1].trim() : null;
}
