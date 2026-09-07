---
title: Compromise assessment
label: Compromise assessment
practice: assessments-and-testing
order: 9
tagline: Are you already breached? A forensic hunt through your estate for the intrusion that nobody has noticed yet.
summary: Threat-hunting assessment of endpoints, servers, identity and cloud for evidence of existing or past compromise — forensic artefacts, persistence, lateral movement and exfiltration — with containment if found.
icon: magnifier
status: published
facts:
- label: Method
  value: Forensic and telemetry collection across endpoints, servers, identity systems and cloud; hunting against MITRE ATT&CK and current threat intelligence
- label: Answers
  value: Whether an adversary is present or has been; what they reached; whether they are still there — and what to do in the next 24 hours if so
- label: Applies to
  value: Any organisation with a reason to ask — a warning from a regulator or partner, an acquisition, a suspicious event, or simply time since the last look
- label: Cadence
  value: On trigger, and annually for organisations that have never done one; before closing an acquisition
appliesTo:
- CERT-In, a regulator, a partner or law enforcement has told you your systems may be compromised, or your data has appeared somewhere it should not.
- You are acquiring a company and want to know what you are buying before it joins your network.
- Something happened — an odd login, a disabled tool, an unexplained outage — and it was closed without anyone being sure.
- You have deployed EDR and monitoring recently and want to know what was there before the visibility began.
- Your sector is under an active campaign and you have no way to know whether you are among the victims.
- A ransomware group has named a supplier or a peer and you share infrastructure or credentials with them.
stakes:
- Average dwell time before detection is measured in weeks or months; every week an intruder stays is more data, more persistence and a larger eventual incident.
- Ransomware groups spend that time stealing data before they encrypt — the extortion is the exfiltration, and it has already happened by the time the ransom note appears.
- Acquiring a compromised company brings the adversary into your network on day one.
- Regulators expect a reasoned answer to "were you breached?" — "we did not look" is not one.
- An intrusion that was closed as a false positive is still an intrusion.
- Insurance and legal exposure depend on when you knew — and on whether you had reason to know.
steps:
- title: Scope and threat context
  text: Which systems, identities and cloud tenancies are in scope, and which threat actors and techniques the hunt should prioritise given your sector and any trigger.
- title: Collection
  text: Forensic artefacts and telemetry gathered at scale from endpoints, servers, Active Directory, cloud identity and infrastructure — using your tooling where it exists and ours where it does not.
- title: Hunting
  text: Analysis for indicators of compromise and, more importantly, for the behaviours of an adversary — persistence mechanisms, credential abuse, lateral movement, command-and-control, staging and exfiltration.
- title: Investigation of leads
  text: Every suspicious finding run down forensically to a conclusion — benign, historic or active — with the timeline reconstructed.
- title: Containment if active
  text: If an adversary is present, immediate containment planned and executed with your team, and the engagement transitions to incident response and forensics.
- title: Report and hardening
  text: A clear answer, the evidence behind it, and the weaknesses the hunt exposed — closed before the next adversary finds them.
deliverables:
- title: Compromise assessment report
  text: Compromised, previously compromised or no evidence found — with the evidence and its limits stated.
- title: Timeline of any intrusion
  text: Initial access, persistence, movement, objectives, exfiltration — reconstructed and dated.
- title: Indicators and detection content
  text: What to block and what to alert on, from what was found.
- title: Exposure findings
  text: The misconfigurations and weaknesses the hunt revealed, whether or not an adversary used them.
- title: Containment and response plan
  text: If needed, executed with you in the first hours.
- title: Regulatory and board briefing
  text: A defensible answer to "were we breached?", in the form each audience needs.
faq:
- q: What is the difference between this and a penetration test?
  a: A penetration test looks for ways in; a compromise assessment looks for someone who is already in. They use different evidence — vulnerabilities versus forensic artefacts and behaviours — and answer different questions. Organisations that have only ever done the first have never actually checked.
- q: Can you say definitively that we are not compromised?
  a: No honest assessment can. What we can say is that a thorough, intelligence-led hunt across the defined scope found no evidence of compromise, and state exactly what was and was not examined. That is a defensible answer; a guarantee is not.
- q: What happens if you find something?
  a: The engagement becomes an incident response. We contain with your team in the first hours, preserve evidence, and move into forensic investigation and regulatory reporting — the same GISPL practice, without a handoff.
- q: Do we need EDR for this?
  a: It helps, and we use your telemetry where it exists. Where it does not, we deploy collection tooling for the assessment and remove it afterwards. Many assessments are the first time an organisation has had this visibility — which is itself a finding.
- q: How long does it take?
  a: Two to four weeks for a mid-sized estate, from collection to a reported answer. If a trigger makes it urgent, the first look at the highest-risk systems happens within days.
related:
- digital-forensics
- red-blue-purple-teaming
- mdr
industries:
- bfsi
- government
- telecom
- manufacturing
insights:
- after-the-breach-what-digital-forensics-actually-recovers
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: Compromise assessment and threat hunting — GISPL
  description: Forensic threat hunt across endpoints, identity and cloud for existing or past compromise — a defensible answer to 'are we breached?', with containment.
  noindex: false
---

Most organisations have never actually checked whether they are breached. They have scanned for vulnerabilities, tested for ways in, deployed tools that alert on what they recognise — but nobody has gone looking, forensically and systematically, for an adversary who is already inside. A compromise assessment is that search: a threat hunt across endpoints, servers, identity systems and cloud for the artefacts and behaviours of an intrusion, whether it began last week or two years ago.

The reason it matters is dwell time. Intruders operate unseen for weeks or months in most breaches, and ransomware groups in particular use that time to steal data before they encrypt — by the time the ransom note appears, the exfiltration that drives the extortion is finished. An assessment finds them during the dwell, when containment is still possible and the incident is still small. And when it finds nothing, it provides what a regulator, a board or an acquirer actually needs: a reasoned, evidenced answer to "were you breached?" rather than "we did not look".

## What the hunt looks for

Indicators of known threats, from current intelligence about the actors targeting your sector — but chiefly behaviours, because adversaries change their tools and not their methods: persistence mechanisms, credential abuse, unusual authentication, lateral movement, command-and-control traffic, staging and exfiltration. Every lead is run down forensically to a conclusion. If an adversary is present, the engagement becomes an incident response on the spot, with containment planned and executed alongside your team and GISPL's forensics practice taking the investigation forward without a handoff.

The most common triggers are a warning from CERT-In, a regulator or a partner; an acquisition, where the target's network is about to join yours; an event that was closed without anyone being sure; and the deployment of new monitoring, which reveals the present but not the past. Organisations that have never done one usually find the exercise revealing even when no adversary is found — the weaknesses the hunt exposes are the ones the next one would use.
