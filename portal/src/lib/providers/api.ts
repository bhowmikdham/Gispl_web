/* ApiProvider + CognitoAuthProvider — compiling skeletons for API mode.
   Inert while MODE:"local"; when the AWS backend lands, set
   NEXT_PUBLIC_PORTAL_MODE=api plus the Cognito/API env vars and rebuild.
   No page code changes — the same contract as the site's config.js. */

import { config } from "../config";
import { clearSession, readSession, writeSession } from "../auth/session";
import type { Client, DocumentItem, Engagement, Finding, Session } from "../types";
import type { AuthProvider, DataProvider, FindingFilter } from "./types";

async function authedFetch<T>(path: string): Promise<T> {
  const token = await apiAuth.getAccessToken();
  const r = await fetch(config.API_BASE + path, {
    headers: { Accept: "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
  });
  if (!r.ok) throw new Error(path + " → " + r.status);
  return r.json() as Promise<T>;
}

function qs(params: Record<string, string | undefined>): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && p.set(k, v));
  const s = p.toString();
  return s ? "?" + s : "";
}

export const apiData: DataProvider = {
  ready: () => Promise.resolve(),
  getClient: () => authedFetch<Client>("/portal/client"),
  listEngagements: () => authedFetch<Engagement[]>("/portal/engagements"),
  getEngagement: (idOrSlug) => authedFetch<Engagement>("/portal/engagements/" + encodeURIComponent(idOrSlug)),
  listFindings: (f?: FindingFilter) =>
    authedFetch<Finding[]>(
      "/portal/findings" + qs({ engagement: f?.engagementId, severity: f?.severity, status: f?.status, q: f?.q })
    ),
  getFinding: (id) => authedFetch<Finding>("/portal/findings/" + encodeURIComponent(id)),
  listDocuments: (f) =>
    authedFetch<DocumentItem[]>("/portal/documents" + qs({ engagement: f?.engagementId, type: f?.type })),
  getDocumentUrl: (id) =>
    authedFetch<{ url: string; demo: boolean }>("/portal/documents/" + encodeURIComponent(id) + "/url"),
  resetDemo: () => Promise.resolve(),
};

/* --- Cognito Hosted UI, PKCE (public client, no secret) --- */

const VERIFIER_KEY = "gispl:portal:pkce-verifier";

function b64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function pkcePair(): Promise<{ verifier: string; challenge: string }> {
  const verifier = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: b64url(new Uint8Array(digest)) };
}

function redirectUri(): string {
  return location.origin + config.COGNITO.redirectPath;
}

export const apiAuth: AuthProvider = {
  getSession: readSession,
  /* Primary API auth: email + password → our backend issues a JWT. Works
     everywhere and keeps the same login form as demo mode. (For enterprise
     SSO, swap the backend to AUTH_MODE=cognito and use beginHostedUiLogin.) */
  async signIn(email: string, password: string) {
    const r = await fetch(config.API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (r.status === 401) throw new Error("Incorrect email or password.");
    if (!r.ok) throw new Error("Sign-in failed (" + r.status + "). Please try again.");
    const t = (await r.json()) as { token: string; expiresIn: number; user: { email: string; name: string; clientId: string; clientName: string } };
    const now = Date.now();
    const expiresAt = new Date(now + t.expiresIn * 1000).toISOString();
    const s: Session = {
      mode: "api",
      email: t.user.email,
      name: t.user.name,
      clientId: t.user.clientId,
      clientName: t.user.clientName,
      issuedAt: new Date(now).toISOString(),
      expiresAt,
      tokens: { accessToken: t.token, idToken: t.token, expiresAt },
    };
    writeSession(s);
    return s;
  },
  beginHostedUiLogin(next?: string) {
    void pkcePair().then(({ verifier, challenge }) => {
      sessionStorage.setItem(VERIFIER_KEY, verifier);
      if (next) sessionStorage.setItem("gispl:portal:next", next);
      const p = new URLSearchParams({
        response_type: "code",
        client_id: config.COGNITO.clientId,
        redirect_uri: redirectUri(),
        scope: "openid email profile",
        code_challenge_method: "S256",
        code_challenge: challenge,
      });
      location.href = "https://" + config.COGNITO.domain + "/oauth2/authorize?" + p;
    });
  },
  async completeHostedUiLogin(code: string) {
    const verifier = sessionStorage.getItem(VERIFIER_KEY) || "";
    sessionStorage.removeItem(VERIFIER_KEY);
    const r = await fetch("https://" + config.COGNITO.domain + "/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.COGNITO.clientId,
        redirect_uri: redirectUri(),
        code,
        code_verifier: verifier,
      }),
    });
    if (!r.ok) throw new Error("Token exchange failed (" + r.status + ")");
    const t = (await r.json()) as { access_token: string; id_token: string; refresh_token?: string; expires_in: number };
    const claims = JSON.parse(atob(t.id_token.split(".")[1])) as Record<string, string>;
    const now = Date.now();
    const s: Session = {
      mode: "cognito",
      email: claims.email || "",
      name: claims.name || claims.email || "",
      clientId: claims["custom:clientId"] || "",
      clientName: claims["custom:clientName"] || "",
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 12 * 3600_000).toISOString(),
      tokens: {
        accessToken: t.access_token,
        idToken: t.id_token,
        refreshToken: t.refresh_token,
        expiresAt: new Date(now + t.expires_in * 1000).toISOString(),
      },
    };
    writeSession(s);
    return s;
  },
  signOut() {
    clearSession();
    return Promise.resolve();
  },
  async getAccessToken() {
    const s = readSession();
    if (!s?.tokens) return null;
    // password/API mode: session expiry (checked in readSession) gates the token
    if (s.mode === "api") return s.tokens.accessToken;
    if (Date.parse(s.tokens.expiresAt) - Date.now() > 60_000) return s.tokens.accessToken;
    if (!s.tokens.refreshToken) {
      clearSession();
      return null;
    }
    const r = await fetch("https://" + config.COGNITO.domain + "/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: config.COGNITO.clientId,
        refresh_token: s.tokens.refreshToken,
      }),
    });
    if (!r.ok) {
      clearSession();
      return null;
    }
    const t = (await r.json()) as { access_token: string; id_token: string; expires_in: number };
    writeSession({
      ...s,
      tokens: { ...s.tokens, accessToken: t.access_token, idToken: t.id_token, expiresAt: new Date(Date.now() + t.expires_in * 1000).toISOString() },
    });
    return t.access_token;
  },
};
