---
title: ISO 22301 — business continuity
label: ISO 22301 · Continuity
practice: consulting-and-maintenance
order: 4
tagline: A continuity system that has been exercised — so the plan works on the day, and the certificate proves it.
summary: ISO 22301 business continuity management system design, implementation, exercising and certification support — BIA, risk assessment, strategies, plans and drills that regulators and customers accept.
icon: refresh
status: published
facts:
- label: Standard
  value: ISO 22301:2019 — security and resilience, business continuity management systems
- label: Certified by
  value: Accredited certification bodies; integrates with ISO 27001 on the harmonised structure
- label: Applies to
  value: Any organisation whose customers, regulators or own survival depend on it continuing to operate through disruption — banks, telecoms, data centres, manufacturers, hospitals, BPOs
- label: Cadence
  value: Annual surveillance, three-year recertification; plans exercised at least annually and after significant change
appliesTo:
- A regulator requires a tested business continuity plan — RBI, SEBI, IRDAI and TRAI all do — and yours has not been exercised.
- Customers ask for your BCP and recovery objectives in every contract, and a certificate would end the questionnaires.
- You run a data centre, a SOC, a payment platform, a BPO delivery centre or a plant where an outage is measured in crores per hour.
- You survived a disruption — a ransomware attack, a flood, a power failure, a pandemic — and the plan did not work as written.
- Your continuity plan is an IT disaster-recovery document with no business impact analysis behind it.
- You hold ISO 27001 and want continuity integrated into the same management system.
stakes:
- Disruption without a rehearsed plan lasts longer, costs more and is decided by improvisation; the difference between a bad day and a business-ending one is preparation.
- Regulators treat an unexercised continuity plan as no plan, and say so in inspection findings.
- Customer contracts carry recovery commitments; missing them is a breach and, in outsourcing, often a termination right.
- Ransomware is now the most common cause of a continuity invocation; a plan that assumes the network is available does not survive it.
- Suppliers and single points of failure that were never identified fail exactly when you need them.
- A certificate obtained without exercising produces a plan that fails in front of customers and regulators at once.
steps:
- title: Context and scope
  text: Which products, services and sites the BCMS covers, which stakeholders — regulators, customers, staff — it must satisfy, and the legal and contractual continuity obligations it must meet.
- title: Business impact analysis
  text: Every activity's maximum tolerable disruption, recovery time and recovery point objectives, and the resources — people, systems, suppliers, sites — each one depends on.
- title: Risk assessment
  text: The disruption scenarios that matter to you, from cyber attack to site loss to key-supplier failure, assessed for likelihood and impact.
- title: Strategies and plans
  text: Recovery strategies chosen for cost and speed, then written into plans people can follow under stress — crisis management, business continuity, IT disaster recovery, communications.
- title: Exercising
  text: Tabletop, walkthrough and live exercises that test the plan and the people, with lessons fed back into the system.
- title: Certification and maintenance
  text: Internal audit, management review, Stage 1 and Stage 2, then the annual cycle so the plans stay current as the business changes.
deliverables:
- title: BCMS scope, policy and objectives
  text: The framework top management commits to.
- title: Business impact analysis
  text: MTPD, RTO and RPO for every activity, with dependencies mapped.
- title: Risk assessment and treatment
  text: Disruption scenarios prioritised and addressed.
- title: Continuity, crisis and recovery plans
  text: Written for use under stress, with contact trees, decision points and checklists.
- title: Exercise programme and reports
  text: Evidence that the plans work — and of what was fixed when they did not.
- title: Certification support and maintenance cycle
  text: Through the audit and beyond.
faq:
- q: Is this the same as IT disaster recovery?
  a: "Disaster recovery is one part of it — the recovery of IT systems. Business continuity covers the whole organisation: people, sites, suppliers, processes and communications, driven by a business impact analysis that says what must come back and how fast. Most \"BCPs\" we are shown are DR plans with a new cover page."
- q: Do regulators require ISO 22301 specifically?
  a: They require a tested business continuity framework; RBI, SEBI and IRDAI all describe one in their directions. ISO 22301 is the recognised way to build and evidence it, and a certificate is the shortest answer to an inspector's question.
- q: How often must we exercise?
  a: The standard requires exercises at planned intervals and after significant change; at least annually is the norm, and regulators expect it. We run a graduated programme — tabletop first, then walkthroughs, then live failover — so each exercise tests something the last one did not.
- q: Can it share a management system with ISO 27001?
  a: Yes. Both follow the harmonised structure, and continuity is itself a requirement of ISO 27001's controls. One integrated system, one audit cycle, one set of documentation — that is how we build it.
- q: How long does certification take?
  a: Four to eight months, most of it the business impact analysis and plan development; the exercise programme runs alongside. With ISO 27001 already in place, the shared clauses are done and the programme is shorter.
related:
- bcp-dr-and-mock-drills
- iso-27001-isms
- ransomware-detection-and-response
industries:
- bfsi
- telecom
- manufacturing
- pharma-healthcare
insights:
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: ISO 22301 business continuity management system — GISPL
  description: ISO 22301 BCMS design, business impact analysis, continuity and recovery plans, exercising and certification support — continuity regulators accept.
  noindex: false
---

ISO 22301 is the international standard for a business continuity management system: a structured way of understanding what an organisation must keep doing through disruption, how quickly each activity must recover, what it depends on, and how it will actually be recovered — documented, exercised, audited and certified. It is the standard regulators point to when they require a tested continuity framework, the one customers accept in place of their own questionnaire, and the discipline that separates organisations that recover from a bad day from those that do not.

The system rests on the **business impact analysis**: for every activity, the maximum tolerable period of disruption, the recovery time objective, the recovery point objective, and the people, systems, suppliers and sites it depends on. Strategies follow from that — which activities need a hot standby, which can wait a week, which suppliers need a second source — and plans follow from the strategies: crisis management, business continuity, IT disaster recovery, communications. Then the plans are exercised, because a plan that has never been run is an assumption.

## The plan that survives contact

Most continuity plans we are shown fail one of two tests. The first is that they are IT disaster-recovery documents renamed — recovery of servers with no analysis of which business activities need them or how fast. The second is that they have never been exercised, so the contact numbers are stale, the decision points are unclear, and the people who would run the recovery have never read them. Ransomware has made both failures acute: the most common continuity invocation today is one where the network, the backups and the communication tools are all compromised at once, and a plan that assumes any of them will fail.

GISPL builds continuity systems from the business impact analysis outward, writes plans for use under stress, and runs a graduated exercise programme — tabletop, walkthrough, live failover — so each drill tests something the last did not. For organisations with ISO 27001, continuity is integrated into the same management system and audited in the same cycle. And because we also run incident response and forensics, the plans are written by people who have seen what a real invocation looks like.
