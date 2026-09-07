---
title: Web & mobile application testing
label: Web & mobile app testing
practice: assessments-and-testing
order: 3
tagline: Your applications and APIs attacked the way a skilled adversary would — business logic included — before your customers find out.
summary: Manual penetration testing of web applications, APIs and Android/iOS apps against OWASP ASVS, MASVS and the API Top 10 — authentication, authorisation, business logic, data exposure — with proof and retest.
icon: bug
status: published
facts:
- label: Standards
  value: OWASP Web Security Testing Guide and ASVS; OWASP MASVS/MASTG for mobile; OWASP API Security Top 10; CWE for classification
- label: Required by
  value: RBI, SEBI CSCRF, IRDAI and CERT-In (before go-live and annually, by an empanelled auditor); PCI DSS 6.4 and 11.4 for payment applications
- label: Coverage
  value: Web applications, REST/GraphQL/SOAP APIs, Android and iOS apps, thick clients, and the back-ends behind them
- label: Cadence
  value: Before every major release and at least annually; on a retainer for teams shipping continuously
appliesTo:
- You are launching or have launched a customer-facing web or mobile application — banking, payments, trading, insurance, e-commerce, health, education.
- Your regulator requires application security testing before go-live and annually by a CERT-In empanelled organisation.
- You expose APIs to partners, fintechs or mobile apps, and the API layer has never been tested on its own.
- Your last test was a scanner report, and you want to know what a person would find.
- A customer, acquirer or partner has asked for a penetration-test report on your application.
- You ship continuously and need testing that keeps pace with releases.
stakes:
- Applications are the most common breach entry point; authorisation flaws in particular expose every customer's data to every other customer.
- Business-logic flaws — skipping payment steps, manipulating amounts, abusing coupons or transfers — cause direct financial loss and never appear in a scanner.
- Mobile apps leak secrets, tokens and data through storage, logging and insecure APIs, and are trivially reverse-engineered.
- Regulators and acquirers refuse go-live without a test report; a late test delays the launch.
- A breach through a customer application is a DPDP Act incident, a regulator report and a public event simultaneously.
- Fixing a design flaw after launch costs many times what fixing it in testing would have.
steps:
- title: Scope and threat model
  text: Applications, environments, user roles and test accounts, and a threat model of what an attacker would want — the data, the money, the accounts.
- title: Reconnaissance and mapping
  text: Every endpoint, parameter, role and function enumerated, including the APIs the mobile app talks to and the ones the front end does not show.
- title: Authentication and session testing
  text: Login, MFA, password reset, session handling, token lifecycle and OAuth flows attacked for bypass, fixation, replay and weakness.
- title: Authorisation and business logic
  text: Horizontal and vertical access control tested across every role; business processes — payments, transfers, orders, approvals — attacked for logic abuse.
- title: Input, data and platform testing
  text: Injection, cross-site scripting, deserialisation, file handling, server-side request forgery, data exposure and mobile-specific issues — storage, transport, binary protections, platform interaction.
- title: Reporting and retest
  text: Every finding reproduced with request and response, rated by impact in your application, with specific remediation; a retest confirms closure.
deliverables:
- title: Executive summary
  text: Risk to customers, money and data in plain language.
- title: Technical findings with reproduction steps
  text: Request, response, screenshot and impact for every issue, classified by CWE and mapped to ASVS or MASVS.
- title: Authorisation matrix
  text: What each role can reach, and what it should not.
- title: Mobile security assessment
  text: Storage, transport, binary protection, platform and API findings for Android and iOS.
- title: Remediation guidance
  text: Specific to your framework and platform, with secure-coding references.
- title: Retest report and go-live certificate
  text: The document your regulator, acquirer or customer asks for.
faq:
- q: Is this automated scanning?
  a: Scanners are part of reconnaissance; the test is manual. Authorisation flaws, business-logic abuse and chained attacks — the issues that actually cause breaches — are found by people who understand what the application is for. A scanner report is not a penetration test, and regulators know the difference.
- q: Do you test APIs separately from the application?
  a: Yes. The API is the real attack surface for a mobile app and for most modern web applications, and it often exposes functions the front end never calls. We test every endpoint directly, against the OWASP API Security Top 10.
- q: Do you need source code?
  a: Not for a penetration test. Where you can share it, a combined approach — testing plus targeted code review — finds more in less time, and we offer secure code review as a separate service.
- q: What about testing in production?
  a: Preferably a production-like staging environment with realistic data. Where production is the only option, we agree strict rules of engagement, avoid destructive tests and coordinate with your operations team.
- q: Can you keep up with continuous delivery?
  a: Yes — on a retainer, with testing scoped per release or per sprint, and a standing understanding of your application that makes each test faster than the last.
related:
- vapt-services
- secure-source-code-review
- application-security
industries:
- bfsi
- education-hospitality
- pharma-healthcare
- telecom
insights:
- red-blue-and-purple-which-testing-does-your-team-need
- pci-dss-v4-0-is-here-the-deadlines-you-can-t-miss
seo:
  title: Web, API and mobile application penetration testing — GISPL
  description: Manual penetration testing of web apps, APIs and Android/iOS apps against OWASP ASVS, MASVS and the API Top 10 — CERT-In empanelled, with retest.
  noindex: false
---

Applications are where organisations meet their customers and where attackers meet organisations. A banking app, a trading platform, an insurance portal, a hospital's patient app, a university's admissions system — each exposes authentication, data and money to the internet, and each is a target the moment it goes live. Application penetration testing is the discipline of attacking them first: by hand, with the goals a real adversary would have, and with proof for everything found.

The issues that cause real breaches are rarely the ones scanners report. They are authorisation flaws — one customer able to see another's account by changing a number in a request; business-logic abuse — a payment step skipped, an amount manipulated, a coupon reused; broken session and token handling; APIs that expose functions the front end never shows; mobile apps that store secrets in plain text or trust their own client. Finding them requires understanding what the application is for, mapping every role and function, and then thinking like someone who wants the money or the data.

## How we test

Every engagement starts with a threat model and a full map of the application — web, API and mobile, including the back-end calls the mobile app makes. Authentication and session mechanisms are attacked for bypass and weakness. Authorisation is tested across every role, horizontally and vertically. Business processes are attacked for logic abuse. Then the platform-level issues — injection, cross-site scripting, deserialisation, server-side request forgery, file handling, data exposure — and, for mobile, storage, transport, binary protection and platform interaction against OWASP's MASVS.

Every finding is reproduced with the request and response, classified, rated by impact in your application and paired with remediation specific to your framework. Regulators in Indian financial services require this testing before go-live and annually by a CERT-In empanelled organisation, and PCI DSS requires it for payment applications; our reports are written to be submitted as they are. For teams that ship continuously, a retainer keeps testing in step with releases.
