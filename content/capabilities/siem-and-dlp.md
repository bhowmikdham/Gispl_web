---
title: SIEM & DLP
label: SIEM & DLP
practice: implementation-and-managed-services
order: 9
tagline: Security information and event management that produces detections, and data-loss prevention that catches leaks — designed, deployed, tuned and run.
summary: Design, deployment and operation of SIEM and data-loss prevention platforms — log architecture, detection engineering, DLP policy design and tuning, and integration with SOC operations — for regulated estates.
icon: server
status: published
facts:
- label: Platforms
  value: Microsoft Sentinel, Splunk, IBM QRadar, Elastic and others for SIEM; Microsoft Purview, Symantec, Forcepoint, Zscaler and native cloud DLP
- label: Drivers
  value: RBI, SEBI CSCRF and IRDAI log-retention and monitoring requirements; DPDP Act safeguards; PCI DSS requirements 10 and 12; ISO 27001 controls 8.15 and 8.12
- label: Covers
  value: Log-source architecture and retention, parsing and normalisation, detection engineering, dashboards and reporting, DLP data classification and policy, endpoint, email, web and cloud DLP channels
- label: Cadence
  value: Deployment as a project of 8–16 weeks; detection and policy tuning continuous; operated by your SOC or ours
appliesTo:
- Your regulator requires centralised logging, retention and monitoring — RBI, SEBI, IRDAI and PCI DSS all specify it — and you have logs scattered across systems.
- You bought a SIEM and it ingests everything and detects nothing.
- Personal, financial or proprietary data leaves through email, cloud storage and USB and nobody would know.
- The DPDP Act requires reasonable safeguards for personal data, and you cannot show where it goes.
- Licensing costs are driven by ingesting logs nobody uses.
- Your SOC — in-house or outsourced — needs a platform that produces detections rather than volume.
stakes:
- Regulators issue findings for missing logs, short retention and unmonitored systems; after an incident, missing logs mean no investigation and no root cause.
- A SIEM without detection engineering is an expensive archive.
- Data walks out through email, personal cloud accounts and removable media every day in most organisations; DLP is how you find out — and stop it.
- DPDP and GDPR breach notification requires knowing what left; without DLP telemetry, you are guessing to a regulator.
- Insider incidents — departing employees with customer lists — are among the most common we investigate and the most preventable.
- DLP deployed without tuning blocks the business and gets switched off.
steps:
- title: Requirements and architecture
  text: Which logs, from which sources, retained how long, to satisfy which regulator and which detection use case — and for DLP, which data, on which channels, with which response.
- title: Data classification
  text: For DLP, the categories that matter — personal data, card data, health records, intellectual property — defined and discoverable, with the labels and patterns that identify them.
- title: Deployment
  text: SIEM log sources onboarded with parsing and normalisation verified; DLP agents and channel integrations rolled out in monitor mode.
- title: Detection and policy engineering
  text: Detection rules built for your threat model and mapped to ATT&CK; DLP policies built for your data and business processes — both tuned on real traffic.
- title: Integration with operations
  text: Alerts routed to your SOC or ours, playbooks for each detection and DLP incident, dashboards and reports for compliance.
- title: Tuning and optimisation
  text: False positives driven down, ingestion optimised for cost, retention aligned to regulation, and the content reviewed quarterly.
deliverables:
- title: Logging and DLP architecture
  text: Sources, retention, channels and data categories mapped to regulatory requirements.
- title: Deployed and verified platform
  text: Log sources parsing correctly; DLP channels covered.
- title: Detection rule library
  text: Mapped to ATT&CK, tuned, documented.
- title: DLP policy set
  text: Per data category and channel, with response actions and exception process.
- title: Dashboards and compliance reports
  text: For the SOC, the CISO and the regulator.
- title: Operations handover or managed service
  text: Runbooks for your team, or operation through GISPL's SOC.
faq:
- q: Which SIEM should we choose?
  a: The one that fits your estate, your budget and your SOC — we work across the major platforms and have no resale relationship that biases the advice. Cloud-native estates usually favour Sentinel or a cloud SIEM; large on-premise estates often have Splunk or QRadar already. The platform matters less than the content and the people.
- q: Why does our SIEM produce nothing useful?
  a: "Almost always because it was deployed as an ingestion project rather than a detection one — every log switched on, no use cases defined, vendor default rules generating noise. Detection engineering is the missing step: rules built for your threat model, tested against real data and tuned."
- q: Will DLP block our business?
  a: If it is switched on in blocking mode on day one, yes — and then it gets switched off. We deploy in monitor mode, learn how data actually moves, build policies around genuine business processes, and move to blocking channel by channel with an exception process. Done that way, it catches leaks and stays on.
- q: How long must we retain logs?
  a: "It depends on the regulator: RBI and SEBI specify minimum periods for various log types, PCI DSS requires a year with three months immediately available, and CERT-In's directions require 180 days of certain logs. We design retention to the strictest applicable requirement, on tiers that keep the cost sane."
- q: Can you run it for us?
  a: Yes — SIEM operation and DLP incident handling are delivered through our 24×7 SOC as a managed service.
related:
- soc-monitoring
- mdr
- dpdp-act-2023
industries:
- bfsi
- telecom
- pharma-healthcare
- government
insights:
- building-an-incident-response-runbook-that-survives-contact
- dpdp-act-turning-consent-into-an-engineering-problem
seo:
  title: SIEM and DLP design, deployment and operation — GISPL
  description: SIEM and DLP design, deployment, detection engineering, policy tuning and operation for regulated estates — RBI, SEBI, IRDAI, PCI DSS and DPDP requirements.
  noindex: false
---

Security information and event management is the platform that collects logs from across the estate, correlates them and produces the detections a SOC acts on. Data-loss prevention is the platform that watches data as it moves — through email, cloud storage, web uploads, removable media — and catches it leaving. Both are required, explicitly or implicitly, by every regulator in Indian financial services and by PCI DSS; both are among the most commonly bought and most commonly disappointing security investments, and for the same reason. A SIEM deployed as an ingestion project detects nothing. A DLP deployed in blocking mode on day one is switched off by week two.

The difference is engineering. A SIEM produces detections when log sources are chosen for the use cases they serve, parsed and normalised correctly, retained to the regulatory requirement on tiers that control cost, and fed into detection rules built for the organisation's threat model, mapped to MITRE ATT&CK and tuned on real traffic. A DLP catches leaks and stays on when the data categories that matter — personal data under the DPDP Act, card data under PCI DSS, health records, intellectual property — are defined and discoverable, when policies are built around how the business actually moves data, and when enforcement is introduced channel by channel with an exception process after a monitoring period has shown what normal looks like.

## Built for the regulator and the SOC

GISPL designs, deploys and tunes both platforms across the major products, with no resale relationship to bias the advice, and integrates them with security operations — yours or ours. Logging architecture is mapped to the retention and monitoring clauses of RBI, SEBI, IRDAI, PCI DSS and CERT-In's directions, so the compliance report writes itself; DLP telemetry is what lets an organisation tell the Data Protection Board what actually left, rather than guess. And because the same team runs our 24×7 SOC, the detections and policies are built by people who will have to act on them — which is the surest way to keep the noise down.
