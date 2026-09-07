---
title: Switching & LAN security
label: Switching security
practice: implementation-and-managed-services
order: 6
tagline: The layer-2 controls that stop an attacker on one port from owning the floor — port security, 802.1X, VLAN hygiene and hardened switches.
summary: Hardening of the switched network — port security, 802.1X authentication, VLAN and trunk hygiene, DHCP snooping, dynamic ARP inspection, spanning-tree protection and management-plane security — with configuration standards and validation.
icon: network
status: published
facts:
- label: Covers
  value: Access-layer authentication (802.1X, MAB), port security, VLAN and trunk configuration, DHCP snooping, dynamic ARP inspection, IP source guard, STP guards, storm control, management-plane hardening
- label: Benchmarks
  value: CIS Benchmarks for Cisco, Juniper, Aruba and other platforms; vendor hardening guides; NIST SP 800-115 for validation
- label: Applies to
  value: Any organisation with a campus, branch, data-centre or plant-floor switched network — especially those with open ports in public or shared spaces
- label: Cadence
  value: Standards and hardening as a project; configuration compliance checked continuously; validated annually by testing
appliesTo:
- Anyone can plug a laptop into a wall port in your office, branch or plant and get a network address.
- Your internal penetration test spoofed a device, poisoned ARP or hopped a VLAN — and reached servers from a meeting room.
- Switch configurations vary by site and by whoever installed them, with no standard and no compliance check.
- Wireless is authenticated but the wired network trusts anything that plugs in.
- Printers, cameras and building devices share VLANs with users and servers.
- Switch management is reachable from user networks over telnet or HTTP.
stakes:
- An unauthenticated port is physical access to the network; in most offices it takes a visitor five minutes to find one.
- ARP spoofing and rogue DHCP let an attacker on one port intercept the traffic of everyone on the segment — credentials included.
- VLAN hopping turns segmentation into a diagram.
- Rogue switches and spanning-tree manipulation cause outages that look like faults and take days to trace.
- Compromised switch management is control of the entire network's traffic.
- Every one of these is a standard step in the internal attacks we run and the intrusions we investigate.
steps:
- title: Configuration assessment
  text: Every switch's configuration collected and assessed against the CIS benchmark and your own standard — or the absence of one — with deviations by site and device.
- title: Standards
  text: A hardened configuration standard per platform and per port role — user, printer, phone, camera, server, uplink, trunk — that engineers can apply and auditors can check.
- title: Access-layer authentication
  text: 802.1X with certificate or credential authentication for managed devices, MAC authentication bypass for those that cannot, and dynamic VLAN assignment so a device is placed by identity.
- title: Layer-2 protections
  text: DHCP snooping, dynamic ARP inspection, IP source guard, port security, BPDU and root guards, storm control — enabled per the standard, in change windows.
- title: Management-plane hardening
  text: Out-of-band or dedicated management VLANs, encrypted management protocols only, centralised authentication, logging and configuration backup.
- title: Compliance and validation
  text: Configuration compliance monitored continuously, and the controls validated by attempting the attacks they are meant to stop.
deliverables:
- title: Switch configuration assessment
  text: Deviations by device, site and severity.
- title: Hardened configuration standard
  text: Per platform and port role, ready to apply and audit.
- title: 802.1X and NAC design and rollout plan
  text: Phased by site, with monitor-mode first.
- title: Layer-2 protection implementation
  text: Applied and documented, with change records.
- title: Management-plane architecture
  text: Isolated, encrypted, authenticated, logged.
- title: Validation report
  text: The attacks attempted, and stopped.
faq:
- q: Is switch security really that important next to firewalls and endpoints?
  a: It is the layer beneath both. Every internal attack we run starts by plugging in or spoofing a device, poisoning ARP or hopping a VLAN — because it almost always works. A firewall cannot protect a segment whose switch lets an attacker intercept everything on it.
- q: Will 802.1X break things?
  a: Rolled out carelessly, yes — printers, phones and devices that cannot authenticate get locked out. Rolled out properly — inventory first, MAC authentication bypass for devices that need it, monitor mode before enforcement, site by site — it breaks nothing and finally tells you what is on the network.
- q: We have many sites and many vendors. Can this be standardised?
  a: That is the point. A configuration standard per platform and port role, applied through automation where possible and checked continuously, is how a hundred sites stay hardened. Without it, each site is as secure as whoever installed it.
- q: Does this cover plant-floor and OT switches?
  a: Yes, with the OT practice's discipline — changes in maintenance windows, no active testing against production process networks, and zone-and-conduit design from IEC 62443 applied to the switched layer.
- q: How does this relate to your NAC service?
  a: Closely. 802.1X on the switches is the enforcement point; NAC is the policy engine behind it. We design and implement both, and the firewall and NAC page covers the policy side in more depth.
related:
- firewall-and-nac
- network-security
- network-security-testing
industries:
- bfsi
- manufacturing
- government
- education-hospitality
insights:
- red-blue-and-purple-which-testing-does-your-team-need
seo:
  title: Switching and LAN security hardening — GISPL
  description: Hardening of the switched network — 802.1X and NAC, port security, VLAN hygiene, DHCP snooping, ARP inspection and management-plane security, validated.
  noindex: false
---

Beneath the firewalls, the endpoint agents and the identity platform sits the switched network — and on most of them, anyone who plugs into a wall port gets an address, anyone on a segment can intercept its traffic, and a VLAN is a boundary only until someone tries to cross it. Every internal penetration test we run begins at this layer, because it almost always works: a spoofed device, a poisoned ARP table, a rogue DHCP server, a hopped VLAN, and the attacker is reading credentials from a meeting room. The intrusions we investigate use the same techniques.

Switching security is the set of layer-2 controls that close those paths. Access-layer authentication — 802.1X for devices that can authenticate, MAC authentication bypass for those that cannot — so a device is identified and placed in the right VLAN before it can talk. Port security, DHCP snooping, dynamic ARP inspection and IP source guard, so a device on one port cannot impersonate the gateway or intercept its neighbours. Spanning-tree guards and storm control, so a rogue switch cannot take the network down. VLAN and trunk hygiene, so segmentation holds. And a hardened, isolated management plane, because control of the switches is control of everything that crosses them.

## Standards, not heroics

The difficulty is rarely knowing what to do; it is doing it consistently across a hundred sites configured by a dozen installers over ten years. GISPL's approach starts with collecting and assessing every configuration against the CIS benchmark, then producing a hardened standard per platform and per port role that engineers can apply and auditors can check. 802.1X is rolled out site by site, inventory first and monitor mode before enforcement, so nothing that should work stops working. Layer-2 protections are enabled in change windows. Compliance is then checked continuously, and the controls are validated by attempting the attacks they exist to stop — the proof that a diagram has become a network.
