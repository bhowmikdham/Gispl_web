---
title: HIPAA
label: HIPAA
practice: compliance-and-certification
order: 2
tagline: Protected health information handled to the US standard — for providers, plans and the Indian companies that process it for them.
summary: HIPAA Privacy, Security and Breach Notification Rule compliance — risk analysis, safeguards, business-associate obligations and evidence — for covered entities and their vendors.
icon: hospital
status: published
facts:
- label: Law
  value: Health Insurance Portability and Accountability Act 1996, with the HITECH Act 2009 and the Omnibus Rule 2013
- label: Enforced by
  value: US Department of Health & Human Services, Office for Civil Rights; state attorneys general
- label: Applies to
  value: Covered entities (providers, health plans, clearinghouses) and every business associate that handles their PHI — wherever it sits
- label: Cadence
  value: Risk analysis at least annually and on change; no certificate — compliance is demonstrated, not awarded
appliesTo:
- You are a hospital, clinic, laboratory, health plan or clearinghouse that treats or insures US patients.
- You are an Indian IT, BPO, KPO, medical-transcription, billing or analytics company that processes protected health information for a US client.
- You build or host software — an EHR, a telehealth platform, a claims engine — that touches PHI, and your customers ask you to sign a Business Associate Agreement.
- You are a pharmaceutical or clinical-research organisation receiving identifiable patient data from US sites.
- A US customer's security questionnaire asks for your HIPAA risk analysis and your Security Rule safeguards.
- You subcontract any of the above, which makes your subcontractors business associates too.
stakes:
- Civil penalties per violation, tiered by culpability, and capped per calendar year per provision at a figure that is inflation-adjusted upward every year — into seven figures for wilful neglect.
- Criminal liability for knowingly obtaining or disclosing PHI, including for individuals.
- Breaches affecting 500 or more people are reported to HHS, published on its breach portal and notified to the media — the "wall of shame".
- A Business Associate Agreement makes you contractually liable to your client for their exposure, not just your own.
- "Lost contracts: US healthcare buyers will not onboard an offshore vendor without a documented risk analysis and safeguards."
- Corrective action plans imposed by OCR run for years and are monitored.
steps:
- title: Scope the PHI
  text: Where protected health information enters, is stored, is processed and leaves — systems, people, vendors and, for offshore teams, the connection back to the client.
- title: Security Rule risk analysis
  text: The one document OCR asks for first in every investigation — a formal, documented analysis of threats and vulnerabilities to ePHI, with likelihood and impact.
- title: Safeguard gap assessment
  text: Administrative, physical and technical safeguards measured against the Security Rule's standards and implementation specifications, required and addressable alike.
- title: Privacy and breach-notification readiness
  text: Minimum-necessary practices, patient-rights handling where you are a covered entity, and a breach-response process that meets the 60-day notification clock.
- title: Remediation and documentation
  text: Policies, training, access controls, encryption, audit logging and contingency planning put in place with your team, with the evidence captured as we go.
- title: Business-associate assurance
  text: BAAs reviewed, subcontractors flowed down, and an assurance package your US clients can accept in place of their own audit.
deliverables:
- title: Documented Security Rule risk analysis
  text: The artefact every OCR investigation and every enterprise customer starts with.
- title: Safeguard gap report and remediation plan
  text: Every standard and implementation specification scored, with owners and dates.
- title: HIPAA policy and procedure set
  text: Privacy, security, breach notification, sanctions, training and contingency — written to be followed.
- title: Business Associate Agreement review
  text: Your obligations, your subcontractors' obligations and the gaps between them.
- title: Workforce training records
  text: Role-based training delivered and evidenced, as the Security Rule requires.
- title: Client assurance package
  text: A summary a US customer's compliance team can accept — the difference between winning and losing the contract.
faq:
- q: Is there a HIPAA certificate?
  a: No. HHS does not certify anyone, and no third party can issue an official HIPAA certificate. Compliance is demonstrated through a documented risk analysis, implemented safeguards and evidence. What we deliver is that evidence, plus an independent assessment report your clients can rely on.
- q: We are in India — does a US law apply to us?
  a: If you handle PHI for a US covered entity, you are a business associate and HIPAA's Security and Breach Notification Rules apply to you directly, as does your BAA. OCR has enforcement reach through your client, and your client has it through the contract.
- q: What is the difference between required and addressable specifications?
  a: Required specifications must be implemented as written. Addressable ones must be implemented if reasonable and appropriate — and if not, you must document why and what you did instead. "Addressable" has never meant "optional", and treating it that way is a common finding.
- q: How does HIPAA relate to ISO 27001 or SOC 2?
  a: Closely. An ISO 27001 ISMS or SOC 2 controls cover most Security Rule safeguards; what HIPAA adds is PHI-specific scope, the formal risk analysis, the Privacy Rule for covered entities and breach notification. We map them together so one control set serves all three.
- q: Are the rules changing?
  a: HHS has proposed an update to the Security Rule that would make several currently addressable safeguards — encryption, multi-factor authentication, regular technical testing — mandatory. We build programmes to that bar now, so a rule change is not a rebuild.
related:
- iso-27799-health
- soc-1-and-soc-2
- iso-27701-privacy
industries:
- pharma-healthcare
insights:
- building-an-incident-response-runbook-that-survives-contact
- board-ready-security-reporting-without-the-jargon
seo:
  title: HIPAA compliance and business-associate assurance — GISPL
  description: HIPAA Privacy, Security and Breach Notification Rule compliance — risk analysis, safeguards, BAAs and evidence — for US healthcare and Indian processors.
  noindex: false
---

The Health Insurance Portability and Accountability Act is the United States' health-privacy law, and its Privacy, Security and Breach Notification Rules are the reason "HIPAA" appears in almost every contract between a US healthcare organisation and a technology or outsourcing vendor. The Privacy Rule governs how protected health information may be used and disclosed. The Security Rule sets out the administrative, physical and technical safeguards that must protect it in electronic form. The Breach Notification Rule sets the clock — sixty days — for telling patients, HHS and sometimes the media when it is exposed.

Two features make HIPAA different from the standards most Indian organisations know. First, there is no certificate. Nobody is "HIPAA certified"; an organisation is compliant because it can show a documented risk analysis, implemented safeguards and evidence that they operate. Second, it reaches through contracts. A **business associate** — any vendor that creates, receives, maintains or transmits PHI for a covered entity — is directly bound by the Security Rule and directly liable for breaches, wherever in the world it operates. That is the position of most Indian healthcare IT, BPO, billing, transcription and analytics companies serving US clients.

## What "compliant" actually means

The Office for Civil Rights, which enforces HIPAA, opens almost every investigation with the same request: show us your risk analysis. A risk analysis that is missing, years old or generic is the most common basis for a penalty — not the breach itself. The second request is for the safeguards: access controls, audit logs, encryption, workforce training, contingency plans, business-associate agreements. The third is for evidence that they were in place before the incident, not assembled afterwards.

Our HIPAA engagements are built around those three questions, because they are the ones that decide the outcome. For an Indian business associate, the practical payoff is commercial as much as regulatory: a client's compliance team that receives a current risk analysis, a safeguard assessment and a clean assurance package signs the contract; one that receives a policy binder does not.
