---
title: IoT security architecture
label: IoT security
practice: implementation-and-managed-services
order: 4
tagline: Connected devices deployed with identity, segmentation, updates and monitoring — so a fleet is an asset rather than an attack surface.
summary: Security architecture and implementation for connected-device deployments — device identity and onboarding, network segmentation, secure update and lifecycle, fleet monitoring and procurement standards — for enterprises, utilities, healthcare and smart infrastructure.
icon: chip
status: published
facts:
- label: Covers
  value: Device identity and certificates, secure onboarding, network segmentation for device classes, update and patch management, fleet monitoring, decommissioning, supplier requirements
- label: Standards
  value: ETSI EN 303 645, NIST IR 8259 and SP 800-213, IEC 62443 for industrial devices, IEC 81001-5-1 and FDA guidance for medical devices, TEC code of practice (India)
- label: Applies to
  value: Enterprises and public bodies deploying devices at scale — smart meters and grids, hospitals, campuses, buildings, cities, logistics and manufacturing
- label: Cadence
  value: Architecture before deployment; segmentation and monitoring continuous; supplier and device review on each new class
appliesTo:
- "You are deploying — or have deployed — thousands of devices: meters, cameras, sensors, medical equipment, building controls, trackers."
- Devices sit on the same network as your servers and workstations because nobody designed anything else.
- Devices arrive with default credentials, no update path and a vendor cloud you have never assessed.
- A regulator, an insurer or an audit has asked how you secure connected devices and the answer is a spreadsheet.
- A device has already been the route in — a camera, a printer, a badge reader.
- Procurement needs security requirements for the next tender.
stakes:
- Devices are the most common unmanaged foothold on enterprise networks; a compromised camera or printer is a server an attacker owns inside your perimeter.
- Fleets that cannot be updated stay vulnerable for their entire service life — often a decade.
- Medical and safety devices carry physical consequences; a manipulated infusion pump or building control harms people.
- Botnets built from your devices attack others and carry your name.
- Vendor clouds with access to every device are a supply-chain risk you inherited without assessing.
- Decommissioned devices leave with credentials and data on them.
steps:
- title: Inventory and classification
  text: Every device class found — by network discovery, not by asking — and classified by function, sensitivity, safety impact and manageability.
- title: Architecture
  text: Segmentation by device class, device identity and certificate-based onboarding, controlled paths to vendor clouds, and monitoring designed for devices that cannot run agents.
- title: Onboarding and identity
  text: Certificate provisioning, network access control and zero-touch onboarding so a device is identified and placed before it can talk to anything.
- title: Update and lifecycle
  text: Update management for classes that support it, compensating controls for those that do not, and a decommissioning process that wipes and revokes.
- title: Fleet monitoring
  text: Network-based detection of device anomalies wired into your SOC — a camera that starts scanning is a compromise.
- title: Supplier and procurement standards
  text: Security requirements written into tenders and contracts, and an assessment method for new device classes before they are bought.
deliverables:
- title: Device inventory and risk classification
  text: What is on the network, by class, with its risk.
- title: IoT security architecture
  text: Segmentation, identity, vendor-cloud paths and monitoring design.
- title: Onboarding and NAC implementation
  text: Identity-based placement of every device.
- title: Update and lifecycle procedures
  text: Including compensating controls and decommissioning.
- title: Fleet monitoring configuration
  text: Detection content for device behaviours, into the SOC.
- title: Procurement security standard
  text: Requirements and assessment criteria for suppliers.
faq:
- q: Our devices cannot run security software. How do you protect them?
  a: "From the network: segmentation so they can only reach what they need, network access control so they are identified before they connect, and monitoring of their traffic so anomalous behaviour is detected. Most device security is network security applied to devices that cannot defend themselves."
- q: How is this different from IoT security testing?
  a: "Testing examines devices and their ecosystem for vulnerabilities — mostly for makers. This is for deployers: securing a fleet of devices you bought, on your network, for their service life. We do both, and testing new device classes before procurement is part of this programme."
- q: What about medical devices?
  a: "They are the highest-stakes class and the least patchable. We treat them as OT: inventoried, segmented, monitored, with compensating controls per device class, aligned to IEC 81001-5-1 and the regulatory guidance device makers must meet."
- q: Do vendor clouds worry you?
  a: They should worry you. A vendor platform that can reach every device you own is a supply-chain dependency with administrator access. We assess it, constrain the path to it, and write requirements for it into the contract.
- q: Can you manage the fleet monitoring afterwards?
  a: Yes — device anomaly detection can be delivered through our SOC as part of managed detection and response.
related:
- iot-security-testing
- network-security
- firewall-and-nac
industries:
- manufacturing
- pharma-healthcare
- telecom
- education-hospitality
insights:
- building-an-incident-response-runbook-that-survives-contact
seo:
  title: IoT security architecture for device fleets — GISPL
  description: Security architecture for enterprise device fleets — identity and onboarding, segmentation, update and lifecycle, fleet monitoring and procurement standards.
  noindex: false
---

Every connected device an organisation deploys is a computer it cannot patch, cannot install security software on, and often cannot see — sitting on the same network as its servers. Cameras, printers, badge readers, meters, sensors, medical equipment, building controls: in the breaches we investigate they are routinely the first foothold, because they arrived with default credentials, were placed on a flat network, and were never monitored. A fleet of ten thousand such devices is an attack surface unless it is deployed as an architecture.

That architecture has a consistent shape. Devices are inventoried and classified — by discovery, not by asking, because the spreadsheet is always wrong. They are segmented by class, so a camera can reach its recorder and nothing else. They are identified before they connect, through certificates and network access control, so a rogue device cannot impersonate a real one. Their paths to vendor clouds are controlled, because a vendor platform that can reach every device is administrator access you inherited. They are updated where they can be and compensated for where they cannot. Their traffic is monitored, because a meter that starts scanning the network is a compromise. And they are decommissioned properly, because a discarded device leaves with credentials and data on it.

## Deployers, not just makers

Most guidance on IoT security is written for the companies that make devices. This programme is for the organisations that buy and run them — utilities rolling out smart meters, hospitals with connected clinical equipment, campuses and cities with cameras and sensors, manufacturers and logistics operators with tracked assets. It draws on GISPL's network, OT and testing practices: segmentation and NAC from network security, the passive-first discipline of OT for devices that cannot be probed, and device testing before procurement so the next tender specifies what the last one should have. Fleet monitoring can then run through our SOC, so a compromised device is seen the day it happens rather than the year it is found.
