/* Resend transport + memory store.

   The provider is exercised against a real local HTTP server rather than a
   patched global fetch, so the request that gets asserted is the one that
   would actually go over the wire: method, auth header, and JSON body. */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

/* A stand-in for api.resend.com that records what it was sent. */
const received = [];
let nextStatus = 200;
let nextBody = '{"id":"re_test_123"}';
let delayMs = 0;

const stub = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    received.push({
      method: req.method,
      auth: req.headers.authorization,
      contentType: req.headers["content-type"],
      body: (() => { try { return JSON.parse(raw); } catch { return raw; } })(),
    });
    const reply = () => { res.writeHead(nextStatus, { "Content-Type": "application/json" }); res.end(nextBody); };
    if (delayMs) setTimeout(reply, delayMs); else reply();
  });
});

const port = await new Promise((resolve) => {
  stub.listen(0, () => resolve(stub.address().port));
});

process.env.STORE = "memory";
process.env.MAIL_PROVIDER = "resend";
process.env.MAIL_FROM = "GISPL <no-reply@gisconsulting.in>";
process.env.RESEND_API_KEY = "re_test_key";
process.env.RESEND_API_URL = `http://127.0.0.1:${port}/emails`;
process.env.SITE_SECRET = "test-secret-not-the-default";

const { sendMail } = await import("../src/notify.js");
const { getStore } = await import("../src/store/index.js");
const { handleRequest } = await import("../src/router.js");

after(() => stub.close());

function reset() {
  received.length = 0;
  nextStatus = 200;
  nextBody = '{"id":"re_test_123"}';
  delayMs = 0;
}

/* ------------------------------------------------------------ the transport */

test("sendMail posts the message to Resend", async () => {
  reset();
  const res = await sendMail({
    to: "info@gisconsulting.in",
    subject: "Proposal request — Meridian First Bank (GIS-1234ABCD)",
    text: "Name: Priya Nair\nCompany: Meridian First Bank",
    replyTo: "priya@meridian.example",
  });

  assert.equal(res.sent, true);
  assert.equal(received.length, 1);
  const r = received[0];
  assert.equal(r.method, "POST");
  assert.equal(r.auth, "Bearer re_test_key");
  assert.match(r.contentType, /application\/json/);
  assert.deepEqual(r.body.to, ["info@gisconsulting.in"]);
  assert.equal(r.body.from, "GISPL <no-reply@gisconsulting.in>");
  assert.match(r.body.subject, /Meridian First Bank/);
  assert.match(r.body.text, /Priya Nair/);
});

test("the enquirer's address becomes reply_to, so Reply goes to them", async () => {
  reset();
  await sendMail({ to: "info@gisconsulting.in", subject: "s", text: "t", replyTo: "Priya@Meridian.Example" });
  assert.equal(received[0].body.reply_to, "priya@meridian.example");
});

test("a junk reply-to is dropped rather than sent", async () => {
  reset();
  await sendMail({ to: "info@gisconsulting.in", subject: "s", text: "t", replyTo: "not an address" });
  assert.equal("reply_to" in received[0].body, false);
});

test("a newline in the subject cannot become a second header", async () => {
  reset();
  await sendMail({ to: "info@gisconsulting.in", subject: "Enquiry\r\nBcc: victim@example.com", text: "t" });
  assert.ok(!/[\r\n]/.test(received[0].body.subject));
});

test("a Resend refusal is reported, not thrown", async () => {
  reset();
  nextStatus = 403;
  nextBody = '{"message":"The gisconsulting.in domain is not verified."}';
  const res = await sendMail({ to: "info@gisconsulting.in", subject: "s", text: "t" });
  assert.equal(res.sent, false);
  assert.equal(res.reason, "resend-403");
});

test("a missing API key logs instead of throwing", async () => {
  reset();
  const { config } = await import("../src/config.js");
  const key = config.mail.resendKey;
  config.mail.resendKey = "";
  try {
    const res = await sendMail({ to: "info@gisconsulting.in", subject: "s", text: "t" });
    assert.equal(res.sent, false);
    assert.equal(res.reason, "resend-key-missing");
    assert.equal(received.length, 0, "nothing should reach the provider without a key");
  } finally {
    config.mail.resendKey = key;
  }
});

test("no MAIL_FROM means log-only, and never a thrown error", async () => {
  reset();
  const { config } = await import("../src/config.js");
  const from = config.mail.from;
  config.mail.from = "";
  try {
    const res = await sendMail({ to: "info@gisconsulting.in", subject: "s", text: "t" });
    assert.equal(res.sent, false);
    assert.equal(res.reason, "not-configured");
    assert.equal(received.length, 0);
  } finally {
    config.mail.from = from;
  }
});

/* ------------------------------------------------- the lead path end to end */

test("a posted lead is stored AND emailed to the sales address", async () => {
  reset();
  const store = await getStore();
  const res = await handleRequest({
    method: "POST", path: "/v1/leads", query: {}, headers: {},
    clientIp: "203.0.113.90", userAgent: "node-test",
    body: {
      name: "Ravi Menon", email: "ravi@apex.example", company: "Apex Logistics",
      service: "VAPT & Pen Testing", message: "Pre-audit test, please scope.",
      consent: true, renderedAt: Date.now() - 30000,
    },
  }, { store });

  assert.equal(res.status, 200);
  assert.match(res.body.ref, /^GIS-[0-9A-F]{8}$/);

  // stored
  const lead = store._snapshot().leads.find((l) => l.company === "Apex Logistics");
  assert.ok(lead, "the lead is retained in the memory store");

  // and actually sent
  assert.equal(received.length, 1, "exactly one notification goes out");
  const mail = received[0].body;
  assert.deepEqual(mail.to, ["info@gisconsulting.in"]);
  assert.equal(mail.reply_to, "ravi@apex.example");
  assert.match(mail.subject, /Apex Logistics/);
  assert.match(mail.text, /Pre-audit test, please scope\./);
  assert.match(mail.text, /ravi@apex\.example/);
});

test("the visitor still gets a success response when the provider is down", async () => {
  reset();
  nextStatus = 500;
  nextBody = "upstream exploded";
  const store = await getStore();
  const res = await handleRequest({
    method: "POST", path: "/v1/leads", query: {}, headers: {},
    clientIp: "203.0.113.91", userAgent: "node-test",
    body: {
      name: "Anjali Rao", email: "anjali@example.com", company: "Northwind Bank",
      consent: true, renderedAt: Date.now() - 30000,
    },
  }, { store });

  assert.equal(res.status, 200, "a failed notification must not fail the submission");
  const lead = store._snapshot().leads.find((l) => l.company === "Northwind Bank");
  assert.ok(lead, "and the lead is still captured, so it can be recovered");
});

/* ------------------------------------------------------------ memory store */

test("the memory store keeps subscribers addressable within one process", async () => {
  const store = await getStore();
  await store.putSubscriber({ email: "reader@example.com", status: "pending" });
  const got = await store.getSubscriber("reader@example.com");
  assert.equal(got.status, "pending");
  assert.equal(await store.getSubscriber("nobody@example.com"), null);
});

test("the memory store still rate limits", async () => {
  const store = await getStore();
  const key = "leads:memtest";
  assert.equal(await store.bumpRate(key, 3600), 1);
  assert.equal(await store.bumpRate(key, 3600), 2);
  assert.equal(await store.bumpRate(key, 3600), 3);
});
