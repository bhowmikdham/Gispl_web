/* Demo seed — Meridian First Bank Ltd. is a FICTIONAL organisation.
   All people are invented; emails use the RFC-2606-reserved .example TLD.
   Bump LocalProvider's SEED_SENTINEL whenever this content changes. */

import type { Client, DocumentItem, Engagement, Finding } from "../types";

export const DEMO_LOGIN = {
  email: "priya.nair@meridianfirst.example",
  password: "GisplDemo!2026",
  name: "Priya Nair",
};

const T = "T00:00:00Z";

export const DEMO_CLIENT: Client = {
  id: "cl-meridian",
  slug: "meridian-first-bank",
  name: "Meridian First Bank Ltd.",
  industry: "Banking & Financial Services",
  demo: true,
  contacts: [
    { name: "Priya Nair", role: "CISO", email: "priya.nair@meridianfirst.example", side: "client" },
    { name: "Arjun Mehta", role: "Head of IT Infrastructure", email: "arjun.mehta@meridianfirst.example", side: "client" },
  ],
  createdAt: "2026-01-05" + T,
  updatedAt: "2026-07-01" + T,
};

export const DEMO_ENGAGEMENTS: Engagement[] = [
  {
    id: "eng-vapt-2026",
    slug: "external-vapt-retail-banking",
    clientId: DEMO_CLIENT.id,
    name: "External Web & Network VAPT — Retail Banking Platform",
    serviceLine: "vapt",
    status: "active",
    currentPhase: 5,
    phaseHistory: [
      { phase: 1, enteredAt: "2026-04-06" + T },
      { phase: 2, enteredAt: "2026-04-20" + T },
      { phase: 3, enteredAt: "2026-05-04" + T },
      { phase: 4, enteredAt: "2026-05-18" + T },
      { phase: 5, enteredAt: "2026-06-22" + T },
    ],
    startDate: "2026-04-06" + T,
    targetEndDate: "2026-08-28" + T,
    milestones: [
      { id: "m1", label: "Scope & rules of engagement signed", due: "2026-04-17" + T, completedAt: "2026-04-15" + T },
      { id: "m2", label: "Exploitation window complete", due: "2026-06-19" + T, completedAt: "2026-06-19" + T },
      { id: "m3", label: "Prioritised risk register delivered", due: "2026-07-24" + T },
      { id: "m4", label: "Final report & management presentation", due: "2026-08-21" + T },
    ],
    team: [
      { name: "Vikram Nair", role: "Engagement Lead", email: "vikram.nair@gispl.com", side: "gispl" },
      { name: "Sana Qureshi", role: "Senior Penetration Tester", email: "sana.qureshi@gispl.com", side: "gispl" },
      { name: "Priya Nair", role: "CISO (sponsor)", email: "priya.nair@meridianfirst.example", side: "client" },
      { name: "Arjun Mehta", role: "Remediation owner", email: "arjun.mehta@meridianfirst.example", side: "client" },
    ],
    frameworks: ["OWASP", "PTES", "NIST SP 800-115", "CVSS v3.1"],
    scopeSummary:
      "Internet-facing retail banking web application, mobile API gateway and 14 perimeter hosts. Grey-box testing with two authenticated roles; exploitation permitted in the UAT ring-fence.",
    createdAt: "2026-03-30" + T,
    updatedAt: "2026-07-08" + T,
  },
  {
    id: "eng-iso-2026",
    slug: "iso27001-surveillance-cycle-2",
    clientId: DEMO_CLIENT.id,
    name: "ISO 27001:2022 Surveillance Audit — Cycle 2",
    serviceLine: "iso27001-surveillance",
    status: "complete",
    currentPhase: 8,
    phaseLabels: [
      "Audit Planning",
      "Document Review",
      "Evidence Collection",
      "Control Testing",
      "Nonconformity Review",
      "Corrective Action Guidance",
      "Follow-up Verification",
      "Certificate Continuation",
    ],
    phaseHistory: [
      { phase: 1, enteredAt: "2026-01-12" + T },
      { phase: 4, enteredAt: "2026-02-09" + T },
      { phase: 8, enteredAt: "2026-03-27" + T },
    ],
    startDate: "2026-01-12" + T,
    targetEndDate: "2026-03-27" + T,
    milestones: [
      { id: "m1", label: "Stage plan agreed", due: "2026-01-16" + T, completedAt: "2026-01-16" + T },
      { id: "m2", label: "On-site audit days", due: "2026-02-27" + T, completedAt: "2026-02-26" + T },
      { id: "m3", label: "Certificate continuation confirmed", due: "2026-03-27" + T, completedAt: "2026-03-25" + T },
    ],
    team: [
      { name: "Meera Iyer", role: "Lead Auditor", email: "meera.iyer@gispl.com", side: "gispl" },
      { name: "Priya Nair", role: "ISMS owner", email: "priya.nair@meridianfirst.example", side: "client" },
    ],
    frameworks: ["ISO 27001:2022"],
    scopeSummary:
      "Surveillance audit of the certified ISMS covering retail banking operations, data-centre operations and the Gurgaon corporate office.",
    createdAt: "2026-01-05" + T,
    updatedAt: "2026-03-27" + T,
  },
  {
    id: "eng-dpdp-2026",
    slug: "dpdp-readiness-assessment",
    clientId: DEMO_CLIENT.id,
    name: "DPDP Act Readiness Assessment",
    serviceLine: "dpdp-readiness",
    status: "active",
    currentPhase: 2,
    phaseLabels: [
      "Scoping & Data Discovery",
      "Processing Inventory",
      "Gap Assessment",
      "Consent & Notice Design",
      "Rights-Workflow Design",
      "Remediation Roadmap",
      "Implementation Support",
      "Readiness Attestation",
    ],
    phaseHistory: [
      { phase: 1, enteredAt: "2026-06-08" + T },
      { phase: 2, enteredAt: "2026-07-01" + T },
    ],
    startDate: "2026-06-08" + T,
    targetEndDate: "2026-10-16" + T,
    milestones: [
      { id: "m1", label: "Data-flow discovery workshops", due: "2026-06-26" + T, completedAt: "2026-06-26" + T },
      { id: "m2", label: "Processing inventory sign-off", due: "2026-07-31" + T },
      { id: "m3", label: "Gap register & roadmap", due: "2026-09-04" + T },
    ],
    team: [
      { name: "Rohit Malhotra", role: "Privacy Lead", email: "rohit.malhotra@gispl.com", side: "gispl" },
      { name: "Arjun Mehta", role: "Programme owner", email: "arjun.mehta@meridianfirst.example", side: "client" },
    ],
    frameworks: ["DPDP Act 2023"],
    scopeSummary:
      "Readiness assessment across retail banking customer journeys: consent, notice, data-principal rights, retention and breach-reporting obligations under the DPDP Act, 2023.",
    createdAt: "2026-06-01" + T,
    updatedAt: "2026-07-05" + T,
  },
];

