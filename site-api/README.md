# GISPL site API

The public website's lead-capture service: the proposal form on `contact.html`,
the DPDP checklist gate on `dpdp-readiness.html`, the newsletter signup on the
insights pages, and job applications on `/careers/roles/<slug>/`.

Before this existed, every one of those forms handed off to `mailto:` — the lead
only arrived if the visitor had a mail client configured and pressed send in it.
The website now posts to this service when an API base is configured, and falls
back to the same `mailto:` handoff when it is not, so an unconfigured deploy
degrades to the previous behaviour rather than losing the lead.

Deployed **separately from `portal-api`** on purpose. This is a public,
unauthenticated *write* surface; the portal is an authenticated, read-only one.
Separate stacks mean abuse here cannot reach client data there, and the portal
keeps its read-only IAM policy.

## Run it locally

```bash
cd site-api
npm start                 # http://localhost:4100
npm test                  # 37 tests, no network, no AWS
```

With no configuration it stores to `.data/site.json` and prints the
notification emails to the console — including the confirmation link, so the
double opt-in can be walked end to end offline.

```bash
curl -s localhost:4100/v1/leads -H 'content-type: application/json' -d '{
  "name":"Priya Nair","email":"priya@example.com","company":"Meridian First Bank",
  "service":"VAPT & Pen Testing","message":"Pen test before the SEBI audit.",
  "consent":true }'
```

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Liveness. |
| `POST` | `/v1/leads` | Proposal request (`source: contact-form`) or DPDP checklist gate (`source: dpdp-checklist`). |
| `POST` | `/v1/subscribe` | Newsletter signup — records a **pending** subscriber and emails a confirmation link. |
| `GET` | `/v1/subscribe/confirm?token=` | The link from that email. Marks the subscriber confirmed, returns a page. |
| `GET` | `/v1/unsubscribe?token=` | One-click unsubscribe. Returns a page. |
| `POST` | `/v1/applications` | Job application; returns a presigned S3 POST for the CV when uploads are configured. |

Every endpoint is public. **None of them reads a stored record back out** — there
is no `GET /v1/leads`. The notification email is the operational channel; the
DynamoDB table (and its `GSI1`, keyed `TYPE#lead` / `createdAt`) is the archive.
That is what stops a public write API from also being a customer-data leak.

### Response shape

```jsonc
// 200
{ "ok": true, "ref": "GIS-3F91A20C", "message": "…" }
// 400 — render `fields` inline against the form
{ "error": "Please check the highlighted fields.", "fields": { "email": "Enter a valid work email." } }
// 429 — with a Retry-After header
{ "error": "Too many submissions from this address. …" }
```

## What protects it

No CAPTCHA and no third-party script (both would be another vendor processing
visitor data, which is the opposite of the point on a DPDP page).

- **Declared fields only.** `validate.js` drops anything not in the route's spec,
  so the stored record and the notification email have a fixed shape no matter
  what is posted.
- **Control characters stripped** from single-line fields — a `\r\n` in a name
  would otherwise reach an email header.
- **Honeypot** (`website`) plus a **timing check** (`renderedAt`): a submission
  that arrives faster than `MIN_FILL_SECONDS` was scripted. Both are answered
  with an ordinary success response, so the bot learns nothing.
- **Per-IP, per-route rate limit**, counted against an HMAC of the address so the
  counter partition never becomes a visitor log. Fail-open: if the counter store
  is down the submission is accepted, because losing a real proposal request is
  worse than admitting spam during an outage.
- **Stage throttling** on the HTTP API caps the aggregate, so a distributed flood
  cannot run up an unbounded Lambda + SES bill.
- **64 KB body cap** in both entrypoints.
- **Purpose-bound HMAC tokens**: a confirmation link cannot be replayed as an
  unsubscribe, and vice versa.

## DPDP posture

- Every record carries a **consent block** — the wording that was agreed to, the
  privacy-policy version, the timestamp, the IP and the user agent. Under DPDP
  §6 the burden of proving consent sits with the data fiduciary, and a `mailto:`
  proved nothing.
