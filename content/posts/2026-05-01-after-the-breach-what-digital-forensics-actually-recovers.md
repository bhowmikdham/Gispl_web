---
title: 'After the breach: what digital forensics actually recovers'
excerpt: Timelines, artefacts and attribution — a look at what evidence-grade investigation can and can't
  tell you.
category: forensics
cover:
  src: /assets/images/covers/after-the-breach-what-digital-forensics-actually-recovers.png
  alt: 'Title card for the article “After the breach: what digital forensics actually recovers”, set on the GISPL navy brand ground'
tags: []
author: gispl
status: published
publishedAt: '2026-05-01T09:00:00+05:30'
featured: false
seo:
  title: null
  description: null
  noindex: false
---

The question every board asks first is "who did this?" It is almost never the question forensics
is best placed to answer, and it is rarely the one that changes what you do next.

What a competent investigation reliably delivers is a defensible account of *what happened, in
what order, to which data* — and that is what determines your regulatory position, your
insurance claim, your remediation plan and whether it happens again.

## What we can usually establish

**Initial access, with evidence.** Phishing, exposed service, valid credentials, third-party
compromise — the entry vector is usually recoverable, and it is the finding that prevents
recurrence.

**A timeline.** Correlating filesystem metadata, event logs, authentication records, EDR
telemetry and network flow data produces a sequenced narrative: first foothold, privilege
escalation, lateral movement, staging, exfiltration. Dwell time falls out of this, and dwell
time drives the scope of everything else.

**Which accounts were used, and which are still trusted.** Frequently the most operationally
urgent finding. Credentials that remain valid are an open door regardless of what you have
cleaned up.

**Whether data left.** This is the one with regulatory teeth. Egress volumes, cloud storage API
calls, archive creation on staging hosts, DNS tunnelling patterns — several independent
signals, which matters because you will be asked to justify the conclusion.

**Persistence.** Scheduled tasks, services, registry run keys, web shells, OAuth grants and
mail rules. Miss one and remediation is temporary.

## What is genuinely hard

**Attribution to a person or organisation.** Tooling, infrastructure and tradecraft can be
matched to known clusters of activity. That is *association*, not identification, and competent
actors deliberately borrow other groups' tooling. Naming a group in a report you may later
have to defend is a risk with little upside. Naming an individual is a matter for law
enforcement with powers you do not have.

**Proving a negative.** "No data was exfiltrated" is rarely provable. "No evidence of
exfiltration was found across these specific sources, which cover this specific period" is
provable — and is what a careful report says. The difference is not pedantry; it is the
difference between a defensible statement and an indefensible one.

**Anything outside the retention window.** If logs roll at 30 days and dwell time was 90, the
first two months are gone. This single factor determines more investigation outcomes than any
tool.

## What destroys evidence, in order of frequency

1. **Rebooting or powering off** — memory gone, and with it the clearest picture of what ran
2. **Reimaging before acquisition** — the entry vector is now unknowable
3. **Restoring from backup over the affected volume** — same, with added confidence that the
   problem is solved
4. **Log rotation during the response** — preserve logs before you start, not after
5. **Well-meaning cleanup** — deleting the attacker's files removes the artefacts

Every one of these is done by a competent administrator trying to help. The fix is a runbook
that says, on the first page, what not to touch.

## What makes an investigation worth what it costs

Three things, all decided before the incident:

- **Log retention** long enough to cover realistic dwell time. In India the CERT-In directions
  require 180 days of ICT logs retained within the country — treat that as a floor, not a target.
- **Coverage.** Endpoint telemetry, authentication logs and egress visibility. Two out of three
  leaves a gap you will discover at the worst moment.
- **Time synchronisation.** A timeline built from hosts whose clocks disagree by minutes is a
  timeline nobody can rely on. NTP everywhere, verified.

## And what to do with the report

A forensic report has three audiences with different needs: an executive summary that states
what happened and what it means, a technical body with the evidence, and a remediation set
tied to specific findings. The last is the one that changes outcomes — and the one most often
left as a generic list of good practices.

If a report does not tell you which control would have stopped this, it has documented the
incident rather than resolved it.

We have run over two thousand forensic investigations. If you are dealing with something now,
skip the form and [call the incident line](/contact.html) — the response team operates 24×7.
