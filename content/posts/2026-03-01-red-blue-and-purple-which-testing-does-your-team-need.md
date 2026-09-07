---
title: 'Red, blue and purple: which testing does your team need?'
excerpt: A plain-English guide to the testing spectrum — and how to choose based on your maturity.
category: phishing
cover:
  src: /assets/images/covers/red-blue-and-purple-which-testing-does-your-team-need.png
  alt: 'Title card for the article “Red, blue and purple: which testing does your team need?”, set on the GISPL navy brand ground'
tags: []
author: gispl
status: published
publishedAt: '2026-03-01T09:00:00+05:30'
featured: false
seo:
  title: null
  description: null
  noindex: false
---

Buying the wrong kind of security testing is expensive twice: once for the engagement, and again
for the year you spend acting on findings that were never the constraint.

The colours are not a maturity ladder you climb. They answer different questions.

## The four things people mean

**Penetration testing** answers *what is exploitable here?* Scoped to a system, a network or an
application, run against the clock, aiming for coverage. The output is a findings list you can
prioritise and fix. This is the right purchase for most organisations, most of the time — and
it is what regulators and customers usually mean when they ask for evidence of testing.

**Red teaming** answers *would we detect and stop a determined adversary?* Objective-based
rather than coverage-based: reach the payment system, exfiltrate the customer database. Stealth
matters, scope is broad, and only a handful of people inside the organisation know it is
happening. The finding is rarely a vulnerability — it is that nobody noticed for eleven days.

**Blue teaming** is the defensive side as an ongoing discipline: detection engineering, tuning,
threat hunting, response. Not an engagement you buy once.

**Purple teaming** puts the two in the same room deliberately. Attacks are executed openly,
technique by technique — typically mapped to MITRE ATT&CK — and after each one you check
whether it was logged, whether it alerted, and whether anyone acted. The output is a coverage
matrix showing exactly which techniques you can see and which you cannot.

There is also **compromise assessment**, which answers a different question entirely: *are we
already breached?* It is a hunt through your live environment for evidence of an intruder
present now or recently. Nobody should discover the answer during a red-team debrief.

## Choosing honestly

The test that teaches you the most is the one aimed at your actual weakest link.

- **If you do not have a current, prioritised findings list** — penetration test. Everything
  else assumes you have already closed the obvious.
- **If you are patching well but have never validated detection** — purple team. It is cheaper
  than a red team, produces a concrete coverage matrix, and improves the blue team while it runs.
- **If your detection is mature and you want to test the whole response chain under realistic
  conditions** — red team. Before this, ask honestly whether you would act on the result.
- **If you have any reason to think something is already wrong** — compromise assessment first.
  Running a red team through a live intrusion wastes both.

## The most common mis-buy

Organisations with no detection capability commission red teams. The engagement succeeds
comfortably, the report says so, and the finding — "you have no detection" — was knowable in
advance for a fraction of the cost. Worse, it produces no map of *what* to build.

The inverse also happens: mature teams commissioning another annual pen test out of habit, when
their unexploited weakness is that three ATT&CK tactics generate no telemetry at all.

## What to insist on regardless

- **Retesting included.** A finding is not closed because a ticket was closed.
- **Reproduction steps a developer can follow.** Not just a CVSS score.
- **Findings ranked by exploitability in *your* environment**, not by generic severity.
- **A debrief with the engineers**, not only with management. The people who will fix it should
  hear it from the people who found it.

Testing is only worth what you do with the report. Choose the engagement whose report you are
actually resourced to act on — [we would rather scope you into the right one](/services.html)
than sell you the impressive one.