function f(
  n: number,
  engagementId: string,
  title: string,
  severity: Finding["severity"],
  cvss: number | null,
  status: Finding["status"],
  category: string,
  affectedAsset: string,
  reportedAt: string,
  dueBy: string,
  extra?: Partial<Finding>
): Finding {
  const id = "GISPL-2026-0" + String(100 + n);
  return {
    id,
    slug: id.toLowerCase(),
    engagementId,
    title,
    severity,
    cvss,
    status,
    category,
    affectedAsset,
    description:
      "Identified during testing and validated with a working proof of concept. Full reproduction steps, evidence and business-impact analysis are in the technical report.",
    recommendation:
      "Apply the remediation detailed in the technical report, then request a retest so GISPL can verify the fix and update this finding's status.",
    reportedAt: reportedAt + T,
    dueBy: dueBy + T,
    createdAt: reportedAt + T,
    updatedAt: (extra?.closedAt || extra?.remediatedAt || reportedAt + T) as string,
    ...extra,
  };
}

export const DEMO_FINDINGS: Finding[] = [
  // VAPT — 14 findings
  f(41, "eng-vapt-2026", "SQL injection in fund-transfer search endpoint", "critical", 9.1, "open", "Injection", "api.meridianfirst.example/transfers/search", "2026-06-12", "2026-07-10", {
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N",
    description: "A UNION-based SQL injection in the transfer-search filter allows an authenticated retail user to read arbitrary rows from the core transaction schema, including other customers' transfer records.",
    recommendation: "Parameterise the search query, deploy the shared input-validation middleware, and rotate the application database credentials. Request a retest once deployed to UAT.",
  }),
  f(42, "eng-vapt-2026", "IDOR exposes account statement PDFs across customers", "critical", 8.8, "in-remediation", "Access Control", "netbank.meridianfirst.example/statements", "2026-06-13", "2026-07-11", {
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N",
    remediatedAt: undefined,
  }),
  f(43, "eng-vapt-2026", "Session tokens survive password reset", "high", 8.1, "in-remediation", "Session Management", "netbank.meridianfirst.example", "2026-06-15", "2026-07-17"),
  f(44, "eng-vapt-2026", "TLS 1.0/1.1 accepted on legacy API host", "high", 7.4, "retest-pending", "Cryptography", "legacy-api.meridianfirst.example", "2026-06-15", "2026-07-17", { remediatedAt: "2026-07-04" + T }),
  f(45, "eng-vapt-2026", "Rate limiting absent on OTP verification", "high", 7.5, "open", "Authentication", "api.meridianfirst.example/otp/verify", "2026-06-18", "2026-07-20"),
  f(46, "eng-vapt-2026", "Verbose stack traces returned to clients", "medium", 5.3, "closed", "Information Disclosure", "api.meridianfirst.example", "2026-06-18", "2026-08-01", { remediatedAt: "2026-06-30" + T, closedAt: "2026-07-06" + T }),
  f(47, "eng-vapt-2026", "Missing HSTS on customer-facing hosts", "medium", 5.4, "retest-pending", "Configuration", "netbank.meridianfirst.example", "2026-06-19", "2026-08-01", { remediatedAt: "2026-07-07" + T }),
  f(48, "eng-vapt-2026", "CSP absent on online-banking application", "medium", 5.0, "in-remediation", "Configuration", "netbank.meridianfirst.example", "2026-06-19", "2026-08-01"),
  f(49, "eng-vapt-2026", "Password policy permits 8-character dictionary words", "medium", 5.9, "open", "Authentication", "Identity provider", "2026-06-22", "2026-08-05"),
  f(50, "eng-vapt-2026", "SNMP community string 'public' on two perimeter devices", "medium", 6.5, "in-remediation", "Network", "edge-rtr-01 / edge-rtr-02", "2026-06-23", "2026-08-05"),
  f(51, "eng-vapt-2026", "Directory listing enabled on static-content host", "low", 3.7, "closed", "Configuration", "static.meridianfirst.example", "2026-06-24", "2026-08-14", { remediatedAt: "2026-07-01" + T, closedAt: "2026-07-03" + T }),
  f(52, "eng-vapt-2026", "Autocomplete enabled on payment form fields", "low", 3.1, "open", "Client-side", "netbank.meridianfirst.example/payments", "2026-06-25", "2026-08-14"),
  f(53, "eng-vapt-2026", "Server version banners disclosed", "low", 2.7, "in-remediation", "Information Disclosure", "Perimeter hosts (6)", "2026-06-25", "2026-08-14"),
  f(54, "eng-vapt-2026", "Outdated jQuery on marketing microsite (no known exploit path)", "info", null, "closed", "Dependency Hygiene", "offers.meridianfirst.example", "2026-06-26", "2026-08-28", { closedAt: "2026-07-02" + T }),
  // ISO 27001 — 3 observations
  f(55, "eng-iso-2026", "Minor NC: supplier security reviews behind schedule (A.5.19)", "medium", null, "closed", "ISMS Nonconformity", "Supplier management process", "2026-02-26", "2026-03-20", { remediatedAt: "2026-03-12" + T, closedAt: "2026-03-18" + T }),
  f(56, "eng-iso-2026", "Observation: asset register missing two SaaS platforms", "low", null, "closed", "ISMS Observation", "Asset management", "2026-02-26", "2026-03-20", { remediatedAt: "2026-03-10" + T, closedAt: "2026-03-18" + T }),
  f(57, "eng-iso-2026", "OFI: consolidate incident post-mortems into the risk register", "info", null, "retest-pending", "Opportunity for Improvement", "Incident management", "2026-02-27", "2026-09-30"),
  // DPDP — 1 early gap
  f(58, "eng-dpdp-2026", "Consent records not retained for closed accounts", "high", null, "open", "DPDP Gap", "Customer onboarding journey", "2026-07-03", "2026-08-14", {
    description: "Consent artefacts for data principals whose accounts are closed are purged with the account record, leaving no demonstrable consent trail as required under the DPDP Act.",
    recommendation: "Retain consent artefacts on the schedule defined in the retention matrix, separated from account data, and include them in the data-principal rights workflow design (phase 5).",
  }),
];

