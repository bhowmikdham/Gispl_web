/* LocalProvider — the demo backend. Everything lives in the browser's
   localStorage, seeded once from the typed seed module. Namespaced
   gispl:portal:* so it can never clobber the public site's seeded
   content or the admin panel's data. */

import { config } from "../config";
import { asset } from "../paths";
import { clearSession, readSession, writeSession } from "../auth/session";
import { DEMO_CLIENT, DEMO_DOCUMENTS, DEMO_ENGAGEMENTS, DEMO_FINDINGS, DEMO_LOGIN } from "../seed/seed-data";
import type { Client, DocumentItem, Engagement, Finding, Session } from "../types";
import type { AuthProvider, DataProvider, FindingFilter } from "./types";

const K = {
  client: "gispl:portal:client",
  engagements: "gispl:portal:engagements",
  findings: "gispl:portal:findings",
  documents: "gispl:portal:documents",
  // bump the version suffix whenever seed-data.ts changes
  seeded: "gispl:portal:seeded:v1",
};

function jget<T>(key: string, dflt: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : dflt;
  } catch {
    return dflt;
  }
}

function seed(): void {
  localStorage.setItem(K.client, JSON.stringify(DEMO_CLIENT));
  localStorage.setItem(K.engagements, JSON.stringify(DEMO_ENGAGEMENTS));
  localStorage.setItem(K.findings, JSON.stringify(DEMO_FINDINGS));
  localStorage.setItem(K.documents, JSON.stringify(DEMO_DOCUMENTS));
  localStorage.setItem(K.seeded, "1");
}

const SEVERITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

export const localData: DataProvider = {
  ready() {
    if (typeof window !== "undefined" && !localStorage.getItem(K.seeded)) seed();
    return Promise.resolve();
  },
  getClient() {
    return this.ready().then(() => jget<Client>(K.client, DEMO_CLIENT));
  },
  listEngagements() {
    return this.ready().then(() => jget<Engagement[]>(K.engagements, []));
  },
  getEngagement(idOrSlug: string) {
    return this.listEngagements().then(
      (all) => all.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || null
    );
  },
  listFindings(filter?: FindingFilter) {
    return this.ready().then(() => {
      let out = jget<Finding[]>(K.findings, []);
      if (filter?.engagementId) out = out.filter((x) => x.engagementId === filter.engagementId);
      if (filter?.severity) out = out.filter((x) => x.severity === filter.severity);
      if (filter?.status) out = out.filter((x) => x.status === filter.status);
      if (filter?.q) {
        const q = filter.q.trim().toLowerCase();
        out = out.filter((x) =>
          (x.title + " " + x.id + " " + x.category + " " + x.affectedAsset).toLowerCase().includes(q)
        );
      }
      return out
        .slice()
        .sort(
          (a, b) =>
            SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
            b.reportedAt.localeCompare(a.reportedAt)
        );
    });
  },
  getFinding(id: string) {
    return this.ready().then(
      () => jget<Finding[]>(K.findings, []).find((x) => x.id === id || x.slug === id) || null
    );
  },
  listDocuments(filter?) {
    return this.ready().then(() => {
      let out = jget<DocumentItem[]>(K.documents, []);
      if (filter?.engagementId) out = out.filter((x) => x.engagementId === filter.engagementId);
      if (filter?.type) out = out.filter((x) => x.type === filter.type);
      return out.slice().sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
    });
  },
  getDocumentUrl() {
    // every demo deliverable serves the same branded placeholder PDF
    return Promise.resolve({ url: asset("/demo-docs/placeholder.pdf"), demo: true });
  },
  resetDemo() {
    Object.values(K).forEach((k) => localStorage.removeItem(k));
    seed();
    return Promise.resolve();
  },
};

export const localAuth: AuthProvider = {
  getSession: readSession,
  signIn(email: string, password: string) {
    const okEmail = email.trim().toLowerCase() === DEMO_LOGIN.email;
    if (!okEmail || password !== DEMO_LOGIN.password) {
      return Promise.reject(new Error("Incorrect email or password. Use the demo credentials shown below."));
    }
    const now = Date.now();
    const s: Session = {
      mode: "demo",
      email: DEMO_LOGIN.email,
      name: DEMO_LOGIN.name,
      clientId: DEMO_CLIENT.id,
      clientName: DEMO_CLIENT.name,
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + config.SESSION_HOURS * 3600_000).toISOString(),
    };
    writeSession(s);
    return Promise.resolve(s);
  },
  beginHostedUiLogin() {
    throw new Error("Hosted UI login is API-mode only");
  },
  completeHostedUiLogin() {
    return Promise.reject(new Error("Hosted UI login is API-mode only"));
  },
  signOut() {
    clearSession();
    return Promise.resolve();
  },
  getAccessToken() {
    return Promise.resolve(null); // demo mode has no bearer token
  },
};
