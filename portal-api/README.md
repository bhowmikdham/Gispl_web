# GISPL Portal API

Multi-tenant read API behind the client portal (`portal/`, a Next.js static export served at `/portal`). Plain ESM JavaScript, Node >= 18, no build step, zero runtime dependencies in local mode (only `node:http`, `node:crypto`, `node:fs`). The AWS SDK v3 packages are `optionalDependencies` and are lazy-loaded only when AWS mode is on.

Two independent switches (see `.env.example`):

| Env var | Values | What it picks |
| --- | --- | --- |
| `STORE` | `file` (default) \| `dynamo` | Local JSON file persistence vs DynamoDB single-table |
| `AUTH_MODE` | `password` (default) \| `cognito` | Our own scrypt + HS256 JWT login vs Cognito token verification |

The frontend talks to this API when built with `NEXT_PUBLIC_PORTAL_MODE=api` and `NEXT_PUBLIC_API_BASE=<this API's URL>` (`portal/src/lib/providers/api.ts`): it POSTs `/auth/login`, stores the JWT, and sends it as a bearer token on every `/portal/*` fetch. Every data query is scoped to the `clientId` in the authenticated token — one tenant can never read another tenant's rows, and cross-tenant id lookups return 404.

## Quick start (local)

```sh
cd portal-api
npm install          # optional AWS deps; fine to skip if offline — local mode needs none
cp .env.example .env # defaults are already correct for local dev
npm start            # http://localhost:4000  (npm run dev = auto-restart on change)
```

Try it:

```sh
curl http://localhost:4000/health
# {"ok":true,"service":"gispl-portal-api"}

curl -s -X POST http://localhost:4000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"priya.nair@meridianfirst.example","password":"GisplDemo!2026"}'
# {"token":"...","expiresIn":28800,"user":{...}}

TOKEN=<token from above>
curl -s http://localhost:4000/portal/engagements -H "Authorization: Bearer $TOKEN"
```

On first start the file store auto-seeds demo data into `<DATA_DIR>/db.json` (default `./.data/db.json`). To reset to a fresh seed:

```sh
npm run seed   # deletes .data/db.json; next `npm start` re-seeds from src/store/seed-data.js
```

## API reference

All bodies are JSON. Routes marked **bearer** require `Authorization: Bearer <jwt>` (401 otherwise).

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | public | Liveness check → `{ok:true}` |
| POST | `/auth/login` | public | `{email,password}` → `{token,expiresIn,user:{email,name,clientId,clientName}}`, or 401 |
| GET | `/auth/me` | bearer | Current user → `{email,name,clientId,clientName}` |
| GET | `/portal/client` | bearer | The authenticated tenant's Client record |
| GET | `/portal/engagements` | bearer | Engagement[] for the tenant |
| GET | `/portal/engagements/:id` | bearer | One Engagement (id **or** slug), or 404 |
| GET | `/portal/findings?engagement=&severity=&status=&q=` | bearer | Finding[] (all filters optional) |
| GET | `/portal/findings/:id` | bearer | One Finding, or 404 |
| GET | `/portal/documents?engagement=&type=` | bearer | DocumentItem[] (filters optional) |
| GET | `/portal/documents/:id/url` | bearer | `{url, demo}` — local: `/files/placeholder.pdf`; dynamo: S3 presigned URL |

Routes live in `src/router.js`; handlers in `src/handlers.js`.

## Auth

**Password mode (default).** Passwords are stored as scrypt hashes (`src/auth/crypto-util.js`). A successful login (`src/auth/service.js`) issues an HS256 JWT signed with `JWT_SECRET`, valid for `TOKEN_TTL_SECONDS` (default 28800 = 8h). Signature checks use `timingSafeEqual`. The token's claims carry `clientId` — that is the tenant every handler filters by.

**Demo users** (both use password `GisplDemo!2026`, seeded from `src/store/seed-data.js`):

| Email | Tenant | Data |
| --- | --- | --- |
| `priya.nair@meridianfirst.example` | `cl-meridian` | 3 engagements, 18 findings, 10 docs |
| `ravi.menon@apexlogistics.example` | `cl-apex` | 1 engagement, 3 findings, 1 doc |

**Adding a real user:** add an entry to `USERS` (and, if new, `CLIENTS`) in `src/store/seed-data.js` — the plaintext password there is hashed at seed time — then reseed: `npm run seed` locally, or `node scripts/seed-dynamo.js` against DynamoDB (see below).

