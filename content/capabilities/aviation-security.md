---
title: Aviation cybersecurity
label: Aviation security
practice: compliance-and-certification
order: 13
tagline: Airports, airlines and the systems between them — secured to the international framework and the national programme that implements it.
summary: Cybersecurity assessment and compliance for airports, airlines, ground handlers, MROs and aviation suppliers — against ICAO Annex 17, India's national aviation security programme and critical-infrastructure obligations.
icon: plane
status: published
facts:
- label: Framework
  value: ICAO Annex 17 (cyber-threat provisions) and the ICAO Aviation Cybersecurity Strategy; EASA Part-IS for European operators; NIST CSF and IEC 62443 for the technical baseline
- label: Regulated by
  value: In India, the Bureau of Civil Aviation Security and the DGCA; NCIIPC for airports designated critical information infrastructure; CERT-In for incident reporting
- label: Applies to
  value: Airport operators, airlines, air-navigation providers, ground handlers, MROs, cargo and catering operators, and their IT and OT suppliers
- label: Cadence
  value: Annual assessment and on significant change; incident reporting to CERT-In within six hours; audit under the national programme
appliesTo:
- You operate an airport, a terminal or airside infrastructure — baggage handling, access control, fuelling, airfield lighting, building management.
- You are an airline with passenger service, departure control, crew, operations and maintenance systems, and a growing digital channel.
- You provide air-navigation, ground-handling, cargo, catering, MRO or security-screening services under the national programme.
- Your airport has been designated critical information infrastructure and NCIIPC's requirements now apply.
- You supply IT, OT or connected equipment to any of the above and are being asked to demonstrate your own security.
- You operate in Europe or for European carriers and EASA Part-IS applies to you.
stakes:
- Safety and security of flight operations — the reason aviation cyber security is regulated at all.
- "Operational disruption: a compromised departure-control or baggage system grounds an airport; the cost is measured in cancelled flights and stranded passengers."
- Regulatory action under the national programme, including audit findings that must be closed to retain approvals.
- Critical-infrastructure obligations to NCIIPC and six-hour incident reporting to CERT-In, with consequences for late reporting.
- Passenger data — passport, payment, travel — that is a DPDP Act and GDPR exposure as well as an aviation one.
- "Supply-chain exposure: airports and airlines depend on dozens of specialised vendors, any one of which is a route in."
steps:
- title: Scope and system criticality
  text: Every system that affects safety, security or operations mapped and rated — airside, landside, passenger-facing, back-office and the OT that runs the building and the apron.
- title: Regulatory mapping
  text: ICAO Annex 17 cyber provisions, the national aviation security programme, NCIIPC and CERT-In obligations, and EASA Part-IS where it applies, translated into one control set.
- title: Assessment and testing
  text: Gap assessment against the control set, and CERT-In empanelled penetration testing of the systems that can safely be tested — with OT handled by the passive-first methods the plant floor requires.
- title: Architecture and segmentation
  text: The separation between passenger networks, operational systems, OT and corporate IT designed and validated.
- title: Incident response and exercises
  text: A crisis management plan that covers the aviation-specific escalation — to the regulator, to the airport operations centre, to partner carriers — and exercised with them.
- title: Supplier assurance and audit readiness
  text: Security requirements flowed to vendors, and the evidence assembled for the national-programme audit.
deliverables:
- title: System criticality register
  text: Every system, its safety and operational impact, and its owner.
- title: Unified control framework
  text: ICAO, national programme, NCIIPC, CERT-In and EASA requirements in one set.
- title: Gap and penetration-test reports
  text: CERT-In empanelled, with OT handled safely.
- title: Network architecture and segmentation design
  text: Passenger, operational, OT and corporate domains separated and validated.
- title: Aviation cyber crisis management plan
  text: Including the regulator and partner escalations, exercised.
- title: Supplier security requirements and audit pack
  text: For vendors, and for the national-programme audit.
faq:
- q: Which regulator covers aviation cyber security in India?
  a: Aviation security, including its cyber dimension, sits with the Bureau of Civil Aviation Security under the national civil aviation security programme, with the DGCA regulating operators and airworthiness. Airports designated critical information infrastructure also answer to NCIIPC, and every entity reports cyber incidents to CERT-In. We map all of them into one control set.
- q: What does ICAO Annex 17 require?
  a: Annex 17 requires each state to ensure that operators and entities identify their critical information and communications technology systems, assess the cyber threats to them, and protect them with appropriate measures. National programmes translate that into specific obligations, which is what we implement.
- q: Can you test operational systems safely?
  a: "Yes, with the same discipline we use in industrial OT: passive assessment first, active testing only where agreed in writing and inside operational windows, and never against systems where a failure could affect safety. Baggage, access control, building management and airfield systems are treated as OT."
- q: Does EASA Part-IS apply to us?
  a: If you hold an EASA approval or operate for European carriers, Part-IS's information-security management requirements apply from its effective dates. Its structure is close to ISO 27001 with aviation-specific reporting; we build programmes that satisfy both.
- q: We are a supplier to an airport — why are we being asked?
  a: Because the airport's obligations flow down to you. Airports and airlines depend on specialised vendors for everything from screening equipment to crew rostering, and a compromise at a supplier is a compromise at the airport. Demonstrable security is becoming a condition of the contract.
related:
- iec-62443-ot-security
- nist-csf
- soc-monitoring
industries:
- government
- telecom
insights:
- building-an-incident-response-runbook-that-survives-contact
- red-blue-and-purple-which-testing-does-your-team-need
seo:
  title: Aviation cybersecurity for airports and airlines — GISPL
  description: Aviation cybersecurity for airports, airlines, ground handlers and suppliers — ICAO Annex 17, India's national programme, NCIIPC, CERT-In and EASA Part-IS.
  noindex: false
---

Aviation runs on systems: departure control, passenger service, baggage handling, access control, air-navigation, crew rostering, maintenance records, fuelling, airfield lighting, building management. A compromise of any of them is a safety and security matter before it is anything else, and that is why aviation cyber security is regulated internationally rather than left to each operator. ICAO's **Annex 17** requires every state to ensure that operators identify their critical systems, assess the cyber threats to them and protect them; the ICAO Aviation Cybersecurity Strategy sets the direction; and each state's national civil aviation security programme turns that into obligations for airports, airlines and the entities that serve them.

In India those obligations sit with the Bureau of Civil Aviation Security and the DGCA, with two more regimes layered on top: airports designated critical information infrastructure answer to NCIIPC, and every operator reports cyber incidents to CERT-In within six hours. Operators holding European approvals, or flying for European carriers, meet EASA's Part-IS as well. The result is several rulebooks over one estate — and an estate that combines corporate IT, a large public-facing digital channel, and operational technology that behaves like a plant floor.

## How we approach it

We treat an airport or airline as three environments that must be separated and secured differently: passenger-facing systems and data, which carry DPDP and GDPR exposure; corporate and operational IT, which is where most intrusions begin; and operational technology — baggage, access control, building management, airfield systems — which we assess with the passive-first, safety-bounded methods we use in industrial plants. The regulatory obligations are mapped into one control set, the gaps assessed and tested by our CERT-In empanelled team, the segmentation designed and validated, and the incident-response plan built around the aviation-specific escalations — to the regulator, to the airport operations centre, to partner carriers — and exercised with them.

GISPL's aviation work draws on our critical-infrastructure and OT practice and on our government-sector experience, including assessments for defence and security organisations. Supplier assurance is part of every engagement, because an airport's security is only as good as the dozens of specialised vendors it depends on.
