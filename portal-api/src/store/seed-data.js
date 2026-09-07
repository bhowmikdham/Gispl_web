/* Demo seed — the SAME Meridian First Bank content as the frontend's local
   mode, so `MODE=api` shows identical data. A second tenant (Apex Logistics)
   proves real multi-tenant scoping: each user sees only their client's data.
   All organisations are FICTIONAL; emails use the reserved .example TLD. */

const T = "T00:00:00Z";
const DEMO_PASSWORD = "GisplDemo!2026"; // hashed at seed time by the store

/* ---------------- clients + users ---------------- */

export const CLIENTS = [
  {
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
  },
  {
    id: "cl-apex",
    slug: "apex-logistics",
    name: "Apex Logistics Pvt. Ltd.",
    industry: "Transport & Logistics",
    demo: true,
    contacts: [{ name: "Ravi Menon", role: "CTO", email: "ravi.menon@apexlogistics.example", side: "client" }],
    createdAt: "2026-05-20" + T,
    updatedAt: "2026-06-25" + T,
  },
];

// password is plaintext here (demo only); the store hashes it on seed.
export const USERS = [
  { email: "priya.nair@meridianfirst.example", name: "Priya Nair", clientId: "cl-meridian", password: DEMO_PASSWORD },
  { email: "ravi.menon@apexlogistics.example", name: "Ravi Menon", clientId: "cl-apex", password: DEMO_PASSWORD },
];

/* ---------------- engagements ---------------- */

export const ENGAGEMENTS = [
  {
    id: "eng-vapt-2026",
    slug: "external-vapt-retail-banking",
    clientId: "cl-meridian",
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
      { name: "Vikram Nair", role: "Engagement Lead", email: "vikram.nair@gisconsulting.in", side: "gispl" },
      { name: "Sana Qureshi", role: "Senior Penetration Tester", email: "sana.qureshi@gisconsulting.in", side: "gispl" },
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
    clientId: "cl-meridian",
    name: "ISO 27001:2022 Surveillance Audit — Cycle 2",
    serviceLine: "iso27001-surveillance",
    status: "complete",
    currentPhase: 8,
    phaseLabels: ["Audit Planning", "Document Review", "Evidence Collection", "Control Testing", "Nonconformity Review", "Corrective Action Guidance", "Follow-up Verification", "Certificate Continuation"],
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
      { name: "Meera Iyer", role: "Lead Auditor", email: "meera.iyer@gisconsulting.in", side: "gispl" },
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
    clientId: "cl-meridian",
    name: "DPDP Act Readiness Assessment",
    serviceLine: "dpdp-readiness",
    status: "active",
    currentPhase: 2,
    phaseLabels: ["Scoping & Data Discovery", "Processing Inventory", "Gap Assessment", "Consent & Notice Design", "Rights-Workflow Design", "Remediation Roadmap", "Implementation Support", "Readiness Attestation"],
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
      { name: "Rohit Malhotra", role: "Privacy Lead", email: "rohit.malhotra@gisconsulting.in", side: "gispl" },
      { name: "Arjun Mehta", role: "Programme owner", email: "arjun.mehta@meridianfirst.example", side: "client" },
    ],
    frameworks: ["DPDP Act 2023"],
    scopeSummary:
      "Readiness assessment across retail banking customer journeys: consent, notice, data-principal rights, retention and breach-reporting obligations under the DPDP Act, 2023.",
    createdAt: "2026-06-01" + T,
    updatedAt: "2026-07-05" + T,
  },
  {
    id: "eng-apex-vapt",
    slug: "apex-network-vapt",
    clientId: "cl-apex",
    name: "Internal Network VAPT — Warehouse Systems",
    serviceLine: "vapt",
    status: "active",
    currentPhase: 3,
    phaseHistory: [
      { phase: 1, enteredAt: "2026-06-01" + T },
      { phase: 2, enteredAt: "2026-06-12" + T },
      { phase: 3, enteredAt: "2026-06-24" + T },
    ],
    startDate: "2026-06-01" + T,
    targetEndDate: "2026-08-15" + T,
    milestones: [
      { id: "m1", label: "Scope & rules of engagement signed", due: "2026-06-06" + T, completedAt: "2026-06-05" + T },
      { id: "m2", label: "Internal testing window", due: "2026-07-18" + T },
    ],
    team: [
      { name: "Sana Qureshi", role: "Engagement Lead", email: "sana.qureshi@gisconsulting.in", side: "gispl" },
      { name: "Ravi Menon", role: "CTO (sponsor)", email: "ravi.menon@apexlogistics.example", side: "client" },
    ],
    frameworks: ["OWASP", "PTES"],
    scopeSummary: "Internal network and warehouse OT segment assessment across three distribution centres.",
    createdAt: "2026-05-25" + T,
    updatedAt: "2026-06-24" + T,
  },
];

