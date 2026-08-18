---
title: 'ISO 27001 in 2026: what the new controls really demand'
excerpt: The 2022 revision restructured Annex A and added eleven controls. Here is what auditors are
  actually asking for.
category: compliance
cover:
  src: /assets/images/covers/iso-27001-in-2026-what-the-new-controls-really-demand.png
  alt: 'Title card for the article “ISO 27001 in 2026: what the new controls really demand”, set on the GISPL navy brand ground'
tags: []
author: gispl
status: published
publishedAt: '2026-06-01T09:00:00+05:30'
featured: false
seo:
  title: null
  description: null
  noindex: false
---

The transition window closed on 31 October 2025. Every valid ISO/IEC 27001 certificate is now
against the 2022 revision, which means the eleven new Annex A controls are no longer a
forward-looking concern — they are what your next surveillance audit examines.

The restructure itself is mostly presentational. Annex A went from 114 controls in fourteen
clauses to 93 controls in four themes — organisational (37), people (8), physical (14) and
technological (34). Controls were merged and reorganised rather than deleted. If your Statement
of Applicability was mapped mechanically during transition, it probably reads fine and proves
little.

The eleven additions are where the substance is.

## The eleven, and what evidence they need

| Control | What auditors ask to see |
| --- | --- |
| 5.7 Threat intelligence | A feed is not enough — show a decision that changed because of it |
| 5.23 Information security for use of cloud services | Onboarding, exit and shared-responsibility mapping per service |
| 5.30 ICT readiness for business continuity | RTOs tested against actual ICT recovery, not asserted |
| 7.4 Physical security monitoring | Detection and response, not just cameras recording |
| 8.9 Configuration management | Defined baselines, drift detection, exception handling |
| 8.10 Information deletion | Deletion that is verified, including in backups and with processors |
| 8.11 Data masking | Applied where real data would otherwise reach non-production |
| 8.12 Data leakage prevention | Coverage aligned to your classification scheme |
| 8.16 Monitoring activities | Baselines for "normal" and defined anomaly response |
| 8.23 Web filtering | Policy enforced technically, with a documented exception route |
| 8.28 Secure coding | Standards, training, and evidence they are applied in review |

## The three that fail audits

**8.10, information deletion.** Almost everyone has a retention policy. Far fewer can demonstrate
that data was actually deleted — from backups, from analytics pipelines, from the processor who
received a copy in 2021. This is also where ISO and India's DPDP obligations converge, and doing
it once for both is the efficient path.

**8.9, configuration management.** Auditors want a defined secure baseline per platform and
evidence that drift is detected. "We use a hardening guide" is a document. "Here is this month's
drift report and the tickets it generated" is a control.

**8.16, monitoring activities.** The failure is rarely tooling. It is that nobody has written
down what normal looks like, so there is no defensible definition of anomalous — and so the
control cannot be shown to work.

## Clause 6.3 is the quiet one

Amendment 1 added *planning of changes* to the management system itself. Small clause, real
consequence: when your scope, structure or risk treatment changes, that change has to be planned
and documented rather than discovered at the next audit. Certification bodies have started
asking.

## What to do before your next surveillance visit

Pick the three new controls where your evidence is thinnest and build the artefact trail now —
a deletion certificate, a drift report, a threat-intelligence decision record. One real artefact
per control beats a rewritten policy set, because an auditor can test an artefact.

The 2022 revision rewards organisations running an actual management system and exposes those
maintaining a documentation set. If you are unsure which you have, [a gap assessment against the
new Annex A](/services.html) will tell you in a fortnight rather than in an audit finding.
