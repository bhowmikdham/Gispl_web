"""<head> assembly and JSON-LD.

Every generated page gets what no page on the site has today: a canonical URL,
an og:url, an og:image and structured data. Verified before this existed: 0 of
19 pages carried any of them, so every article shared one hardcoded og:title
("Insight — GISPL") and every LinkedIn share looked identical.

Absolute URLs matter here specifically. Canonical and og:url MUST be absolute —
a relative canonical is resolved against the current URL, which makes it a
no-op, and OG scrapers don't resolve relatives at all.
"""
import json

from .html import esc, meta, meta_prop, truncate

MAX_DESCRIPTION = 160


def absolute(base_url, path):
    """Join the site base URL with a root-relative path."""
    if not path:
        return base_url
    if path.startswith(("http://", "https://")):
        return path
    return base_url.rstrip("/") + "/" + path.lstrip("/")


def head(site, *, title, description, path, og_type="website", image=None,
         published=None, modified=None, noindex=False, extra_links=(),
         jsonld=(), prefix=""):
    """Build the <head> inner HTML for a generated page.

    `path` is the page's root-relative URL ("/insights/foo/"); the canonical is
    always built from site.baseUrl + path, never from the preview host, so a
    review deploy can never publish canonicals pointing at itself.
    """
    base = site["baseUrl"]
    canonical = absolute(base, path)
    desc = truncate(description or site.get("description", ""), MAX_DESCRIPTION)
    og_image = absolute(base, image or site.get("defaultOgImage"))

    out = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        "<title>%s</title>" % esc(title),
        meta("description", desc),
        '<link rel="canonical" href="%s">' % esc(canonical),
    ]
    out.extend(extra_links)

    out += [
        meta_prop("og:type", og_type),
        meta_prop("og:site_name", site.get("siteName")),
        meta_prop("og:title", title),
        meta_prop("og:description", desc),
        meta_prop("og:url", canonical),
        meta_prop("og:image", og_image),
        # summary_large_image only pays off when an image actually exists;
        # with none, X renders an empty box.
        meta("twitter:card", "summary_large_image" if og_image else "summary"),
    ]
    if published:
        out.append(meta_prop("article:published_time", published))
    if modified:
        out.append(meta_prop("article:modified_time", modified))
    if noindex:
        out.append(meta("robots", "noindex,follow"))

    for block in jsonld:
        if block:
            out.append('<script type="application/ld+json">%s</script>'
                       % json.dumps(block, ensure_ascii=False, separators=(",", ":")))

    return "\n".join(x for x in out if x)


# ------------------------------------------------------------------ JSON-LD

def organization(site):
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": site["baseUrl"] + "/#organization",
        "name": site["name"],
        "legalName": site.get("legalName"),
        "url": site["baseUrl"],
        "logo": absolute(site["baseUrl"], site.get("logo")),
        "description": site.get("description"),
        "email": site.get("email"),
        "telephone": site.get("phone"),
    }


def website(site):
    """WebSite + SearchAction.

    The SearchAction target must be a real page that renders results for ?q=.
    It points at /search/, which the build generates — before that existed,
    pressing Enter in site search sent every visitor to the jobs board
    regardless of what they typed.
    """
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": site["baseUrl"] + "/#website",
        "url": site["baseUrl"] + "/",
        "name": site["name"],
        "publisher": {"@id": site["baseUrl"] + "/#organization"},
        "potentialAction": {
            "@type": "SearchAction",
            "target": {"@type": "EntryPoint",
                       "urlTemplate": site["baseUrl"] + "/search/?q={search_term_string}"},
            "query-input": "required name=search_term_string",
        },
    }


def service(site, name, description, url, service_type=None):
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": name,
        "serviceType": service_type or name,
        "description": description,
        "url": url,
        "provider": {"@id": site["baseUrl"] + "/#organization"},
        "areaServed": [{"@type": "Country", "name": c}
                       for c in ("India", "Qatar", "United States")],
    }


