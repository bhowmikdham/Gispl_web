---
title: Firewall & network access control
label: Firewall & NAC
practice: implementation-and-managed-services
order: 16
tagline: Firewalls that enforce a policy rather than a history, and NAC that decides what a device may reach before it connects.
summary: Firewall architecture, rule-base review and clean-up, next-generation feature enablement, and network access control design and rollout — implemented, documented and operated as a managed service.
icon: lock
status: published
facts:
- label: Platforms
  value: Palo Alto, Fortinet, Check Point, Cisco, Sophos and cloud-native firewalls; Cisco ISE, Aruba ClearPass, Fortinet and Microsoft NAC platforms
- label: Covers
  value: Perimeter and internal firewall architecture, rule-base review and optimisation, application-layer and threat-prevention features, VPN and remote access, NAC policy design, 802.1X rollout and posture assessment
- label: Benchmarks
  value: CIS benchmarks and vendor hardening guides for each platform; PCI DSS requirement 1; NIST SP 800-41 firewall guidance
- label: Cadence
  value: Rule-base reviews quarterly (PCI requires six-monthly); NAC rollout phased by site; platforms operated 24×7 as a managed service
appliesTo:
- Your firewall rule base has thousands of rules, hundreds unused, and nobody knows what half of them are for.
- PCI DSS requires documented business justification for every rule and a six-monthly review, and you cannot produce either.
- You paid for next-generation features — application control, IPS, URL filtering, sandboxing — that are switched off or in monitor mode.
- Anyone who plugs in gets on the network; contractors, guests and devices are indistinguishable from staff.
- Your penetration test walked through the firewall via a rule added for a project that ended years ago.
- Firewall changes are made by whoever is asked, without review, and nobody can say who changed what.
stakes:
- Every unused, over-broad or forgotten rule is a path through the perimeter that an attacker will find before you do.
- Next-generation features left in monitor mode detect the attack and let it through.
- PCI and regulator findings for undocumented rules and missing reviews.
- Unauthenticated network access is physical access; a visitor with a laptop is inside.
- Devices that cannot be identified cannot be segmented, monitored or trusted.
- Uncontrolled change is the leading cause of both outages and breaches at the perimeter.
steps:
- title: Rule-base and architecture review
  text: Every rule analysed for usage, breadth, justification and risk; the architecture assessed against the segmentation it is meant to enforce.
- title: Clean-up and optimisation
  text: Unused rules removed, over-broad rules tightened, shadowed and redundant rules consolidated, and business justification documented for what remains — in change windows, with rollback.
- title: Feature enablement
  text: Application control, intrusion prevention, URL filtering, DNS security, sandboxing and decryption enabled and tuned from monitor to block, policy by policy.
- title: NAC design
  text: Policy defined by identity, device type and posture — what each class of user and device may reach — with the enforcement points and the exception process.
- title: NAC rollout
  text: 802.1X and MAC authentication bypass deployed site by site, inventory first, monitor mode before enforcement, posture assessment for managed devices.
- title: Operation
  text: Change control with review, quarterly rule-base reviews, firmware and signature currency, and 24×7 monitoring and management through GISPL's SOC.
deliverables:
- title: Rule-base analysis report
  text: Unused, over-broad, shadowed and unjustified rules, with risk.
- title: Optimised, documented rule base
  text: Every rule justified, owned and reviewed.
- title: Threat-prevention configuration
  text: Next-generation features enabled and tuned to block.
- title: NAC policy and architecture
  text: By identity, device class and posture.
- title: Phased NAC deployment
  text: Site by site, with the inventory it produced.
- title: Managed firewall and NAC service
  text: Change control, reviews, currency and 24×7 operation.
faq:
- q: Why does rule-base clean-up matter so much?
  a: Because the rule base is the perimeter's actual policy, and after years of project exceptions it no longer resembles the intended one. In most reviews we find a quarter of the rules unused and a meaningful number that allow far more than anyone intended. Each is a path. PCI DSS requires the review for exactly this reason.
- q: Will enabling threat-prevention features slow the firewall or break applications?
  a: Sized correctly and enabled in stages — monitor first, then block, policy by policy — neither. Features left permanently in monitor mode, which is common, provide a log of the attacks that succeeded.
- q: What does NAC actually decide?
  a: Whether a device may connect, and to what. A staff laptop with current patches and endpoint protection reaches the corporate network; a contractor reaches a restricted segment; a printer reaches its print server; an unknown device reaches nothing. It is the enforcement of segmentation at the point of connection.
- q: How does NAC relate to switching security?
  a: Switches with 802.1X are the enforcement points; NAC is the policy engine. We design and implement both, and the switching security page covers the layer-2 hardening that makes enforcement hold.
- q: Can you manage the firewalls?
  a: Yes — managed firewall and NAC operation with change control, rule reviews, firmware and signature currency, and monitoring through our 24×7 SOC is one of our longest-running managed services.
related:
- network-security
- switching-security
- soc-monitoring
industries:
- bfsi
- telecom
- manufacturing
- government
insights:
- red-blue-and-purple-which-testing-does-your-team-need
seo:
  title: Firewall management and network access control — GISPL
  description: Firewall architecture, rule-base clean-up, threat-prevention enablement and NAC rollout — implemented, documented and operated 24×7 as a managed service.
  noindex: false
---

A firewall enforces the rules it has, not the policy anyone intended. After ten years of projects, migrations and emergency changes, the rule base of most organisations' firewalls is a history rather than a policy: thousands of rules, a quarter of them never matched, dozens allowing far more than anyone remembers agreeing to, and a handful — added for a vendor, a test, a project long finished — that open the perimeter to the internet. Penetration testers find these rules routinely. So do attackers. PCI DSS requires a documented justification for every rule and a review every six months precisely because the rule base drifts this way everywhere.

Firewall management is the discipline of making the rule base a policy again, and keeping it one: every rule analysed for usage, breadth and justification; the unused removed and the over-broad tightened, in change windows with rollback; next-generation features — application control, intrusion prevention, URL and DNS filtering, sandboxing — enabled and tuned from monitor mode to blocking, because a threat-prevention engine left in monitor mode is a log of the attacks that succeeded; and change control with review, so the drift does not start again the next week.

## Network access control: the decision before connection

Network access control moves enforcement to the point of connection. Instead of a network that gives an address to anything that plugs in, NAC decides — by identity, device type and posture — whether a device may connect and what it may reach: a compliant staff laptop to the corporate network, a contractor to a restricted segment, a printer to its server, an unknown device to nothing. It is how segmentation is enforced for the devices that cannot be trusted to place themselves, and it produces, as a by-product, the first accurate inventory most organisations have had. GISPL designs and rolls out NAC site by site — inventory first, monitor mode before enforcement — on the switching foundation described elsewhere in this catalogue, and operates firewalls and NAC platforms as a managed service through our 24×7 SOC.
