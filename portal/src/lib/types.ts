/* GISPL portal — domain model. Mirrors the site's data-layer conventions
   (slug + status + createdAt/updatedAt, Promise-returning providers). */

export type ISO = string;

export interface TeamContact {
  name: string;
  role: string;
  email: string;
  side: "gispl" | "client";
}

export interface Client {
  id: string;
  slug: string;
  name: string;
  industry: string;
  contacts: TeamContact[];
  demo: true;
  createdAt: ISO;
  updatedAt: ISO;
}

export type ServiceLine = "vapt" | "iso27001-surveillance" | "dpdp-readiness";
export type EngagementStatus = "active" | "on-hold" | "complete";

export interface Milestone {
  id: string;
  label: string;
  due: ISO;
  completedAt?: ISO;
}

export interface Engagement {
  id: string;
  slug: string;
  clientId: string;
  name: string;
  serviceLine: ServiceLine;
  status: EngagementStatus;
  /** 1-8 index into the phase spine (VAPT_PHASES or phaseLabels override). */
  currentPhase: number;
  /** 8-entry label override for non-VAPT service lines. */
  phaseLabels?: string[];
  phaseHistory: { phase: number; enteredAt: ISO }[];
  startDate: ISO;
  targetEndDate: ISO;
  milestones: Milestone[];
  team: TeamContact[];
  frameworks: string[];
  scopeSummary: string;
  createdAt: ISO;
  updatedAt: ISO;
}

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type FindingStatus = "open" | "in-remediation" | "retest-pending" | "closed";

export interface Finding {
  id: string; // display ref, e.g. "GISPL-2026-0141"
  slug: string;
  engagementId: string;
  title: string;
  severity: Severity;
  cvss: number | null; // CVSS v3.1 base score
  cvssVector?: string;
  status: FindingStatus;
  category: string;
  affectedAsset: string;
  description: string;
  recommendation: string;
  reportedAt: ISO;
  dueBy: ISO;
  remediatedAt?: ISO;
  closedAt?: ISO;
  createdAt: ISO;
  updatedAt: ISO;
}

export type DocumentType =
  | "executive-summary"
  | "technical-report"
  | "management-presentation"
  | "certificate"
  | "attestation-letter"
  | "scope-document"
  | "retest-report";

export interface DocumentItem {
  id: string;
  slug: string;
  engagementId: string;
  title: string;
  type: DocumentType;
  version: string;
  fileExt: "pdf" | "pptx" | "xlsx";
  sizeBytes: number;
  issuedAt: ISO;
  createdAt: ISO;
  updatedAt: ISO;
}

export interface Session {
  mode: "demo" | "api" | "cognito";
  email: string;
  name: string;
  clientId: string;
  clientName: string;
  issuedAt: ISO;
  expiresAt: ISO;
  tokens?: {
    accessToken: string;
    idToken: string;
    refreshToken?: string;
    expiresAt: ISO;
  };
}

export const SEVERITIES: Severity[] = ["critical", "high", "medium", "low", "info"];
export const SEVERITY_META: Record<Severity, { label: string; color: string }> = {
  critical: { label: "Critical", color: "var(--color-sev-critical)" },
  high: { label: "High", color: "var(--color-sev-high)" },
  medium: { label: "Medium", color: "var(--color-sev-medium)" },
  low: { label: "Low", color: "var(--color-sev-low)" },
  info: { label: "Info", color: "var(--color-sev-info)" },
};

export const FINDING_STATUSES: FindingStatus[] = ["open", "in-remediation", "retest-pending", "closed"];
export const STATUS_META: Record<FindingStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "var(--color-sev-critical)" },
  "in-remediation": { label: "In remediation", color: "var(--color-sev-medium)" },
  "retest-pending": { label: "Retest pending", color: "var(--color-orange-onlight)" },
  closed: { label: "Closed", color: "var(--color-sev-low)" },
};

export const SERVICE_LINE_META: Record<ServiceLine, string> = {
  vapt: "VAPT",
  "iso27001-surveillance": "ISO 27001",
  "dpdp-readiness": "DPDP Readiness",
};

export const DOCUMENT_TYPE_META: Record<DocumentType, string> = {
  "executive-summary": "Executive summary",
  "technical-report": "Technical report",
  "management-presentation": "Management presentation",
  certificate: "Certificate",
  "attestation-letter": "Attestation letter",
  "scope-document": "Scope document",
  "retest-report": "Retest report",
};
