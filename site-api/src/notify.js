/* Outbound email via SES v2 — the channel that actually gets a lead in front
   of a human. Optional by design:

     MAIL_FROM unset  → the notification is written to the log and the record is
                        still stored. That is the local-dev mode, and it is also
                        the safe failure mode: a submission is never rejected
                        because email is down.

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
