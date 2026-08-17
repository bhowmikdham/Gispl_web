/* The two endpoints a person reaches by clicking a link in their inbox return
   a page, not JSON. These are deliberately self-contained: no stylesheet, no
   font file, no script — the API host has none of the site's assets, and a
   confirmation page that half-loads reads as a broken subscription.

   They carry the Fusion palette (navy ground, orange accent) with a system
   font stack, so they look related to the site without pretending to be a page
   of it. */

import { config } from "./config.js";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SANS = "'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,monospace";

function shell({ title, eyebrow, heading, body, links }) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>${esc(title)} — GISPL</title>
</head>
<body style="margin:0;background:#07142B;color:#fff;font:400 16px/1.6 ${SANS};display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
<main style="max-width:560px;width:100%;background:#0C2136;border:1px solid rgba(255,255,255,.1);border-top:2px solid #F26A21;border-radius:14px;padding:40px 36px">
  <span style="display:block;font:500 11px ${MONO};letter-spacing:.18em;color:#F26A21">${esc(eyebrow)}</span>
  <h1 style="font:700 28px/1.15 ${SANS};letter-spacing:-.02em;margin:14px 0 12px">${esc(heading)}</h1>
  ${body}
  <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);font:400 14px/1.6 ${SANS};color:rgba(255,255,255,.55)">
    ${links}
  </p>
</main>
</body></html>`;
}

function backLink() {
  let host = config.siteBase;
  // label the link with the site's hostname rather than a hard-coded domain —
  // the production domain is still being settled and this must not go stale
  try { host = new URL(config.siteBase).host; } catch { /* keep the raw value */ }
  return `<a href="${esc(config.siteBase)}/" style="color:#F4915A;text-decoration:none">Back to ${esc(host)}</a>`;
}

export function confirmedPage(email, unsubUrl) {
  return shell({
    title: "Subscription confirmed",
    eyebrow: "SUBSCRIPTION CONFIRMED",
    heading: "You are on the list.",
    body:
      `<p style="margin:0 0 14px;color:rgba(255,255,255,.8)">We will send GISPL insights to ` +
      `<strong style="color:#fff">${esc(email)}</strong> — new research, regulatory deadlines and ` +
      `field notes from our consultants. No more than a couple of emails a month.</p>` +
      `<p style="margin:0;color:rgba(255,255,255,.55);font-size:14px">Changed your mind? ` +
      `<a href="${esc(unsubUrl)}" style="color:#F4915A">Unsubscribe</a> — the link keeps working, ` +
      `so you can leave it in your inbox.</p>`,
    links: backLink(),
  });
}

export function unsubscribedPage(email) {
  return shell({
    title: "Unsubscribed",
    eyebrow: "UNSUBSCRIBED",
    heading: "You are off the list.",
    body:
      `<p style="margin:0;color:rgba(255,255,255,.8)">We have stopped sending insights to ` +
      `<strong style="color:#fff">${esc(email)}</strong>. Nothing else changes — if you have an ` +
      `open enquiry or engagement with us, that carries on as normal.</p>`,
    links: backLink(),
  });
}

export function badLinkPage(reason) {
  return shell({
    title: "Link not valid",
    eyebrow: "LINK NOT VALID",
    heading: "That link did not work.",
    body:
      `<p style="margin:0 0 14px;color:rgba(255,255,255,.8)">${esc(reason)}</p>` +
      `<p style="margin:0;color:rgba(255,255,255,.55);font-size:14px">Subscribe again from the ` +
      `insights page, or write to <a href="mailto:info@gisconsulting.in" style="color:#F4915A">` +
      `info@gisconsulting.in</a> and we will sort it out by hand.</p>`,
    links: `<a href="${esc(config.siteBase)}/insights/" style="color:#F4915A;text-decoration:none">Go to Insights</a>`,
  });
}
