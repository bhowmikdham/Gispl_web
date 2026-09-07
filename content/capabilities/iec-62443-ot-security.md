---
title: IEC 62443 & OT security compliance
label: IEC 62443 · OT
practice: compliance-and-certification
order: 10
tagline: Industrial control systems secured to the standard the sector wrote for itself — zones, conduits and security levels, without stopping the plant.
summary: ISA/IEC 62443 assessments, zone-and-conduit design, security-level targets and compliance programmes for plants, utilities, OEMs and integrators — aligned to CEA and NCIIPC expectations.
icon: factory
status: published
facts:
- label: Standard
  value: ISA/IEC 62443 series — 2-1 (asset-owner programme), 2-4 (service providers), 3-2 (risk and zoning), 3-3 (system requirements), 4-1 and 4-2 (product development and components)
- label: Owner
  value: International Society of Automation and the International Electrotechnical Commission; referenced by CEA and NCIIPC in India
- label: Applies to
  value: Asset owners running industrial control systems, and the integrators, service providers and product vendors that build and maintain them
- label: Cadence
  value: Risk assessment and zoning on design and on change; periodic assessment against target security levels; CEA guidelines require annual audit for power-sector entities
appliesTo:
- You operate a plant, a utility, a refinery, a pipeline, a port, a water system or a smart building where PLCs, SCADA, DCS and safety systems run the process.
- You are a power-sector entity subject to the Central Electricity Authority's cyber security guidelines, or your systems are designated critical information infrastructure under NCIIPC.
- You are an OEM or integrator whose customers now require IEC 62443-4-1 development processes or 62443-4-2 component certification.
- You are connecting OT to IT — for analytics, remote support or cloud — and need the segmentation designed before the connection, not after the incident.
- A customer, insurer or regulator has asked for your OT security posture and you have an IT answer.
- You have had, or narrowly avoided, an incident on the plant floor.
stakes:
- "Safety: a compromised control system can injure people, and an incorrectly performed security test can do the same."
- Production downtime measured in hours of lost output, contractual penalties and, for utilities, service interruptions to the public.
- Regulatory action under CEA guidelines and NCIIPC directions for critical infrastructure, including reporting obligations.
- Ransomware that crosses from IT to OT — the most common real-world pattern — takes the plant down even when the controllers themselves are untouched.
- Legacy controllers that cannot be patched and were never designed to be on a network, now reachable from the corporate estate.
- "Lost tenders: OEMs and integrators without 62443 alignment are being excluded from utility and industrial procurement."
steps:
- title: Asset discovery and system inventory
  text: What is actually on the OT network — controllers, HMIs, engineering stations, historians, remote-access paths — found passively, without touching the process.
- title: Risk assessment and zoning (62443-3-2)
  text: The system under consideration partitioned into zones and conduits, with a risk assessment per zone and a target security level for each.
- title: Gap assessment against target levels
  text: Each zone's controls measured against the 62443-3-3 requirements for its target security level, and the asset-owner programme against 62443-2-1.
- title: Architecture and control design
  text: Segmentation, secure remote access, monitoring, patch and configuration management, backup and recovery — designed for equipment that cannot be rebooted at will.
- title: Implementation with the plant
  text: Controls put in place inside maintenance windows with your engineers and vendors, and validated without disturbing the process.
- title: Programme and audit readiness
  text: The cyber security management system 62443-2-1 describes, aligned to CEA and NCIIPC expectations, with the evidence for the annual audit.
deliverables:
- title: OT asset inventory and network map
  text: The document most plants do not have, and every assessment begins with.
- title: Zone-and-conduit model with target security levels
  text: The 62443-3-2 design that everything else is measured against.
- title: Gap report and remediation roadmap
  text: Per zone, per requirement, sequenced around production.
- title: OT security architecture
  text: Segmentation, remote access, monitoring and recovery designed for the plant.