const D = (n: number, engagementId: string, title: string, type: DocumentItem["type"], version: string, fileExt: DocumentItem["fileExt"], sizeBytes: number, issuedAt: string): DocumentItem => ({
  id: "doc-" + n,
  slug: "doc-" + n,
  engagementId,
  title,
  type,
  version,
  fileExt,
  sizeBytes,
  issuedAt: issuedAt + T,
  createdAt: issuedAt + T,
  updatedAt: issuedAt + T,
});

export const DEMO_DOCUMENTS: DocumentItem[] = [
  D(1, "eng-vapt-2026", "Rules of Engagement & Scope Definition", "scope-document", "1.2", "pdf", 412_000, "2026-04-15"),
  D(2, "eng-vapt-2026", "Interim Detailed Technical Report", "technical-report", "0.9", "pdf", 4_820_000, "2026-06-27"),
  D(3, "eng-vapt-2026", "Retest Report — TLS & HSTS remediations", "retest-report", "1.0", "pdf", 1_140_000, "2026-07-08"),
  D(4, "eng-iso-2026", "Executive Summary Report", "executive-summary", "1.0", "pdf", 890_000, "2026-03-18"),
  D(5, "eng-iso-2026", "Detailed Audit Report", "technical-report", "1.0", "pdf", 3_360_000, "2026-03-18"),
  D(6, "eng-iso-2026", "Management Presentation", "management-presentation", "1.0", "pptx", 6_450_000, "2026-03-24"),
  D(7, "eng-iso-2026", "ISO 27001:2022 Surveillance Certificate", "certificate", "1.0", "pdf", 310_000, "2026-03-25"),
  D(8, "eng-iso-2026", "Letter of Attestation", "attestation-letter", "1.0", "pdf", 205_000, "2026-03-25"),
  D(9, "eng-dpdp-2026", "Assessment Scope & Approach", "scope-document", "1.0", "pdf", 480_000, "2026-06-12"),
  D(10, "eng-dpdp-2026", "Data-Processing Gap Register (working copy)", "technical-report", "0.3", "xlsx", 260_000, "2026-07-04"),
];
