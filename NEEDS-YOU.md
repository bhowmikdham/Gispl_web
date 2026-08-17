# Needs you

Things the website work is blocked on that only a human at GISPL can supply or
decide. Everything else has been decided and built — see the commit log on
`claude/website-brand-image-dklsyy`.

Nothing here blocks the site from going live. Each item makes it better or
removes an assumption.

---

## 1. A photograph of Dr. Naveen Dham — *assets*

**Where:** About page, leadership section.

The site previously showed four **fictional** people as leadership ("Rajesh
Kumar, Founder & CEO", "Aisha Rahman", "Vikram Nair", "Meera Iyer"). They are
gone, replaced with the real founder and his real credentials from the company
portfolio.

The portrait is currently a navy gradient with an **ND** monogram. That reads as
deliberate rather than broken, but a real photograph would carry far more weight
on the one page where a prospect goes to decide whether to trust the firm.

**To fix:** drop a photo at `assets/images/naveen-dham.jpg` (portrait
orientation, ideally 2:3 or squarer, min 660px wide) and the monogram block can
be swapped for an `<img>`.

---

## 2. Is the site's AI assistant the "world's first"? — *decision*

**Where:** the chat widget bottom-right on every page (`assets/js/assistant.js`),
currently labelled "GISPL Assistant / Guided answers · replies instantly".

The portfolio's single biggest media claim is the launch of **the world's first
AI assistant for cybersecurity consulting**, covered by ANI and syndicated across
153+ publications. That is a genuinely strong brand asset.

The site *has* an AI assistant widget. But I could not verify that this
KB-driven site chatbot is the same product the portfolio means, so I did **not**
label it "world's first". Overclaiming on a page that sells trust is worse than
underclaiming. The launch is instead stated as a coverage fact on the About page.

**To decide:** if this widget *is* that product, say so and it gets branded
accordingly. If the "world's first AI assistant" is a separate product, it
probably deserves its own page.

---

## 3. Client logo assets — *assets, optional*

**Where:** homepage "Trusted by security teams at" marquee.

The marquee now uses real client names from the portfolio (Bajaj Finserv, Central
Bank of India, Panasonic, HAL, DMI Finance, Max Healthcare, InterGlobe, Punjab &
Sind Bank, Wipro Infotech, Zomato Payments, BHEL, Punj Lloyd) as text wordmarks,
replacing four repeating placeholders.

Text is consistent with the existing design and safe. Real logo marks would look
stronger — **but** check you hold permission to display each client's mark. Some
engagement contracts forbid it, and for defence and government clients it may be
prohibited outright.

**To decide:** supply SVG/PNG marks for clients you are contractually clear to
name visually, or leave as wordmarks.

---

## 4. Confirm the contact details — *verification*

Taken from the company portfolio and now live sitewide:

| Field | Value |
|---|---|
| Phone | 1800 212 676767 (you confirmed this) |
| Email | info@gisconsulting.in |
| Careers | careers@gisconsulting.in |

The previous `@gispl.com` addresses were **dead**. The parallel session verified
by DNS that `gispl.com` is not GISPL's domain: no MX records, SPF `v=spf1 -all`,
nameservers on `forsale.hugedomainsdns.com`, serving a HugeDomains for-sale page.
Every contact form, newsletter signup and CV submission on the site was
terminating in nothing.

**Worth acting on:** anyone who buys `gispl.com` inherits a domain that job
applicants were being told to email CVs to. Consider acquiring it defensively, or
at minimum confirm no live mail flow still points there.

Also removed: the site claimed offices in **Doha** and **Delhi**. Neither appears
in the portfolio. The five real offices (Gurgaon HQ, Dubai, Germantown MD, Whitby
ON, Jimboomba QLD) are now on the Contact page with real addresses, phone numbers
and live timezone clocks. **Confirm Doha and Delhi are genuinely not offices** —
if either is, it needs adding back.

---

## 5. Assumptions I made without you — *review*

Decided on your instruction not to wait. Each is reversible.

- **"CERT-IN certified" → "CERT-IN empanelled"** sitewide. CERT-In grants
  empanelment; it does not certify. The old wording was factually wrong.
- **Track record numbers** raised from "200+ engagements" to the portfolio's real
  figures: 10,000+ security testing projects, 5,000+ compliance audits, 2,000+
  forensic investigations, 30+ government ministries. The site was underselling
  the firm by roughly 50x.
- **Header lockup** changed from `PROTECT · COMPLY · GROW` to
  `CYBERSECURITY · COMPLIANCE · FORENSICS`. The old triad was generic, "grow" is
  not why anyone buys security, and forensics — 2,000+ investigations — was
  invisible in the one place a first-time visitor looks.
- **"Building the architecture of enterprise trust"** is now the positioning line
  (About h1, homepage client band, both `og:title`s). "Security is a promise we
  keep" was kept, moved into the About lead paragraph.
- **Era claims** corrected to "Since 2012". The site said "15+ years"; founding
  was 2012, which is fourteen years.
- **Capability count** 39 → 59, adding SEBI, IRDAI, ISO 42001, ISO 27701,
  IEC 62443, TISAX, NIST CSF, ITGC, MDR, SIEM/DLP and resource augmentation — a
  whole service line the site never mentioned.
- **DPDP programme** expanded from 4 steps to the portfolio's 8 workstreams. Data
  discovery and vendor compliance were missing entirely.
- **Education & Hospitality** added as a sixth industry sector.

---

## 6. Name a Grievance Officer — *decision, and the most urgent one*

**Where:** `privacy.html`, "Grievance officer" section.

The page was rendering the literal text **"[Name], Grievance Officer"** and
**"[registered address]"** to visitors. That is now role-addressed ("The
Grievance Officer") with the real Gurgaon corporate address filled in, so nothing
embarrassing is on the page — but a **named individual is still missing**.

Why this one matters more than the rest: the DPDP Act requires a Data Fiduciary to
publish its Grievance Officer's contact details, and GISPL *sells DPDP
readiness*. A prospect doing diligence who finds a placeholder on the privacy
policy of a firm that audits privacy compliance draws one conclusion, and it is
not a good one.

I did not invent a name — fabricating a legal contact is not a judgement call I
should make.

**To fix:** give me the officer's name and direct contact, and confirm the
registered office address matches your filings. Both `privacy.html` and
`terms.html` also still carry `<!-- DRAFT: have counsel review before launch -->`
markers, which should stay until counsel has actually reviewed them.

---

## 7. From the parallel session — *its blockers, folded in*

The other agent finished and went idle at `85839c4`, reporting four blockers. One
of them ("copy") turned out to be in my lane and is now **resolved**: all twelve
role files under `content/roles/` had seeded placeholder bodies ending "(Seed
description — edit in the admin.)" and now carry real copy. Five of them were also
advertising jobs in Doha and Delhi; those moved to Dubai and Gurgaon.

Its three remaining blockers need you:

- **GA4 measurement ID** — analytics is wired but has no property to report to.
- **AWS SES** — the new `site-api` captures form submissions but cannot send
  notification email until SES is configured and out of sandbox. Nothing was
  deployed and no live email was sent; see `site-api/README.md`.
- **Grievance officer** — the same item as section 6 above.

---

## 8. Permissions, for next time

This repo had no `.claude/settings.json`, so every outward-facing action (git
push, cross-agent messaging) escalated to a prompt even in auto mode. A proposed
allowlist — push to the feature branch only, with force-push, push-to-main,
`git reset --hard`, `aws`, `sam deploy` and `npm publish` explicitly denied — was
handed over in chat. An agent cannot install its own permission file, by design.
