/* Route handlers. Framework-agnostic: each takes a normalized request
   { method, path, params, query, headers, body, clientIp, userAgent } and the
   ctx { store }, and returns { status, body } — or { status, html } for the two
   endpoints a person reaches by clicking a link in their inbox.

   Every endpoint here is PUBLIC and unauthenticated, so each one:
     • declares its fields (validate.js drops everything else)
     • runs the honeypot + timing check before touching the store
     • is rate limited per IP
     • writes a consent record alongside the data
   and none of them ever reads a stored record back out over HTTP. */

import { randomUUID, randomBytes } from "node:crypto";
import { config } from "./config.js";
import { validate, botReason } from "./validate.js";
import { checkRate } from "./ratelimit.js";
import { sendMail, detailLines } from "./notify.js";
import { confirmLink, unsubscribeLink, verifyToken, PURPOSE } from "./tokens.js";
import { presignCvUpload, ALLOWED_CV_TYPES } from "./uploads.js";
import { confirmedPage, unsubscribedPage, badLinkPage } from "./pages.js";

/* ------------------------------------------------------------------ helpers */

/** Short, quotable reference for the acknowledgement ("your reference is …"). */
function newRef(prefix) {
  return `${prefix}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

/** The DPDP §6 evidence: what was agreed to, when, by whom, under which notice. */
function consentRecord(req, purpose, text) {
  return {
    purpose,
    text,
    policyVersion: config.privacyPolicyVersion,
    at: new Date().toISOString(),
    // Retained as proof the consent came from a real session. It is personal
    // data, and it expires with the record's TTL like everything else.
    ip: req.clientIp || null,
    userAgent: (req.userAgent || "").slice(0, 300) || null,
  };
}

/** 400 with per-field messages the form can render inline. */
function invalid(errors) {
  return { status: 400, body: { error: "Please check the highlighted fields.", fields: errors } };
}

/* A bot gets the same shape of success a human does. Telling it that the
   honeypot fired just teaches the author to stop filling that field. */
function pretendAccepted(ref) {
  return { status: 200, body: { ok: true, ref, message: "Thank you — we have your message." } };
}

async function guard(req, ctx, route) {
  const bot = botReason(req.body, config.minFillSeconds);
  if (bot) return { blocked: true, bot };
  const rate = await checkRate(ctx.store, route, req.clientIp);
  if (rate.limited) {
    return {
      blocked: true,
      response: {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfter) },
        body: { error: "Too many submissions from this address. Please try again later, or email info@gisconsulting.in." },
      },
    };
  }
  return { blocked: false };
}

/* ------------------------------------------------------------------- health */

export async function health() {
  return { status: 200, body: { ok: true, service: "gispl-site-api" } };
}

/* -------------------------------------------------------------------- leads */

// Free text rather than a strict enum for the three <select> fields: their
// options live in the site's HTML, and a mismatch after a copy edit would
// reject a real proposal request with an error the visitor cannot act on.
const LEAD_SPEC = {
  name: { type: "text", required: true, max: 120, label: "Full name" },
  title: { type: "text", max: 120, label: "Job title" },
  email: { type: "email", required: true, max: 200, label: "Work email" },
  phone: { type: "phone", max: 30, label: "Phone" },
  company: { type: "text", required: true, max: 160, label: "Company" },
  location: { type: "text", max: 80, label: "Location" },
  service: { type: "text", max: 80, label: "Service of interest" },
  industry: { type: "text", max: 80, label: "Industry" },
  message: { type: "longtext", max: 5000, label: "Message" },
  source: { type: "choice", values: ["contact-form", "dpdp-checklist"], max: 40, label: "Source" },
};

const SOURCE_LABEL = {
  "contact-form": "Proposal request",
  "dpdp-checklist": "DPDP checklist",
};

export async function postLead(req, ctx) {
  const g = await guard(req, ctx, "leads");
  if (g.blocked) return g.response || pretendAccepted(newRef("GIS"));

  const { ok, value, errors } = validate(LEAD_SPEC, req.body);
  if (!ok) return invalid(errors);

  const source = value.source || "contact-form";
  // The contact form carries an explicit checkbox; the DPDP checklist gate
  // carries a visible notice instead ("Used only to follow up on your
  // readiness"), so the two record different consent text but both record it.
  const consentText =
    source === "dpdp-checklist"
      ? "Submitted the DPDP checklist form, which states the details are used only to follow up on DPDP readiness."
      : "Ticked: I agree to GISPL processing my details to respond to this enquiry, per the privacy policy.";

  if (source === "contact-form") {
    const agreed = req.body && (req.body.consent === true || req.body.consent === "true" || req.body.consent === "on");
    if (!agreed) return invalid({ consent: "Please agree to the privacy policy so we can reply." });
  }

  const now = new Date().toISOString();
  const lead = {
    id: randomUUID(),
    ref: newRef("GIS"),
    kind: "lead",
    source,
    createdAt: now,
    ...value,
    source, // resolved: value.source is blank when the client omits it
    consent: consentRecord(req, `Respond to a ${SOURCE_LABEL[source] || "website"} enquiry`, consentText),
  };

  await ctx.store.putLead(lead);

  await sendMail({
    to: config.mail.leadsTo,
    replyTo: lead.email,
    subject: `${SOURCE_LABEL[source] || "Website enquiry"} — ${lead.company} (${lead.ref})`,
    text:
      `A new enquiry came in from the website.\n\n` +
      detailLines([
        ["Reference", lead.ref],
        ["Received", lead.createdAt],
        ["Name", lead.name],
        ["Job title", lead.title],
        ["Company", lead.company],
        ["Email", lead.email],
        ["Phone", lead.phone],
        ["Location", lead.location],
        ["Service", lead.service],
        ["Industry", lead.industry],
        ["Source", SOURCE_LABEL[source] || source],
      ]) +
      (lead.message ? `\n\nMessage:\n${lead.message}\n` : "\n") +
      `\nConsent recorded: ${lead.consent.text}\n(policy ${lead.consent.policyVersion}, ${lead.consent.at})\n`,
  });

  return {
    status: 200,
    body: {
      ok: true,
      ref: lead.ref,
      message: "Thank you — your request is with a GISPL specialist. We reply within one business day.",
    },
  };
}

/* ---------------------------------------------------------------- subscribe */

const SUBSCRIBE_SPEC = {
  email: { type: "email", required: true, max: 200, label: "Email" },
};

// One message for every outcome — new address, pending address, already
// confirmed. Anything else turns the endpoint into an oracle for whether a
// given address is on the list.
const SUBSCRIBE_MESSAGE = "Check your inbox — we have sent a link to confirm your subscription.";

export async function postSubscribe(req, ctx) {
  const g = await guard(req, ctx, "subscribe");
  if (g.blocked) return g.response || { status: 200, body: { ok: true, message: SUBSCRIBE_MESSAGE } };

  const { ok, value, errors } = validate(SUBSCRIBE_SPEC, req.body);
  if (!ok) return invalid(errors);

  const existing = await ctx.store.getSubscriber(value.email);
  const now = new Date().toISOString();

  // Someone who already unsubscribed is re-opening a subscription of their own
  // accord, so `status` moves back to pending and the double opt-in runs again.
  const sub = {
    email: value.email,
    status: existing && existing.status === "confirmed" ? "confirmed" : "pending",
    createdAt: (existing && existing.createdAt) || now,
    updatedAt: now,
    requestedConsent: consentRecord(
      req,
      "Send the GISPL insights newsletter",
      "Submitted the newsletter form and confirmed the address by clicking the emailed link."
    ),
    confirmedAt: (existing && existing.confirmedAt) || null,
    unsubscribedAt: null,
  };
  await ctx.store.putSubscriber(sub);

  // Confirmed addresses are not re-mailed a confirmation link: that would let a
  // stranger use the form to spam a real subscriber's inbox.
  if (sub.status !== "confirmed") {
    await sendMail({
      to: value.email,
      subject: "Confirm your GISPL insights subscription",
      text:
        `Someone — we hope you — asked to receive GISPL insights at this address.\n\n` +
        `Confirm the subscription:\n${confirmLink(value.email)}\n\n` +
        `The link is valid for seven days. If this was not you, ignore this email; ` +
        `nothing is sent to an address that has not been confirmed.\n\n` +
        `GISPL — G-Info Technology Solutions Pvt. Ltd.\n${config.siteBase}\n`,
    });
  }

  return { status: 200, body: { ok: true, message: SUBSCRIBE_MESSAGE } };
}

export async function getSubscribeConfirm(req, ctx) {
  const payload = verifyToken(req.query.token, PURPOSE.CONFIRM);
  if (!payload || !payload.e) {
    return { status: 400, html: badLinkPage("That confirmation link is invalid or has expired.") };
  }

  const existing = await ctx.store.getSubscriber(payload.e);
  const now = new Date().toISOString();
  await ctx.store.putSubscriber({
    ...(existing || { email: payload.e, createdAt: now, requestedConsent: null }),
    email: payload.e,
    status: "confirmed",
    confirmedAt: (existing && existing.confirmedAt) || now,
    unsubscribedAt: null,
    updatedAt: now,
    // The click is the affirmative action; record where it came from too.
    confirmedFrom: { ip: req.clientIp || null, userAgent: (req.userAgent || "").slice(0, 300) || null },
  });

  return { status: 200, html: confirmedPage(payload.e, unsubscribeLink(payload.e)) };
}

export async function getUnsubscribe(req, ctx) {
  const payload = verifyToken(req.query.token, PURPOSE.UNSUBSCRIBE);
  if (!payload || !payload.e) {
    return { status: 400, html: badLinkPage("That unsubscribe link is invalid.") };
  }

  const existing = await ctx.store.getSubscriber(payload.e);
  const now = new Date().toISOString();
  // The record is kept, not deleted: it is the suppression list. Deleting it
  // would let the next form submission quietly resubscribe the same address.
  await ctx.store.putSubscriber({
    ...(existing || { email: payload.e, createdAt: now, requestedConsent: null, confirmedAt: null }),
    email: payload.e,
    status: "unsubscribed",
    unsubscribedAt: now,
    updatedAt: now,
  });

  return { status: 200, html: unsubscribedPage(payload.e) };
}

/* ------------------------------------------------------------- applications */

const APPLICATION_SPEC = {
  role: { type: "slug", required: true, max: 120, label: "Role" },
  roleTitle: { type: "text", max: 160, label: "Role title" },
  name: { type: "text", required: true, max: 120, label: "Your name" },
  email: { type: "email", required: true, max: 200, label: "Email" },
  phone: { type: "phone", max: 30, label: "Phone" },
  message: { type: "longtext", max: 5000, label: "Message" },
  cvContentType: { type: "text", max: 120, label: "CV file type" },
};

export async function postApplication(req, ctx) {
  const g = await guard(req, ctx, "applications");
  if (g.blocked) return g.response || pretendAccepted(newRef("GIS-A"));

  const { ok, value, errors } = validate(APPLICATION_SPEC, req.body);
  if (!ok) return invalid(errors);

  if (value.cvContentType && !ALLOWED_CV_TYPES.includes(value.cvContentType)) {
    return invalid({ cvContentType: "Attach a PDF or Word document." });
  }

  const now = new Date().toISOString();
  const app = {
    id: randomUUID(),
    ref: newRef("GIS-A"),
    kind: "application",
    createdAt: now,
    ...value,
    consent: consentRecord(
      req,
      "Assess a job application",
      "Submitted an application through the GISPL careers site, per the privacy policy."
    ),
    cv: null,
  };

  const upload = value.cvContentType ? await presignCvUpload(value.role, app.id, value.cvContentType) : null;
  if (upload) app.cv = { key: upload.key, contentType: value.cvContentType, uploadedAt: null };

  await ctx.store.putApplication(app);

  await sendMail({
    to: config.mail.careersTo,
    replyTo: app.email,
    subject: `Application — ${app.roleTitle || app.role} (${app.ref})`,
    text:
      `A new application came in from the careers site.\n\n` +
      detailLines([
        ["Reference", app.ref],
        ["Received", app.createdAt],
        ["Role", `${app.roleTitle || app.role} (${app.role})`],
        ["Name", app.name],
        ["Email", app.email],
        ["Phone", app.phone],
        ["CV", app.cv ? `s3://${config.uploadBucket}/${app.cv.key}` : "not attached — ask the candidate to send it"],
      ]) +
      (app.message ? `\n\nFrom the candidate:\n${app.message}\n` : "\n"),
  });

  return {
    status: 200,
    body: {
      ok: true,
      ref: app.ref,
      // Present only when S3 uploads are configured; the client falls back to
      // asking the candidate to email the CV when it is absent.
      upload: upload ? { url: upload.url, fields: upload.fields, maxBytes: upload.maxBytes } : null,
      message: "Thank you — your application is with the GISPL talent team.",
    },
  };
}