/* ---------------- findings ---------------- */

function f(n, engagementId, title, severity, cvss, status, reportedAt, dueBy, extra = {}) {
  const id = "GISPL-2026-0" + (100 + n);
  return {
    id,
    slug: id.toLowerCase(),
    engagementId,
    title,
    severity,
    cvss,
    status,
    category: extra.category || "Security Finding",
    affectedAsset: extra.affectedAsset || "In-scope system",
    description:
      extra.description ||
      "Identified during testing and validated with a working proof of concept. Full reproduction steps, evidence and business-impact analysis are in the technical report.",
    recommendation:
      extra.recommendation ||
      "Apply the remediation detailed in the technical report, then request a retest so GISPL can verify the fix and update this finding's status.",
    cvssVector: extra.cvssVector,
    reportedAt: reportedAt + T,
    dueBy: dueBy + T,
    remediatedAt: extra.remediatedAt ? extra.remediatedAt + T : undefined,
    closedAt: extra.closedAt ? extra.closedAt + T : undefined,
    createdAt: reportedAt + T,
    updatedAt: (extra.closedAt || extra.remediatedAt || reportedAt) + T,
  };
}

export const FINDINGS = [
  f(41, "eng-vapt-2026", "SQL injection in fund-transfer search endpoint", "critical", 9.1, "open", "2026-06-12", "2026-07-10", { category: "Injection", affectedAsset: "api.meridianfirst.example/transfers/search", cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N" }),
  f(42, "eng-vapt-2026", "IDOR exposes account statement PDFs across customers", "critical", 8.8, "in-remediation", "2026-06-13", "2026-07-11", { category: "Access Control", affectedAsset: "netbank.meridianfirst.example/statements", cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N" }),
  f(43, "eng-vapt-2026", "Session tokens survive password reset", "high", 8.1, "in-remediation", "2026-06-15", "2026-07-17", { category: "Session Management", affectedAsset: "netbank.meridianfirst.example" }),
  f(44, "eng-vapt-2026", "TLS 1.0/1.1 accepted on legacy API host", "high", 7.4, "retest-pending", "2026-06-15", "2026-07-17", { category: "Cryptography", affectedAsset: "legacy-api.meridianfirst.example", remediatedAt: "2026-07-04" }),
  f(45, "eng-vapt-2026", "Rate limiting absent on OTP verification", "high", 7.5, "open", "2026-06-18", "2026-07-20", { category: "Authentication", affectedAsset: "api.meridianfirst.example/otp/verify" }),
  f(46, "eng-vapt-2026", "Verbose stack traces returned to clients", "medium", 5.3, "closed", "2026-06-18", "2026-08-01", { category: "Information Disclosure", affectedAsset: "api.meridianfirst.example", remediatedAt: "2026-06-30", closedAt: "2026-07-06" }),
  f(47, "eng-vapt-2026", "Missing HSTS on customer-facing hosts", "medium", 5.4, "retest-pending", "2026-06-19", "2026-08-01", { category: "Configuration", affectedAsset: "netbank.meridianfirst.example", remediatedAt: "2026-07-07" }),
  f(48, "eng-vapt-2026", "CSP absent on online-banking application", "medium", 5.0, "in-remediation", "2026-06-19", "2026-08-01", { category: "Configuration", affectedAsset: "netbank.meridianfirst.example" }),
  f(49, "eng-vapt-2026", "Password policy permits 8-character dictionary words", "medium", 5.9, "open", "2026-06-22", "2026-08-05", { category: "Authentication", affectedAsset: "Identity provider" }),
  f(50, "eng-vapt-2026", "SNMP community string 'public' on two perimeter devices", "medium", 6.5, "in-remediation", "2026-06-23", "2026-08-05", { category: "Network", affectedAsset: "edge-rtr-01 / edge-rtr-02" }),
  f(51, "eng-vapt-2026", "Directory listing enabled on static-content host", "low", 3.7, "closed", "2026-06-24", "2026-08-14", { category: "Configuration", affectedAsset: "static.meridianfirst.example", remediatedAt: "2026-07-01", closedAt: "2026-07-03" }),
  f(52, "eng-vapt-2026", "Autocomplete enabled on payment form fields", "low", 3.1, "open", "2026-06-25", "2026-08-14", { category: "Client-side", affectedAsset: "netbank.meridianfirst.example/payments" }),
  f(53, "eng-vapt-2026", "Server version banners disclosed", "low", 2.7, "in-remediation", "2026-06-25", "2026-08-14", { category: "Information Disclosure", affectedAsset: "Perimeter hosts (6)" }),
  f(54, "eng-vapt-2026", "Outdated jQuery on marketing microsite (no known exploit path)", "info", null, "closed", "2026-06-26", "2026-08-28", { category: "Dependency Hygiene", affectedAsset: "offers.meridianfirst.example", closedAt: "2026-07-02" }),
  f(55, "eng-iso-2026", "Minor NC: supplier security reviews behind schedule (A.5.19)", "medium", null, "closed", "2026-02-26", "2026-03-20", { category: "ISMS Nonconformity", affectedAsset: "Supplier management process", remediatedAt: "2026-03-12", closedAt: "2026-03-18" }),
  f(56, "eng-iso-2026", "Observation: asset register missing two SaaS platforms", "low", null, "closed", "2026-02-26", "2026-03-20", { category: "ISMS Observation", affectedAsset: "Asset management", remediatedAt: "2026-03-10", closedAt: "2026-03-18" }),
  f(57, "eng-iso-2026", "OFI: consolidate incident post-mortems into the risk register", "info", null, "retest-pending", "2026-02-27", "2026-09-30", { category: "Opportunity for Improvement", affectedAsset: "Incident management" }),
  f(58, "eng-dpdp-2026", "Consent records not retained for closed accounts", "high", null, "open", "2026-07-03", "2026-08-14", { category: "DPDP Gap", affectedAsset: "Customer onboarding journey" }),
  // Apex tenant
  f(101, "eng-apex-vapt", "Default credentials on warehouse IoT gateway", "high", 8.2, "open", "2026-06-20", "2026-07-25", { category: "Authentication", affectedAsset: "iot-gw-wh3.apex.local" }),
  f(102, "eng-apex-vapt", "Flat network — no VLAN segmentation", "medium", 6.1, "in-remediation", "2026-06-21", "2026-08-01", { category: "Network", affectedAsset: "Warehouse LAN" }),
  f(103, "eng-apex-vapt", "SMBv1 enabled on file server", "high", 7.8, "open", "2026-06-22", "2026-07-26", { category: "Configuration", affectedAsset: "fs-01.apex.local" }),
];

/* ---------------- documents ---------------- */

function d(id, engagementId, title, type, version, fileExt, sizeBytes, issuedAt) {
  return { id, slug: id, engagementId, title, type, version, fileExt, sizeBytes, issuedAt: issuedAt + T, createdAt: issuedAt + T, updatedAt: issuedAt + T };
}

export const DOCUMENTS = [
  d("doc-1", "eng-vapt-2026", "Rules of Engagement & Scope Definition", "scope-document", "1.2", "pdf", 412000, "2026-04-15"),
  d("doc-2", "eng-vapt-2026", "Interim Detailed Technical Report", "technical-report", "0.9", "pdf", 4820000, "2026-06-27"),
  d("doc-3", "eng-vapt-2026", "Retest Report — TLS & HSTS remediations", "retest-report", "1.0", "pdf", 1140000, "2026-07-08"),
  d("doc-4", "eng-iso-2026", "Executive Summary Report", "executive-summary", "1.0", "pdf", 890000, "2026-03-18"),
  d("doc-5", "eng-iso-2026", "Detailed Audit Report", "technical-report", "1.0", "pdf", 3360000, "2026-03-18"),
  d("doc-6", "eng-iso-2026", "Management Presentation", "management-presentation", "1.0", "pptx", 6450000, "2026-03-24"),
  d("doc-7", "eng-iso-2026", "ISO 27001:2022 Surveillance Certificate", "certificate", "1.0", "pdf", 310000, "2026-03-25"),
  d("doc-8", "eng-iso-2026", "Letter of Attestation", "attestation-letter", "1.0", "pdf", 205000, "2026-03-25"),
  d("doc-9", "eng-dpdp-2026", "Assessment Scope & Approach", "scope-document", "1.0", "pdf", 480000, "2026-06-12"),
  d("doc-10", "eng-dpdp-2026", "Data-Processing Gap Register (working copy)", "technical-report", "0.3", "xlsx", 260000, "2026-07-04"),
  d("doc-a1", "eng-apex-vapt", "Rules of Engagement", "scope-document", "1.0", "pdf", 300000, "2026-06-05"),
];
