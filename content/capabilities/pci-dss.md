---
title: PCI DSS
label: PCI DSS
practice: compliance-and-certification
order: 1
tagline: Payment card security, scoped tightly, remediated properly and validated without drama.
summary: Scoping, gap assessment, scope reduction, remediation and validation support for PCI DSS v4.0.1 — for merchants, payment aggregators, processors and service providers.
icon: card
facts:
- label: Standard
  value: PCI DSS v4.0.1 (v4.0 retired 31 Dec 2024)
- label: Owner
  value: PCI Security Standards Council; enforced by the card brands through your acquirer
- label: Applies to
  value: Any entity that stores, processes or transmits cardholder data, or could affect its security
- label: Cadence
  value: Annual validation (ROC or SAQ), quarterly ASV scans, annual penetration test
appliesTo:
- You accept card payments — in a store, online, by phone or through an app.
- You are a payment aggregator, gateway or processor; RBI requires PCI DSS compliance as a condition of authorisation.
- You host, develop or support systems for someone who does, and can affect the security of their cardholder data.
- You issue cards, or handle card data on behalf of a bank or fintech.
- Your acquirer, a card brand or a large merchant customer has asked for an Attestation of Compliance.
- You were compliant under v3.2.1 and have not yet worked through the 51 future-dated requirements that became mandatory on 31 March 2025.
stakes:
- Non-compliance fees levied by the card brands and passed through by your acquirer, month after month, until you validate.
- After a breach, a mandatory PCI Forensic Investigation, card reissuance costs and fraud liability shifted onto the compromised entity.
- Loss of the ability to accept cards — for most businesses, the end of online revenue.
- For RBI-regulated payment aggregators, a regulatory finding on top of the commercial one.
- Customer due-diligence stalls; large merchants and banks will not onboard a supplier without a current AOC.
- Reputational damage that outlasts the technical fix — card breaches make headlines.
steps:
- title: Scope and data-flow mapping
  text: We find every place card data enters, moves, rests and leaves — including the ones nobody wrote down — and draw the cardholder data environment as it actually is.
- title: Scope reduction
  text: Segmentation, tokenisation and outsourcing options assessed for what they would take out of scope; the cheapest control is the one you no longer need.
- title: Gap assessment against v4.0.1
  text: All twelve requirements, sub-requirement by sub-requirement, with a finding, an owner and an effort estimate for every gap — including the customised-approach options where they fit.
- title: Remediation, alongside your engineers
  text: We work the plan with your team rather than handing it over — configuration, process, documentation and evidence, in the order that reduces risk fastest.
- title: Testing and scans
  text: Quarterly ASV scans, the annual penetration test and segmentation validation, run and evidenced to the standard's own requirements.
- title: Validation
  text: Readiness review, then the Report on Compliance or Self-Assessment Questionnaire and the Attestation of Compliance — and we stay in the room until it is signed.
deliverables:
- title: Cardholder data-flow diagrams and scope statement
  text: The document every assessor asks for first, accurate to the environment as it runs today.
- title: Gap report with remediation roadmap
  text: Every requirement scored, every gap owned, dated and sized.
- title: Policy and procedure set
  text: The documentation PCI DSS requires, written for the people who follow it.
- title: Scan and test evidence
  text: ASV scan reports, penetration-test reports and segmentation checks, filed the way the ROC references them.
- title: ROC or SAQ and Attestation of Compliance
  text: The validation package your acquirer, your bank and your customers actually ask for.
- title: Annual compliance calendar
  text: Every recurring PCI obligation — scans, reviews, training, tests — scheduled and owned, so compliance holds between assessments.
faq:
- q: Do we need a QSA, or can we self-assess?
  a: It depends on your merchant or service-provider level, which your acquirer sets from transaction volume. Level 1 merchants and most service providers need an on-site assessment and a Report on Compliance; smaller merchants complete a Self-Assessment Questionnaire. We tell you which applies on the first call, and prepare you for either.
- q: What changed with PCI DSS v4.0.1?
  a: Version 4 rewrote the standard around continuous security rather than an annual snapshot, added a "customised approach" for meeting a requirement's objective in a different way, and introduced 51 future-dated requirements — multi-factor authentication for all access to the cardholder data environment, script integrity on payment pages, targeted risk analyses and more — that became mandatory on 31 March 2025. v4.0.1 is the current version; v4.0 was retired at the end of 2024.
- q: Can we reduce the cost by shrinking scope?
  a: Almost always. Tokenisation, hosted payment pages, point-to-point encryption and network segmentation can remove entire systems from the cardholder data environment. Scope reduction is the first thing we look at, because a control you no longer need is cheaper than one you have to maintain.
- q: We are an Indian payment aggregator — does RBI require this?
  a: Yes. RBI's guidelines for payment aggregators and gateways require PCI DSS compliance, and the card-on-file tokenisation rules prohibit merchants from storing actual card data. PCI DSS is both a card-brand obligation and a regulatory one for you.
- q: How long does it take?
  a: A first-time programme for a mid-sized environment typically runs three to six months from scoping to attestation, most of it remediation. Re-validation for an already-compliant environment is a matter of weeks. You get a fixed scope and timeline before work starts.
related:
- iso-27001-isms
- web-and-mobile-app-testing
- network-security-testing
industries:
- bfsi
- education-hospitality
insights:
- pci-dss-v4-0-is-here-the-deadlines-you-can-t-miss
- tokenisation-scope-reduction-and-the-art-of-shrinking-pci
status: published
seo:
  title: PCI DSS compliance & assessment — GISPL
  description: PCI DSS v4.0.1 scoping, gap assessment, scope reduction, remediation and validation support for merchants, payment aggregators and service providers.
  noindex: false
---

The Payment Card Industry Data Security Standard is the set of security requirements that every organisation handling payment card data must meet. It is not a law; it is a contractual obligation that flows from the card brands — Visa, Mastercard, American Express, Discover, JCB — through the acquiring banks to every merchant and service provider that touches a card number. That contractual route is what gives it teeth: fall short and your acquirer, not a court, is the one who acts.

The standard has twelve requirements, grouped into six goals: build and maintain a secure network, protect account data, maintain a vulnerability management programme, implement strong access controls, monitor and test networks regularly, and maintain an information security policy. Under those twelve sit several hundred testable sub-requirements. The current version, **PCI DSS v4.0.1**, replaced v3.2.1 and turned what used to be an annual snapshot into an expectation of continuous security — with requirements for targeted risk analysis, multi-factor authentication on every path into the cardholder data environment, and integrity controls on the scripts that run on payment pages.

## Scope is everything

Every PCI DSS conversation starts with the same question: what is in scope? The answer is the cardholder data environment — every system component that stores, processes or transmits cardholder data, everything on the same network segment, and everything that could affect its security. Get the scope wrong in one direction and you are securing systems that never see a card number; get it wrong in the other and your assessment is invalid.

The most valuable work in a PCI programme is usually shrinking that environment. Tokenising stored card data, moving to a hosted payment page, encrypting card data at the point of interaction and properly segmenting the network can take whole applications and networks out of scope — and every system out of scope is one you no longer have to harden, monitor, scan and evidence every year.

## In India, it is also regulatory

For Indian payment aggregators and gateways, PCI DSS is a condition of RBI authorisation, not just an acquirer requirement. RBI's card-on-file tokenisation rules also prohibit merchants from storing actual card data, which changes the scope picture for every online business. GISPL has delivered PCI DSS programmes for banks, NBFCs, payment companies and merchants since 2012, and understands where the RBI expectations and the card-brand requirements overlap — and where they do not.
