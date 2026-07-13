/* Pure query helpers shared by every store implementation — so filtering,
   sorting and tenant-scoping behave identically whether data comes from a
   local file or DynamoDB. */

const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

export function engagementIdsForClient(engagements, clientId) {
  return new Set(engagements.filter((e) => e.clientId === clientId).map((e) => e.id));
}

export function filterFindings(findings, engIds, f = {}) {
  let out = findings.filter((x) => engIds.has(x.engagementId));
  if (f.engagementId) out = out.filter((x) => x.engagementId === f.engagementId);
  if (f.severity) out = out.filter((x) => x.severity === f.severity);
  if (f.status) out = out.filter((x) => x.status === f.status);
  if (f.q) {
    const q = String(f.q).trim().toLowerCase();
    out = out.filter((x) => (x.title + " " + x.id + " " + x.category + " " + x.affectedAsset).toLowerCase().includes(q));
  }
  return out
    .slice()
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || String(b.reportedAt).localeCompare(String(a.reportedAt)));
}

export function filterDocuments(documents, engIds, f = {}) {
  let out = documents.filter((x) => engIds.has(x.engagementId));
  if (f.engagementId) out = out.filter((x) => x.engagementId === f.engagementId);
  if (f.type) out = out.filter((x) => x.type === f.type);
  return out.slice().sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt)));
}

export function scrubFinding(x) {
  // strip undefined fields for clean JSON
  const o = { ...x };
  Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]);
  return o;
}
