---
title: Secure source code review
label: Secure source code review
practice: assessments-and-testing
order: 7
tagline: Vulnerabilities found in the code, not in production — tool-assisted, verified by hand, explained to the developers who will fix them.
summary: Manual and tool-assisted secure code review across web, mobile and back-end codebases — authentication, authorisation, cryptography, input handling, secrets and dependencies — with developer-ready findings.
icon: search-doc
status: published
facts:
- label: Method
  value: Static analysis to find candidates; manual review to verify, chain and find what tools cannot — authorisation, business logic, cryptographic misuse
- label: Standards
  value: OWASP ASVS and Code Review Guide; CWE Top 25; PCI DSS requirement 6.2 and 6.3; CERT secure coding standards
- label: Languages
  value: Java, .NET, Node.js, Python, PHP, Go, Kotlin, Swift, C/C++ and the frameworks around them
- label: Cadence
  value: Before major releases; on a retainer per sprint for continuous delivery; on acquisition of a codebase
appliesTo:
- You build software that handles money, personal data or regulated information, and a penetration test alone leaves too much unseen.
- PCI DSS requires review of custom code for payment applications, and your regulator expects secure development evidence.
- You are acquiring, inheriting or outsourcing a codebase and need to know what is in it before you own it.
- Your static-analysis tool produces thousands of findings and nobody knows which matter.
- A penetration test found issues that suggest a pattern, and you want the pattern found everywhere it occurs.
- You want your developers to learn from findings rather than just receive them.
stakes:
- Vulnerabilities in code ship to every customer and every environment; found in review, they cost hours — found in production, they cost incidents.
- Authorisation and business-logic flaws hide in code that scanners rate as clean.
- Hard-coded secrets, keys and credentials in repositories are the most common cause of cloud breaches we investigate.
- Vulnerable dependencies — the majority of most codebases — carry known exploits with public proof-of-concept code.
- Cryptography misused — wrong modes, weak randomness, home-made schemes — passes every functional test and fails the first real attack.
- Regulators and acquirers now ask for secure-development evidence, not just penetration-test reports.
steps:
- title: Scope and architecture walkthrough
  text: Codebases, components, languages and trust boundaries; the architecture explained by your developers so review effort goes where risk lives.
- title: Tool-assisted analysis
  text: Static analysis, secret scanning and software-composition analysis run across the codebase to surface candidates and known-vulnerable dependencies.
- title: Manual review of security-critical code
  text: Authentication, session, authorisation, input handling, cryptography, file and data access, error handling and logging read by people, with tool findings verified and false positives removed.
- title: Business-logic and data-flow review
  text: How money, permissions and sensitive data move through the code, traced for the flaws that no tool understands.
- title: Findings and developer walkthrough
  text: Each finding with the vulnerable code, the fix, and the pattern to look for elsewhere — presented to the developers, not just delivered.
- title: Re-review
  text: Fixed code re-read to confirm the fix and check it did not introduce something new.
deliverables:
- title: Verified findings with code references
  text: File, line, vulnerable pattern, exploit scenario, fix — no unverified scanner output.
- title: Dependency and secrets report
  text: Known-vulnerable components with exploitability, and every secret that should not be in the repository.
- title: Architecture and trust-boundary notes
  text: Where the design, not the code, is the problem.
- title: Secure-coding guidance for your stack
  text: The patterns to adopt, framework-specific.
- title: Developer walkthrough session
  text: Findings explained, questions answered.
- title: Re-review report
  text: Closure evidence for regulators and acquirers.
faq:
- q: Is this just running a static-analysis tool?
  a: Tools are the first pass; they find candidates and known-vulnerable dependencies, and they miss authorisation, business logic and most cryptographic misuse. The review is the manual part — reading the security-critical code, verifying every tool finding and removing the noise. You receive verified findings, not a scanner export.
- q: Do you need the full codebase?
  a: Ideally, with build instructions and a developer to walk us through the architecture. Where that is not possible, we scope to the security-critical components — authentication, authorisation, payment, data access — and say clearly what was not reviewed.
- q: How does this compare with a penetration test?
  a: They find different things. A penetration test sees the application from outside and finds what is exploitable now; a code review sees it from inside and finds what is wrong, including in paths a tester might never reach. For high-value applications we recommend both, and the combination is faster than either alone.
- q: Does it satisfy PCI DSS?
  a: PCI DSS requires that custom software be reviewed for vulnerabilities before release, by people knowledgeable in secure coding, with findings corrected. Our review is designed to meet that requirement and is reported in a form a QSA accepts.
- q: How do you handle confidentiality of our code?
  a: Under NDA, on isolated review systems, with access limited to the named reviewers and deleted at the end of the engagement. We can also review on your infrastructure.
related:
- web-and-mobile-app-testing
- application-security
- open-source-security
industries:
- bfsi
- telecom
- pharma-healthcare
insights:
- red-blue-and-purple-which-testing-does-your-team-need
seo:
  title: Secure source code review — GISPL
  description: Manual and tool-assisted secure code review — authorisation, cryptography, input handling, secrets and dependencies — verified findings developers can act on.
  noindex: false
---

Every vulnerability that a penetration test finds in production was once a line of code that someone could have read. Secure code review reads it: security-critical code examined by people who know what to look for, supported by tools that find candidates across the whole codebase, and reported to the developers who will fix it in a form they can act on. It finds what testing from outside cannot reach — the authorisation check missing in one of forty endpoints, the cryptographic mode chosen wrongly, the secret committed to the repository three years ago — and it finds the pattern, not just the instance.

Static-analysis tools are where review starts and where most organisations stop. They are good at injection, at known-vulnerable dependencies, at secrets in repositories; they are poor at authorisation, at business logic and at the misuse of cryptography, and they produce thousands of findings of which a small fraction matter. A review is the manual work of reading the code that handles authentication, sessions, permissions, money, sensitive data, cryptography and input; verifying every tool finding; removing the noise; and tracing how money and data actually move.

## What you receive, and who receives it

Findings with the file, the line, the vulnerable pattern, the exploit scenario and the fix — verified, not exported from a scanner. A dependency and secrets report with exploitability, because most codebases are mostly other people's code. Notes on where the design rather than the code is the problem. Secure-coding guidance specific to your framework. And a walkthrough with your developers, because a finding that is understood is fixed once and not reintroduced.

Regulators and acquirers increasingly ask for secure-development evidence alongside penetration-test reports, and PCI DSS requires review of custom payment code by people knowledgeable in secure coding. For high-value applications, review combined with penetration testing finds more, faster, than either alone — we offer both, and a retainer that reviews per sprint for teams that ship continuously.
