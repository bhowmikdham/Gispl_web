/* Outbound email — the channel that actually gets a lead in front of a human.

   Two providers (see config.mail.provider):

     resend  a single HTTPS POST with a Bearer key. No SDK, no AWS, nothing to
             install, so the service can run on any host that can make an
             outbound request. This is the low-friction path.
     ses     for a stack that is already on AWS. Needs the optional SDK, and
             needs the account moved out of the SES sandbox.

   Optional by design: with no MAIL_FROM the notification is written to the log
   and the record is still stored. That is the local-dev mode, and it is also
   the safe failure mode — a submission is never rejected because email is down.

   Delivery is awaited (a Lambda that returns before its promise settles gets
   frozen mid-send) but never allowed to throw into the response path. */

import { config } from "./config.js";
import { EMAIL_RE } from "./validate.js";

let clientPromise = null;

async function sesClient() {
  if (!clientPromise) {
    clientPromise = import("@aws-sdk/client-sesv2")
      .then((m) => ({ client: new m.SESv2Client({ region: config.region }), SendEmailCommand: m.SendEmailCommand }))
      .catch(() => null);
  }
  return clientPromise;
}

/** Collapse to a single line — a newline here would be a header injection. */
function headerSafe(s) {
  return String(s || "").replace(/[\r\n]+/g, " ").trim().slice(0, 200);
}

function safeAddress(a) {
  const v = String(a || "").trim().toLowerCase();
  return EMAIL_RE.test(v) ? v : null;
}

/** Resend: POST /emails with a Bearer key. Node 18+ has fetch built in. */
async function sendViaResend({ recipients, subj, text, reply }) {
  if (!config.mail.resendKey) {
    console.error(`[notify:no-key] MAIL_PROVIDER=resend but RESEND_API_KEY is unset — logging instead.\nto=${recipients.join(",")} subject=${subj}\n${text}`);
    return { sent: false, reason: "resend-key-missing" };
  }

  // Do not let a hung provider hold the request open; the record is already
  // stored, so a timeout costs a notification, not the lead.
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 10000);
  try {
    const res = await fetch(config.mail.resendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.mail.resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.mail.from,
        to: recipients,
        subject: subj,
        text: String(text || ""),
        ...(reply ? { reply_to: reply } : {}),
      }),
      signal: abort.signal,
    });
    if (!res.ok) {
      // Read the body: Resend explains refusals (unverified domain, bad key)
      // in it, and that message is the whole diagnosis when mail stops.
      const detail = await res.text().catch(() => "");
      console.error(`[notify:failed] resend ${res.status} ${subj} ${detail.slice(0, 400)}`);
      return { sent: false, reason: `resend-${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("[notify:failed] resend", subj, err && err.name === "AbortError" ? "timed out" : err);
    return { sent: false, reason: "send-failed" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @returns {Promise<{sent: boolean, reason?: string}>} — resolves, never rejects.
 */
export async function sendMail({ to, subject, text, replyTo }) {
  const recipients = (Array.isArray(to) ? to : [to]).map(safeAddress).filter(Boolean);
  const subj = headerSafe(subject);

  if (!config.mail.from || recipients.length === 0) {
    console.log(`[notify:not-sent] to=${recipients.join(",") || "(none)"} subject=${subj}\n${text}`);
    return { sent: false, reason: config.mail.from ? "no-recipient" : "not-configured" };
  }

  if (config.mail.provider === "resend") {
    return sendViaResend({ recipients, subj, text, reply: safeAddress(replyTo) });
  }

  const ses = await sesClient();
  if (!ses) {
    console.error(`[notify:no-sdk] @aws-sdk/client-sesv2 is not installed — logging instead.\nto=${recipients.join(",")} subject=${subj}\n${text}`);
    return { sent: false, reason: "sdk-missing" };
  }

  const reply = safeAddress(replyTo);
  try {
    await ses.client.send(
      new ses.SendEmailCommand({
        FromEmailAddress: config.mail.from,
        Destination: { ToAddresses: recipients },
        ReplyToAddresses: reply ? [reply] : undefined,
        ConfigurationSetName: config.mail.configurationSet || undefined,
        Content: {
          Simple: {
            Subject: { Data: subj, Charset: "UTF-8" },
            Body: { Text: { Data: String(text || ""), Charset: "UTF-8" } },
          },
        },
      })
    );
    return { sent: true };
  } catch (err) {
    // The record is already stored at this point; a bounced notification is an
    // operations problem, not a reason to tell the visitor their form failed.
    console.error("[notify:failed]", subj, err);
    return { sent: false, reason: "send-failed" };
  }
}

/** Render "Label: value" lines, skipping blanks. */
export function detailLines(pairs) {
  return pairs
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
