---
title: Microsoft 365 hardening
label: Office 365 hardening
practice: implementation-and-managed-services
order: 13
tagline: The tenant most organisations run their business on, configured the way Microsoft, CIS and your regulator expect — and kept that way.
summary: Security hardening of Microsoft 365 and Entra ID — identity and conditional access, mail security, data protection, Teams and SharePoint governance, audit and monitoring — against the CIS benchmark and Microsoft's own baselines.
icon: mail
status: published
facts:
- label: Covers
  value: Entra ID identity and conditional access, MFA and passwordless, privileged roles, Exchange Online and Defender for Office 365, SharePoint/OneDrive/Teams sharing, Purview data protection and retention, Intune device compliance, audit logging and monitoring
- label: Benchmarks
  value: CIS Microsoft 365 Foundations Benchmark, Microsoft Secure Score and security baselines, ISO 27001 and regulator cloud expectations
- label: Applies to
  value: Every organisation running Microsoft 365 — which is most — and especially those where it is the identity provider for everything else
- label: Cadence
  value: Hardening as a 4–8 week project; configuration drift monitored continuously; benchmark re-assessed annually and on major feature changes
appliesTo:
- Microsoft 365 is your email, your files, your collaboration and, through Entra ID, the identity behind most of your applications.
- Business-email compromise, account takeover or a phishing incident has already happened — or your peers' have.
- MFA is "enabled" but not enforced everywhere, legacy authentication is still allowed, and global administrators number in the double digits.
- External sharing, guest access and Teams are ungoverned because the pandemic switched them on.
- You pay for security features — Defender, Purview, conditional access — that were never configured.
- Your regulator or auditor has asked for the tenant's security posture and Secure Score is the only answer.
stakes:
- Business-email compromise is the highest-loss cybercrime category worldwide; it runs through Microsoft 365 tenants that allowed legacy authentication and did not enforce MFA.
- A compromised Entra ID is compromise of every application that trusts it — which is most of them.
- Files shared "anyone with the link" are public; most organisations have thousands of them and know of none.
- Global administrators without privileged-access controls are the highest-value accounts an attacker can phish.
- Audit logging left at defaults means an incident that cannot be investigated.
- Licensed security features left unconfigured are money spent and risk retained.
steps:
- title: Assessment
  text: The tenant assessed against the CIS benchmark and Microsoft's baselines — identity, mail, sharing, data protection, devices, logging — with findings prioritised by the attack they enable.
- title: Identity hardening
  text: MFA enforced everywhere through conditional access, legacy authentication blocked, privileged roles reduced and protected with just-in-time access, break-glass accounts established, and risky sign-in policies tuned.
- title: Mail security
  text: Anti-phishing, safe links and attachments, impersonation protection, DMARC/DKIM/SPF, external tagging and mail-flow rules configured against business-email compromise.
- title: Collaboration and data governance
  text: External sharing and guest access policies, sensitivity labels, DLP for the data that matters, retention aligned to regulation, and the "anyone" links found and remediated.
- title: Devices and monitoring
  text: Intune compliance policies feeding conditional access; unified audit logging, alerting and integration with your SOC or ours.
- title: Drift control
  text: The hardened configuration documented as your standard, monitored for drift, and re-assessed as Microsoft changes the platform.
deliverables:
- title: Tenant security assessment
  text: Against CIS and Microsoft baselines, prioritised by risk.
- title: Conditional-access and identity design
  text: Policies implemented, documented and tested — including break-glass.
- title: Mail security configuration
  text: Defender for Office 365 and mail authentication set and verified.
- title: Sharing, labelling, DLP and retention configuration
  text: Governed collaboration, with the exposed links remediated.
- title: Monitoring integration
  text: Audit logging and alerting into your SOC.
- title: Configuration standard and drift report
  text: The baseline, and how far you have moved from it.
faq:
- q: We have MFA on. Are we not covered?
  a: "\"On\" and \"enforced for every user, every application and every sign-in method, with legacy protocols blocked\" are different things. Most compromised tenants we investigate had MFA \"on\"; the attacker used a legacy protocol that bypassed it, or an account that was excluded. Conditional access is how enforcement actually happens."
- q: Do we need the higher licence tiers?
  a: Much of the hardening works on any tier; some controls — risk-based conditional access, advanced Defender features, some Purview capabilities — need higher licences. We tell you what each control requires and what it buys, and we have no resale interest in the answer.
- q: Will hardening disrupt users?
  a: "Introduced in stages with report-only mode first, it disrupts very little: MFA prompts become consistent, legacy clients that should have been retired are retired, and sharing that should never have been open is closed. The disruption of a business-email compromise is considerably larger."
- q: How does this relate to Azure hardening?
  a: Entra ID is shared between Microsoft 365 and Azure, so identity hardening serves both. Azure infrastructure hardening — subscriptions, networks, workloads — is covered on the AWS and Azure hardening page, and we often run the two together.
- q: Can you keep it hardened?
  a: Yes — configuration drift monitoring, Secure Score tracking and periodic re-assessment can be delivered as a managed service, with the tenant's alerts handled through our SOC.
related:
- aws-and-azure-hardening
- email-gateway-and-anti-spam
- cloud-security
industries:
- bfsi
- education-hospitality
- pharma-healthcare
- government
insights:
- why-faster-smarter-phishing-is-beating-legacy-controls
seo:
  title: Microsoft 365 and Entra ID security hardening — GISPL
  description: Microsoft 365 tenant hardening to the CIS benchmark — conditional access and MFA, privileged roles, Defender for Office 365, sharing governance, monitoring.
  noindex: false
---

For most organisations, Microsoft 365 is not an application; it is the business — email, files, meetings, and through Entra ID the identity that every other system trusts. A compromised tenant is therefore not an email incident. It is an attacker reading the finance director's mailbox, forwarding invoices to a look-alike domain, downloading the shared drive, and signing in to every application that uses "Sign in with Microsoft". Business-email compromise, the highest-loss cybercrime category in the world, runs almost entirely through tenants that were never hardened.

The tenant ships with defaults chosen for compatibility, not security, and most organisations have added years of exceptions. MFA is "on" but not enforced through conditional access, so legacy protocols bypass it. Global administrators number in the double digits with no just-in-time control. External sharing was switched on in 2020 and never governed; thousands of files are shared with "anyone with the link". Defender and Purview features are licensed and unconfigured. Audit logging is at defaults. Every one of these is a finding in the CIS Microsoft 365 benchmark, and every one is a step in the account-takeover incidents we investigate.

## Hardened, then held

GISPL assesses the tenant against the CIS benchmark and Microsoft's own baselines, prioritises findings by the attack they enable, and remediates in stages — identity first, because it is the perimeter; then mail, collaboration and data governance; then devices and monitoring — with report-only mode before enforcement so users see consistency rather than disruption. The hardened configuration becomes your documented standard, monitored for drift as Microsoft changes the platform, and the tenant's alerts flow into your SOC or ours. For regulated organisations, the assessment and the standard are the evidence an inspector or auditor asks for; for everyone, the point is that the business's identity provider is no longer the softest target on the estate.