def local_businesses(site):
    """One LocalBusiness per office.

    Street addresses are NOT on the site — contact.html lists city and
    timezone only — so addressLocality/addressCountry are all that can honestly
    be asserted. Google tolerates a partial PostalAddress; inventing a street
    to fill the schema would be worse than omitting it.
    """
    out = []
    for office in site.get("offices", []):
        out.append({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "%s/#office-%s" % (site["baseUrl"], office["city"].lower().replace(" ", "-")),
            "name": "%s — %s" % (site["name"], office["city"]),
            "parentOrganization": {"@id": site["baseUrl"] + "/#organization"},
            "url": site["baseUrl"] + "/contact.html",
            "telephone": site.get("phone"),
            "email": site.get("email"),
            "address": {
                "@type": "PostalAddress",
                "addressLocality": office["city"],
                "addressRegion": office.get("region"),
                "addressCountry": office["country"],
            },
        })
    return out


def faq_page(qa_pairs):
    """FAQPage from the question/answer pairs already on the page.

    Only ever built from real on-page content: Google requires the marked-up
    answer to be visible to the user, and a mismatch is a manual-action risk.
    """
    if not qa_pairs:
        return None
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in qa_pairs
        ],
    }


def breadcrumbs(site, trail):
    """trail: [(name, path), ...] ending with the current page."""
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name,
             "item": absolute(site["baseUrl"], path)}
            for i, (name, path) in enumerate(trail)
        ],
    }


def blog_posting(site, post, url, author_name, image=None):
    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post["title"],
        "description": post.get("excerpt"),
        "datePublished": post["publishedIso"],
        "dateModified": post.get("modifiedIso") or post["publishedIso"],
        "author": {"@type": "Organization", "name": author_name},
        "publisher": {"@id": site["baseUrl"] + "/#organization"},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "url": url,
    }
    if image:
        data["image"] = absolute(site["baseUrl"], image)
    if post.get("categoryName"):
        data["articleSection"] = post["categoryName"]
    if post.get("tags"):
        data["keywords"] = ", ".join(post["tags"])
    return data


# Google matches these exactly; the site's display strings ("Full-time · Shifts",
# "Internship · 10 wks") are not valid values, so they are mapped, not passed.
EMPLOYMENT_TYPES = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    "contract": "CONTRACTOR",
    "internship": "INTERN",
    "intern": "INTERN",
    "temporary": "TEMPORARY",
}


def employment_type(display):
    low = (display or "").lower()
    for key, value in EMPLOYMENT_TYPES.items():
        if key in low:
            return value
    return "OTHER"


def job_posting(site, role, url, description_html):
    """JobPosting — this is what makes roles eligible for Google Jobs.

    validThrough is not optional in practice: without it Google keeps showing
    a role indefinitely, including after it is filled.
    """
    data = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": role["title"],
        "description": description_html,
        "datePosted": role["postedIso"],
        "employmentType": employment_type(role.get("employmentType")),
        "hiringOrganization": {"@id": site["baseUrl"] + "/#organization"},
        "url": url,
        "identifier": {"@type": "PropertyValue", "name": site["name"],
                       "value": role["slug"]},
    }
    if role.get("validThrough"):
        data["validThrough"] = role["validThrough"]

    # "Remote · India" is a display string, not a city. Split the two: a
    # remote role needs jobLocationType plus applicantLocationRequirements,
    # and Google rejects a jobLocation whose address is the word "Remote".
    location = (role.get("location") or "").strip()
    if role.get("remote"):
        data["jobLocationType"] = "TELECOMMUTE"
        country = location.split("·")[-1].strip() or "India"
        data["applicantLocationRequirements"] = {"@type": "Country", "name": country}
    else:
        data["jobLocation"] = {
            "@type": "Place",
            "address": {"@type": "PostalAddress",
                        "addressLocality": location,
                        "addressCountry": "QA" if location == "Doha" else "IN"},
        }
    return data
