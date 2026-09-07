"""The service catalogue and the industries, as data.

content/practices/*.md     five practice areas         -> /services/<practice>/
content/capabilities/*.md  one file per capability    -> /services/<slug>/
content/industries/*.md    one file per sector        -> /industries/<slug>/

Three consumers read this: scripts/build-content.py (renders the pages),
scripts/apply-capability-index.py (stamps the chip explorer on services.html
and the mega-menu list in site.js) and scripts/check-content.py (validates).
They share one loader so the chip a visitor clicks, the page it opens and the
entry the mega-menu shows are provably the same record. Before this, the
mega-menu carried 39 hand-typed names and the services page 59, and the two
had already drifted ("Data Protection Act" vs "DPDP Act 2023").

A capability that already has a hand-maintained page (VAPT, AI security, SEBI
CSCRF, DPDP) sets `page:` and gets no generated page — the chip links to the
existing one. Everything else is rendered from its Markdown.
"""
import io
import os

from . import frontmatter

PRACTICES = "practices"
CAPABILITIES = "capabilities"
INDUSTRIES = "industries"


def _load(content_dir, name):
    path = os.path.join(content_dir, name)
    items = {}
    if not os.path.isdir(path):
        return items
    for filename in sorted(os.listdir(path)):
        if not filename.endswith(".md"):
            continue
        meta, body = frontmatter.load(os.path.join(path, filename))
        slug = meta.get("slugOverride") or filename[:-3]
        items[slug] = (meta, body)
    return items


def load_catalogue(content_dir):
    """Return (practices, capabilities, industries) — lists of dicts, sorted
    the way the site shows them, drafts excluded."""
    practices = []
    for slug, (meta, body) in _load(content_dir, PRACTICES).items():
        if meta.get("status", "published") == "draft":
            continue
        practices.append({
            "slug": slug,
            "title": meta.get("title", slug),
            "short": meta.get("short") or meta.get("title", slug),
            "order": int(meta.get("order", 99)),
            "lead": meta.get("lead", ""),
            "intro": meta.get("intro") or meta.get("lead", ""),
            "icon": meta.get("icon", ""),
            "proof": meta.get("proof") or [],
            "steps": meta.get("steps") or [],
            "seo": meta.get("seo") or {},
            "status": meta.get("status", "published"),
            "url": "/services/%s/" % slug,
            "body": body,
            "capabilities": [],
        })
    practices.sort(key=lambda p: (p["order"], p["title"]))
    by_practice = {p["slug"]: p for p in practices}

    capabilities = []
    for slug, (meta, body) in _load(content_dir, CAPABILITIES).items():
        if meta.get("status", "published") == "draft":
            continue
        practice = by_practice.get(meta.get("practice"))
        page = meta.get("page")
        cap = {
            "slug": slug,
            "title": meta.get("title", slug),
            "label": meta.get("label") or meta.get("title", slug),
            "practice": meta.get("practice", ""),
            "practiceTitle": practice["title"] if practice else "",
            "practiceShort": practice["short"] if practice else "",
            "practiceUrl": practice["url"] if practice else "/services/",
            "order": int(meta.get("order", 99)),
            "tagline": meta.get("tagline", ""),
            "summary": meta.get("summary", ""),
            "page": page,
            # Hand-maintained pages sit at the root; generated ones under /services/.
            "url": ("/" + page.lstrip("/")) if page else "/services/%s/" % slug,
            "generated": not page,
            "facts": meta.get("facts") or [],
            "appliesTo": meta.get("appliesTo") or [],
            "stakes": meta.get("stakes") or [],
            "steps": meta.get("steps") or [],
            "deliverables": meta.get("deliverables") or [],
            "faq": meta.get("faq") or [],
            "related": meta.get("related") or [],
            "industries": meta.get("industries") or [],
            "insights": meta.get("insights") or [],
            "icon": meta.get("icon") or (practice["icon"] if practice else ""),
            "seo": meta.get("seo") or {},
            "noindex": bool((meta.get("seo") or {}).get("noindex")),
            "status": meta.get("status", "published"),
            "body": body,
        }
        capabilities.append(cap)
        if practice:
            practice["capabilities"].append(cap)
    capabilities.sort(key=lambda c: (
        by_practice[c["practice"]]["order"] if c["practice"] in by_practice else 99,
        c["order"], c["title"]))
    for p in practices:
        p["capabilities"].sort(key=lambda c: (c["order"], c["title"]))

    industries = []
    for slug, (meta, body) in _load(content_dir, INDUSTRIES).items():
        if meta.get("status", "published") == "draft":
            continue
        industries.append({
            "slug": slug,
            "title": meta.get("title", slug),
            "short": meta.get("short") or meta.get("title", slug),
            "kicker": meta.get("kicker") or meta.get("short") or "",
            "order": int(meta.get("order", 99)),
            "lead": meta.get("lead", ""),
            "summary": meta.get("summary", ""),
            "regulators": meta.get("regulators") or [],
            "facts": meta.get("facts") or [],
            "challenges": meta.get("challenges") or [],
            "capabilities": meta.get("capabilities") or [],
            "clients": meta.get("clients") or [],
            "proof": meta.get("proof") or [],
            "faq": meta.get("faq") or [],
            "insights": meta.get("insights") or [],
            "icon": meta.get("icon", ""),
            "seo": meta.get("seo") or {},
            "noindex": bool((meta.get("seo") or {}).get("noindex")),
            "status": meta.get("status", "published"),
            "url": "/industries/%s/" % slug,
            "body": body,
        })
    industries.sort(key=lambda i: (i["order"], i["title"]))

    return practices, capabilities, industries
