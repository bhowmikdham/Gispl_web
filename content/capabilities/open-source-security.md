---
title: Open-source & supply-chain security
label: Open source security
practice: implementation-and-managed-services
order: 5
tagline: Know every component in your software, track every vulnerability in it, and prove it with an SBOM — before a customer or a breach asks.
summary: Software-composition analysis, SBOM generation and management, dependency vulnerability tracking, licence compliance and build-pipeline integrity — for organisations whose software is mostly other people's code.
icon: search-doc
status: published
facts:
- label: Covers
  value: Software-composition analysis, SBOM generation (SPDX, CycloneDX) and management, vulnerability tracking and prioritisation, licence compliance, build and artefact integrity, third-party software assessment
- label: Standards
  value: NIST SSDF and SP 800-161, SLSA, OpenSSF Scorecard, CERT-In SBOM guidelines, EU Cyber Resilience Act requirements
- label: Applies to
  value: Anyone who builds, ships or buys software — product companies, banks with in-house development, IT services firms, and procurement teams that receive SBOMs from suppliers
- label: Cadence
  value: SBOM on every release; vulnerability monitoring continuous; supplier SBOM review on procurement and on major updates
appliesTo:
- Customers, regulators or tenders ask for a software bill of materials — CERT-In has issued guidelines, and the EU Cyber Resilience Act requires one.
- Most of your codebase is open-source dependencies and nobody can say which are vulnerable today.
- A widely reported vulnerability in a common library sent your teams searching for where it was used — and they were not sure.
- You ship software to customers and want to know what you are exposing them to.
- You buy software and want to assess what suppliers are shipping to you.
- Licence obligations — copyleft in a commercial product — have never been checked.
stakes:
- Vulnerable dependencies are a leading breach cause, with public exploit code available within days of disclosure.
- Supply-chain attacks through compromised packages, build tools and update channels reach every customer at once.
- A vulnerability announcement you cannot answer in hours — "are we affected?" — is a customer, regulator and board question you fail.
- "Regulatory access: the Cyber Resilience Act, CERT-In guidelines and sector rules increasingly require an SBOM."
- Licence violations discovered in due diligence stall funding and acquisitions.
- Enterprise customers assess your supply-chain posture before they buy.
steps:
- title: Inventory
  text: Software-composition analysis across every codebase and container, producing a complete inventory of components, versions and transitive dependencies.
- title: SBOM generation and management
  text: Machine-readable SBOMs in SPDX or CycloneDX for every product and release, generated in the pipeline and stored where they can be queried.
- title: Vulnerability tracking and prioritisation
  text: Components matched continuously to vulnerability intelligence, with findings prioritised by exploitability and reachability rather than raw severity.
- title: Licence compliance
  text: Licences identified, obligations mapped, and conflicts with your commercial model resolved.
- title: Build and artefact integrity
  text: Pipeline hardening, signed artefacts, provenance and dependency pinning against SLSA levels — so what you ship is what you built.
- title: Supplier software assessment
  text: A process for receiving, validating and acting on SBOMs from your own suppliers, and requirements for procurement.
deliverables:
- title: Component inventory
  text: Every dependency, direct and transitive, in every product.
- title: SBOM pipeline
  text: Generated on every build, in standard formats, stored and queryable.
- title: Vulnerability management process for dependencies
  text: Continuous matching, prioritisation and ownership.
- title: Licence compliance report
  text: Obligations and conflicts, resolved.
- title: Build integrity implementation
  text: Signing, provenance and pinning to an agreed SLSA level.
- title: Supplier SBOM requirements and review process
  text: For procurement and for the software you receive.
faq:
- q: What is an SBOM, exactly?
  a: A software bill of materials — a machine-readable list of every component in a piece of software, with versions and relationships, in a standard format such as SPDX or CycloneDX. It is to software what an ingredients list is to food, and it is how you answer "are we affected?" in minutes rather than days.
- q: Who is asking for them?
  a: CERT-In has issued SBOM guidelines for Indian organisations; the EU Cyber Resilience Act requires them for products sold in Europe; US federal procurement has required them since 2021; and enterprise customers increasingly ask for them in due diligence. The direction is clear.
- q: Our scanner reports thousands of vulnerable dependencies. Where do we start?
  a: With reachability and exploitability. Most reported vulnerabilities are in code paths your application never calls, or are not exploitable in your context. We prioritise by whether the vulnerable function is reachable, whether an exploit exists, and where the component sits — which usually reduces thousands to dozens.
- q: Does this cover the build pipeline?
  a: Yes — supply-chain attacks increasingly target build tools, package registries and update channels rather than the code itself. We harden the pipeline, sign artefacts and establish provenance to an agreed SLSA level, so what you ship is provably what you built.
- q: What about the software we buy?
  a: "The same discipline in reverse: requiring SBOMs from suppliers, validating them, matching them to vulnerability intelligence and acting on what you find. We build the procurement requirements and the review process."
related:
- application-security
- secure-source-code-review
- threat-and-vulnerability-management
industries:
- bfsi
- telecom
- manufacturing
insights:
- red-blue-and-purple-which-testing-does-your-team-need
seo:
  title: Open-source, SBOM and software supply-chain security — GISPL
  description: Software-composition analysis, SBOM generation, dependency vulnerability prioritisation, licence compliance and build integrity for teams that ship software.
  noindex: false
---

Modern software is mostly assembled, not written. A typical application is eighty or ninety per cent open-source components — libraries, frameworks, runtimes — pulled in directly and, through them, hundreds of transitive dependencies nobody chose. Each is code you ship to your customers, run in your estate and are accountable for, and each carries its own vulnerabilities and licence obligations. When a widely used library is found to be critically vulnerable — as happens several times a year — the question every customer, regulator and board asks within hours is "are we affected?", and an organisation without an inventory cannot answer.

The software bill of materials is the answer. An SBOM is a machine-readable list of every component in a product, generated on every build in a standard format, stored where it can be queried, and matched continuously to vulnerability intelligence. CERT-In has issued guidelines requiring it of Indian organisations; the EU's Cyber Resilience Act requires it of products sold in Europe; enterprise customers ask for it in due diligence. Beyond the requirement, it is what turns a vulnerability announcement from a search into a lookup.

## Beyond the inventory

Knowing what you have is the beginning. The findings need prioritising — most reported vulnerabilities are in code paths an application never calls, and reachability and exploitability analysis reduces thousands of alerts to the dozens that matter. Licences need checking, because a copyleft component in a commercial product is a problem that surfaces in due diligence. And the build pipeline itself needs securing, because supply-chain attacks increasingly target package registries, build tools and update channels rather than the code: signed artefacts, provenance and dependency pinning against SLSA levels mean that what you ship is provably what you built.

GISPL implements the full discipline — composition analysis, SBOM pipelines, vulnerability prioritisation, licence compliance, build integrity — and its mirror image for procurement: requiring and reviewing SBOMs from the software you buy. It is one of the practice areas we have invested in most, and it is where the next generation of breaches is already arriving.
