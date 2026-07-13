/* Local persistence: seeds from seed-data.js on first run, writes to
   <dataDir>/db.json. Zero external dependencies. Same query surface as the
   DynamoDB store so handlers don't know which one they're talking to. */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { config } from "../config.js";
import { hashPassword } from "../auth/crypto-util.js";
import { CLIENTS, USERS, ENGAGEMENTS, FINDINGS, DOCUMENTS } from "./seed-data.js";
import { engagementIdsForClient, filterFindings, filterDocuments, scrubFinding } from "./filters.js";

function seededDb() {
  return {
    clients: CLIENTS,
    users: USERS.map((u) => ({ email: u.email.toLowerCase(), name: u.name, clientId: u.clientId, passwordHash: hashPassword(u.password) })),
    engagements: ENGAGEMENTS,
    findings: FINDINGS.map(scrubFinding),
    documents: DOCUMENTS,
  };
}

export function createFileStore() {
  const dir = resolve(config.dataDir);
  const file = join(dir, "db.json");
  let db = null;

  function load() {
    if (db) return db;
    if (existsSync(file)) {
      db = JSON.parse(readFileSync(file, "utf8"));
    } else {
      db = seededDb();
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(file, JSON.stringify(db, null, 2));
    }
    return db;
  }

  return {
    async ready() {
      load();
    },
    async getUserByEmail(email) {
      const d = load();
      return d.users.find((u) => u.email === String(email).toLowerCase()) || null;
    },
    async getClient(clientId) {
      const d = load();
      return d.clients.find((c) => c.id === clientId) || null;
    },
    async listEngagements(clientId) {
      const d = load();
      return d.engagements
        .filter((e) => e.clientId === clientId)
        .slice()
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    },
    async getEngagement(clientId, idOrSlug) {
      const d = load();
      return d.engagements.find((e) => e.clientId === clientId && (e.id === idOrSlug || e.slug === idOrSlug)) || null;
    },
    async listFindings(clientId, filter) {
      const d = load();
      return filterFindings(d.findings, engagementIdsForClient(d.engagements, clientId), filter);
    },
    async getFinding(clientId, id) {
      const d = load();
      const engIds = engagementIdsForClient(d.engagements, clientId);
      return d.findings.find((x) => (x.id === id || x.slug === id) && engIds.has(x.engagementId)) || null;
    },
    async listDocuments(clientId, filter) {
      const d = load();
      return filterDocuments(d.documents, engagementIdsForClient(d.engagements, clientId), filter);
    },
    async getDocument(clientId, id) {
      const d = load();
      const engIds = engagementIdsForClient(d.engagements, clientId);
      return d.documents.find((x) => (x.id === id || x.slug === id) && engIds.has(x.engagementId)) || null;
    },
    // local mode: every deliverable resolves to the branded placeholder PDF
    async documentUrl(_doc, selfBase) {
      const base = config.filesBase || selfBase || "";
      return { url: base + "/files/placeholder.pdf", demo: true };
    },
  };
}