- title: Cyber security management system
  text: Policies, roles and procedures against 62443-2-1 and CEA guidelines.
- title: Audit and assurance pack
  text: Evidence for CEA, NCIIPC, customers and insurers.
faq:
- q: Will assessment or testing disrupt production?
  a: Not if it is done properly. OT assessment is passive first — traffic capture, configuration review, documentation — and any active testing is agreed in writing, run inside maintenance windows, and never against safety systems. We have assessed live utilities and process plants without a single trip.
- q: What is a security level?
  a: IEC 62443 defines security levels 1 to 4, describing the sophistication of attacker a zone must resist — from casual misuse to a nation-state with extended resources. Each zone gets a target level from its risk assessment, and the controls follow from that. Not every zone needs level 3; the standard is explicit about that.
- q: Does this apply to us as a product vendor or integrator?
  a: Yes, through different parts of the series. 62443-4-1 covers the secure development lifecycle, 62443-4-2 the technical requirements for components, and 62443-2-4 the requirements for integration and maintenance service providers. Utility and industrial customers now write these into tenders.
- q: How does this relate to CEA and NCIIPC?
  a: The Central Electricity Authority's cyber security guidelines for the power sector and NCIIPC's requirements for critical information infrastructure both draw on 62443 and both require periodic audit. A 62443-based programme is the most direct way to meet them, and we structure the evidence for both.
- q: Can our IT security team handle OT?
  a: The principles carry over; the practice does not. OT has different priorities (availability and safety over confidentiality), different equipment (controllers with decades-long lifecycles and no patching), different protocols and different failure modes. Our OT team includes people who have worked on the plant side.
related:
- scada-ot-testing
- network-security
- tisax-automotive
industries:
- manufacturing
- telecom
- government
insights:
- building-an-incident-response-runbook-that-survives-contact
- red-blue-and-purple-which-testing-does-your-team-need
seo:
  title: IEC 62443 & OT security compliance — GISPL
  description: ISA/IEC 62443 assessments, zone-and-conduit design, security-level targets and OT programmes for plants, utilities, OEMs and integrators — CEA/NCIIPC aligned.
  noindex: false
---

ISA/IEC 62443 is the international standard for the security of industrial automation and control systems — the PLCs, SCADA, distributed control and safety systems that run plants, utilities, pipelines, ports and buildings. It was written by the automation sector for itself, and it differs from IT security standards in ways that matter: it puts availability and safety ahead of confidentiality, it assumes equipment that cannot be patched or rebooted at will, and it organises security around **zones** (groups of assets with common requirements) and **conduits** (the communication paths between them), each assigned a **target security level** from 1 to 4 according to the sophistication of attacker it must resist.

The series has parts for every party. 62443-2-1 describes the asset owner's security programme; 62443-3-2 the risk assessment and zoning method; 62443-3-3 the system-level technical requirements for each security level; 62443-2-4 the requirements for integrators and maintenance providers; 62443-4-1 and 4-2 the secure development process and component requirements for product vendors. In India, the Central Electricity Authority's cyber security guidelines for the power sector and NCIIPC's requirements for critical information infrastructure both draw on it and both require periodic audit.

## Why OT security is different

Most industrial incidents do not begin on the plant floor. They begin in IT — a phishing email, a compromised VPN, a ransomware payload — and cross into OT through a connection that was made for convenience and never segmented. The controllers themselves may be untouched; the plant still stops, because the HMIs, historians and engineering stations that operate it are Windows machines on a flat network. Zone-and-conduit design exists to stop that crossing, and it is the first thing we build.

The second difference is testing. Active scanning that is routine in IT can crash a controller. Our OT assessments are passive first — traffic capture, configuration review, documentation — with any active work agreed in writing, run inside maintenance windows and never against safety systems. GISPL has assessed live utilities, process plants and manufacturing sites across India and the Gulf without disturbing a single process, and our OT team includes people who have worked on the plant side.
