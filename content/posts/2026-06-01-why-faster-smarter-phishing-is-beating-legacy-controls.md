---
title: Why faster, smarter phishing is beating legacy controls
excerpt: Attackers industrialised social engineering. Awareness training alone no longer closes the gap.
category: phishing
cover:
  src: /assets/images/covers/why-faster-smarter-phishing-is-beating-legacy-controls.png
  alt: Title card for the article “Why faster, smarter phishing is beating legacy controls”, set on the GISPL navy brand ground
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

The advice most organisations still give staff — look for bad grammar, check the sender's name,
hover over the link — was calibrated for an era when phishing was cheap and sloppy. It is now
cheap and good.

Three things changed at once, and the third is the one that breaks the controls people trust.

## What changed

**The writing got fluent.** Generative tooling removed the language tell entirely, in every
language your workforce reads. A lure referencing your actual vendor, your actual quarter-end
process and your actual reporting line now costs an attacker minutes. "Look for typos" is
retired advice; repeating it teaches staff to trust well-written mail.

**The pretext got specific.** Public filings, LinkedIn, breach corpora and a company's own
website supply enough context for targeting at scale — spear-phishing quality at commodity cost.

**And MFA stopped being sufficient.** This is the important one. Adversary-in-the-middle
phishing kits proxy the real login page in real time: the victim sees the genuine site, enters
their password, completes the genuine MFA challenge — and the attacker relays it all, capturing
the resulting **session token**. The account is compromised with MFA fully enabled and working
exactly as designed. Nothing was bypassed; the session was stolen after authentication
succeeded.

That is why "we rolled out MFA" is no longer an answer to phishing, and why push-notification
and OTP factors in particular now carry a caveat.

## What actually helps

**Phishing-resistant authentication.** FIDO2 security keys and passkeys bind the credential to
the origin. A proxy site is a different origin, so the authenticator simply does not produce a
usable assertion — the attack fails by construction rather than by the user noticing. Prioritise
this for administrators, finance and anyone with access to customer data; expand from there.

**Token protection and short sessions.** Where phishing-resistant factors are not yet
universal, reduce what a stolen token is worth: bind sessions to device state, shorten
lifetimes for sensitive applications, and re-authenticate on privileged actions.

**Conditional access on device and location signals.** A valid token arriving from an
unmanaged device in an unusual location should meet friction even when the credential is
correct.

**Detection tuned for the aftermath, not the email.** Assume some messages land. The signals
worth alerting on are what follows: impossible-travel sign-ins, new mail-forwarding or inbox
rules, unexpected OAuth grants, mass file access. Most successful business email compromise is
visible in mailbox rule changes before the fraudulent payment goes out.

**Reporting that is easier than deleting.** A one-click report button, and a security team that
responds visibly to reports. The metric that matters is not click rate — it is *report* rate and
time-to-report, because that is what shortens the window when a campaign does land.

## Simulations: useful, frequently misused

Simulated phishing is worth running, and worth running honestly:

- **Measure report rate and speed**, not just clicks. A department that clicks 8% but reports in
  four minutes is in better shape than one that clicks 3% and reports nothing.
- **Do not punish clickers.** Punishment buys silence, and silence is the expensive outcome —
  the person who clicked and said nothing is how a foothold becomes a breach.
- **Match difficulty to reality.** A simulation nobody could plausibly fall for measures nothing.
- **Follow up in minutes, not in the quarterly deck.** Teachable moments are perishable.

## The uncomfortable summary

Phishing is now an authentication problem more than an awareness problem. Awareness reduces the
volume that reaches the point of failure; it does not fix the point of failure. If your
authentication can be replayed by a proxy, a sufficiently motivated attacker will get in
eventually, and no amount of training changes that arithmetic.

Start with phishing-resistant factors for your highest-privilege accounts. It is the single
control that changes the outcome rather than the odds.

We built [PhishSniper™](/services.html) because most of our clients' real risk walks in through
the inbox — and because simulations are only worth running if they change what you do next.
