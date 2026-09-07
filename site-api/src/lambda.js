/* AWS Lambda adapter — API Gateway HTTP API (payload v2.0). Reuses the exact
   same router and handlers as the local server; only the request/response
   translation differs. Deploy this as the Lambda handler `src/lambda.handler`. */

import { getStore } from "./store/index.js";
import { handleRequest } from "./router.js";
import { corsHeaders } from "./http/cors.js";
import { isProdSecretMissing } from "./config.js";

// Fail closed: refuse to serve on the dev default secret in a Dynamo deploy.
// Anyone who knows it can forge a "confirmed" opt-in link, which is exactly
// the evidence the consent record is supposed to be. Guard runs in BOTH
// entrypoints (local server + this handler).
if (isProdSecretMissing()) {
  throw new Error("SITE_SECRET is the dev default while STORE=dynamo — set a strong SITE_SECRET before deploying.");
}

const MAX_BODY_BYTES = 64 * 1024;

let storePromise = null;

export async function handler(event) {
  if (!storePromise) storePromise = getStore(); // reused across warm invocations
  const store = await storePromise;

  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const path = event.rawPath || event.requestContext?.http?.path || event.path || "/";
  const headers = event.headers || {};
  const cors = corsHeaders(headers.origin || headers.Origin);

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  let body;
  if (event.body) {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    if (raw.length > MAX_BODY_BYTES) {
      return { statusCode: 413, headers: { ...cors, "Content-Type": "application/json" }, body: JSON.stringify({ error: "Request too large." }) };
    }
    try { body = JSON.parse(raw); } catch { body = undefined; }
  }

  const result = await handleRequest(
    {
      method,
      path,
      query: event.queryStringParameters || {},
      headers,
      body,
      // API Gateway resolves this itself; X-Forwarded-For is client-settable
      // and must not be trusted for a rate-limit key.
      clientIp: event.requestContext?.http?.sourceIp || null,
      userAgent: headers["user-agent"] || event.requestContext?.http?.userAgent || "",
    },
    { store }
  );

  const extra = result.headers || {};
  if (result.html !== undefined) {
    return { statusCode: result.status, headers: { ...cors, ...extra, "Content-Type": "text/html; charset=utf-8" }, body: result.html };
  }
  return {
    statusCode: result.status,
    headers: { ...cors, ...extra, "Content-Type": "application/json" },
    body: JSON.stringify(result.body),
  };
}
