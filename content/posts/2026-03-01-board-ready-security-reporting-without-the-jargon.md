---
title: Board-ready security reporting without the jargon
excerpt: How to translate CVSS scores and control gaps into decisions a board can actually make.
category: compliance
cover:
  src: /assets/images/covers/board-ready-security-reporting-without-the-jargon.png
  alt: Title card for the article “Board-ready security reporting without the jargon”, set on the GISPL navy brand ground
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

A board paper that opens with "we closed 412 of 587 findings this quarter" has told the board
nothing it can act on. It does not say whether the organisation is safer than last quarter,
whether the remaining 175 matter, or what decision is being asked for.

Boards are not the wrong audience for security. They are the wrong audience for security
*metrics presented as security metrics*. Their job is allocating capital and accepting risk, and
a good report speaks in exactly those terms.

## Three questions, and nothing else

Every board security update is answering three questions. Structure the paper around them.

**1. Are we more or less exposed than last time, and why?**

One direction-of-travel judgement, with the reason. "Materially better: the two internet-facing
systems that carried our highest-likelihood breach path are now behind phishing-resistant
authentication." A number without a reason invites debate about the number.

**2. What could plausibly hurt us, and how badly?**

Frame in business impact, not vulnerability class. Not "17 criticals in the payment stack" but
"an exploitable path to the payment platform exists today; realised, it would stop settlement
for an estimated two to five days and trigger notification to the regulator and to affected
customers."

That sentence contains everything a director needs: what breaks, for how long, and who has to
be told. CVSS 9.8 contains none of it.

**3. What are you asking us to decide?**

Every paper should end with explicit asks: approve this spend, accept this risk until this date,
or note this for awareness. A report with no ask is a report with no outcome — and the board
will assume management has it in hand, which may not be what you meant.

## Translate, don't summarise

Summarising keeps the vocabulary and cuts the volume. Translation changes the vocabulary.

| What the tool says | What the board needs to hear |
| --- | --- |
| 47 criticals outstanding | Three of these sit on the path to customer data; the rest are on systems that hold none |
| Patch SLA compliance 82% | The 18% that missed SLA are concentrated in the OT estate, where patching requires a plant shutdown |
| Phishing click rate 6% | Our people report suspicious mail in four minutes on average — that window is what stops a campaign |
| ISO 27001 certified | Certification covers the Gurgaon operation; the acquired subsidiary is out of scope until Q3 |

The right-hand column is the same data. It is also the only column a non-specialist can act on.

## Four numbers worth trending

Resist the dashboard. A small number of measures, trended over time, beats forty gauges:

- **Time to detect and time to respond** — the two that determine how bad an incident becomes
- **Percentage of critical assets with full telemetry coverage** — what you cannot see, you
  cannot defend
- **Ageing of accepted risks** — risk accepted eighteen months ago "temporarily" is a decision
  that deserves revisiting
- **Third-party concentration** — which single supplier failure would hurt most

Each supports a decision. None requires a glossary.

## Say what you do not know

Boards discount reports that never contain bad news, and rightly. State the blind spots — the
subsidiary not yet assessed, the log source with 30-day retention against a realistic dwell
time, the vendor who will not complete a security questionnaire. Naming a gap is how it gets
funded. Concealing it is how it becomes a finding in someone else's report.

## One page, then appendices

The board reads the first page. Put the direction of travel, the top three exposures in business
terms, and the asks there. Everything else is an appendix for the audit committee and the people
with time to read it.

Security reporting fails not because boards lack technical depth but because the reports ask
them to supply the translation themselves. Do that work before the meeting, and the conversation
changes from "what does this mean?" to "what should we do?"

If your next board pack would benefit from an independent read of where the real exposure sits,
[that is work we do regularly](/contact.html).