**Hard requirement:** set a strong, random `JWT_SECRET` in any shared or production environment. With `STORE=dynamo` and the dev default secret, the server **refuses to start** (`isProdSecretMissing()` in `src/config.js` — both the local server and the Lambda handler enforce it).

## Deploy to AWS (Lambda + DynamoDB + S3)

Prerequisites: AWS CLI and SAM CLI installed, AWS credentials configured for the target account/region.

1. **Build and deploy the stack** (the SAM stack wires API Gateway HTTP API → `src/lambda.js` → DynamoDB table + S3 bucket):

   ```sh
   cd portal-api
   sam build
   sam deploy --guided   # supply the JwtSecret and CorsOrigin parameters when prompted
   ```

   `JwtSecret` must be a strong random value; `CorsOrigin` should be the exact site origin (e.g. `https://www.example.com`), not `*`.

2. **Seed DynamoDB** with the stack outputs (table name, region):

   ```sh
   DDB_TABLE=<table from stack output> AWS_REGION=<region> node scripts/seed-dynamo.js
   ```

3. **Upload real document files.** Seeded documents point at `s3Key = documents/<id>.<ext>`; the demo only ships `files/placeholder.pdf`. Upload the real deliverables:

   ```sh
   aws s3 cp report.pdf s3://<bucket>/documents/<docId>.pdf
   ```

4. **Point the frontend at the API** using the `ApiUrl` stack output, then rebuild the site bundle:

   ```sh
   cd ../portal
   NEXT_PUBLIC_PORTAL_MODE=api NEXT_PUBLIC_API_BASE=<ApiUrl> npm run build
   cd ..
   python3 scripts/build-dist.py
   ```

### DynamoDB single-table layout

Table name from `DDB_TABLE` (default `gispl-portal`); keys are strings `PK`, `SK`:

| PK | SK | data |
| --- | --- | --- |
| `CLIENT#<clientId>` | `#META` | Client |
| `CLIENT#<clientId>` | `ENG#<engId>` | Engagement |
| `CLIENT#<clientId>` | `FND#<findId>` | Finding |
| `CLIENT#<clientId>` | `DOC#<docId>` | Document (incl. `s3Key`) |
| `USER#<email>` | `#USER` | `{email, name, clientId, passwordHash}` |

Lists are `Query(PK = CLIENT#<tenant>, begins_with(SK, ENG#/FND#/DOC#))`; client and user lookups are `GetItem`. Document downloads resolve to a presigned S3 `GetObject` URL (bucket `S3_BUCKET`, 300 s expiry) in `src/store/dynamo-store.js`.

## Switching demo ↔ real, and Cognito SSO

- **Demo → real data:** replace the fictional content in `src/store/seed-data.js` with real clients/users/engagements and reseed (local: `npm run seed`; AWS: `node scripts/seed-dynamo.js`), then upload the matching files under `documents/` in the S3 bucket. The store layer (`src/store/index.js`) is the only thing that changes between `file` and `dynamo` — handlers are identical.
- **Password → Cognito (optional):** set `AUTH_MODE=cognito` plus `COGNITO_REGION`, `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`. The API then verifies RS256 Cognito access/ID tokens against the pool's JWKS (`src/auth/cognito-verify.js`) instead of issuing its own JWTs; tokens must carry a `custom:clientId` claim mapping the user to their tenant. The frontend switches to the Cognito Hosted UI for sign-in and sends the Cognito token as the bearer.

## Security notes

- **`JWT_SECRET`** — never ship the dev default. The server hard-fails on start when `STORE=dynamo` and the secret is unchanged; treat any shared environment the same way even with the file store.
- **`CORS_ORIGINS`** — `*` is for local dev only. In production set it to the exact site origin(s), comma-separated (`src/http/cors.js` builds headers from this list).
- **Tenant isolation** — the tenant is taken from the verified token (`req.claims.clientId`), never from the request path or query. All store queries are keyed by it, so a valid token for tenant A cannot enumerate or fetch tenant B's ids (they 404).
- **Presigned URLs** — document links from `/portal/documents/:id/url` in dynamo mode expire after 300 seconds; hand them straight to the browser, don't persist them.
- **No PII in the repo** — all seeded organisations and people are fictional and use the reserved `.example` TLD.
