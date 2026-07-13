import type {
  Client,
  DocumentItem,
  DocumentType,
  Engagement,
  Finding,
  FindingStatus,
  Session,
  Severity,
} from "../types";

export interface AuthProvider {
  getSession(): Session | null;
  /** Local mode: validates the demo credential pair. */
  signIn(email: string, password: string): Promise<Session>;
  /** API mode: redirect to the Cognito Hosted UI authorize URL. */
  beginHostedUiLogin(next?: string): void;
  /** API mode: exchange the ?code= on /portal/callback/ for tokens. */
  completeHostedUiLogin(code: string): Promise<Session>;
  signOut(): Promise<void>;
  /** Refresh-aware access token; null in demo mode. */
  getAccessToken(): Promise<string | null>;
}

export interface FindingFilter {
  engagementId?: string;
  severity?: Severity;
  status?: FindingStatus;
  q?: string;
}

export interface DataProvider {
  /** Local mode: seed-once. API mode: no-op. */
  ready(): Promise<void>;
  getClient(): Promise<Client>;
  listEngagements(): Promise<Engagement[]>;
  getEngagement(idOrSlug: string): Promise<Engagement | null>;
  listFindings(filter?: FindingFilter): Promise<Finding[]>;
  getFinding(id: string): Promise<Finding | null>;
  listDocuments(filter?: { engagementId?: string; type?: DocumentType }): Promise<DocumentItem[]>;
  getDocumentUrl(id: string): Promise<{ url: string; demo: boolean }>;
  /** Local mode: clear + re-seed the demo data. API mode: no-op. */
  resetDemo(): Promise<void>;
}
