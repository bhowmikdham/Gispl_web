---
title: Network security testing
label: Network security testing
practice: assessments-and-testing
order: 2
tagline: External, internal and wireless — the paths an attacker would actually take through your network, tested by hand and proven.
summary: External and internal network penetration testing, wireless assessment, segmentation validation and firewall rule review — CERT-In empanelled, manual and evidence-led, with retest.
icon: network
status: published
facts:
- label: Scope
  value: External perimeter, internal network, wireless, VPN and remote access, segmentation and firewall configuration
- label: Methodology
  value: PTES and NIST SP 800-115 aligned; MITRE ATT&CK for adversary techniques; CIS Benchmarks for configuration review
- label: Required by
  value: RBI, SEBI CSCRF, IRDAI and CERT-In guidelines (annual, by an empanelled auditor); PCI DSS requirements 11.3 and 11.4
- label: Cadence
  value: Annually and after significant change; quarterly for internet-facing estates in regulated sectors
appliesTo:
- Your regulator requires annual network penetration testing by a CERT-In empanelled organisation — RBI, SEBI, IRDAI and CERT-In all do.
- PCI DSS requires internal and external penetration testing and segmentation validation, at least annually.
- You have opened new internet-facing services, VPNs, branch links or cloud connections since the last test.
- You want to know what an attacker who gets one foothold — a phished laptop, a contractor's credentials — could reach from inside.
- "Your wireless estate has grown beyond what anyone has assessed: guest networks, IoT, warehouse and plant floor."
- A merger, migration or outsourcing has changed the network and nobody has tested the result.
stakes:
- The external perimeter is what ransomware groups scan first; an exposed service with a known vulnerability is a matter of days, not months.
- Flat internal networks turn one compromised endpoint into domain-wide compromise — the pattern in most breaches we investigate.
- Failed segmentation silently puts systems back into PCI scope and into an attacker's reach.
- Regulators treat a missed annual test as a finding, and a test without remediation as a worse one.
- Wireless and remote-access weaknesses give an attacker the inside without ever touching the perimeter.
- Firewall rule bases accumulate exceptions for years; each one is a path nobody remembers opening.
steps:
- title: Scope and rules of engagement
  text: Address ranges, sites, wireless SSIDs, remote-access paths, testing windows, exclusions and escalation contacts agreed in writing.
- title: External testing
  text: Reconnaissance, service enumeration, vulnerability identification and manual exploitation of the internet-facing perimeter, including VPN, mail and remote-access services.
- title: Internal testing
  text: From an assumed foothold — a network port, a standard user account — lateral movement, privilege escalation, Active Directory attack paths and access to critical systems, proven step by step.
- title: Wireless and segmentation
  text: Wireless authentication and isolation tested on site; segmentation between zones — user, server, PCI, OT, guest — validated by attempting to cross it.
- title: Configuration review
  text: Firewall rule bases, switch and router configurations and remote-access settings reviewed against benchmarks and your own policy.
- title: Reporting and retest
  text: Findings with proof, impact in your environment and specific remediation; a retest to confirm closure and a report a regulator will accept.
deliverables:
- title: Executive summary
  text: The attack paths that matter, in a page the board can read.
- title: Technical findings with evidence
  text: Every finding reproduced — request, response, screenshot — and rated by real impact.
- title: Attack-path narrative
  text: How an attacker gets from outside to your crown jewels, step by step.
- title: Segmentation and firewall review report
  text: Rules that should not exist, and paths that should not be open.
- title: Remediation guidance
  text: Specific to your platforms, prioritised by exposure.
- title: Retest report and closure certificate
  text: The document that closes the regulatory or PCI requirement.
faq:
- q: What is the difference between a vulnerability assessment and a penetration test?
  a: A vulnerability assessment finds known weaknesses, largely with tools, and lists them. A penetration test exploits them by hand, chains them together and shows what an attacker could actually reach. Regulators require both; the value is in the second.
- q: Will testing disrupt the network?
  a: External and internal testing is run inside agreed windows with agreed exclusions, and exploitation is controlled — we prove access, we do not cause outages. Anything with an availability risk is discussed and scheduled before it is attempted. OT segments are handled by our OT testing practice.
- q: Do you test from inside as well as outside?
  a: Yes, and the internal test is usually the more revealing. Most breaches begin with one phished user or one compromised contractor; the internal test shows how far that foothold reaches, which is what a flat network and weak Active Directory turn into domain compromise.
- q: Does this satisfy PCI DSS requirement 11?
  a: It is designed to. We test internal and external, validate segmentation, and report in a form a QSA accepts. Quarterly ASV scanning is a separate, automated requirement that we can also run.
- q: How often should we test?
  a: Annually at minimum — that is what RBI, SEBI, IRDAI, CERT-In and PCI DSS require — and after any significant change. Internet-facing estates in regulated sectors benefit from quarterly external testing.
related:
- vapt-services
- web-and-mobile-app-testing
- firewall-and-nac
industries:
- bfsi
- telecom
- government
- manufacturing
insights:
- red-blue-and-purple-which-testing-does-your-team-need
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: Network penetration testing — GISPL
  description: CERT-In empanelled external, internal and wireless network penetration testing, segmentation validation and firewall review — evidence-led, with retest.
  noindex: false
---

Network security testing answers a concrete question: starting from the internet, or from one compromised device inside, how far could an attacker get? The external test examines the perimeter — every internet-facing service, VPN, mail gateway and remote-access path — for the weaknesses ransomware groups scan for daily. The internal test starts from an assumed foothold, because that is how most breaches actually begin, and follows the paths an intruder would: lateral movement, privilege escalation, Active Directory attack chains, access to the systems that matter. Wireless and segmentation testing check whether the boundaries between zones — user, server, payment, OT, guest — actually hold when someone tries to cross them.

Every regulator in Indian financial services requires this annually, by a CERT-In empanelled organisation; PCI DSS requires it for the cardholder data environment together with segmentation validation. But the reason to do it well is not the requirement. In the breaches we investigate, the pattern is consistent: a single phished user or an exposed service, then a flat network, then domain-wide compromise in hours. A network test performed by hand, by people who think like the intruder, is the way to find that path before they do.

## How we test

Reconnaissance and enumeration first, then manual exploitation — tools identify candidates, people prove them. Findings are chained where they combine, because three medium-severity issues that together give domain administrator are a critical finding. Everything is evidenced: the request, the response, the screenshot, the path. Impact is rated in your environment, not from a scanner's severity table. Firewall rule bases, switch and router configurations and remote-access settings are reviewed against benchmarks, because years of accumulated exceptions are paths nobody remembers opening.

Rules of engagement are agreed in writing — ranges, windows, exclusions, escalation — and exploitation is controlled: we prove access, we do not cause outages. The report has two audiences, an executive summary the board can act on and technical detail an engineer can reproduce, and every engagement includes a retest so closure is evidenced rather than assumed.