- The contact form has an explicit checkbox and is **rejected without it**. The
  DPDP checklist gate carries a visible notice instead of a checkbox; it records
  that notice as the consent basis. If legal wants a checkbox there too, add one
  to `dpdp-readiness.html` and switch the `source === "contact-form"` test in
  `handlers.js` to cover both sources.
- The newsletter is **double opt-in**. Nothing is ever sent to an address that
  has not clicked the emailed link, and a confirmed address is never re-mailed a
  confirmation link (which would let a stranger use the form to spam an inbox).
- Unsubscribing **keeps** the record — it is the suppression list. Deleting it
  would let the next form post silently resubscribe the address.
- `RETENTION_DAYS` (default 1095) drives a DynamoDB TTL on every record and an S3
  lifecycle rule on the CV prefix, so personal data is erased once its purpose is
  served rather than accumulating (§8(7)).
- Bump `PRIVACY_POLICY_VERSION` whenever the policy changes materially, so old
  records stay attributable to the text the person actually agreed to.

## Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `4100` | Local server only. |
| `STORE` | `file` | `file` \| `dynamo`. |
| `DATA_DIR` | `./.data` | File store location. |
| `SITE_SECRET` | `dev-only-change-me` | Signs confirm/unsubscribe links and the rate-limit keys. **Both entrypoints refuse to start** on the default with `STORE=dynamo`. |
| `SITE_BASE` | `http://localhost:8080` | Website origin; used for the "back to the site" links. |
| `API_BASE` | `http://localhost:$PORT` | Public origin of *this* API. The confirmation links in email are built from it — a wrong value 404s in the subscriber's inbox. |
| `CORS_ORIGINS` | `*` | Comma-separated. Pin it in production. |
| `MAIL_FROM` | *(empty)* | SES-verified sender. Empty ⇒ notifications are logged, submissions still stored. |
| `MAIL_LEADS_TO` | `info@gisconsulting.in` | Comma-separated. |
| `MAIL_CAREERS_TO` | `careers@gisconsulting.in` | Comma-separated. |
| `UPLOAD_BUCKET` | *(empty)* | Empty ⇒ no CV upload; the careers form asks the candidate to email it. |
| `MAX_CV_BYTES` | `8388608` | Enforced by the presigned policy, not the client. |
| `PRIVACY_POLICY_VERSION` | `2026-08-17` | Stamped into consent records. |
| `RETENTION_DAYS` | `1095` | DynamoDB TTL + S3 lifecycle. |
| `RATE_MAX` / `RATE_WINDOW_SECONDS` | `5` / `3600` | Per IP, per route. |
| `MIN_FILL_SECONDS` | `3` | Timing check threshold. |

Rotating `SITE_SECRET` invalidates every confirmation and unsubscribe link
already sitting in someone's inbox. Treat it as a planned event, not a routine
credential rotation.

## Deploy

```bash
cd site-api
npm install --omit=dev --include=optional     # AWS SDK, only needed for the bundle
sam deploy --guided \
  --template infra/template.yaml \
  --parameter-overrides \
      SiteSecret=$(openssl rand -hex 32) \
      SiteBase=https://www.example.com \
      CorsOrigin=https://www.example.com \
      MailFrom=no-reply@gisconsulting.in
```

Two-step, because the confirmation links need the API's own URL:

1. Deploy with `ApiBase` blank. The function falls back to the API Gateway URL,
   which is correct unless a CDN fronts it.
2. If `/api/*` is routed through the site's CDN, redeploy with
   `ApiBase=https://www.example.com/api`.

Then point the website at it — one constant in `assets/js/api.js`, or at build
time:

```bash
python3 scripts/build-dist.py --api-base https://www.example.com/api
```

With no `--api-base` the site keeps the `mailto:` fallback, which is what the
GitHub Pages review deploy runs on.

### Before it goes live

- Verify the `MailFrom` identity in SES, and move the account **out of the SES
  sandbox** — in the sandbox, SES will only deliver to verified addresses, so
  subscriber confirmation emails silently fail.
- Publish SPF/DKIM/DMARC for `gisconsulting.in` so the confirmation email is not
  filed as spam. A double opt-in that lands in junk reads as a broken form.
- Confirm `info@` and `careers@gisconsulting.in` are monitored mailboxes.
- Pin `CorsOrigin` to the real site origin.
