---
title: ISO 27799 — health information security
label: ISO 27799 · Health
practice: consulting-and-maintenance
order: 8
tagline: ISO 27001 controls applied the way healthcare needs them — for hospitals, labs, insurers, pharma and the platforms between them.
summary: ISO 27799 implementation for healthcare organisations — the health-specific application of ISO 27002 controls to patient records, clinical systems, medical devices and health-data exchange, integrated with ISO 27001 and mapped to HIPAA and DPDP.
icon: hospital
status: published
facts:
- label: Standard
  value: ISO 27799:2016 — health informatics, information security management in health using ISO/IEC 27002
- label: Certified by
  value: Evidenced through an ISO/IEC 27001 certificate whose scope and controls follow the 27799 guidance; accredited bodies audit the combination
- label: Applies to
  value: Hospitals, clinics, diagnostic labs, health insurers and TPAs, pharmaceutical and clinical-research organisations, health-tech platforms and their suppliers
- label: Cadence
  value: Within the ISO 27001 cycle — annual surveillance, three-year recertification; controls reviewed on every new clinical system or device
appliesTo:
- You are a hospital, hospital group, clinic chain or diagnostic laboratory running electronic medical records, PACS, LIS and connected devices.
- You are a health insurer or third-party administrator holding claims and clinical data under IRDAI's guidelines.
- You are a pharmaceutical, biotech or clinical-research organisation handling identifiable patient data from trials or programmes.
- You build or operate a health-tech platform — telehealth, EHR, health app, ABDM-linked service — and customers or regulators ask how patient data is protected.
- You serve US healthcare clients under HIPAA and want a certified system that evidences the Security Rule.
- You hold ISO 27001 with a generic scope and your clinical estate is not really covered.
stakes:
- Health data is the most sensitive category under the DPDP Act and the GDPR, and the most valuable on criminal markets; breaches are reported, litigated and remembered.
- Ransomware against hospitals is now routine and stops clinical care; the cost is measured in postponed treatment, not just downtime.
- Connected medical devices — infusion pumps, imaging, monitors — are unpatched computers on the clinical network, and generic ISMS scopes ignore them.
- Insurers and TPAs face IRDAI action; providers face regulatory and accreditation consequences; research organisations face sponsor and ethics-committee consequences.
- HIPAA business-associate obligations reach Indian health-IT and outsourcing companies directly.
- "Trust: patients and referring clinicians do not return to a provider that lost their records."
steps:
- title: Health-specific scope
  text: The ISMS scope drawn around the clinical estate as it is — EMR, PACS, LIS, pharmacy, billing, devices, telehealth, exchange interfaces — not around the IT department.
- title: Health information classification and flows
  text: Personal health information identified and traced through admission, treatment, diagnostics, claims, research and exchange, including with partners and ABDM.
- title: Risk assessment for clinical environments
  text: Threats to confidentiality, and equally to availability and integrity of clinical data — because a wrong record harms a patient.
- title: Control implementation to 27799 guidance
  text: Access control by clinical role, emergency access, audit trails of record access, device security, secure messaging and exchange, retention and secure disposal — implemented with clinical and IT staff together.
- title: Integration and internal audit
  text: The health-specific controls in the ISO 27001 Statement of Applicability, mapped to HIPAA, DPDP and IRDAI where they apply, and audited internally.
- title: Certification and maintenance
  text: Supported through the certification audit, then maintained as new clinical systems and devices arrive.
deliverables:
- title: Clinical-estate scope and asset register
  text: Including medical devices and exchange interfaces.
- title: Health information flow map
  text: Where patient data goes, inside and outside the organisation.
- title: Risk assessment for clinical systems
  text: Confidentiality, integrity and availability weighed as healthcare requires.
- title: Health-specific control set and procedures
  text: Role-based and emergency access, audit trails, device security, exchange, disposal.
- title: Regulatory crosswalk
  text: 27799 controls mapped to HIPAA, DPDP, IRDAI and ABDM expectations.
- title: Certification support
  text: Through the ISO 27001 audit with 27799 scope.
faq:
- q: Is ISO 27799 a separate certificate?
  a: 27799 is guidance on applying ISO 27002 controls in healthcare, not a separately certified standard. What you certify is ISO 27001, with a scope and control implementation that follow 27799. The certificate then evidences health-specific security, which is what regulators, insurers and partners look for.
- q: How does this relate to HIPAA?
  a: HIPAA's Security Rule and 27799 cover the same ground from different directions — one a legal obligation, the other a control framework. A 27799-aligned ISMS implements the Security Rule safeguards and provides the documented risk analysis and evidence HIPAA requires. We map them explicitly for organisations serving US clients.
- q: Do medical devices really come into scope?
  a: They must. Infusion pumps, imaging systems, patient monitors and lab analysers are networked computers, often running unsupported operating systems, and they are the weakest point on most clinical networks. 27799 expects them to be inventoried, segmented and governed; we treat them as OT.
- q: What about DPDP and health data?
  a: The DPDP Act applies to all personal data, and health data is where the consequences of a breach are most severe. A 27799-aligned ISMS provides the reasonable security safeguards the Act requires and the evidence a fiduciary needs; we also map the consent and rights obligations for patient-facing services.
- q: Will this disrupt clinical operations?
  a: It is designed not to. Controls are implemented with clinical staff, emergency access is preserved, and device security is handled with the same passive-first discipline we use in industrial environments. Security that obstructs care gets bypassed; we build the kind that does not.
related:
- hipaa
- iso-27001-isms
- iot-security
industries:
- pharma-healthcare
insights:
- iso-27001-in-2026-what-the-new-controls-really-demand
- after-the-breach-what-digital-forensics-actually-recovers
seo:
  title: ISO 27799 health information security — GISPL
  description: ISO 27799 for hospitals, labs, insurers, pharma and health-tech — health-specific controls for patient records, clinical systems and medical devices.
  noindex: false
---

ISO 27799 is the international standard for information security management in health. It takes the controls of ISO/IEC 27002 and explains how each must be applied when the information is personal health information — where confidentiality matters more than almost anywhere else, but where the availability and integrity of a record can be a matter of a patient's safety. It is the guidance that turns a generic ISO 27001 certificate into one that actually covers a hospital, a laboratory, an insurer or a health-data platform.

Healthcare environments differ from corporate ones in ways that matter for security. Access to records must follow clinical role and must be available in an emergency, which means break-glass access with audit trails rather than rigid permissions. Data flows through admission, treatment, diagnostics, pharmacy, claims, research and, increasingly, national exchange infrastructure such as ABDM. Connected medical devices — infusion pumps, imaging systems, monitors, analysers — are networked computers running software that cannot be patched, and they sit on the same network as the electronic medical record. And the threat is acute: ransomware against hospitals is now routine, and it stops care.

## One system for several regulators

Health organisations answer to more than one rulebook. Insurers and TPAs sit under IRDAI's cyber security guidelines. Providers face regulatory and accreditation requirements. Research organisations face sponsors and ethics committees. Indian health-IT and outsourcing companies serving US clients are HIPAA business associates. And every one of them is a data fiduciary or processor under the DPDP Act, handling the most sensitive category of personal data it defines.

GISPL implements 27799 as the health-specific scope and control set of an ISO 27001 system, with a crosswalk to HIPAA's Security Rule, the DPDP Act's obligations and IRDAI's requirements, so one certified system evidences all of them. Controls are implemented with clinical staff rather than imposed on them, medical devices are treated as operational technology, and emergency access is preserved — because security that obstructs care gets bypassed, and we build the kind that does not.
