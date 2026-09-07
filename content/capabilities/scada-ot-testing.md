---
title: SCADA / OT security testing
label: SCADA / OT testing
practice: assessments-and-testing
order: 5
tagline: Industrial control systems assessed by people who know what a false trip costs — passive first, safety-bounded, and thorough.
summary: Security assessment and controlled testing of SCADA, DCS, PLC and building-management environments — asset discovery, architecture review, protocol analysis and safe active testing against IEC 62443.
icon: factory
status: published
facts:
- label: Scope
  value: SCADA and DCS, PLCs and RTUs, HMIs and engineering stations, historians, safety systems, remote access, and the IT–OT boundary
- label: Methodology
  value: IEC 62443-3-2 and 3-3, NIST SP 800-82, MITRE ATT&CK for ICS; passive-first with agreed, bounded active testing
- label: Required by
  value: CEA cyber security guidelines for the power sector; NCIIPC for critical information infrastructure; CERT-In empanelment for mandated audits
- label: Cadence
  value: Annually and after significant change; continuous passive monitoring where available
appliesTo:
- You operate a plant, utility, refinery, pipeline, water system, port, rail or airport where control systems run the process.
- You are subject to CEA's cyber security guidelines or designated critical information infrastructure under NCIIPC, and an audit is required.
- You are connecting OT to IT, the cloud or a vendor's remote support and want the exposure measured before the connection goes live.
- Your IT penetration test stopped at the OT firewall and nobody knows what is behind it.
- You have had an event — a strange HMI screen, an unexplained trip, a vendor laptop with malware — and want to know what an attacker could really do.
- Your insurer or a customer has asked for an OT security assessment.
stakes:
- "Safety: a compromised or mis-tested control system can injure people and damage plant."
- "Downtime: a stopped line or a tripped unit costs more per hour than most IT incidents cost in total."
- Regulatory action under CEA guidelines and NCIIPC directions, including for failure to assess and report.
- Ransomware crossing from IT to OT — the dominant real-world pattern — takes the plant down without touching a controller.
- Decades-old controllers with no authentication, reachable from the corporate network through a connection made for convenience.
- Vendor remote access that is always on, shared, and never reviewed.
steps:
- title: Scope and safety rules
  text: Systems, zones, sites and windows agreed with operations and safety; what is passive-only, what may be actively tested, what is never touched — in writing, signed by the plant.
- title: Passive discovery
  text: Traffic capture and configuration review to inventory every device, protocol and communication path — including the ones the network diagram omits — without sending a packet to a controller.
- title: Architecture and boundary review
  text: Zones and conduits, the IT–OT boundary, remote access, jump hosts, historians and the DMZ assessed against IEC 62443 and your own design.
- title: Configuration and vulnerability analysis
  text: Controllers, HMIs, engineering stations and network devices reviewed for known vulnerabilities, weak authentication, default credentials, insecure protocols and unsafe configurations — offline where possible.
- title: Bounded active testing
  text: Where agreed, controlled testing of specific paths — the boundary, remote access, HMI and engineering-station networks — inside maintenance windows, with operations present and a rollback plan.
- title: Reporting and remediation
  text: Findings rated by safety and production impact, remediation designed for equipment that cannot be patched, and a roadmap sequenced around outages.
deliverables:
- title: OT asset inventory and communication map
  text: Every device, protocol and path, from observation — the document most plants lack.
- title: Architecture assessment
  text: Zones, conduits, boundary and remote access against IEC 62443.
- title: Vulnerability and configuration findings
  text: Rated by safety and production impact, not scanner severity.
- title: Attack-path analysis
  text: How an attacker gets from the corporate network, a vendor or the internet to the process.
- title: Compensating-control recommendations
  text: For the controllers you cannot patch or replace.
- title: Regulatory report
  text: In the form CEA, NCIIPC or your auditor expects.
faq:
- q: Can you test without stopping the plant?
  a: Yes — most of the assessment is passive and offline, and produces the majority of the findings. Active testing is limited to paths agreed in writing, run in maintenance windows with operations present, and never against safety systems. We have assessed live utilities and process plants without a single trip.
- q: Why not just run our IT penetration test into the OT network?
  a: Because IT tools and techniques assume systems that tolerate probing. A port scan can crash a PLC; an authentication brute-force can lock an HMI during a run. OT testing is a different discipline with different tools, and our OT team includes people who have worked on the plant side.
- q: What do we do about controllers that cannot be patched?
  a: Most cannot, and the standard expects that. The answer is compensating controls — segmentation, access restriction, monitoring, hardened engineering stations, controlled remote access — designed around each device's constraints. We specify them per zone.
- q: Does this meet CEA and NCIIPC audit requirements?
  a: It is designed to, and it is delivered by a CERT-In empanelled organisation, which the mandated audits require. The report is structured for the regulator as well as for your engineers.
- q: What about building management systems?
  a: Data centres, hospitals, airports and commercial buildings run BMS, access control and CCTV on the same kind of equipment with the same weaknesses, and they are increasingly the route into the corporate network. We assess them as OT.
related:
- iec-62443-ot-security
- network-security-testing
- iot-security-testing
industries:
- manufacturing
- telecom
- government
insights:
- red-blue-and-purple-which-testing-does-your-team-need
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: SCADA and OT security testing — GISPL
  description: Passive-first, safety-bounded security assessment of SCADA, DCS, PLC and building-management systems against IEC 62443 — regulator-ready reporting.
  noindex: false
---

Industrial control systems — SCADA, distributed control, PLCs, safety systems, the building-management systems of data centres and hospitals — were built to run for decades, to be reliable, and to be operated by engineers who could walk to the cabinet. They were not built to be on a network reachable from a corporate laptop, and most of them now are. OT security testing measures what that exposure actually means: what an attacker who reaches the plant network could see, change or stop, and by which path.

It is a different discipline from IT testing, because the equipment is different. A port scan that is routine on a server can crash a controller. An authentication test can lock an operator out mid-run. A controller that is "vulnerable" to a decade-old flaw cannot be patched, because the vendor no longer supports it and the line cannot stop. Testing OT is therefore passive first — traffic capture, configuration review, offline analysis, which together produce most of the findings — with any active testing bounded in writing, run in maintenance windows with operations present, and never against safety systems.

## What we look for

The IT–OT boundary, because that is where intrusions cross — and in most plants it is a firewall with years of exceptions, a dual-homed engineering station, or a vendor's always-on remote access. The architecture, against IEC 62443's zone-and-conduit model. The devices themselves: default credentials, unauthenticated protocols, exposed engineering ports, unsupported operating systems on HMIs and historians. And the path — from the corporate network, from a supplier, from the internet — to the process, traced step by step.

Findings are rated by safety and production impact, not by a scanner's severity, and remediation is designed for the constraints: compensating controls for the controllers that cannot be patched, sequenced around outages. GISPL's OT team includes engineers who have worked on the plant side; we hold the CERT-In empanelment that CEA and NCIIPC audits require, and we have assessed live utilities, process plants and manufacturing sites across India and the Gulf without a single trip.
