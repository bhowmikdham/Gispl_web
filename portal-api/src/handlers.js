/* Route handlers. Framework-agnostic: each takes a normalized request
   { method, path, params, query, headers, body, claims, selfBase } and the
   ctx { store }, and returns { status, body }. Auth is enforced by the router
   BEFORE these run (except the ones marked public in routes.js), so
   `claims.clientId` is always the authenticated tenant here. */

import { login } from "./auth/service.js";

export async function health() {
  return { status: 200, body: { ok: true, service: "gispl-portal-api" } };
}

export async function postLogin(req, ctx) {
  const { email, password } = req.body || {};
  if (!email || !password) return { status: 400, body: { error: "email and password are required" } };
  const result = await login(ctx.store, email, password);
  if (!result) return { status: 401, body: { error: "Incorrect email or password." } };
  return { status: 200, body: result };
}

export async function getMe(req) {
  const c = req.claims;
  return { status: 200, body: { email: c.email, name: c.name, clientId: c.clientId, clientName: c.clientName } };
}

export async function getClient(req, ctx) {
  const client = await ctx.store.getClient(req.claims.clientId);
  if (!client) return { status: 404, body: { error: "Client not found" } };
  return { status: 200, body: client };
}

export async function listEngagements(req, ctx) {
  return { status: 200, body: await ctx.store.listEngagements(req.claims.clientId) };
}

export async function getEngagement(req, ctx) {
  const e = await ctx.store.getEngagement(req.claims.clientId, req.params.id);
  if (!e) return { status: 404, body: { error: "Engagement not found" } };
  return { status: 200, body: e };
}

export async function listFindings(req, ctx) {
  const { engagement, severity, status, q } = req.query;
  const items = await ctx.store.listFindings(req.claims.clientId, { engagementId: engagement, severity, status, q });
  return { status: 200, body: items };
}

export async function getFinding(req, ctx) {
  const f = await ctx.store.getFinding(req.claims.clientId, req.params.id);
  if (!f) return { status: 404, body: { error: "Finding not found" } };
  return { status: 200, body: f };
}

export async function listDocuments(req, ctx) {
  const { engagement, type } = req.query;
  const items = await ctx.store.listDocuments(req.claims.clientId, { engagementId: engagement, type });
  return { status: 200, body: items };
}

export async function getDocumentUrl(req, ctx) {
  const doc = await ctx.store.getDocument(req.claims.clientId, req.params.id);
  if (!doc) return { status: 404, body: { error: "Document not found" } };
  const out = await ctx.store.documentUrl(doc, req.selfBase);
  return { status: 200, body: out };
}
