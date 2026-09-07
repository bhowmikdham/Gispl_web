---
title: Managed detection & response
label: MDR · monitor, detect, respond
practice: implementation-and-managed-services
order: 10
tagline: Monitoring that acts — containment and remediation by our team, under authority you define, at any hour.
summary: Managed detection and response — 24×7 threat detection across endpoints, identity, cloud and network, with active containment, investigation and remediation by GISPL's team under pre-agreed authority.
icon: pulse
status: published
facts:
- label: Scope
  value: Endpoint detection and response, identity and cloud telemetry, network sensors and email — correlated 24×7, with response actions taken by GISPL's analysts
- label: Authority
  value: Response actions — isolate host, disable account, block indicator, kill process — pre-authorised per severity and system class, in writing
- label: Service levels
  value: Time to detect, time to contain and time to notify defined per severity; measured and reported monthly
- label: Onboarding
  value: 4–8 weeks — sensor deployment, response authority matrix, playbooks, tuning, go-live
appliesTo:
- "Monitoring alone leaves a gap: the alert is escalated at 2 a.m. and nobody acts on it until 8."
- You have no in-house team to respond, and building one is a dozen hires away.
- Ransomware timing — nights, weekends, holidays — means response has to happen without waiting for you.
- Your endpoint or cloud tooling is capable and under-used, because nobody operates it.
- Your regulator or insurer asks for demonstrated response capability, not just detection.
- You want one accountable team from detection through containment to forensics.
stakes:
- The interval between detection and containment is where damage happens; ransomware encrypts in minutes once it starts.
- Escalation to a client team that cannot act at night is detection without response.
- Every hour of dwell is more data exfiltrated and more systems compromised.
- Building an in-house 24×7 response capability costs more than most organisations' entire security budget.
- Response taken without pre-agreed authority is either too slow (waiting for approval) or too risky (acting without it).
- Handoffs between a monitoring vendor, an IT team and a forensics firm lose hours and evidence.
steps:
- title: Scope and response authority
  text: Which systems, which telemetry, and — critically — which actions GISPL may take without asking, per severity and system class, agreed with your leadership and written down.
- title: Sensor and telemetry deployment
  text: EDR on endpoints and servers, identity and cloud telemetry connected, network sensors where needed, email integrated — with coverage verified.
- title: Playbooks
  text: For each detection class, what we will do, whom we will tell, and when we will stop and ask — rehearsed with your team.
- title: Tuning and go-live
  text: Detection content tuned on your estate, response actions tested against non-production systems, and the service switched on with a defined start.
- title: Operation
  text: 24×7 detection, investigation and response — containment within the agreed time, remediation coordinated with your IT, and forensic preservation from the first action.
- title: Reporting and threat review
  text: Monthly service reports, quarterly threat briefings, and detection and playbook updates as the threat landscape and your estate change.
deliverables:
- title: Response authority matrix
  text: What we may do, per severity and system class, signed by you.
- title: Deployed sensors with coverage report
  text: Every endpoint, identity and cloud source accounted for.
- title: Playbook library
  text: Per detection class, rehearsed.
- title: Monthly MDR report
  text: Detections, responses, times, and what changed.
- title: Incident reports
  text: For every contained incident — what happened, what we did, what to fix.
- title: Forensic and regulatory support
  text: Evidence preserved from the first action; CERT-In and regulator reports drafted within the deadline.
faq:
- q: What is the difference between SOC monitoring and MDR?
  a: Monitoring detects and escalates; MDR also responds. When a detection meets the criteria in your authority matrix — say, ransomware precursors on a workstation — our analyst isolates the host, disables the account and blocks the indicator at 2 a.m., then tells you. Monitoring would have told you at 2 a.m. and waited.
- q: What if you isolate something you should not have?
  a: "The authority matrix exists to prevent it: actions are pre-agreed per severity and system class, critical systems have tighter rules, and every action is logged and reversible. In practice, the cost of an unnecessary isolation — an hour of one user's time — is a rounding error against the cost of a missed containment."
- q: Do we need to replace our endpoint tooling?
  a: Usually not. We operate the major EDR platforms, and if yours is capable we use it. Where tooling is absent or inadequate, we recommend and deploy — without a resale bias.
- q: What happens after containment?
  a: Investigation to establish scope and root cause, remediation coordinated with your IT, forensic evidence preserved throughout, regulatory reporting where required, and a report on what to fix so it does not recur. Where the incident is serious, GISPL's forensics practice takes it forward without a handoff.
- q: Can MDR cover OT and cloud?
  a: Cloud, yes, through native telemetry with cloud-specific response actions. OT is monitored through passive sensors with response limited to what is safe — we do not isolate a controller — and coordinated with plant operations.
related:
- soc-monitoring
- ransomware-detection-and-response
- compromise-assessment
industries:
- bfsi
- telecom
- manufacturing
- pharma-healthcare
- education-hospitality
insights:
- building-an-incident-response-runbook-that-survives-contact
- after-the-breach-what-digital-forensics-actually-recovers
seo:
  title: Managed detection and response (MDR) — GISPL
  description: 24×7 managed detection and response across endpoints, identity, cloud and network — containment and remediation by GISPL analysts under pre-agreed authority.
  noindex: false
---

Detection without response is a report of what happened. The interval between an alert firing and someone acting on it is where ransomware encrypts, where an intruder moves from one server to the domain, where data leaves. If that interval runs from 2 a.m. until the client's IT team arrives, monitoring has told you about the damage rather than prevented it. Managed detection and response closes the interval: GISPL's analysts detect, investigate and act — isolate the host, disable the account, block the indicator, kill the process — at any hour, under authority you have defined in advance.

The authority matrix is the heart of the service. Before go-live, we agree with your leadership which actions we may take without asking, per severity and per class of system — aggressive on workstations, tighter on production servers, coordinated on anything critical — and write it down. Every action is logged and reversible. The result is response that is fast because it does not wait for approval, and safe because the approval was given in advance by the people entitled to give it.

## One team, no handoffs

MDR is delivered by the same team that runs our 24×7 SOC and works alongside our forensics practice, which changes what happens after containment. Evidence is preserved from the first action, because the analyst who isolates the host knows a forensic examiner will want the image. Investigation establishes scope and root cause. Remediation is coordinated with your IT. Regulatory reporting — CERT-In within six hours, RBI, SEBI or IRDAI as applicable — is drafted within the deadline. And where the incident is serious, the forensics practice takes it forward without a handoff between vendors, which is where hours and evidence are usually lost.

We operate the major endpoint, identity and cloud platforms and use yours where it is capable. OT is monitored through passive sensors with response limited to what is safe. The service comes with defined times to detect, contain and notify, measured and reported monthly — because "we would have caught that" is a claim, and a service level is a commitment.
