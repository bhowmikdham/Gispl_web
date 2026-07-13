/* ONE switch drives the portal — the same contract as the site's
   assets/js/config.js. "local" runs entirely on seeded localStorage;
   "api" points every read at the deployed HTTP API and sign-in at
   Cognito Hosted UI (PKCE). Values are baked at build time. */

export type PortalMode = "local" | "api";

export const config = {
  MODE: (process.env.NEXT_PUBLIC_PORTAL_MODE as PortalMode) || "local",
  API_BASE: process.env.NEXT_PUBLIC_API_BASE || "https://api.gispl.example",
  COGNITO: {
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "",
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
    redirectPath: "/portal/callback/",
  },
  SESSION_KEY: "gispl:client-session",
  SESSION_HOURS: 8,
} as const;
