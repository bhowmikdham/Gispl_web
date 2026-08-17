/* API tests — drive the router directly (no network) against an isolated file
   store in a fresh temp DATA_DIR. Env must be set BEFORE the app modules load
   because config.js reads process.env at import time; hence the dynamic
   await import() below (static imports would hoist above these assignments). */

import { test, after } from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dataDir = mkdtempSync(join(tmpdir(), "gispl-site-api-test-"));
process.env.STORE = "file";
process.env.DATA_DIR = dataDir;
process.env.SITE_SECRET = "test-secret-not-the-default";
process.env.SITE_BASE = "https://example.test";
process.env.API_BASE = "https://api.example.test";
process.env.MIN_FILL_SECONDS = "3";
process.env.RATE_MAX = "5";
process.env.RATE_WINDOW_SECONDS = "3600";
process.env.MAIL_FROM = ""; // notifications are logged, never sent, in tests

const { handleRequest } = await import("../src/router.js");
const { getStore } = await import("../src/store/index.js");
const { signToken, PURPOSE, confirmLink, unsubscribeLink } = await import("../src/tokens.js");

const ctx = { store: await getStore() };

after(() => rmSync(dataDir, { recursive: true, force: true }));

/* Each test gets its own IP so one test's submissions never spend another
   test's rate-limit budget. */
let ipSeq = 0;
function freshIp() {
  ipSeq += 1;
  return `203.0.113.${ipSeq}`;
}

function call(method, path, { body, query, ip, userAgent } = {}) {
  return handleRequest(
    {
      method,
      path,
      query: query || {},
      headers: {},
      body,
      clientIp: ip || freshIp(),
      userAgent: userAgent || "node-test",
    },
    ctx
  );
}

function db() {
  return JSON.parse(readFileSync(join(dataDir, "site.json"), "utf8"));
}

/** A well-formed lead body. `renderedAt` is old enough to clear the timing check. */
function leadBody(over = {}) {
  return {
    name: "Priya Nair",
    email: "Priya.Nair@Example.com",
    company: "Meridian First Bank",
    service: "VAPT & Pen Testing",
    message: "We need a scoped pen test before the SEBI audit.",
    consent: true,
    renderedAt: Date.now() - 30_000,
    ...over,
  };
}

/* ------------------------------------------------------------------- health */

test("GET /health returns ok:true", async () => {
  const res = await call("GET", "/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test("an unknown path is a 404, not a crash", async () => {
  const res = await call("GET", "/v1/nope");
  assert.equal(res.status, 404);
});

/* -------------------------------------------------------------------- leads */

test("POST /v1/leads stores the enquiry and returns a reference", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody() });
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.match(res.body.ref, /^GIS-[0-9A-F]{8}$/);

  const lead = db().leads.find((l) => l.ref === res.body.ref);
  assert.ok(lead, "the lead must be persisted");
  assert.equal(lead.email, "priya.nair@example.com", "email is normalised to lower case");
  assert.equal(lead.company, "Meridian First Bank");
  assert.equal(lead.source, "contact-form", "source defaults to the contact form");
});

test("POST /v1/leads records a DPDP consent trail", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody(), userAgent: "Mozilla/5.0 (test)" });
  const lead = db().leads.find((l) => l.ref === res.body.ref);
  assert.ok(lead.consent.text.length > 0, "the agreed wording is stored");
  assert.ok(lead.consent.at, "consent is timestamped");
  assert.equal(lead.consent.policyVersion, "2026-08-17");
  assert.equal(lead.consent.userAgent, "Mozilla/5.0 (test)");
  assert.ok(lead.consent.ip, "the source address is retained as proof of consent");
});

test("POST /v1/leads rejects a missing email with a per-field message", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ email: "" }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.email, "the failing field is named so the form can highlight it");
});

test("POST /v1/leads rejects a malformed email", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ email: "priya at example" }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.email);
});

test("POST /v1/leads refuses the contact form without the consent checkbox", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ consent: false }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.consent);
});

test("POST /v1/leads accepts the DPDP gate, which has a notice instead of a checkbox", async () => {
  const res = await call("POST", "/v1/leads", {
    body: leadBody({ source: "dpdp-checklist", consent: undefined, message: "" }),
  });
  assert.equal(res.status, 200);
  const lead = db().leads.find((l) => l.ref === res.body.ref);
  assert.equal(lead.source, "dpdp-checklist");
  assert.match(lead.consent.text, /DPDP checklist form/);
});

test("POST /v1/leads rejects an unknown source rather than storing free text", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ source: "spam-campaign" }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.source);
});

test("POST /v1/leads stores only declared fields", async () => {
  const res = await call("POST", "/v1/leads", {
    body: leadBody({ isAdmin: true, notes: "smuggled", __proto__: { polluted: true } }),
  });
  const lead = db().leads.find((l) => l.ref === res.body.ref);
  assert.equal(lead.isAdmin, undefined);
  assert.equal(lead.notes, undefined);
  assert.equal({}.polluted, undefined, "prototype is untouched");
});

