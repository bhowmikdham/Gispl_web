/* Tiny framework-agnostic router. Matches method + path pattern (with :params),
   enforces bearer auth on non-public routes, and dispatches to a handler.
   Shared by the local HTTP server and the Lambda adapter. */

import * as h from "./handlers.js";
import { authenticate, bearerFrom } from "./auth/service.js";

// [method, pattern, handler, { public }]
const ROUTES = [
  ["GET", "/health", h.health, { public: true }],
  ["POST", "/auth/login", h.postLogin, { public: true }],
  ["GET", "/auth/me", h.getMe],
  ["GET", "/portal/client", h.getClient],
  ["GET", "/portal/engagements", h.listEngagements],
  ["GET", "/portal/engagements/:id", h.getEngagement],
  ["GET", "/portal/findings", h.listFindings],
  ["GET", "/portal/findings/:id", h.getFinding],
  ["GET", "/portal/documents", h.listDocuments],
  ["GET", "/portal/documents/:id/url", h.getDocumentUrl],
];

const compiled = ROUTES.map(([method, pattern, handler, opts]) => {
  const parts = pattern.split("/").filter(Boolean);
  return { method, parts, handler, opts: opts || {} };
});

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

/** req: { method, path, query, headers, body, selfBase }. Returns { status, body }. */
export async function handleRequest(req, ctx) {
  const m = match(req.method, req.path);
  if (!m) return { status: 404, body: { error: "Not found" } };

  const request = { ...req, params: m.params, query: req.query || {} };

  if (!m.route.opts.public) {
    const claims = await authenticate(bearerFrom(req.headers || {}));
    if (!claims || !claims.clientId) return { status: 401, body: { error: "Unauthorized" } };
    request.claims = claims;
  }

  try {
    return await m.route.handler(request, ctx);
  } catch (err) {
    if (globalThis.console) console.error("handler error", req.method, req.path, err);
    return { status: 500, body: { error: "Internal error" } };
  }
}
