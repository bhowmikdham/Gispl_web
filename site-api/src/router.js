/* Tiny framework-agnostic router — the same shape as portal-api's, minus the
   auth layer, because every route here is public by design.

   Shared by the local HTTP server and the Lambda adapter, so a request behaves
   identically on a laptop and in production. */

import * as h from "./handlers.js";

// [method, pattern, handler]
const ROUTES = [
  ["GET", "/health", h.health],
  ["POST", "/v1/leads", h.postLead],
  ["POST", "/v1/subscribe", h.postSubscribe],
  ["GET", "/v1/subscribe/confirm", h.getSubscribeConfirm],
  ["GET", "/v1/unsubscribe", h.getUnsubscribe],
  ["POST", "/v1/applications", h.postApplication],
];

const compiled = ROUTES.map(([method, pattern, handler]) => ({
  method,
  parts: pattern.split("/").filter(Boolean),
  handler,
}));

function match(method, path) {
  const segs = path.split("/").filter(Boolean);
  for (const r of compiled) {
    if (r.method !== method) continue;
    if (r.parts.length !== segs.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < r.parts.length; i++) {
      const p = r.parts[i];
      if (p.startsWith(":")) params[p.slice(1)] = decodeURIComponent(segs[i]);
      else if (p !== segs[i]) { ok = false; break; }
    }
    if (ok) return { route: r, params };
  }
  return null;
}

/**
 * req: { method, path, query, headers, body, clientIp, userAgent }.
 * Returns { status, body } for JSON routes, or { status, html } for the
 * inbox-link routes. `headers` on the result are extra response headers.
 */
export async function handleRequest(req, ctx) {
  const m = match(req.method, req.path);
  if (!m) return { status: 404, body: { error: "Not found" } };

  const request = { ...req, params: m.params, query: req.query || {} };

  try {
    return await m.route.handler(request, ctx);
  } catch (err) {
    // Never echo the error: these endpoints are unauthenticated, and the stack
    // would describe the store layout to anyone who can post a malformed body.
    console.error("handler error", req.method, req.path, err);
    return { status: 500, body: { error: "Something went wrong on our side. Please email info@gisconsulting.in." } };
  }
}
