/* Central config, read once from the environment — same philosophy as
   portal-api/src/config.js: one place decides file-vs-dynamo, whether email
   notification is live, and where uploaded CVs go.

   Defaults are the LOCAL DEV shape: file store, no AWS, notifications printed
   to the console. Nothing here reaches the network until it is configured. */

const env = process.env;

function list(v) {
  return String(v || "").split(",").map((s) => s.trim()).filter(Boolean);
}

export const config = {
  port: Number(env.PORT || 4100),
  store: env.STORE || "file", // "file" | "dynamo"
  dataDir: env.DATA_DIR || "./.data",

  // Signs the double-opt-in confirm and unsubscribe links. Anyone holding this
  // can mint a "confirmed" consent record, so it is a real secret in prod.
  secret: env.SITE_SECRET || "dev-only-change-me",

  // Public site origin(s) allowed to call the API. "*" is fine while the only
  // endpoints are unauthenticated form posts, but pin it in production so a
  // third-party page cannot farm your rate-limit budget from a victim's browser.
  corsOrigins: list(env.CORS_ORIGINS || "*"),

  // Absolute base URL of the website — used for the "back to the site" links on
  // the confirm/unsubscribe pages. No trailing slash.
  siteBase: (env.SITE_BASE || "http://localhost:8080").replace(/\/+$/, ""),

  // Absolute, publicly reachable base URL of THIS api, used to build the links
  // that go out in email. Set it to the API Gateway URL, or to
  // "<site>/api" when a CDN routes /api/* here. Getting this wrong produces
  // confirmation links that 404 in the subscriber's inbox, so it has no silent
  // default beyond the local-dev one.
  apiBase: (env.API_BASE || `http://localhost:${Number(env.PORT || 4100)}`).replace(/\/+$/, ""),

  // Version stamped into every consent record. Bump it whenever the privacy
  // policy changes materially, so old records stay attributable to the text
  // the person actually agreed to (DPDP §6 puts the burden of proof on us).
  privacyPolicyVersion: env.PRIVACY_POLICY_VERSION || "2026-08-17",

  // How long a lead/application/consent record is retained before DynamoDB's
  // TTL sweeps it. DPDP §8(7) requires erasure once the purpose is served;
  // 3 years is the default commercial-record window, override per policy.
  retentionDays: Number(env.RETENTION_DAYS || 1095),

  rateLimit: {
    windowSeconds: Number(env.RATE_WINDOW_SECONDS || 3600),
    // per IP, per route, per window
    max: Number(env.RATE_MAX || 5),
  },

  // Minimum seconds between the form rendering and its submission. Scripted
  // posts arrive instantly; a human filling a proposal form does not.
  minFillSeconds: Number(env.MIN_FILL_SECONDS || 3),

  // AWS
  region: env.AWS_REGION || "ap-south-1",
  ddbTable: env.DDB_TABLE || "gispl-site",
  uploadBucket: env.UPLOAD_BUCKET || "",
  uploadPrefix: env.UPLOAD_PREFIX || "applications",
  maxCvBytes: Number(env.MAX_CV_BYTES || 8 * 1024 * 1024),

  // Notification email (SES v2). With no `from` address the service records
  // everything and logs the notification instead of sending it — that is the
  // supported local-dev mode, not a failure.
  mail: {
    from: env.MAIL_FROM || "",
    leadsTo: list(env.MAIL_LEADS_TO || "info@gisconsulting.in"),
    careersTo: list(env.MAIL_CAREERS_TO || "careers@gisconsulting.in"),
    configurationSet: env.SES_CONFIGURATION_SET || "",
  },
};

/** True when a production deployment is still carrying the dev signing key. */
export function isProdSecretMissing() {
  return config.secret === "dev-only-change-me" && config.store === "dynamo";
}
