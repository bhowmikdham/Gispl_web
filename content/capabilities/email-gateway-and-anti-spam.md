---
title: Email gateway & anti-phishing
label: Email gateway & anti-spam
practice: implementation-and-managed-services
order: 15
tagline: The channel most attacks arrive through, defended in depth — authentication, filtering, impersonation protection and the people who click.
summary: Email security design and implementation — secure email gateway or Defender for Office 365 configuration, SPF/DKIM/DMARC enforcement, impersonation and business-email-compromise controls, attachment and link protection, and integration with awareness testing.
icon: mail
status: published
facts:
- label: Covers
  value: Secure email gateway selection and configuration, Defender for Office 365 or Google Workspace security, SPF/DKIM/DMARC deployment and enforcement, anti-impersonation and BEC controls, sandboxing, URL protection, encryption and DLP integration
- label: Standards
  value: DMARC (RFC 7489) and BIMI, CIS benchmarks for mail platforms, NIST SP 800-177 email security guidance, CERT-In advisories on phishing
- label: Applies to
  value: Every organisation with email — and particularly those in finance, where payment fraud through email is the dominant loss
- label: Cadence
  value: Design and deployment as a 3–6 week project; DMARC enforcement phased over 8–12 weeks; policy tuning continuous
appliesTo:
- "Phishing gets through: users report it, or worse, they do not."
- Your domain is being spoofed to your customers and suppliers, and DMARC is absent or set to monitor only.
- A payment has been diverted, or nearly, by an email that looked like it came from a director or a supplier.
- Your gateway or Microsoft 365 mail security is at defaults, licensed features unconfigured.
- Spam and malicious mail volume is consuming the helpdesk.
- You run phishing simulations and the click rate is not falling — because the mail should never have arrived.
stakes:
- Phishing is the initial-access vector in the majority of breaches, and business-email compromise the highest-loss cybercrime category worldwide.
- A spoofed domain damages every customer and supplier relationship it touches, and the sender never knows.
- Diverted payments are rarely recovered; the loss is the invoice value, and the supplier relationship.
- Malicious attachments and links that reach the inbox are one click from ransomware.
- Awareness training cannot compensate for a gateway that lets the attack through; the people are the last line, not the first.
- Regulators expect email security controls and DMARC as basic hygiene; their absence is a finding after the incident.
steps:
- title: Assessment
  text: Mail flow, gateway or platform configuration, authentication records, current threat volume and the phishing that reaches users, assessed against benchmarks and the attacks in current use.
- title: Authentication
  text: SPF, DKIM and DMARC deployed for every sending domain and service — including marketing and third-party senders — and DMARC moved from monitor to quarantine to reject in phases, with reporting analysed throughout.
- title: Gateway and platform configuration
  text: Anti-spam, anti-malware, sandboxing, URL rewriting and time-of-click protection, impersonation detection for executives and suppliers, and external-sender tagging configured and tuned.
- title: Business-email-compromise controls
  text: Payment-process controls, supplier-domain monitoring, look-alike domain detection and mailbox-rule monitoring — because BEC is a process attack as much as a technical one.
- title: Integration
  text: Reported-phishing workflow, DLP and encryption integration, and alerts into your SOC or ours.
- title: Tuning and measurement
  text: False positives and misses tracked, policies tuned, and the results measured against the phishing that reaches users — coordinated with awareness testing.
deliverables:
- title: Email security assessment
  text: Configuration, authentication and threat findings, prioritised.
- title: SPF/DKIM/DMARC implementation
  text: Every sender covered, enforcement reached, reporting monitored.
- title: Hardened gateway or platform configuration
  text: Documented as a standard, with the reasoning.
- title: BEC control set
  text: Technical and process controls against payment fraud.
- title: Reported-phishing and SOC workflow
  text: From user report to analyst verdict to purge.
- title: Measurement report
  text: What reaches users, and how it changes.
faq:
- q: We have Microsoft 365 — do we still need a gateway?
  a: Not necessarily. Defender for Office 365, properly licensed and configured, is a capable email security platform; a separate gateway adds value in some architectures and complexity in others. We assess what you have and recommend without a resale interest.
- q: What is DMARC and why does enforcement take weeks?
  a: DMARC tells receiving mail servers what to do with messages that claim to come from your domain but fail authentication. Moving to "reject" too quickly blocks legitimate mail from senders you forgot — marketing platforms, ticketing systems, a subsidiary. We phase it, analysing the reports, so enforcement blocks only the spoofers.
- q: Will this stop business-email compromise?
  a: "Technical controls stop most of it: impersonation detection, look-alike domain blocking, external tagging, mailbox-rule monitoring. The remainder is process — a payment-detail change verified by phone, a second approver — and we implement both, because the attacker who defeats the gateway still has to defeat the process."
- q: How does this relate to awareness training and PhishSniper?
  a: They are the other half. The gateway stops what it can; awareness and simulation prepare people for what gets through; and the measurement of both together is what tells you whether the risk is falling. Our PhishSniper platform runs the simulations and feeds the results back into gateway tuning.
- q: Can you manage it?
  a: Yes — gateway and platform tuning, DMARC monitoring, reported-phishing triage and BEC alerting can be delivered through our SOC.
related:
- office-365-hardening
- phishsniper
- security-awareness-training
industries:
- bfsi
- education-hospitality
- manufacturing
- pharma-healthcare
insights:
- why-faster-smarter-phishing-is-beating-legacy-controls
seo:
  title: Email security, DMARC and anti-phishing — GISPL
  description: Email gateway and Microsoft 365 mail security, SPF/DKIM/DMARC enforcement, impersonation and business-email-compromise controls, reported-phishing workflow.
  noindex: false
---

Most attacks arrive by email. Phishing is the initial-access vector in the majority of breaches; business-email compromise — the forged instruction from a director, the supplier whose bank details "changed" — is the highest-loss category of cybercrime in the world; and the malicious attachment that becomes ransomware still comes through the inbox. Email security is the discipline of stopping as much of that as possible before it reaches a person, and of making the person's job easier for the remainder.

It has layers. Authentication — SPF, DKIM and DMARC — stops attackers from sending mail as your domain, protecting your customers and suppliers from being defrauded in your name; most organisations have it half-deployed and unenforced. The gateway or platform — a dedicated secure email gateway, or Microsoft's Defender for Office 365 properly configured — filters spam and malware, sandboxes attachments, rewrites and checks links at click time, and detects impersonation of executives and suppliers. Business-email-compromise controls add the specific defences against payment fraud: look-alike domain detection, mailbox-rule monitoring, and the process controls — a phone call to verify changed bank details — that defeat the attacker who gets past the technology. And a reported-phishing workflow turns users into sensors, with reports triaged by the SOC and malicious mail purged from every inbox it reached.

## Measured against what gets through

The test of email security is the phishing that reaches users, and that is what GISPL measures: before, during and after, coordinated with awareness testing through our PhishSniper platform so that gateway tuning and people-training are managed as one programme. We assess and configure the major gateways and Microsoft 365 without a resale interest, phase DMARC to enforcement without blocking legitimate senders, implement the technical and process controls against payment fraud, and can run the whole thing — tuning, DMARC monitoring, reported-phishing triage — through our 24×7 SOC.