test("POST /v1/leads strips control characters from single-line fields", async () => {
  const res = await call("POST", "/v1/leads", {
    body: leadBody({ name: "Priya\r\nBcc: victim@example.com" }),
  });
  const lead = db().leads.find((l) => l.ref === res.body.ref);
  assert.ok(!/[\r\n]/.test(lead.name), "no newline survives into an email header");
});

test("POST /v1/leads keeps newlines inside the message body", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ message: "line one\nline two" }) });
  const lead = db().leads.find((l) => l.ref === res.body.ref);
  assert.equal(lead.message, "line one\nline two");
});

test("POST /v1/leads rejects an over-long field", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ company: "x".repeat(500) }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.company);
});

/* ------------------------------------------------------------- bot defences */

test("a filled honeypot looks accepted but stores nothing", async () => {
  const before = db().leads.length;
  const res = await call("POST", "/v1/leads", { body: leadBody({ website: "http://spam.example" }) });
  assert.equal(res.status, 200, "the bot is told nothing");
  assert.equal(res.body.ok, true);
  assert.equal(db().leads.length, before, "but no record is written");
});

test("a submission faster than a human could type is discarded", async () => {
  const before = db().leads.length;
  const res = await call("POST", "/v1/leads", { body: leadBody({ renderedAt: Date.now() }) });
  assert.equal(res.status, 200);
  assert.equal(db().leads.length, before);
});

test("a form with no renderedAt stamp still works", async () => {
  const body = leadBody();
  delete body.renderedAt;
  const res = await call("POST", "/v1/leads", { body });
  assert.equal(res.status, 200);
  assert.ok(db().leads.some((l) => l.ref === res.body.ref));
});

test("a clock-skewed client (renderedAt in the future) is not treated as a bot", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ renderedAt: Date.now() + 600_000 }) });
  assert.equal(res.status, 200);
  assert.ok(db().leads.some((l) => l.ref === res.body.ref));
});

test("the sixth submission from one address in a window is rate limited", async () => {
  const ip = "198.51.100.7";
  for (let i = 0; i < 5; i++) {
    const ok = await call("POST", "/v1/leads", { body: leadBody(), ip });
    assert.equal(ok.status, 200, `submission ${i + 1} should be accepted`);
  }
  const res = await call("POST", "/v1/leads", { body: leadBody(), ip });
  assert.equal(res.status, 429);
  assert.ok(Number(res.headers["Retry-After"]) > 0, "a Retry-After is supplied");
});

test("the rate limit is per route, so a lead does not spend the subscribe budget", async () => {
  const ip = "198.51.100.8";
  for (let i = 0; i < 5; i++) await call("POST", "/v1/leads", { body: leadBody(), ip });
  const res = await call("POST", "/v1/subscribe", {
    body: { email: "route-budget@example.com", renderedAt: Date.now() - 30_000 },
    ip,
  });
  assert.equal(res.status, 200);
});

/* ---------------------------------------------------------------- subscribe */

test("POST /v1/subscribe records a pending subscriber, not a confirmed one", async () => {
  const res = await call("POST", "/v1/subscribe", {
    body: { email: "reader@example.com", renderedAt: Date.now() - 30_000 },
  });
  assert.equal(res.status, 200);
  const sub = db().subscribers.find((s) => s.email === "reader@example.com");
  assert.equal(sub.status, "pending", "nothing is sent until the address is confirmed");
  assert.equal(sub.confirmedAt, null);
});

test("POST /v1/subscribe answers identically whether or not the address is known", async () => {
  const a = await call("POST", "/v1/subscribe", { body: { email: "oracle@example.com" } });
  const b = await call("POST", "/v1/subscribe", { body: { email: "oracle@example.com" } });
  assert.deepEqual(a.body, b.body, "the response must not reveal subscription state");
});

test("the confirmation link moves the subscriber to confirmed", async () => {
  await call("POST", "/v1/subscribe", { body: { email: "optin@example.com" } });
  const token = signToken(PURPOSE.CONFIRM, { e: "optin@example.com" }, 3600);

  const res = await call("GET", "/v1/subscribe/confirm", { query: { token } });
  assert.equal(res.status, 200);
  assert.match(res.html, /You are on the list/);
  assert.match(res.html, /optin@example\.com/);

  const sub = db().subscribers.find((s) => s.email === "optin@example.com");
  assert.equal(sub.status, "confirmed");
  assert.ok(sub.confirmedAt);
});

test("a confirmation token cannot be replayed as an unsubscribe", async () => {
  const token = signToken(PURPOSE.CONFIRM, { e: "purpose@example.com" }, 3600);
  const res = await call("GET", "/v1/unsubscribe", { query: { token } });
  assert.equal(res.status, 400);
  assert.match(res.html, /did not work/);
});

test("a tampered token is rejected", async () => {
  const token = signToken(PURPOSE.CONFIRM, { e: "real@example.com" }, 3600);
  const [payload] = token.split(".");
  const res = await call("GET", "/v1/subscribe/confirm", { query: { token: `${payload}.deadbeef` } });
  assert.equal(res.status, 400);
});

