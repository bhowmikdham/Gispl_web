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

## 3. Permission to display the client logos — *decision*

**Where:** homepage, "A few of the organisations we secure".

The homepage now runs **28 real client logos**, extracted from the company
portfolio and normalised: EY, NTT, LIC, POWERGRID, IFFCO, GeM, Aaj Tak, Bajaj
Finserv, Central Bank of India, Punjab & Sind Bank, IFCI, AMTRON, DCHL, TAAI,
J.K. Organisation, and the BFSI depth behind them. The navy text marquee above it
is unchanged.

**What needs deciding:** whether GISPL holds the right to display each mark. Some
engagement contracts forbid naming a client at all, let alone reproducing their
logo. This is the one thing about the marquee I could not settle.

**Fifteen logos were deliberately left out**, and you may want to overrule that:

- **All government and defence emblems** — the four ministries, CISF, CAPF, SSB,
  the state emblems, GST, and the US Air Force seal. India's State Emblem of India
  (Prohibition of Improper Use) Act 2005 restricts commercial use of the
  Ashoka-lions emblem that appears in the ministry marks, and the US DoD restricts
  use of its seals in any way implying endorsement. A firm selling compliance is a
  poor defendant on that point. The government relationships are already stated in
  prose by the homepage "Cleared for the work that cannot fail" section, which
  names the same organisations at far lower risk.
- **Save Solutions** — white ink on transparent, invisible on the light band.
- **Four emblems** that could not be identified; they are named
  `UNIDENTIFIED-emblem-x<ref>.png` rather than guessed at, in
  `assets/images/clients/`.

All 43 raw extracts are kept in `assets/images/clients/`, the 28 web-ready ones in
`assets/images/clients/web/`. Higher-resolution official press-kit files would
still be an upgrade — 27 of the 43 sources are under 100px tall.

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
- **Careers testimonials** were attributed to two invented employees ("Arjun Mehta",
  "Fatima Al-Kuwari"). Now attributed by role and practice only. If these quotes
  came from real colleagues, give me their names and I will restore proper
  attribution; if you would rather drop the quotes entirely, say so.
- **Twelve job descriptions** were placeholder text and now carry real copy. Read
  them before the roles go live — I wrote them from the portfolio, so they are
  accurate about GISPL but I invented nothing about salary, benefits or reporting
  lines. Five roles also moved off Doha and Delhi.

---

## 6. The review site cannot deploy this branch — *4 clicks*

The GitHub Pages `github-pages` environment has a **Deployment branches** rule that
permits only `claude/website-audit-plan-fe8651`. Every run from any other branch
fails: the `deploy` job is rejected in about two seconds, records no steps, and
has no logs to download. It is not a build failure — build and both API test
suites pass first.

That is why the live review site shows the corrected text marquee but no client
logos: it was last published from an allowed branch at `b59df5f`, which predates
the logo work by four commits.

**To fix:** Settings → Environments → `github-pages` → Deployment branches → add
`claude/website-brand-image-dklsyy`, or switch to "All branches". Then re-run the
Preview workflow. This also unblocks `claude/website-audit-plan-fe8651-40hly6`,
which has never successfully deployed either.

**Alternative:** authorise a push of this branch's state onto
`claude/website-audit-plan-fe8651`, the one branch that does deploy. Not done
unprompted — pushing to a branch other than the assigned one needs an explicit
say-so.

---

## 7. Name a Grievance Officer — *decision, and the most urgent one*

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

## 8. From the parallel session — *its blockers, folded in*

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

## 9. Permissions, for next time

This repo had no `.claude/settings.json`, so every outward-facing action (git
push, cross-agent messaging) escalated to a prompt even in auto mode. A proposed
allowlist — push to the feature branch only, with force-push, push-to-main,
`git reset --hard`, `aws`, `sam deploy` and `npm publish` explicitly denied — was
handed over in chat. An agent cannot install its own permission file, by design.
