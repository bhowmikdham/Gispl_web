---
title: ERP security audit
label: ERP security audit
practice: assessments-and-testing
order: 11
tagline: SAP, Oracle and Dynamics examined where the money moves — roles, segregation of duties, custom code, interfaces and the platform beneath.
summary: Security and controls audit of SAP, Oracle and Microsoft Dynamics estates — authorisation and segregation of duties, custom code, interfaces, platform hardening and configuration — for fraud prevention and financial-audit assurance.
icon: server
status: published
facts:
- label: Platforms
  value: SAP ECC and S/4HANA (including Basis, HANA and Fiori), Oracle E-Business Suite and Fusion Cloud, Microsoft Dynamics 365
- label: Scope
  value: Authorisation and segregation of duties, privileged and emergency access, custom code, interfaces and integrations, configuration, platform and database hardening, logging
- label: Drivers
  value: Financial-audit ITGC and SOX, Companies Act internal financial controls, fraud prevention, RBI IS audit, post-implementation assurance
- label: Cadence
  value: Annually aligned to the financial year; before and after implementation, migration or major upgrade
appliesTo:
- Your financial auditors have raised observations on ERP access, segregation of duties or change control.
- You are implementing or migrating — S/4HANA, Oracle Fusion, Dynamics 365 — and want the controls designed in before go-live.
- You suspect, or have found, fraud enabled by ERP access — a vendor created and paid, a master record altered, a limit overridden.
- Custom code, interfaces and integrations have accumulated for years and nobody knows what they can do.
- You are a bank or NBFC whose core and finance systems fall under RBI's IS audit requirements.
- Your ERP is internet-facing — Fiori, portals, supplier and customer self-service — and has never been penetration tested.
stakes:
- ERP is where money is created, moved and paid; access and segregation weaknesses are the enabling condition for most internal fraud.
- Audit qualifications and material weaknesses arising from ERP controls are disclosed to shareholders and lenders.
- Failed implementations where roles were copied from the old system and nobody can explain who can do what.
- Custom code with hard-coded logins, bypassed authorisation checks and direct table access — invisible to standard controls.
- Internet-facing ERP components with known, exploited vulnerabilities and an unpatched platform beneath.
- Emergency and privileged access that is permanent, shared and unlogged.
steps:
- title: Scope and risk mapping
  text: Which systems, modules, companies and processes; where the financial and fraud risk concentrates; which audit and regulatory requirements apply.
- title: Authorisation and segregation-of-duties analysis
  text: Roles, profiles and user assignments analysed against a segregation-of-duties ruleset tailored to your processes; conflicts identified by user and by transaction, with real usage data.
- title: Privileged, emergency and generic access review
  text: Who holds superuser, developer and emergency access, how it is granted, monitored and revoked, and whether it is actually needed.
- title: Custom code and interface review
  text: Custom programs, enhancements and interfaces reviewed for authorisation bypass, hard-coded credentials, direct data access and insecure integrations.
- title: Platform and configuration audit
  text: Application server, database and operating-system hardening, patch status, security parameters, logging and internet-facing components — including penetration testing where exposed.
- title: Remediation design and support
  text: Role redesign, mitigating controls for unavoidable conflicts, code fixes, hardening and monitoring, sequenced with your ERP team and auditors.
deliverables:
- title: Segregation-of-duties conflict report
  text: By user, role and transaction, with usage evidence and business impact.
- title: Access and privileged-access findings
  text: Who can do what they should not, and why.
- title: Custom code and interface findings
  text: With the vulnerable code and the fix.
- title: Platform hardening report
  text: Against vendor and CIS benchmarks, with patch and configuration gaps.
- title: Role redesign and mitigating-controls proposal
  text: The path to a defensible authorisation model.
- title: Audit-ready evidence pack
  text: For financial auditors, SOX testers or RBI inspectors.
faq:
- q: Our auditors test ERP controls every year — why do we need this?
  a: Financial auditors test a sample of controls for financial-reporting purposes. An ERP security audit examines the whole authorisation model, the custom code, the interfaces and the platform for fraud and security risk, and designs the fixes. Organisations with clean audit opinions routinely have hundreds of segregation-of-duties conflicts the sample never reached.
- q: Can you do this without disrupting the ERP?
  a: Yes. Authorisation analysis runs on extracted data; code review is offline; platform review is read-only; any penetration testing of internet-facing components is scoped and scheduled. The ERP team is involved throughout, not interrupted.
- q: What about a new implementation?
  a: The best time. Roles designed from the process and the segregation-of-duties ruleset before go-live cost a fraction of retrofitting them after the first year-end audit — and prevent the classic failure of copying the old system's roles into the new one.
- q: Do you cover cloud ERP?
  a: Yes — S/4HANA Cloud, Oracle Fusion Cloud and Dynamics 365 have the same authorisation and segregation-of-duties questions, a different platform layer that the vendor runs, and integration and identity questions of their own.
- q: How does this relate to ITGC?
  a: "ITGC are the general controls around the ERP — access, change, operations. This audit goes inside it: the authorisation model, the code and the configuration. Financial auditors need both; we deliver both."
related:
- itgc
- application-security
- soc-1-and-soc-2
industries:
- manufacturing
- bfsi
- pharma-healthcare
insights:
- board-ready-security-reporting-without-the-jargon
seo:
  title: ERP security audit — SAP, Oracle, Dynamics — GISPL
  description: Security and controls audit of SAP, Oracle and Dynamics — segregation of duties, privileged access, custom code, interfaces and platform hardening.
  noindex: false
---

An ERP system is where an organisation's money is created, moved and paid. Vendors are created, invoices approved, payments released, master data changed, limits set and overridden — all inside SAP, Oracle or Dynamics, governed by an authorisation model that decides who can do what. When that model is weak, fraud does not need to break in; it logs in. Most internal frauds we investigate were enabled by a segregation-of-duties conflict that nobody knew existed, a generic account that everyone knew existed, or emergency access that never ended.

The authorisation model is only the first layer. Beneath it sits years of custom code — enhancements, reports, interfaces — that can bypass the standard checks, embed credentials or read tables directly. Around it sit integrations with banks, suppliers, payroll and e-commerce. Under it sits a platform — application servers, HANA or Oracle databases, operating systems — with its own patching and hardening, increasingly exposed to the internet through Fiori, portals and self-service. Financial auditors sample the first layer for reporting purposes; the rest is rarely examined by anyone.

## What the audit covers

Authorisation and segregation of duties, analysed against a ruleset tailored to your processes and cross-referenced with actual transaction usage — so the report shows real conflicts exercised by real users, not theoretical ones. Privileged, emergency and generic access. Custom code and interfaces, reviewed for authorisation bypass, hard-coded logins and insecure data access. Platform configuration and hardening against vendor and CIS benchmarks, with penetration testing of anything internet-facing. And remediation designed with your ERP team: role redesign, mitigating controls for conflicts that cannot be removed, code fixes, hardening and monitoring.

GISPL's ERP audits serve financial-audit and SOX assurance, RBI's IS audit requirements for banks and NBFCs, fraud prevention, and — most valuably — implementation and migration programmes, where designing the roles from the process before go-live prevents the failure that every retrofitted authorisation model represents.
