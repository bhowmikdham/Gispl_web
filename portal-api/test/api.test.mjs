/* API tests — drive the router directly (no network) against an isolated
   file store in a fresh temp DATA_DIR. Env must be set BEFORE the app modules
   load because config.js reads process.env at import time; hence the dynamic
   await import() below (static imports would hoist above these assignments). */

import { test, after } from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";

const dataDir = mkdtempSync(join(tmpdir(), "gispl-portal-api-test-"));
process.env.STORE = "file";
process.env.AUTH_MODE = "password";
process.env.JWT_SECRET = "test-secret";
process.env.DATA_DIR = dataDir;

const { handleRequest } = await import("../src/router.js");
const { getStore } = await import("../src/store/index.js");

const ctx = { store: await getStore() };

after(() => rmSync(dataDir, { recursive: true, force: true }));

function call(method, path, { token, body, query, headers } = {}) {
  const h = { ...(headers || {}) };
  if (token) h.authorization = `Bearer ${token}`;
  return handleRequest({ method, path, query: query || {}, headers: h, body }, ctx);
}

const PRIYA = { email: "priya.nair@meridianfirst.example", password: "GisplDemo!2026" };
const RAVI = { email: "ravi.menon@apexlogistics.example", password: "GisplDemo!2026" };

async function loginToken(creds) {
  const res = await call("POST", "/auth/login", { body: creds });
  assert.equal(res.status, 200);
  assert.ok(res.body.token, "login must return a token");
  return res.body.token;
}

test("GET /health is public and returns ok:true", async () => {
  const res = await call("GET", "/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test("POST /auth/login with correct credentials returns a token and user", async () => {
  const res = await call("POST", "/auth/login", { body: PRIYA });
  assert.equal(res.status, 200);
  assert.ok(typeof res.body.token === "string" && res.body.token.length > 0);
  assert.ok(res.body.expiresIn > 0);
  assert.equal(res.body.user.email, PRIYA.email);
  assert.equal(res.body.user.clientId, "cl-meridian");
});

test("POST /auth/login with wrong password returns 401", async () => {
  const res = await call("POST", "/auth/login", { body: { email: PRIYA.email, password: "wrong-password" } });
  assert.equal(res.status, 401);
});

test("GET /portal/engagements with no token returns 401", async () => {
  const res = await call("GET", "/portal/engagements");
  assert.equal(res.status, 401);
});

test("priya (meridian) sees her tenant's data", async (t) => {
  const token = await loginToken(PRIYA);

  await t.test("engagements: 3 items", async () => {
    const res = await call("GET", "/portal/engagements", { token });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 3);
  });

  await t.test("findings: 18 items", async () => {
    const res = await call("GET", "/portal/findings", { token });
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 18);
  });

  await t.test("findings?severity=critical: 2 items", async () => {
    const res = await call("GET", "/portal/findings", { token, query: { severity: "critical" } });
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    for (const f of res.body) assert.equal(f.severity, "critical");
  });

  await t.test("documents: 10 items", async () => {
    const res = await call("GET", "/portal/documents", { token });
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 10);
  });

  await t.test("engagement by slug: currentPhase 5", async () => {
    const res = await call("GET", "/portal/engagements/external-vapt-retail-banking", { token });
    assert.equal(res.status, 200);
    assert.equal(res.body.currentPhase, 5);
  });

  await t.test("document url: {url, demo:true}", async () => {
    const res = await call("GET", "/portal/documents/doc-1/url", { token });
    assert.equal(res.status, 200);
    assert.ok(typeof res.body.url === "string" && res.body.url.endsWith("/files/placeholder.pdf"));
    assert.equal(res.body.demo, true);
  });
});

test("tenant isolation: ravi (apex) cannot reach meridian's data", async (t) => {
  const token = await loginToken(RAVI);

  await t.test("engagements: 1 item", async () => {
    const res = await call("GET", "/portal/engagements", { token });
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
  });

  await t.test("meridian finding GISPL-2026-0141 -> 404", async () => {
    const res = await call("GET", "/portal/findings/GISPL-2026-0141", { token });
    assert.equal(res.status, 404);
  });

  await t.test("meridian document doc-1 url -> 404", async () => {
    const res = await call("GET", "/portal/documents/doc-1/url", { token });
    assert.equal(res.status, 404);
  });
});

test("tampered token returns 401", async () => {
  const token = await loginToken(PRIYA);
  const res = await call("GET", "/portal/engagements", { token: token + "x" });
  assert.equal(res.status, 401);
});
