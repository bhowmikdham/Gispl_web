---
title: Digital forensics
label: Digital forensics
practice: cyber-forensics-and-investigations
order: 1
tagline: What happened, who did it, what was taken — established from disks, memory, mobiles and cloud to a standard that survives challenge.
summary: Court-grade digital forensic investigation across computers, servers, mobile devices, cloud tenancies and networks — preservation, acquisition, analysis, timeline reconstruction and expert reporting for breaches, fraud and disputes.
icon: magnifier
status: published
facts:
- label: Scope
  value: Disk, memory and mobile forensics; cloud and SaaS tenancy investigation; network and log forensics; email and messaging; malware analysis; timeline reconstruction
- label: Standards
  value: ISO/IEC 27037 and 27042 for evidence handling and analysis; ACPO principles; Bharatiya Sakshya Adhiniyam 2023 (s.63) certificates for electronic records; IT Act s.79A examiner requirements
- label: Used for
  value: Breach and ransomware investigation, insider and employee misconduct, fraud, IP theft, regulatory reports, litigation and law-enforcement referrals
- label: Response
  value: Retained clients — on the call within the hour, on site within the day; chain of custody documented from first contact
appliesTo:
- You have had a breach, a ransomware attack or a suspected intrusion and need to know how, what was taken and whether it is over.
- An employee has left with data, is suspected of fraud, or a device needs examining before a disciplinary or legal step.
- A regulator — RBI, SEBI, IRDAI, CERT-In, the Data Protection Board — requires a root-cause and impact report you can stand behind.
- Litigation, arbitration or a police complaint will turn on electronic evidence and it must be admissible.
- Your insurer requires an independent forensic investigation before it pays.
- Something happened and IT "fixed it" before anyone asked what it was.
stakes:
- Evidence is destroyed in the first hours — by rebuilds, by log rotation, by well-meaning staff — and cannot be recovered afterwards.
- A breach report to a regulator that turns out to be wrong is worse than a late one; the investigation must be right.
- Without a proper timeline, the intrusion's cause is guessed, the fix is guessed, and the attacker returns.
- Electronic evidence handled without chain of custody is challenged and excluded — the case collapses on procedure.
- Insurers and counsel will not act on IT's account; they act on a forensic report.
- The question after every incident is "did you know what happened?"; the honest answer decides liability.
steps:
- title: Preserve
  text: Affected systems, accounts, logs and devices secured and imaged before anything changes — forensically sound acquisition with hashes, and a chain of custody from the first minute.
- title: Scope and triage
  text: Rapid triage to establish what is affected, whether the incident is ongoing, and what must be contained now — feeding the incident response while the investigation proceeds.
- title: Acquire and analyse
  text: Disk, memory, mobile, cloud and log evidence analysed with validated tools and methods — artefacts, malware, lateral movement, data access and exfiltration.
- title: Reconstruct
  text: "A corroborated timeline: initial access, actions, persistence, movement, what was accessed, what left, and by whom — each conclusion supported by more than one source."
- title: Report
  text: Written for counsel, the regulator, the insurer and the board — findings, evidence, limitations, and the root cause — with certificates for electronic records where court use is anticipated.
- title: Testify and close
  text: Expert testimony where the matter goes that far, and the root cause handed to the defensive practice so the route is closed.
deliverables:
- title: Preservation and chain-of-custody records
  text: What was collected, when, by whom, with hashes.
- title: Forensic images and working copies
  text: Retained securely for the period counsel or the regulator requires.
- title: Investigation report
  text: Timeline, findings, evidence, attribution where supportable, limitations stated.
- title: Regulatory submissions
  text: CERT-In, RBI, SEBI, IRDAI and DPDP breach reports drafted from the findings.
- title: Electronic-evidence certificates
  text: Under the Bharatiya Sakshya Adhiniyam where court use is anticipated.
- title: Root-cause and remediation brief
  text: For the defensive team, so it does not happen again.
faq:
- q: What should we do in the first hour?
  a: Do not rebuild, do not wipe, do not "clean up". Isolate affected systems from the network if the incident is ongoing but leave them powered on where possible; preserve logs; note who did what and when; and call us. Almost every investigation we take on has lost evidence to well-meaning first-hour actions.
- q: Will the evidence stand up in court?
  a: If it is preserved and handled properly from the start. We follow ISO/IEC 27037 and ACPO principles, document chain of custody from first contact, use validated tools, and provide the certificates for electronic records that Indian courts require. Our examiners have testified in criminal and civil matters.
- q: Can you investigate cloud and SaaS?
  a: Yes — Microsoft 365, Google Workspace, AWS, Azure and the major SaaS platforms through their audit logs, APIs and native forensic capabilities. Cloud incidents leave different evidence from on-premise ones, and preserving it quickly matters more because retention is short.
- q: Can you tell us what data was taken?
  a: Usually, to a reasonable standard — from access logs, file-system artefacts, network telemetry and, where the attacker staged data, the staging itself. Where the evidence does not support a firm answer we say so, because a breach notification based on a guess is a liability.
- q: How does this relate to your incident-response services?
  a: They run together. Forensics establishes what happened; the response team contains and recovers; the same GISPL practice does both, so evidence is preserved during containment and the investigation informs the recovery. For retained clients, the first call is to people who already know the environment.
related:
- compromise-assessment
- ransomware-detection-and-response
- data-recovery-and-decryption
industries:
- bfsi
- government
- manufacturing
- pharma-healthcare
- telecom
insights:
- after-the-breach-what-digital-forensics-actually-recovers
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: Digital forensics and breach investigation — GISPL
  description: Court-grade digital forensics across computers, mobiles, cloud and networks — preservation, timeline reconstruction, regulatory reports and expert testimony.
  noindex: false
---

After an incident the questions are always the same: what happened, how, who did it, what was taken, and is it over? Digital forensics answers them from evidence — disks, memory, mobile devices, cloud tenancies, logs, network captures — using methods that produce conclusions a regulator, an insurer, a court or a board can rely on. It is the difference between a breach report that says "we believe" and one that says "we established".

The discipline begins with preservation, because evidence is fragile and the first hours after an incident are when it is most often lost — a server rebuilt, a log rotated out, a laptop wiped for a new joiner, a chat deleted. Forensically sound acquisition with documented chain of custody from the first minute is what makes everything afterwards defensible. Analysis follows validated methods — ISO/IEC 27037 and 27042, the ACPO principles — and reconstructs a timeline corroborated across independent sources: a conclusion that rests on one artefact is an opinion; one that rests on the disk image, the authentication logs, the network telemetry and the cloud audit trail is a finding.

## Where it is used

Breach and ransomware investigation, where the report drives the regulatory submissions to CERT-In, RBI, SEBI, IRDAI or the Data Protection Board and the insurer's decision to pay. Insider matters — a departing employee with the customer list, a suspected fraud, misconduct on a company device — where the evidence must survive a disciplinary process or a court. Litigation and arbitration turning on electronic records, where Indian law requires specific certificates for their admission. And the question every board asks after an incident: did we know what happened?

GISPL has conducted more than two thousand forensic investigations for government ministries, defence and security organisations, banks, corporates and law firms since 2012. Our examiners have testified in criminal and civil proceedings. And because the forensics practice works alongside our incident-response and defensive teams, the root cause of every investigation is handed over to be closed — the map of how the defences failed is the most valuable thing a forensic report contains.
