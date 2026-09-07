---
title: IoT security testing
label: IoT security testing
practice: assessments-and-testing
order: 6
tagline: Hardware, firmware, radio, cloud and app — the whole device ecosystem tested, because attackers do not stop at the enclosure.
summary: End-to-end security testing of connected devices — hardware interfaces, firmware, radio protocols, device-to-cloud APIs and companion apps — against OWASP IoT and ETSI EN 303 645.
icon: chip
status: published
facts:
- label: Scope
  value: Hardware and debug interfaces, firmware, secure boot and update, BLE/Wi-Fi/Zigbee/LoRa/cellular, device-to-cloud APIs, companion mobile and web apps
- label: Standards
  value: OWASP IoT Top 10 and ISVS; ETSI EN 303 645; NIST IR 8259; TEC's Code of Practice for securing consumer IoT (India)
- label: Applies to
  value: Device makers, OEMs and integrators; and enterprises deploying connected devices at scale — smart meters, medical devices, industrial sensors, cameras, building systems
- label: Cadence
  value: Before launch, on major firmware releases, and on deployment of new device classes into the enterprise
appliesTo:
- You design or manufacture connected devices — consumer, industrial, medical, automotive, smart-city — and customers or regulators ask for security evidence.
- You are deploying connected devices at scale — smart meters, cameras, sensors, medical equipment, building systems — into an enterprise or public network.
- Your device has a companion app and a cloud back-end, and only the app has ever been tested.
- You are exporting to markets where device security requirements now apply — the EU's Cyber Resilience Act, the UK PSTI regime, US labelling schemes.
- A vulnerability disclosure, a customer finding or a research paper has named your product class.
- Your procurement requires suppliers to demonstrate device security and you need an assessment method.
stakes:
- A single firmware flaw is replicated across every device shipped; recall and update campaigns cost more than the testing many times over.
- Compromised devices become footholds into the networks they sit on — cameras, printers and sensors are routinely the first hop in an intrusion.
- Medical and industrial devices carry safety consequences; a manipulated reading or actuator is a physical harm.
- Regulatory access to markets now depends on demonstrated security — the EU Cyber Resilience Act carries penalties up to €15 million or 2.5% of turnover.
- Hard-coded credentials and unsigned updates, the two most common findings, are the two most exploited in the wild.
- Botnets built from vulnerable device classes damage the maker's name for years.
steps:
- title: Threat model the ecosystem
  text: Device, firmware, radio, cloud, app, update channel and manufacturing process mapped, with the assets an attacker would want and the paths to them.
- title: Hardware and interface analysis
  text: Debug ports, memory extraction, boot process, secure element and tamper resistance examined on the bench.
- title: Firmware analysis
  text: Extraction, reverse engineering, credential and key discovery, update-mechanism and signing verification, and vulnerability analysis of the software stack.
- title: Radio and protocol testing
  text: Bluetooth, Wi-Fi, Zigbee, LoRa, cellular and proprietary protocols tested for authentication, encryption, replay and pairing weaknesses.
- title: Cloud, API and app testing
  text: The device-to-cloud interface, the management platform and the companion app tested as applications — authorisation across devices and users above all.
- title: Reporting and design guidance
  text: Findings rated by fleet-wide impact, with remediation that fits the hardware and a secure-design baseline for the next product.
deliverables:
- title: Ecosystem threat model
  text: Device, firmware, radio, cloud, app and supply chain in one picture.
- title: Hardware and firmware findings
  text: Interfaces, boot, storage, credentials, update and signing, with evidence.
- title: Radio and protocol assessment
  text: Per protocol, with captured traffic and proof.
- title: Cloud and application findings
  text: Device identity, API authorisation, fleet management and companion app.
- title: Standards mapping
  text: Against ETSI EN 303 645, OWASP IoT and the market requirements you face.
- title: Secure-design baseline
  text: What the next product should do differently, from the start.
faq:
- q: Do you need the hardware, or can you test remotely?
  a: We need devices on the bench for hardware, firmware and radio work — that is where the important findings are. Cloud and app testing can be done remotely. We typically ask for several units, including one we can take apart.
- q: We deploy devices; we do not make them. Can you help?
  a: Yes. Enterprise deployments are assessed for what the devices expose on your network, how they authenticate to your systems, how they are updated and how they would be used as a foothold — and we give you procurement criteria for the next purchase.
- q: What regulations apply to device makers?
  a: "Increasingly many: the EU Cyber Resilience Act for products sold in Europe, the UK's PSTI regime for consumer devices, US labelling schemes, and in India the TEC code of practice and sector rules for medical and industrial devices. ETSI EN 303 645 is the common technical baseline; we map findings to it."
- q: Is this the same as OT testing?
  a: "They overlap — industrial sensors and controllers are both IoT and OT. The difference is emphasis: IoT testing focuses on the product ecosystem a maker ships; OT testing on the operational environment a plant runs. We do both, often for the same client."
- q: Can you test medical devices?
  a: Yes, with the additional safety discipline they require and with awareness of the regulatory expectations — FDA premarket cybersecurity requirements, the EU MDR and IEC 81001-5-1 — that device makers must meet.
related:
- iot-security
- scada-ot-testing
- web-and-mobile-app-testing
industries:
- manufacturing
- pharma-healthcare
- telecom
insights:
- red-blue-and-purple-which-testing-does-your-team-need
seo:
  title: IoT and connected-device security testing — GISPL
  description: End-to-end testing of connected devices — hardware, firmware, radio, cloud APIs and companion apps — against OWASP IoT and ETSI EN 303 645.
  noindex: false
---

A connected device is not a product; it is a system. There is the hardware, with its debug ports and memory. The firmware, with its credentials, keys and update mechanism. The radio, with its pairing and encryption. The cloud back-end and its APIs, which manage the fleet. The companion app. And the manufacturing and supply chain that provisions each unit. An attacker will use whichever part is weakest, and in our experience it is rarely the part that was tested — because most IoT "testing" tests the app.

The findings that matter are consistent across sectors. Hard-coded credentials shared across every unit shipped. Firmware that can be extracted from a debug port and reverse-engineered in an afternoon. Update mechanisms that do not verify signatures. Radio pairing that can be sniffed or replayed. Cloud APIs that let one device — or one user — read another's data because device identity was never properly enforced. Each of these is replicated across the whole fleet, which is what makes device security different from application security: a flaw is not one vulnerability, it is every unit in the field.

## How we test, and why it matters now

We test the ecosystem end to end, on the bench and in the cloud: hardware interfaces and boot; firmware extraction, analysis and update verification; every radio protocol the device speaks; the device-to-cloud interface and management platform; the companion app. Findings are rated by fleet-wide impact and mapped to the standards the market now demands — ETSI EN 303 645, OWASP's IoT guidance, and the regulatory regimes that increasingly gate market access, from the EU's Cyber Resilience Act to sector rules for medical and industrial devices.

For makers, the deliverable is a product that ships without a recall waiting in it, and a secure-design baseline for the next one. For enterprises deploying devices at scale — utilities with smart meters, hospitals with connected equipment, cities with cameras and sensors — it is an understanding of what those devices expose on the network, how they would be used as a foothold, and what to require of the next supplier.