test("an expired confirmation token is rejected", async () => {
  const token = signToken(PURPOSE.CONFIRM, { e: "stale@example.com" }, -1);
  const res = await call("GET", "/v1/subscribe/confirm", { query: { token } });
  assert.equal(res.status, 400);
});

test("unsubscribing keeps the record as a suppression entry", async () => {
  await call("POST", "/v1/subscribe", { body: { email: "leaving@example.com" } });
  const confirm = signToken(PURPOSE.CONFIRM, { e: "leaving@example.com" }, 3600);
  await call("GET", "/v1/subscribe/confirm", { query: { token: confirm } });

  const token = signToken(PURPOSE.UNSUBSCRIBE, { e: "leaving@example.com" }, 0);
  const res = await call("GET", "/v1/unsubscribe", { query: { token } });
  assert.equal(res.status, 200);
  assert.match(res.html, /off the list/);

  const sub = db().subscribers.find((s) => s.email === "leaving@example.com");
  assert.equal(sub.status, "unsubscribed");
  assert.ok(sub.unsubscribedAt, "the record survives so a later signup cannot silently resubscribe");
});

test("re-subscribing after unsubscribing goes back through the double opt-in", async () => {
  await call("POST", "/v1/subscribe", { body: { email: "returning@example.com" } });
  const unsub = signToken(PURPOSE.UNSUBSCRIBE, { e: "returning@example.com" }, 0);
  await call("GET", "/v1/unsubscribe", { query: { token: unsub } });

  await call("POST", "/v1/subscribe", { body: { email: "returning@example.com" } });
  const sub = db().subscribers.find((s) => s.email === "returning@example.com");
  assert.equal(sub.status, "pending", "an unsubscribed address is not re-confirmed by a form post");
});

test("the emailed links point at the configured API base", () => {
  assert.ok(confirmLink("x@example.com").startsWith("https://api.example.test/v1/subscribe/confirm?token="));
  assert.ok(unsubscribeLink("x@example.com").startsWith("https://api.example.test/v1/unsubscribe?token="));
});

test("the confirmation page escapes the address it echoes", async () => {
  const evil = 'a"><script>alert(1)</script>@example.com';
  const token = signToken(PURPOSE.CONFIRM, { e: evil }, 3600);
  const res = await call("GET", "/v1/subscribe/confirm", { query: { token } });
  assert.ok(!res.html.includes("<script>alert(1)</script>"), "no unescaped markup reaches the page");
  assert.match(res.html, /&lt;script&gt;/);
});

/* ------------------------------------------------------------- applications */

function applicationBody(over = {}) {
  return {
    role: "senior-penetration-tester",
    roleTitle: "Senior Penetration Tester",
    name: "Ravi Menon",
    email: "ravi@example.com",
    phone: "+91 98765 43210",
    message: "Ten years in offensive security.",
    renderedAt: Date.now() - 30_000,
    ...over,
  };
}

test("POST /v1/applications stores the application", async () => {
  const res = await call("POST", "/v1/applications", { body: applicationBody() });
  assert.equal(res.status, 200);
  assert.match(res.body.ref, /^GIS-A-[0-9A-F]{8}$/);

  const app = db().applications.find((a) => a.ref === res.body.ref);
  assert.equal(app.role, "senior-penetration-tester");
  assert.equal(app.email, "ravi@example.com");
  assert.ok(app.consent.at, "an application carries its own consent record");
});

test("POST /v1/applications rejects a role that is not a slug", async () => {
  const res = await call("POST", "/v1/applications", { body: applicationBody({ role: "../../etc/passwd" }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.role);
});

test("POST /v1/applications rejects a CV type we do not accept", async () => {
  const res = await call("POST", "/v1/applications", {
    body: applicationBody({ cvContentType: "application/x-msdownload" }),
  });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.cvContentType);
});

test("with no bucket configured the response carries no upload target", async () => {
  const res = await call("POST", "/v1/applications", {
    body: applicationBody({ cvContentType: "application/pdf" }),
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.upload, null, "the careers form falls back to emailing the CV");
});

test("POST /v1/applications requires a name and a valid email", async () => {
  const res = await call("POST", "/v1/applications", { body: applicationBody({ name: "", email: "nope" }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.name);
  assert.ok(res.body.fields.email);
});

/* ---------------------------------------------------------- malformed input */

test("a non-object body is a validation error, not a crash", async () => {
  for (const body of [undefined, null, "string", 42, ["a"]]) {
    const res = await call("POST", "/v1/leads", { body });
    assert.equal(res.status, 400, `body ${JSON.stringify(body)} should be a 400`);
  }
});

test("an object where a string belongs is rejected, not stringified", async () => {
  const res = await call("POST", "/v1/leads", { body: leadBody({ name: { $ne: null } }) });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.name);
});

test("no endpoint reads a stored record back out", async () => {
  const { default: fs } = await import("node:fs");
  const src = fs.readFileSync(new URL("../src/router.js", import.meta.url), "utf8");
  assert.ok(!/GET".*leads|GET".*applications|GET".*subscribers/.test(src),
    "there is no read route over stored personal data");
});
