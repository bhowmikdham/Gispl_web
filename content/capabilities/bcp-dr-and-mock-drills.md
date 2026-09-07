---
title: BCP/DR & mock drills
label: BCP / DR & mock drills
practice: implementation-and-managed-services
order: 12
tagline: Continuity and disaster-recovery plans that have been run, timed and fixed — because a plan that has never been exercised is a hope.
summary: Business continuity and IT disaster-recovery planning, DR architecture and implementation, and a graduated programme of tabletop, walkthrough and live failover drills — with the evidence RBI, SEBI and IRDAI require.
icon: refresh
status: published
facts:
- label: Covers
  value: Business impact analysis, continuity strategies and plans, DR architecture and implementation, backup and replication validation, crisis management, and tabletop, walkthrough and live drills
- label: Required by
  value: RBI (BCP/DR with periodic DR drills for banks and NBFCs), SEBI CSCRF (BCP and DR testing), IRDAI guidelines, ISO 22301 and ISO 27001 continuity controls
- label: Applies to
  value: Any organisation whose regulator, customers or survival require it to recover from disruption within a defined time — which is every regulated entity
- label: Cadence
  value: BIA and plans reviewed annually; drills at least annually and after significant change; live DR failover as the regulator prescribes
appliesTo:
- RBI, SEBI or IRDAI requires periodic DR drills with evidence, and your last one was a document review.
- Your DR site exists on paper, or exists but has never taken production load.
- Ransomware, a data-centre incident or a cloud outage showed that the plan and the reality had diverged.
- Recovery time and recovery point objectives were set years ago and nobody knows if they are achievable.
- Your continuity plan is an IT document with no business impact analysis behind it.
- The board has asked how long the organisation could be down, and nobody can answer.
stakes:
- Disruption without a rehearsed plan lasts days longer than it should and is decided by improvisation.
- Regulators treat an undrilled plan as no plan; RBI in particular inspects DR drill evidence and issues findings on it.
- Recovery objectives that cannot be met are commitments to customers and regulators that will be broken on the worst day.
- Ransomware has made the DR site a target and the backups the first casualty; a plan that assumes either is intact will fail.
- Contracts carry recovery commitments; missing them is a breach and often a termination right.
- The drill you skipped is the one that would have found the expired certificate, the missing runbook step or the person who left.
steps:
- title: Business impact analysis
  text: Every critical activity's maximum tolerable disruption, recovery time and recovery point objectives, and the systems, people, suppliers and sites each depends on.
- title: Strategy and architecture
  text: Recovery strategies chosen for cost and speed, and the DR architecture — replication, backup, alternate sites, cloud recovery — designed to meet the objectives rather than approximate them.
- title: Implementation and validation
  text: DR infrastructure, replication and backup implemented or remediated, and each component validated individually before the first drill.
- title: Plans and runbooks
  text: Crisis management, business continuity and technical recovery runbooks written for use under stress — decision points, contact trees, step-by-step recovery with expected times.
- title: Graduated drill programme
  text: Tabletop exercises for leadership, walkthroughs for recovery teams, component tests, and live failover of production systems to the DR site — each finding fed back into the plan.
- title: Evidence and continual improvement
  text: Drill reports with measured recovery times against objectives, lessons and corrective actions, and the evidence pack the regulator inspects.
deliverables:
- title: Business impact analysis
  text: MTPD, RTO, RPO and dependencies for every critical activity.
- title: DR architecture and gap remediation
  text: Designed to the objectives, implemented and validated.
- title: Continuity, crisis and recovery runbooks
  text: Written for the worst day, not the audit.
- title: Drill programme and reports
  text: Tabletop to live failover, with measured times against objectives.
- title: Corrective-action log
  text: What each drill found, and what was fixed.
- title: Regulatory evidence pack
  text: DR drill evidence in the form RBI, SEBI or IRDAI inspects.
faq:
- q: What is a mock drill, and why do regulators insist on it?
  a: A rehearsal of the plan — from a tabletop discussion of a scenario to an actual failover of production systems to the DR site — that measures whether recovery works and how long it takes. Regulators insist because an unexercised plan is an assumption, and the inspection findings are about the drills, not the documents.
- q: Will a live failover risk production?
  a: "It is planned to avoid it: components validated first, a rollback plan, a maintenance window, and the failover run with operations present. The risk of not doing it — discovering during a real disaster that failover does not work — is the one to worry about."
- q: How is this different from ISO 22301?
  a: ISO 22301 is the management-system standard for continuity, which we also implement and certify against. This is the operational core — the analysis, the architecture, the plans and the drills — whether or not you pursue the certificate. Regulated entities need the drills regardless.
- q: Does the plan cover ransomware?
  a: "It must, because ransomware is now the most common continuity invocation and the one most plans fail: the network, the backups and the communication tools are all compromised at once. We build scenarios and runbooks specifically for it, including recovery from immutable backups and out-of-band communication."
- q: How often should we drill?
  a: At least annually, with a live DR failover as your regulator prescribes, and after any significant change to systems or organisation. A graduated programme — tabletop, walkthrough, component, live — spread through the year tests more than one annual event.
related:
- iso-22301-continuity
- ransomware-detection-and-response
- soc-monitoring
industries:
- bfsi
- telecom
- manufacturing
- pharma-healthcare
- government
insights:
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: BCP, disaster recovery and mock drills — GISPL
  description: Business continuity and DR planning, DR architecture and a drill programme from tabletop to live failover — with the evidence RBI, SEBI and IRDAI inspect.
  noindex: false
---

A disaster-recovery plan that has never been run is a hope with a cover page. The contact numbers are stale, the runbook skips the step that takes four hours, the certificate on the DR site expired last spring, the person who knew how to restart the core system left in March. None of that is discoverable by reading the plan. It is discovered by running it — in a drill, on a scheduled day, with a rollback — or on the worst day, when there is no rollback and the regulator is waiting for a call.

That is why RBI, SEBI and IRDAI all require not just continuity plans but periodic drills with evidence, and why their inspection findings are about the drills rather than the documents. It is also why GISPL's continuity work is built around the exercise programme. The business impact analysis sets the objectives — how long each activity can be down, how much data it can lose, what it depends on. The DR architecture is designed to meet those objectives, not to approximate them, and each component is validated before the first drill. The runbooks are written for use under stress. And then the plan is run: tabletop exercises for leadership, walkthroughs for recovery teams, component tests, and live failover of production systems to the DR site, each finding fed back into the plan and each recovery time measured against its objective.

## The scenario that matters most

Ransomware has changed continuity planning. The traditional scenario — a data-centre fire, a flood — assumes the DR site, the backups and the communication tools are intact. In a ransomware invocation, all three may be compromised at once, and a plan that assumes any of them fails. We build ransomware scenarios and runbooks specifically: recovery from immutable, isolated backups; out-of-band communication when email and chat are gone; decision points for leadership on isolation and restoration; and drills that rehearse exactly that. The organisations that recover in days rather than weeks are the ones that have done this before it was real.
