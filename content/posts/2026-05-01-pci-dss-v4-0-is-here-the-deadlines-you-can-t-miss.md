---
title: PCI DSS v4.0 is here — the deadlines you can't miss
excerpt: The future-dated requirements are now in force. A checklist for acquirers, merchants and service
  providers.
category: payments
cover:
  src: /assets/images/covers/pci-dss-v4-0-is-here-the-deadlines-you-can-t-miss.png
  alt: Title card for the article “PCI DSS v4.0 is here — the deadlines you can't miss”, set on the GISPL navy brand ground
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

Every grace period in PCI DSS v4.0 has expired. v3.2.1 was retired on 31 March 2024, and the
51 requirements that shipped as "best practice until 31 March 2025" became mandatory on that
date. If your last Report on Compliance leaned on either concession, your next one will not.

The organisations we assess rarely fail v4.0 on the headline controls. They fail on the small
number of requirements that quietly changed shape — the ones that need an engineering change,
not a policy update.

## The five that catch people out

**Client-side script integrity (6.4.3 and 11.6.1).** Any page that takes cardholder data must
now inventory every script it loads, justify each one, and detect unauthorised change to the
page's HTTP headers and content. This is the Magecart requirement. It cannot be satisfied by a
policy document, and for most teams it means a Content Security Policy with reporting, plus
subresource integrity or a monitoring service. Budget engineering time, not audit time.

**Authenticated internal vulnerability scanning (11.3.1.2).** Unauthenticated scans no longer
count. Credentialed scanning surfaces a substantially larger finding set on first run — expect
the initial report to look worse than last year's, because it is finally telling the truth.

**Multi-factor authentication for all access into the cardholder data environment (8.4.2).**
Not just administrative access, and not just remote access. Every account, every path in.

**Targeted risk analysis (12.3.1).** Several requirements now let you set your own frequency —
but only if you document a defensible analysis behind it. Teams read "flexible" and skip the
document. The document *is* the requirement.

**Passwords at twelve characters (8.3.6).** Trivial to state, disruptive to roll out across
legacy service accounts and embedded credentials nobody has touched in six years.

## The customised approach is not a shortcut

v4.0's headline addition lets you meet a requirement's stated objective by a different means
than the defined control. It is genuinely useful for mature environments with compensating
engineering — and it is more work, not less. You own the risk analysis, the control design,
the testing procedures your assessor will use, and the evidence that it works. Choose it where
you have a real architectural reason. Do not choose it to avoid a control you simply have not
implemented.

## What to do this quarter

| Action | Why it matters now |
| --- | --- |
| Re-scope before you re-test | Scope is the single biggest cost driver; see our note on [tokenisation and scope reduction](/insights/tokenisation-scope-reduction-and-the-art-of-shrinking-pci/) |
| Inventory every payment-page script | 6.4.3 needs a justified list, not a scan result |
| Switch internal scans to authenticated | Find the delta now, not during the assessment |
| Write the targeted risk analyses | They gate the flexibility you are counting on |
| Confirm your QSA's v4.0 position early | Interpretations differ; disagreement in month nine is expensive |

## The honest summary

v4.0 rewards organisations that reduced scope and punishes those that deferred engineering work
into policy language. The requirements that hurt are the ones that touch code and
infrastructure, and those are exactly the ones you cannot close in the weeks before an
assessment.

If you are unsure whether your current scope, script inventory or scanning posture would survive
a v4.0 assessment, that is a question worth answering deliberately rather than discovering.
[Talk to our payments practice](/contact.html) — scoping and the proposal cost nothing.
