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
npm test                  # 54 tests, no network, no AWS
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
| `POST` | `/v1/grievances` | A data-principal rights request or grievance under the DPDP Act (`/privacy/grievance/`). Returns a `GRV-` reference and the acknowledgement timelines. |

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
- **Rights requests and grievances** (§§11–14 and the s.13 mechanism) have their
  own endpoint, their own reference prefix and their own recipient
  (`MAIL_PRIVACY_TO`), so a statutory request can never sit in a sales queue.
  The acknowledgement promises 2 working days / 30 days; the Rules allow 90.
- `RETENTION_DAYS` (default 1095) drives a DynamoDB TTL on every record and an S3
  lifecycle rule on the CV prefix, so personal data is erased once its purpose is
  served rather than accumulating (§8(7)).
- Bump `PRIVACY_POLICY_VERSION` whenever the policy changes materially, so old
  records stay attributable to the text the person actually agreed to.

## Sending the mail: Resend or SES

The contact form is only worth having if the enquiry reaches a human without
the visitor doing anything else. That needs a server, because an API key cannot
live in a page. Two providers:

**Resend (recommended).** One API key and a verified sending domain. No AWS, no
SDK, nothing to install — the service makes a single HTTPS POST, so it runs on
any host that can reach the internet.

```bash
MAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxx
MAIL_FROM="GISPL <no-reply@gisconsulting.in>"   # domain must be verified in Resend
MAIL_LEADS_TO=info@gisconsulting.in
MAIL_CAREERS_TO=careers@gisconsulting.in
```

**SES.** Right if the stack is already AWS, but the account has to be moved out
of the SES sandbox first — inside it, mail is only delivered to addresses you
have separately verified, which looks exactly like working until a real
prospect submits the form.

Set neither and nothing breaks: submissions are still stored and the
notification is written to the log. `MAIL_PROVIDER` forces a provider; left
unset, a `RESEND_API_KEY` selects Resend and anything else falls back to SES.

The startup banner reports which one is actually in force — read it first when
mail is not arriving:

```
GISPL site API — store=memory mail=resend — http://localhost:4100
```

### Getting a lead into the sales inbox

`MAIL_LEADS_TO` receives the proposal requests. The notification carries the
whole enquiry and sets **Reply-To to the enquirer**, so sales can answer by
pressing Reply — no copying an address out of the body. Every mail carries the
short reference the visitor was shown on screen (`GIS-7DB62B4C`), so a follow-up
call can be matched to the submission.

## Where to run it

The website is static; the API is not, and it needs somewhere to live.

**Without AWS** — set `STORE=memory` and deploy to any Node host or serverless
platform. The lead and application endpoints work fully: the notification email
is the record. Nothing persists across restarts, which is fine for those two
and **not** fine for the newsletter, whose double opt-in needs the pending
subscriber to still exist when the confirmation link is clicked minutes later.
Offer the newsletter and you need a durable store.

**With AWS** — `STORE=dynamo` and the SAM stack in `infra/template.yaml`. This
is the full service: durable records, TTL-based retention, presigned CV uploads.

Either way the last step is the same — point the site at it and rebuild:

```bash
python3 scripts/build-dist.py --api-base https://api.example.com
```

Without `--api-base` every form keeps the `mailto:` handoff. That is what the
GitHub Pages review deploy runs on, and it is why the live review site still
opens the visitor's mail client: the code path exists, the base URL is empty.

## Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `4100` | Local server only. |
| `STORE` | `file` | `file` \| `memory` \| `dynamo`. `memory` needs no disk and no AWS; newsletter opt-in will not work on it. |
| `DATA_DIR` | `./.data` | File store location. |
| `SITE_SECRET` | `dev-only-change-me` | Signs confirm/unsubscribe links and the rate-limit keys. **Both entrypoints refuse to start** on the default with `STORE=dynamo`. |
| `SITE_BASE` | `http://localhost:8080` | Website origin; used for the "back to the site" links. |
| `API_BASE` | `http://localhost:$PORT` | Public origin of *this* API. The confirmation links in email are built from it — a wrong value 404s in the subscriber's inbox. |
| `CORS_ORIGINS` | `*` | Comma-separated. Pin it in production. |
| `MAIL_PROVIDER` | auto | `resend` \| `ses`. Unset ⇒ `resend` when `RESEND_API_KEY` is set, else `ses`. |
| `RESEND_API_KEY` | *(empty)* | Resend key. Required for `MAIL_PROVIDER=resend`. |
| `MAIL_FROM` | *(empty)* | Verified sender, `Name <addr>` accepted. Empty ⇒ notifications are logged, submissions still stored. |
| `MAIL_LEADS_TO` | `info@gisconsulting.in` | Comma-separated. |
| `MAIL_CAREERS_TO` | `careers@gisconsulting.in` | Comma-separated. |
| `MAIL_PRIVACY_TO` | `info@gisconsulting.in` | The Grievance Officer's inbox. Comma-separated. Give it a dedicated mailbox before go-live. |
| `UPLOAD_BUCKET` | *(empty)* | Empty ⇒ no CV upload; the careers form asks the candidate to email it. |
| `MAX_CV_BYTES` | `8388608` | Enforced by the presigned policy, not the client. |
| `PRIVACY_POLICY_VERSION` | `2026-09-10` | Stamped into consent records. |
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

- Verify the sending domain with your provider. On Resend that is a DNS record
  and a few minutes; on SES it also means moving the account **out of the
  sandbox**, since inside it SES only delivers to addresses you have separately
  verified and confirmation emails silently fail.
- Publish SPF/DKIM/DMARC for `gisconsulting.in` so the confirmation email is not
  filed as spam. A double opt-in that lands in junk reads as a broken form.
- Confirm `info@` and `careers@gisconsulting.in` are monitored mailboxes.
- Pin `CorsOrigin` to the real site origin.
