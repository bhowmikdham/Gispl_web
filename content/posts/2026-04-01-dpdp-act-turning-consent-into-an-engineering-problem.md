---
title: 'DPDP Act: turning consent into an engineering problem'
excerpt: Notice, consent and data-principal rights, mapped to systems your team can actually ship.
category: dpdp
cover:
  src: /assets/images/covers/dpdp-act-turning-consent-into-an-engineering-problem.png
  alt: 'Title card for the article “DPDP Act: turning consent into an engineering problem”, set on the GISPL navy brand ground'
tags: []
author: gispl
status: published
publishedAt: '2026-04-01T09:00:00+05:30'
featured: false
seo:
  title: null
  description: null
  noindex: false
---

Most DPDP programmes start in the legal team and stall in engineering. The Act is written in
the language of obligations; systems are built in the language of state, schemas and events. The
translation between the two is where readiness is actually won or lost.

Here is that translation, obligation by obligation.

## Consent is a record, not a checkbox

Under the Act the Data Fiduciary carries the burden of proving that valid consent was obtained.
A tick in a form proves nothing after the fact. What proves it is an immutable record capturing,
at minimum:

- **who** consented — a stable identifier for the Data Principal
- **what for** — the specific purpose, not a category
- **when** — a trustworthy timestamp
- **under which notice** — a version identifier for the exact wording shown
- **how** — the interface and the affirmative action taken

That last field is the one teams omit and later need. If your privacy notice changes and you
cannot say which version a 2026 consent was given against, you cannot demonstrate the consent
was informed. Version your notices like you version your API.

Consent must also be as easy to withdraw as to give, and withdrawal must propagate. That is a
distributed-systems problem: an event, a subscriber per downstream system, and a reconciliation
job that proves the event was honoured everywhere.

## Purpose limitation is a schema constraint

"Processing only for the specified purpose" is enforceable in code. Tag data at ingestion with
the purpose it was collected for, and make that tag travel with the record. Then a query that
joins marketing data to a fraud-model training set becomes a detectable violation rather than
an undocumented one.

The alternative — a spreadsheet mapping systems to purposes, maintained quarterly — describes
your intent. It does not constrain your systems.

## Data-principal rights are API endpoints

Four rights, four services to build:

| Right | What it needs |
| --- | --- |
| Access / summary of processing | Identity verification, then a fan-out query across every store |
| Correction and completion | Write path plus propagation to downstream copies |
| Erasure | Deletion that reaches backups, logs, analytics and processors |
| Grievance redressal | A named officer, a tracked queue, and a response clock |

Erasure is the hard one, and it is hard for a reason worth internalising: you cannot delete data
you cannot find. Every rights request is, first, a data-discovery problem. Organisations with a
current data inventory answer in hours; those without spend weeks and still cannot certify
completeness.

## Retention has to become automatic

The Act requires erasure once the purpose is served and consent is withdrawn or no longer
needed. Manual retention enforcement fails silently — nobody notices the data that *should*
have been deleted. Retention needs to be a property of the store: TTLs, lifecycle rules,
partition expiry. Set it at design time and it happens; set it in a policy document and it does
not.

## Breach notification changes your monitoring

Notification to the Data Protection Board and to affected Data Principals runs on a clock that
starts when you become aware. That has an engineering consequence upstream: you need to be able
to determine *which* Data Principals were affected, quickly. Logging that tells you a database
was accessed but not whose records were returned will not answer the question you will be asked.

Note that this sits alongside, not instead of, the CERT-In directions of April 2022 — six-hour
reporting for specified incident types, and 180 days of ICT logs retained within India. Two
clocks, two audiences, one detection capability.

## Where the dates stand

The Rules set the substantive compliance date and the enforcement date some way apart, and the
live countdowns on our [DPDP readiness page](/dpdp-readiness.html) track both. Treat the earlier
date as the real one: consent records cannot be created retroactively, so every month spent
without a consent architecture is a month of data you may not be able to justify holding.

## A sequencing that works

1. **Inventory.** You cannot honour rights over data you cannot locate.
2. **Consent service.** Versioned notices, immutable records, withdrawal events.
3. **Purpose tags at ingestion.** Cheap now, near-impossible to backfill.
4. **Rights endpoints.** Access first, erasure last — erasure depends on the inventory.
5. **Automated retention.** Then prove it with a deletion report.

None of this is exotic engineering. It is ordinary platform work that has to be scheduled, and
it is the part of DPDP that a legal review will never produce.

Our checklist walks the twelve checkpoints we open on day one of an engagement —
[it is on the readiness page](/dpdp-readiness.html), no download required.
