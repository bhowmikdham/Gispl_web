---
title: Building an incident-response runbook that survives contact
excerpt: Most IR plans fail in the first hour. Here's what a runbook needs to hold up under real pressure.
category: forensics
cover:
  src: /assets/images/covers/building-an-incident-response-runbook-that-survives-contact.png
  alt: Title card for the article “Building an incident-response runbook that survives contact”, set on the GISPL navy brand ground
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

Incident-response plans are written calmly, by people with full context, on a working laptop,
with time to look things up. They are executed at 02:40 by whoever answered the phone, possibly
on a personal device, possibly while the identity provider they need to log into is the thing
that has been compromised.

That gap is why plans fail. Not because they are wrong — because they assume conditions the
incident has removed.

## The first hour decides the next three weeks

Almost every expensive mistake we see in forensic engagements is made in the first sixty
minutes, by people acting reasonably:

- **Rebooting the affected host.** Understandable instinct, and it destroys memory-resident
  evidence — running processes, injected code, network connections, and in some cases the only
  copy of the encryption key.
- **Restoring from backup immediately.** This overwrites the disk state that would have told you
  how they got in. You recover the service and lose the ability to stop it recurring.
- **Deleting the attacker's tooling.** Removes the artefact that would have identified the
  actor and the campaign.
- **Emailing about the incident on the compromised mail system.** Assume the intruder reads it.

A runbook's most valuable page is the one that says *stop, do not do these five things, call
this number*.

## Preserve before you remediate

Order of volatility matters. Capture in this sequence, and capture before you change anything:

1. **Memory** — volatile, lost on power-off, and the richest single source
2. **Network state** — connections, ARP, DNS cache, routing
3. **Running processes and loaded modules**
4. **Disk** — a forensic image, not a file copy
5. **Logs from elsewhere** — the ones on the host may already be edited

If you can only do one thing before containment, image memory. If you can only do one thing at
all, do not power the machine off.

## What a runbook needs that most lack

**Out-of-band communications, pre-provisioned.** A channel that does not depend on the corporate
identity provider, mail system or network. Provisioned *now*, with the roster already in it —
not created during the incident on infrastructure you no longer trust.

**A printed contact tree.** Forensics lead, legal, the regulator contact, the cyber-insurance
notification line, your MSP, your ISP. On paper, because the intranet page listing them may be
unreachable.

**Named decision-makers with authority thresholds.** Who can disconnect the payment gateway?
Who can take the plant offline? If that answer requires a meeting, write the answer down now.

**Regulatory clocks on the first page.** For Indian organisations that means the CERT-In
directions — six-hour reporting for specified incident types — and, where personal data is
involved, DPDP breach notification to the Board and to affected Data Principals. Clocks start
on awareness, so the moment of awareness is itself something to record.

**Evidence handling that would survive a court.** Chain of custody, hashes at acquisition,
write blockers, a documented handler. You may not know on day one whether this becomes
litigation, an insurance claim or a regulatory matter. Preserve as though it will.

**A stated "assume compromised" boundary.** If the domain controller is suspect, what else is
automatically suspect? Deciding this mid-incident produces argument; deciding it in advance
produces action.

## Test it the way it will be used

A tabletop where everyone is in a room with laptops tests the plan's logic. It does not test
its assumptions. Run one exercise a year under realistic degradation: the on-call lead is
unreachable, single sign-on is down, and the wiki is inaccessible. The gaps that surface are
the ones that would have surfaced at 02:40.

Then fix the runbook the same week, while the exercise is fresh. An untested runbook and an
untested backup fail the same way — confidently, and only when it matters.

## Keep it short

A forty-page plan will not be read during an incident. What gets used is a two-page card:
first actions, do-not-do list, contact tree, decision authority, clocks. Put the detail in
appendices for the people who will have time to read them, which is nobody in hour one.

We have run enough of these to know what the first hour looks like from the inside. If you would
like your runbook pressure-tested before an incident tests it for you,
[our forensics and IR team does exactly that](/services.html).
