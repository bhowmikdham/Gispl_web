---
title: Tokenisation, scope reduction and the art of shrinking PCI
excerpt: The fastest route to easier compliance is often having less to comply about.
category: payments
cover:
  src: /assets/images/covers/tokenisation-scope-reduction-and-the-art-of-shrinking-pci.png
  alt: Title card for the article “Tokenisation, scope reduction and the art of shrinking PCI”, set on the GISPL navy brand ground
tags: []
author: gispl
status: published
publishedAt: '2026-02-01T09:00:00+05:30'
featured: false
seo:
  title: null
  description: null
  noindex: false
---

Most organisations approach PCI DSS as a control problem: here are the requirements, here are
our systems, let us close the gap. The cheaper question is the one asked first — *why does this
system touch card data at all?*

Scope is the dominant cost driver in every PCI programme we have run. Not the control count,
not the assessor's day rate. The number of systems in scope determines how much scanning, how
much segmentation testing, how much logging, how many change tickets and how many arguments
you will have over the next twelve months. Halve the scope and you roughly halve the programme.

## Three categories, not one

PCI scoping recognises three kinds of system, and teams routinely collapse them into two:

- **CDE systems** store, process or transmit cardholder data.
- **Connected-to / security-impacting systems** can affect the security of the CDE — jump hosts,
  directory services, patch servers, SIEM collectors. In scope, and frequently missed.
- **Out-of-scope systems** are properly segmented from both, and you must be able to *prove* it.

That middle category is where scope silently grows. A domain controller that authenticates CDE
admins is in scope. So is the monitoring agent with an unrestricted path in.

## What tokenisation actually buys you

Replacing a PAN with a token removes cardholder data from the system holding the token — but
only if the token is genuinely non-reversible in that environment, and only if that system has
no route back to the vault. Two conditions people get wrong:

1. **The tokenisation service itself is in scope.** You have not eliminated the CDE, you have
   concentrated it. That is the point — a small, well-defended vault beats card data smeared
   across forty applications — but the vault is now the crown jewel and must be treated as one.
2. **Detokenisation privileges leak scope back.** If a reporting service can call the vault to
   resolve tokens, that reporting service is in scope. Every detokenisation path is a scope
   path. Enumerate them before you claim the reduction.

## The other three levers

**Redirect or iframe your payment page.** If the card is entered into a page served by your
provider rather than by you, your SAQ burden drops sharply. It does not drop to zero — v4.0's
client-side script requirements (6.4.3, 11.6.1) still apply to the page doing the redirecting,
because an attacker who compromises your page can change where it redirects to.

**Segment properly, then test the segmentation.** Segmentation is not a firewall rule you wrote
once. It is a control you must prove annually — twice yearly for service providers — with
penetration testing that specifically attempts to cross the boundary.

**Stop storing what you do not need.** Authentication data after authorisation must never be
retained. Beyond that, ask what business process genuinely requires a stored PAN rather than a
token, a last-four, or a provider-side reference. In our experience the answer is usually "a
report nobody reads any more".

## A sequencing that works

Re-scope first. Tokenise second. Assess third. Doing it in the reverse order means paying an
assessor to examine systems you were about to remove — and then paying again next year when
the architecture you should have fixed produces the same findings.

Scope reduction is architecture work with a compliance dividend, not compliance work. Treated
that way, it tends to pay for itself before the certificate arrives.

If you want a second opinion on where your CDE boundary actually sits — as opposed to where the
network diagram says it sits — [that is a conversation worth having early](/contact.html).
