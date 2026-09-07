---
title: ISO/IEC 27018 — PII in the public cloud
label: ISO 27018 · Cloud
practice: consulting-and-maintenance
order: 3
tagline: The certified answer to "what do you do with our customers' personal data?" — for cloud providers that process it.
summary: ISO/IEC 27018 implementation and certification support for public-cloud providers acting as PII processors — consent, transparency, customer control, breach notification and secure deletion, as an extension to ISO 27001.
icon: cloud
status: published
facts:
- label: Standard
  value: ISO/IEC 27018:2019 — code of practice for protecting personally identifiable information in public clouds acting as PII processors
- label: Certified by
  value: Accredited certification bodies, as an extension to an ISO/IEC 27001 certificate, commonly alongside ISO/IEC 27017
- label: Applies to
  value: Public-cloud providers — SaaS, PaaS, IaaS, hosting — that process personal data on behalf of their customers
- label: Cadence
  value: Audited within the ISO 27001 cycle — annual surveillance, three-year recertification
appliesTo:
- You are a SaaS or cloud provider whose customers upload their customers', employees' or patients' personal data to your platform.
- Enterprise, government or regulated customers ask how you handle personal data — consent, location, sub-processors, deletion — before they sign.
- You are a processor under the GDPR or the DPDP Act and need certified evidence of the processor obligations those laws impose.
- You serve customers in Europe, and Article 28 due diligence is stalling deals.
- You already hold ISO 27001 and 27017 and want the privacy extension your market now expects.
- You are competing for public-sector cloud work where PII handling is a scored criterion.
stakes:
- Customer contracts stall at the data-processing agreement; without evidence of processor controls, legal teams will not sign.
- GDPR and DPDP obligations fall directly on processors — using data for your own purposes, failing to notify a breach, or retaining data after contract end are infringements with your name on them.
- Sub-processor chains that customers cannot see are a due-diligence failure and, under GDPR, a contractual one.
- A privacy incident at a provider is an incident at every customer; the reputational cost is multiplied by the customer count.
- Secure deletion at contract end is the most-asked and least-evidenced control in cloud contracts.
- Competitors with the certificate win the tenders that score on privacy.
steps:
- title: Processing inventory
  text: Which customer personal data your platform holds, in which services and regions, with which sub-processors — the map both the standard and your customers require.
- title: Gap assessment against 27018
  text: The PII-specific guidance on the ISO 27002 controls and the additional processor controls, assessed against your platform, contracts and operations.
- title: Customer-facing commitments
  text: Purpose limitation, transparency about location and sub-processors, customer control over their data, breach notification and secure deletion — written into contracts and made operational.
- title: Control implementation
  text: Encryption, access control, logging of PII access, data return and deletion, disclosure handling and staff confidentiality, implemented on the platform.
- title: ISMS integration and internal audit
  text: The controls folded into the ISO 27001 risk assessment and Statement of Applicability, and internally audited.
- title: Certification
  text: Supported through the certification body's extension audit.
deliverables:
- title: PII processing inventory
  text: Data, services, regions and sub-processors.
- title: Gap report and remediation plan
  text: Against the 27018 guidance and processor controls.
- title: Data-processing terms and transparency documentation
  text: Purpose limitation, sub-processor disclosure, location, deletion — aligned to GDPR Article 28 and DPDP processor duties.
- title: PII protection procedures
  text: Access, logging, disclosure, breach notification, return and deletion.
- title: Updated ISMS documentation
  text: Risk assessment and Statement of Applicability with 27018 integrated.
- title: Customer assurance package
  text: The evidence a customer's privacy team needs to approve you.
faq:
- q: How is 27018 different from 27701?
  a: 27018 is narrow and specific — a public-cloud provider acting as a processor of personal data. 27701 is a full privacy information management system for any organisation, controller or processor, cloud or not. Cloud providers often hold 27018; organisations with broad privacy obligations pursue 27701. Some need both.
- q: Do we need 27017 as well?
  a: Usually. 27017 covers cloud security generally and 27018 covers personal data specifically; the two are designed to sit together on top of ISO 27001, and certification bodies commonly audit them in one visit.
- q: Does this satisfy GDPR Article 28?
  a: It provides certified evidence of most of the processor obligations Article 28 requires — instructions, confidentiality, security, sub-processor control, assistance with rights and breaches, deletion and audit. The contract itself must still contain the Article 28 terms; we draft those alongside.
- q: What about the DPDP Act?
  a: The DPDP Act places duties on data processors through their contract with the data fiduciary, and fiduciaries are accountable for their processors' conduct. A 27018-certified platform gives an Indian fiduciary the assurance it needs to engage you.
- q: How long does it take?
  a: For a provider with ISO 27001 in place, typically three to four months to the extension audit. Alongside a first ISO 27001 certification, it adds a few weeks to the overall programme.
related:
- iso-27017-cloud
- iso-27701-privacy
- gdpr
industries:
- bfsi
- pharma-healthcare
- education-hospitality
insights:
- dpdp-act-turning-consent-into-an-engineering-problem
seo:
  title: ISO/IEC 27018 — PII protection in public cloud — GISPL
  description: ISO/IEC 27018 for cloud providers processing personal data — processor controls, transparency, deletion and breach notification, GDPR and DPDP aligned.
  noindex: false
---

ISO/IEC 27018 is the international code of practice for protecting personally identifiable information in public clouds where the provider acts as a **PII processor** — that is, where customers upload personal data about their own customers, employees or patients and the provider processes it on their behalf. It is the certified answer to the question every enterprise, government and regulated customer asks a cloud provider before signing: what exactly do you do with our people's data?

The standard takes the ISO/IEC 27002 controls and adds PII-specific guidance, then adds controls that exist only for processors: processing personal data solely on the customer's documented instructions and never for the provider's own purposes; being transparent about where data is stored and which sub-processors touch it; giving customers the means to meet their own obligations to individuals; notifying the customer of any breach; handling law-enforcement disclosure requests properly; logging access to PII; and returning or securely deleting data when the contract ends. Every one of those maps to a processor obligation under the GDPR's Article 28 and, in India, to the duties a data fiduciary must impose on its processors under the DPDP Act.

## Why providers pursue it

Because it unblocks contracts. Privacy due diligence is where cloud deals stall — the customer's legal team wants evidence, not assurances, and a data-processing agreement without it does not get signed. A 27018 certificate, audited by an accredited body as an extension to ISO 27001, is that evidence. It is usually implemented alongside ISO/IEC 27017, and the three standards together — 27001, 27017, 27018 — have become the expected credential set for a cloud provider serving enterprises and the public sector.

GISPL implements 27018 on top of an existing ISMS in a matter of months: inventorying the personal data and sub-processors, assessing the gaps, making the customer-facing commitments operational, implementing the platform controls, integrating them into the ISMS and supporting the extension audit. Where the customer base is European or Indian, we draft the Article 28 and DPDP processor terms at the same time, so the certificate and the contract say the same thing.
