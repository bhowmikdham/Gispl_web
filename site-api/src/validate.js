/* Input validation for the public form endpoints.

   Everything that arrives here is attacker-controlled, so each field is
   declared up front and anything undeclared is dropped rather than stored.
   That keeps the record shape fixed no matter what the client posts, and
   means a new field cannot be smuggled into a notification email. */

// Deliberately permissive: the RFC-legal grammar is far wider than this, but a
// stricter pattern rejects real addresses. The double opt-in is what actually
// proves an address exists — this only catches typos and obvious junk.
const EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>".]+\.[^\s@,;<>"]{2,}$/;
const PHONE_RE = /^[+0-9][0-9\s()\-.]{5,24}$/;

/* C0/C1 control characters. The "keep" variant preserves tab, newline and
   carriage return so a textarea's line breaks survive; the strict variant
   strips them too, because a header-injection newline has no business in a
   single-line field that later lands in an email subject. */
const CTRL_ALL = /[\u0000-\u001F\u007F-\u009F]/g;
const CTRL_KEEP_NEWLINES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

/** Replace control characters with a space. `keepNewlines` for textarea fields. */
function stripControls(s, keepNewlines) {
  return s.replace(keepNewlines ? CTRL_KEEP_NEWLINES : CTRL_ALL, " ");
}

function asString(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return ""; // objects/arrays are never valid input for a text field
}

/**
 * spec: { field: { type, required, max, values, label } }
 *   type: "text" | "longtext" | "email" | "phone" | "choice" | "bool" | "slug"
 * Returns { ok, value, errors } — `value` holds ONLY declared fields.
 */
export function validate(spec, body) {
  const src = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  const value = {};
  const errors = {};

  for (const [field, rule] of Object.entries(spec)) {
    const label = rule.label || field;
    const max = rule.max || 200;

    if (rule.type === "bool") {
      const raw = src[field];
      const on = raw === true || raw === "true" || raw === "on" || raw === 1 || raw === "1";
      if (rule.required && !on) errors[field] = `${label} is required.`;
      value[field] = on;
      continue;
    }

    let v = stripControls(asString(src[field]), rule.type === "longtext").trim();

    if (!v) {
      if (rule.required) errors[field] = `${label} is required.`;
      value[field] = "";
      continue;
    }

    if (v.length > max) {
      errors[field] = `${label} must be ${max} characters or fewer.`;
      continue;
    }

    switch (rule.type) {
      case "email":
        v = v.toLowerCase();
        if (!EMAIL_RE.test(v)) errors[field] = `Enter a valid ${label.toLowerCase()}.`;
        break;
      case "phone":
        if (!PHONE_RE.test(v)) errors[field] = `Enter a valid ${label.toLowerCase()}.`;
        break;
      case "choice":
        // Unknown option → keep the record clean rather than storing free text
        // that the site's own <select> could never have produced.
        if (rule.values && !rule.values.includes(v)) errors[field] = `Choose a valid ${label.toLowerCase()}.`;
        break;
      case "slug":
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) errors[field] = `${label} is not a valid identifier.`;
        break;
      default:
        break;
    }

    value[field] = v;
  }

  return { ok: Object.keys(errors).length === 0, value, errors };
}

/**
 * Bot heuristics that need no CAPTCHA and no third-party script.
 *   `website`  — honeypot input, positioned off-screen; humans never fill it.
 *   `renderedAt` — epoch ms stamped when the form was rendered; a submission
 *                  that arrives faster than a human could type was scripted.
 * Returns a reason string when the submission looks automated, else null.
 */
export function botReason(body, minFillSeconds) {
  const src = body && typeof body === "object" ? body : {};
  if (asString(src.website).trim()) return "honeypot";

  const rendered = Number(src.renderedAt);
  if (Number.isFinite(rendered) && rendered > 0) {
    const elapsed = (Date.now() - rendered) / 1000;
    // Negative means a clock skew or a forged stamp; only the too-fast case is
    // treated as a bot, so a user whose clock is wrong is never blocked.
    if (elapsed >= 0 && elapsed < minFillSeconds) return "too-fast";
  }
  return null;
}

export { EMAIL_RE };
