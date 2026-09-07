---
title: Red, blue & purple teaming
label: Red / blue / purple teaming
practice: assessments-and-testing
order: 8
tagline: A realistic adversary against your real defences — to find out whether detection and response work, not just whether vulnerabilities exist.
summary: Objective-based red-team operations, blue-team detection and response assessment, and collaborative purple-team exercises mapped to MITRE ATT&CK — for organisations that need to know if they would notice.
icon: eye
status: published
facts:
- label: Framework
  value: MITRE ATT&CK for techniques; TIBER-style threat-intelligence-led scenarios; NIST SP 800-61 for response assessment
- label: Expected by
  value: SEBI's CSCRF for market infrastructure institutions and qualified regulated entities; RBI for larger banks; boards and insurers as evidence of resilience
- label: Applies to
  value: Organisations with a security operations capability — in-house or outsourced — that has never been tested against a real adversary
- label: Cadence
  value: Red team annually; purple-team exercises quarterly or per new detection capability
appliesTo:
- You have a SOC, an MDR provider or an EDR platform and want to know whether it would detect a real intrusion — before one happens.
- Your regulator expects red-team exercises — SEBI's CSCRF does for market infrastructure institutions and qualified entities.
- Your penetration tests come back clean and you suspect that says more about the tests than about your security.
- You want to test the people and the process — the analyst at 2 a.m., the escalation, the decision to isolate — not just the technology.
- Your board or insurer has asked for evidence of resilience beyond vulnerability counts.
- You are building detection capability and want an adversary to tune it against.
stakes:
- Most organisations that are breached had the alert; it was not seen, not understood or not acted on. Testing detection is testing the thing that decides the outcome.
- Dwell time — the period an attacker operates unseen — is measured in weeks in most breaches; it is the difference between an incident and a catastrophe.
- Security tools deployed with default rules detect default attacks; real adversaries are not default.
- Response plans that have never been run against a live adversary fail on decisions, not on technology.
- Regulators are moving from "do you test?" to "can you detect and respond?" — the red team is the evidence.
- Spending on detection without measuring it is spending on hope.
steps:
- title: Objectives and threat intelligence
  text: What a real adversary would want from you — funds, data, disruption — and which threat actors target your sector, translated into scenarios and objectives.
- title: Rules of engagement
  text: Scope, legal authorisation, safety limits, deconfliction and a control group who knows — agreed in writing; for red teams, the defenders do not.
- title: Red-team operation
  text: Reconnaissance, initial access — phishing, external exploitation, physical where agreed — persistence, lateral movement and objective pursuit, using the techniques the intelligence identified, logged step by step.
- title: Blue-team assessment
  text: What was detected, when, by what, and what happened next — the SOC's view reconstructed and compared with the attacker's timeline.
- title: Purple-team replay
  text: "Attacker and defenders together, technique by technique: run it, see whether it was detected, tune the detection, run it again."
- title: Findings and roadmap
  text: Detection gaps, response failures and the technical findings that enabled the operation, with a roadmap prioritised by the objectives that were reached.
deliverables:
- title: Threat-intelligence-led scenarios
  text: Who targets you, how, and what the operation will simulate.
- title: Red-team operation report
  text: The attacker's timeline, every technique mapped to ATT&CK, and the evidence.
- title: Detection and response assessment
  text: The defenders' timeline against the attacker's — what was seen, when, and what happened.
- title: ATT&CK coverage map
  text: Which techniques you detect, which you do not, and which matter most for your threat model.
- title: Purple-team detection improvements
  text: Rules tuned and validated during the exercise.
- title: Board summary and roadmap
  text: What was reached, why, and what changes it.
faq:
- q: What is the difference between a penetration test and a red team?
  a: A penetration test finds as many vulnerabilities as possible in a defined scope, with the defenders aware. A red team pursues specific objectives across the organisation using any realistic means, with the defenders unaware, to test detection and response. One measures exposure; the other measures resilience.
- q: What is purple teaming?
  a: "Red and blue working together: run a technique, see whether the SOC detected it, tune the detection, run it again. It is the fastest way to improve detection, and it turns the red team's findings into working rules rather than a report."
- q: Will the red team break something?
  a: Rules of engagement set safety limits, exclusions and deconfliction, and a control group who knows about the exercise can halt it. Techniques with availability risk are simulated or agreed in advance. We have run operations against banks and exchanges without operational incident.
- q: Is this required by regulators?
  a: SEBI's CSCRF expects red-team exercises for market infrastructure institutions and qualified regulated entities, and RBI expects larger banks to test their cyber resilience. Beyond the requirement, boards and insurers increasingly ask for the evidence.
- q: Do we need a SOC first?
  a: You need some detection and response capability — in-house or through an MDR provider — for the exercise to test. If you are building one, a purple-team engagement is the best way to build it against a real adversary from the start.
related:
- compromise-assessment
- soc-monitoring
- vapt-services
industries:
- bfsi
- telecom
- government
insights:
- red-blue-and-purple-which-testing-does-your-team-need
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: Red, blue and purple team exercises — GISPL
  description: Objective-based red-team operations, detection and response assessment and purple-team exercises mapped to MITRE ATT&CK — evidence of resilience for regulators.
  noindex: false
---

A penetration test asks whether an attacker could get in. A red team asks a harder question: if one did, would you notice, and what would you do? It is an objective-based operation — obtain the funds, reach the data, disrupt the service — run against the whole organisation with the techniques real threat actors use, while the defenders go about their normal work unaware. What it measures is not the vulnerability count but the thing that actually decides breaches: whether detection and response work.

In most of the incidents we investigate, the alert existed. It fired into a queue nobody was watching, or it was closed as a false positive, or it was escalated to someone who did not know what to do. Dwell time — the weeks an intruder operates unseen — is where a manageable incident becomes a catastrophe. A red team makes that dwell time visible, technique by technique, and the blue-team assessment that follows reconstructs the defenders' view against the attacker's timeline: what was seen, when, by what, and what happened next.

## Red, blue and purple

The red team operates; the blue team defends; the purple team is both together. After the operation — or instead of it, for organisations still building detection — we sit the attackers and the SOC in one room and replay each technique: run it, check whether it was detected, tune the rule, run it again. It is the fastest way we know to turn a security-tools budget into working detection, and it turns a red-team report into rules that fire.

GISPL's operations are threat-intelligence led — scenarios built from the actors that target your sector — and mapped to MITRE ATT&CK so coverage can be measured and tracked. Rules of engagement set safety limits, exclusions and a control group who can halt the exercise; we have run operations against banks, exchanges and government bodies without operational incident. SEBI's CSCRF now expects red-team exercises from market infrastructure institutions and qualified regulated entities; boards and insurers increasingly ask for the same evidence.
