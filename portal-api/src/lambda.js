/* AWS Lambda adapter — API Gateway HTTP API (payload v2.0). Reuses the exact
   same router and handlers as the local server; only the request/response
   translation differs. Deploy this as the Lambda handler `lambda.handler`. */

import { getStore } from "./store/index.js";
import { handleRequest } from "./router.js";
import { corsHeaders } from "./http/cors.js";
import { isProdSecretMissing } from "./config.js";

// Fail closed: refuse to serve on the dev default secret in a Dynamo deploy —
// otherwise tokens could be forged against a publicly-known key. This guard
// runs in BOTH entrypoints (local server + this Lambda handler).
if (isProdSecretMissing()) {
  throw new Error("JWT_SECRET is the dev default while STORE=dynamo — set a strong JWT_SECRET before deploying.");
}

let storePromise = null;

export async function handler(event) {
  if (!storePromise) storePromise = getStore(); // reused across warm invocations
  const store = await storePromise;

  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const path = event.rawPath || event.requestContext?.http?.path || event.path || "/";
  const headers = event.headers || {};
  const origin = headers.origin || headers.Origin;
  const cors = corsHeaders(origin);

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  const query = event.queryStringParameters || {};
  let body;
  if (event.body) {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    try { body = JSON.parse(raw); } catch { body = undefined; }
  }
  const proto = headers["x-forwarded-proto"] || "https";
  const host = headers.host || headers.Host || "";
  const selfBase = `${proto}://${host}`;

  const result = await handleRequest({ method, path, query, headers, body, selfBase }, { store });

  return {
    statusCode: result.status,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify(result.body),
  };
}
