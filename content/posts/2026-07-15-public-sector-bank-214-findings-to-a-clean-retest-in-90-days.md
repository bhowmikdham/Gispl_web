---
title: "Public-sector bank: 214 findings to a clean retest in 90 days"
excerpt: How a CERT-IN empanelled VAPT across 38 internet-facing applications went from a red board paper to a closure certificate in one quarter.
category: case-studies
cover:
  src: /assets/images/covers/public-sector-bank-214-findings-to-a-clean-retest-in-90-days.png
  alt: "Title card for the case study “Public-sector bank: 214 findings to a clean retest in 90 days”, set on the GISPL navy brand ground"
tags: [vapt, bfsi, remediation]
author: gispl
status: published
publishedAt: '2026-07-15T09:00:00+05:30'
featured: false
seo:
  title: null
  description: null
  noindex: false
---

*A representative engagement. The client is a public-sector bank whose identity is withheld under NDA; figures are illustrative and rounded so that no system or team can be identified.*

## The situation

A public-sector bank with 38 internet-facing applications — net banking, a mobile app, a corporate portal, two payment integrations and a long tail of vendor-built services — had not had an independent test across the whole estate in three years. The regulator's next inspection was due in a quarter, and the last internal scan had produced a 900-line spreadsheet that nobody could act on.

The CISO's brief was blunt: *"Tell me what is actually exploitable, in the order I should fix it, and prove it is fixed before the inspection."*

## What we did

**Scope and rules of engagement, in writing.** Every application, environment and testing window was agreed before a packet was sent. Production testing ran only inside agreed windows; the two payment integrations were tested against staging with production-equivalent data.

**Manual, chained testing across the estate.** A CERT-IN empanelled team of four ran the eight-phase methodology against all 38 applications over five weeks: reconnaissance, automated coverage, then manual exploitation to prove impact. Scanner output was treated as a starting point, never a finding.

**Ranked by exploitability, not CVSS alone.** Each confirmed finding was scored with CVSS v3.1 and then re-ranked by what an attacker could reach from it in *this* environment. Three findings that scanned as "medium" were promoted to critical because they chained to customer data.

**Remediation alongside the bank's engineers.** Weekly readouts with the application owners, a shared tracker, and fix guidance written for the developer who had to ship it — not for the auditor who would read it.

**Retest and closure.** Every remediated finding was retested by the same tester who found it. The closure certificate went to the board and the regulator with the evidence trail attached.

## The numbers

| Measure | At first readout | At closure (day 90) |
| --- | --- | --- |
| Confirmed findings | 214 | 0 open |
| Critical | 11 | 0 |
| High | 46 | 0 |
| Medium | 98 | 0 |
| Low / informational | 59 | 0 |
| Applications with a critical or high finding | 19 of 38 | 0 of 38 |
| Scanner results discarded as false positives | 412 | — |

Every one of the 11 critical findings was closed inside 14 days of the first readout. The board paper that had been red for three inspections in a row went in green, with a single page of open risk accepted by the board.

## What changed for the bank

- **One list, not 900 lines.** The estate's exposure was expressed as 214 proven findings with a fix order, rather than a scanner export. The security team stopped arguing about false positives and started closing tickets.
- **Fix-first ranking.** Three "medium" findings that chained into customer data were fixed in the first week because the ranking said so. On a CVSS-only list they would have waited a quarter.
- **A retest that means something.** A finding was closed when the tester who found it could no longer reproduce it — not when a Jira ticket was closed. That is the difference between a certificate and a hope.
- **A repeatable cadence.** The bank moved to an annual full-estate test with quarterly testing of anything that changed, on the same rules of engagement.

## If this looks like your estate

The pattern repeats across BFSI: a large, partly vendor-built application estate, a scanner report nobody trusts, and an inspection date that does not move. The fix is not more scanning. It is proving what is exploitable, ranking it by what it reaches, and retesting until the list is empty.

[See how a VAPT engagement runs](/service-vapt.html) or [request a proposal](/contact.html).
