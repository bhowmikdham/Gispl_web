---
title: ISO/IEC 27017 — cloud security
label: ISO 27017 · Cloud
practice: consulting-and-maintenance
order: 2
tagline: Cloud-specific security controls certified on top of your ISMS — for providers who host and customers who depend on them.
summary: ISO/IEC 27017 implementation and certification support — cloud-specific controls, shared-responsibility definition and provider–customer obligations, as an extension to ISO 27001.
icon: cloud
status: published
facts:
- label: Standard
  value: ISO/IEC 27017:2015 — code of practice for information-security controls for cloud services, based on ISO/IEC 27002
- label: Certified by
  value: Accredited certification bodies, as an extension to an ISO/IEC 27001 certificate
- label: Applies to
  value: Cloud service providers of every kind (IaaS, PaaS, SaaS, managed hosting) and cloud service customers who need to demonstrate controlled use of cloud
- label: Cadence
  value: Audited alongside the ISO 27001 cycle — surveillance annually, recertification every three years
appliesTo:
- You provide a cloud service — SaaS, hosting, managed platform, data centre — and customers ask how you protect their data and where the responsibility boundary sits.
- You are a cloud customer in a regulated sector and the regulator expects controlled adoption of cloud — RBI, SEBI and IRDAI all now say so explicitly.
- You hold ISO 27001 and want to extend it to cover the cloud-specific controls your customers and tenders ask about.
- You are a government or public-sector cloud provider or user under MeitY's empanelment framework.
- A customer's due-diligence questionnaire asks for your 27017 controls by number.
- You are moving workloads to AWS, Azure or Google Cloud and want the controls designed in.
stakes:
- The shared-responsibility model, left undefined, means each party assumes the other is doing something — and a gap that nobody owns is where breaches happen.
- Regulated customers cannot adopt a provider that cannot evidence cloud-specific controls; providers lose the sector.
- Data location, segregation between tenants, and secure deletion at contract end are the questions every enterprise customer asks — and the ones a generic ISMS does not answer.
- Regulators now audit cloud use directly and expect documented controls, exit plans and provider oversight.
- Administrator access to a cloud platform is the highest-privilege access an organisation holds; ungoverned, it is the single largest exposure.
- Without evidence, cloud security assurances are marketing; with 27017, they are audited.
steps:
- title: Role and scope
  text: Provider, customer or both — for each cloud service, which role you play and which controls therefore apply.
- title: Shared-responsibility mapping
  text: For every control, who does what — documented, agreed with customers or providers, and written into contracts.
- title: Gap assessment against 27017
  text: The cloud-specific implementation guidance for the ISO 27002 controls, plus the seven additional cloud controls, assessed against your platform and processes.
- title: Control implementation
  text: Tenant segregation, virtual-machine hardening, administrator operations, monitoring, data location and deletion — designed and implemented for your platform.
- title: ISMS integration and internal audit
  text: The controls folded into your ISO 27001 risk assessment and Statement of Applicability, and audited internally.
- title: Certification
  text: Supported through the certification body's extension audit, alongside your 27001 cycle.
deliverables:
- title: Cloud role and scope definition
  text: Which services, which role, which controls.
- title: Shared-responsibility matrix
  text: Every control assigned, agreed and contractable.
- title: Gap report and remediation plan
  text: Against the 27017 guidance and additional controls.
- title: Cloud security procedures
  text: Tenant isolation, administrator operations, monitoring, data lifecycle.
- title: Updated Statement of Applicability and risk assessment
  text: 27017 integrated into the ISMS.
- title: Customer assurance package
  text: The answers to the questions every enterprise customer asks.
faq:
- q: Can we certify to 27017 on its own?
  a: No — it is certified as an extension to ISO 27001. If you do not yet hold 27001, we run both together in one programme; the additional work for 27017 is modest once the ISMS exists.
- q: What does 27017 add beyond 27001?
  a: "Cloud-specific implementation guidance for the existing controls — how they apply differently for a provider and a customer — and seven additional controls: shared roles and responsibilities, removal and return of customer assets, segregation in virtual environments, virtual-machine hardening, administrator operational security, monitoring of cloud services, and alignment of virtual and physical network security."
- q: How is 27018 different?
  a: 27017 is about cloud security generally; 27018 is specifically about protecting personally identifiable information in the public cloud when you act as a processor. Providers that handle personal data usually need both; we implement them together.
- q: We are a customer, not a provider — is this relevant?
  a: "Yes. 27017 defines controls for cloud service customers as well as providers: governing your use of cloud, managing administrator access, monitoring the service and planning your exit. Regulators in India increasingly expect exactly this from regulated entities using cloud."
- q: Does this help with regulator cloud requirements?
  a: Directly. RBI's outsourcing directions, SEBI's cloud framework and IRDAI's guidelines all require documented cloud governance, provider oversight, data-location assurance and exit planning. A 27017-aligned ISMS is the most straightforward way to evidence all of it.
related:
- iso-27018-cloud-privacy
- cloud-security
- aws-and-azure-hardening
industries:
- bfsi
- telecom
- government
insights:
- iso-27001-in-2026-what-the-new-controls-really-demand
seo:
  title: ISO/IEC 27017 cloud security controls — GISPL
  description: ISO/IEC 27017 implementation and certification support for cloud providers and customers — shared-responsibility mapping and cloud-specific controls.
  noindex: false
---

ISO/IEC 27017 is the international code of practice for information-security controls in cloud services. It takes the controls of ISO/IEC 27002 and explains how each applies in a cloud context — separately for the **cloud service provider** and the **cloud service customer** — and adds seven controls that exist only because cloud does: shared responsibilities, the return and removal of customer assets at contract end, segregation between tenants in virtual environments, hardening of virtual machines, the operational security of administrators, monitoring of cloud services, and alignment between virtual and physical network security.

Its central contribution is forcing the shared-responsibility model to be written down. Every cloud arrangement divides security between provider and customer; every cloud breach involves a control that one party assumed the other was handling. 27017 requires the division to be defined, documented and agreed, control by control. For providers, that definition is the answer to every enterprise customer's due-diligence questionnaire. For customers in regulated sectors — where RBI, SEBI and IRDAI now audit cloud adoption directly and expect provider oversight, data-location assurance and exit planning — it is the evidence the regulator asks for.

## Certified as part of the ISMS

27017 is not certified alone; it is an extension to ISO 27001, audited alongside it by the same accredited body. For an organisation with a working ISMS, adding it is a matter of months: mapping your cloud role, defining shared responsibilities, assessing and implementing the cloud-specific controls, folding them into the risk assessment and Statement of Applicability, and supporting the extension audit. For an organisation starting from nothing, we run 27001 and 27017 as one programme. Providers that handle personal data usually add ISO/IEC 27018 at the same time; the three together are what most enterprise and public-sector customers now expect of a cloud provider.
