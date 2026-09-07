---
title: Manufacturing & industrial
short: Manufacturing
kicker: MANUFACTURING
order: 2
lead: Where IT meets the plant floor — and where a cyber incident stops production, endangers people and costs by the hour.
summary: Cyber security for manufacturers and industrial operators — IEC 62443 and OT security, SCADA testing, TISAX for automotive suppliers, ransomware resilience, ERP and IP protection, and segmentation that keeps production running.
regulators:
- IEC 62443
- TISAX
- ISO 27001
- CEA
- NCIIPC
- CERT-In
- DPDP Act 2023
facts:
- label: Frameworks
  value: ISA/IEC 62443, TISAX/VDA ISA for automotive, ISO 27001 and 22301, NIST CSF; CEA cyber security guidelines for captive power and utilities
- label: Regulators
  value: CERT-In; NCIIPC for designated critical infrastructure; CEA for power-sector entities; customer and OEM requirements as de facto regulation
- label: Testing requirement
  value: OT assessment against IEC 62443, passive-first; IT testing annually; TISAX assessment at the level the OEM requires
- label: Incident reporting
  value: CERT-In within six hours; NCIIPC for CII; customers and insurers under contract
challenges:
- title: Ransomware stops the line
  text: The dominant incident in manufacturing. It arrives through IT, crosses an unsegmented boundary, and takes down the HMIs, historians and MES that operate the plant — even when the controllers are untouched.
- title: Decades-old OT on modern networks
  text: PLCs and DCS installed twenty years ago, never designed for a network, now reachable from corporate laptops through connections made for convenience.
- title: OEMs and customers as regulators
  text: Automotive OEMs require TISAX; global customers require ISO 27001, SBOMs and supplier assessments; losing a label means losing the programme.
- title: Intellectual property and process knowledge
  text: Designs, formulations, process parameters and supplier terms are the business, and they leave through insiders, partners and unsecured engineering systems.
- title: Vendor remote access
  text: Machine builders and integrators with always-on remote access to the plant — shared credentials, no MFA, no monitoring — are the shortest path in.
- title: Safety
  text: A compromised or mis-tested control system can injure people; security in a plant is a safety discipline first.
capabilities:
- iec-62443-ot-security
- scada-ot-testing
- tisax-automotive
- ransomware-detection-and-response
- network-security
- erp-security-audit
proof:
- value: 10,000+
  label: Security testing projects
- value: 5,000+
  label: Compliance audits
- value: 2,000+
  label: Forensic investigations
- value: 5
  label: Countries
faq:
- q: Can you assess the plant without stopping it?
  a: Yes. OT assessment is passive first — traffic capture, configuration review, documentation — and produces most of the findings without touching a controller. Active testing is agreed in writing, run in maintenance windows with operations present, and never against safety systems. We have assessed live plants across India and the Gulf without a single trip.
- q: Where should we start?
  a: With the IT–OT boundary and remote access. Almost every industrial incident crosses from IT into OT through an unsegmented connection or a vendor's remote path. Segmenting that boundary and controlling that access is the single highest-return investment in most plants, and we usually start there.
- q: Our OEM requires TISAX — is ISO 27001 not enough?
  a: Not on its own. TISAX adds automotive-specific requirements — prototype protection, defined maturity levels, data-protection objectives — and OEMs require the label specifically. An existing ISO 27001 ISMS shortens the programme considerably; we take you through the VDA ISA self-assessment, remediation and the accredited assessment.
- q: What about our captive power plant?
  a: The Central Electricity Authority's cyber security guidelines apply to power-sector entities including captive generation above thresholds, and require periodic audit. Our OT practice delivers against them and NCIIPC where the plant is designated critical.
- q: Do you cover the ERP?
  a: Yes — SAP, Oracle and Dynamics estates are where manufacturers' money moves, and our ERP security audit covers authorisation, segregation of duties, custom code and the platform beneath.
insights:
- building-an-incident-response-runbook-that-survives-contact
- red-blue-and-purple-which-testing-does-your-team-need
- iso-27001-in-2026-what-the-new-controls-really-demand
icon: factory
status: published
seo:
  title: Manufacturing & industrial cybersecurity — GISPL
  description: Cyber security for manufacturers — IEC 62443 and OT security, SCADA testing, TISAX for automotive suppliers, ransomware resilience and ERP protection.
  noindex: false
---

In a factory, a cyber incident is not a data problem. It is a stopped line, a tripped unit, a missed shipment, a safety event. The systems that run production — PLCs, SCADA, distributed control, MES, historians — were installed to run for decades and never designed to be on a network; they now are, connected to corporate IT and to vendors' remote support through links made for convenience and never segmented. Ransomware, the dominant incident in the sector, arrives through IT and crosses that boundary, and the plant stops whether or not the controllers themselves are touched.

The obligations come from several directions at once. Customers and OEMs act as regulators: automotive supply chains require TISAX, global customers require ISO 27001, SBOMs and supplier assessments, and a lost label is a lost programme. CERT-In requires incident reporting within six hours; NCIIPC sets requirements for designated critical infrastructure; the CEA's cyber security guidelines apply to captive power. And ISA/IEC 62443 — the standard the automation industry wrote for itself — defines what good looks like on the plant floor. GISPL's industrial practice includes engineers who have worked on the plant side, and it has assessed live plants, utilities and process facilities across India and the Gulf without a single process trip.

## What we do for manufacturers

The boundary first: segmentation between IT and OT designed against 62443's zones and conduits, and vendor remote access brought under identity, MFA and monitoring — the single highest-return investment in most plants. OT assessment, passive-first and safety-bounded, of the systems that run production. TISAX readiness and assessment support for automotive suppliers, and ISO 27001 as the base for everyone. Ransomware readiness built for the industrial sequence — detection of the precursors, immutable backups of the engineering and MES systems, recovery rehearsed. ERP security, because SAP and Oracle are where the money moves. IP protection and investigation, because designs, formulations and process knowledge are the business. And 24×7 monitoring with OT sensors, so that a compromised engineering station is seen the hour it happens.
