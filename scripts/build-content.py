#!/usr/bin/env python3
"""Render content/ into real static HTML under build/.

    .venv/bin/python scripts/build-content.py
    .venv/bin/python scripts/build-content.py --base-path /Gispl_web   # nested host

Emits:
    build/insights/index.html                 replaces insights.html
    build/insights/<slug>/index.html          replaces article.html?slug=
    build/insights/category/<slug>/index.html new — indexable category pages
    build/insights/author/<slug>/index.html   new
    build/insights/rss.xml                    new
    build/careers/roles/index.html            replaces roles.html
    build/careers/roles/<slug>/index.html     replaces job.html?slug=
    build/sitemap.xml                         new
    build/assets/data/{search-index,insights,roles}.json

Output goes to a git-ignored build/, never into the repo root: committing
generated HTML would put a merge conflict on every CMS commit.

Nothing here touches the 15 hand-written pages. Phase 3 wires build/ into
dist/ and retires the pages these replace.
"""
from __future__ import print_function

import io
import json
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import yaml  # noqa: E402

from lib import dates, feeds, frontmatter, markdown_render, readtime, seo, templates  # noqa: E402
from lib.html import esc  # noqa: E402
from lib.pageshell import ShellDriftError, activate, donor_shell, rebase  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
BUILD = os.path.join(ROOT, "build")

# Pages the content build now owns. Any link to the old URL in an injected
# shell is rewritten to the new one.
ROUTES = {
    "insights.html": "/insights/",
    "roles.html": "/careers/roles/",
}

NAV_INSIGHTS = "insights.html"
NAV_CAREERS = "careers.html"

RFC822_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
RFC822_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def rfc822(value):
    d = dates.parse(value)
    return "%s, %02d %s %d %02d:%02d:%02d +0530" % (
        RFC822_DAYS[d.weekday()], d.day, RFC822_MONTHS[d.month - 1], d.year,
        d.hour, d.minute, d.second)


def load_yaml(path):
    with io.open(path, encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def load_collection(name):
    path = os.path.join(CONTENT, name)
    items = {}
    if not os.path.isdir(path):
        return items
    for filename in sorted(os.listdir(path)):
        if not filename.endswith(".md"):
            continue
        meta, body = frontmatter.load(os.path.join(path, filename))
        stem = filename[:-3]
        slug = meta.get("slugOverride")
        if not slug:
            slug = stem[11:] if (name == "posts" and len(stem) > 11) else stem
        items[slug] = (meta, body)
    return items


def write(path, text):
    d = os.path.dirname(path)
    if not os.path.isdir(d):
        os.makedirs(d)
    with io.open(path, "w", encoding="utf-8") as fh:
        fh.write(text)


def page(shell, site, head_html, body_html, nav_href, prefix):
    """Assemble a full page from the donor shell plus a rendered body."""
    header = activate(shell.header, nav_href)
    inherited = "\n".join(shell.head_links)
    scripts = "\n".join(shell.scripts)
    html = (
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n%s\n%s\n</head>\n<body>\n"
        '<a class="gx-skip" href="#gx-main">Skip to content</a>\n'
        "%s\n%s\n%s\n%s\n</body>\n</html>\n"
        % (head_html, inherited, header, body_html, shell.footer, scripts)
    )
    return rebase(html, ROUTES, prefix)


def main():
    argv = sys.argv[1:]
    prefix = ""
    if "--base-path" in argv:
        prefix = argv[argv.index("--base-path") + 1].rstrip("/")

    site = load_yaml(os.path.join(CONTENT, "site.yml"))

    # og:image goes on every page, so a missing default is a dangling reference
    # site-wide — scrapers fetch it and fail, which is worse than no tag.
    og_default = site.get("defaultOgImage")
    if og_default and not os.path.exists(os.path.join(ROOT, og_default.lstrip("/"))):
        print("ERROR: defaultOgImage %s does not exist.\n"
              "  Run: .venv/bin/python scripts/make-og-image.py" % og_default,
              file=sys.stderr)
        return 1

    try:
        shell = donor_shell(ROOT)
    except ShellDriftError as e:
        print("ERROR: cannot build — the shared header has drifted.\n", file=sys.stderr)
        print(e, file=sys.stderr)
        return 1

    posts_raw = load_collection("posts")
    roles_raw = load_collection("roles")
    authors_raw = load_collection("authors")
    cats_raw = load_collection("categories")

    if os.path.isdir(BUILD):
        shutil.rmtree(BUILD)

    # NOTE: internal URLs below are plain root-absolute. The --base-path prefix
    # for nested hosts is applied once, at the end, by rebase() in page(). Adding
    # it here too produced /Gispl_web/Gispl_web/... — prefix in exactly one place.
    categories = {}
    for slug, (meta, body) in cats_raw.items():
        categories[slug] = {"slug": slug, "name": meta.get("name", slug),
                            "url": "/insights/category/%s/" % slug,
                            "description": body.strip(),
                            "status": meta.get("status", "published")}

    authors = {}
    for slug, (meta, body) in authors_raw.items():
        authors[slug] = {"slug": slug, "name": meta.get("name", slug),
                         "role": meta.get("role", ""), "bio": body.strip(),
                         "url": "/insights/author/%s/" % slug}

    # ---------------------------------------------------------------- posts
    posts = []
    for slug, (meta, body) in posts_raw.items():
        status = meta.get("status", "published")
        if status == "draft":
            continue
        cat = categories.get(meta.get("category"), {})
        author = authors.get(meta.get("author"), {})
        minutes = meta.get("readTimeMinutesOverride") or readtime.minutes(body)
        posts.append({
            "slug": slug,
            "title": meta.get("title", slug),
            "excerpt": meta.get("excerpt", ""),
            "category": meta.get("category", ""),
            "categoryName": cat.get("name", ""),
            "categoryUrl": cat.get("url", "/insights/"),
            "author": meta.get("author", ""),
            "authorName": author.get("name", ""),
            "authorUrl": author.get("url", ""),
            "tags": meta.get("tags") or [],
            "status": status,
            "archived": status == "archived",
            "noindex": bool((meta.get("seo") or {}).get("noindex")),
            "seo": meta.get("seo") or {},
            "cover": meta.get("cover") or {},
            "featured": bool(meta.get("featured")),
            "publishedAt": meta["publishedAt"],
            "publishedIso": dates.iso_datetime(meta["publishedAt"]),
            "publishedDate": dates.iso_date(meta["publishedAt"]),
            "dateLabel": dates.label(meta["publishedAt"]),
            "updatedLabel": dates.label(meta["updatedAt"]) if meta.get("updatedAt") else None,
            "modifiedIso": dates.iso_datetime(meta["updatedAt"]) if meta.get("updatedAt") else None,
            "readTime": "%d MIN READ" % minutes,
            "rfc822": rfc822(meta["publishedAt"]),
            "url": "/insights/%s/" % slug,
            "body": body,
        })
    posts.sort(key=lambda p: p["publishedAt"], reverse=True)
    listed = [p for p in posts if not p["archived"] and not p["noindex"]]

    # ---------------------------------------------------------------- roles
    roles = []
    for slug, (meta, body) in roles_raw.items():
        status = meta.get("status", "published")
        if status == "draft":
            continue
        roles.append({
            "slug": slug,
            "title": meta.get("title", slug),
            "team": meta.get("team", ""),
            "location": meta.get("location", ""),
            "employmentType": meta.get("employmentType", ""),
            "remote": bool(meta.get("remote")),
            "status": status,
            "archived": status == "archived",
            "noindex": bool((meta.get("seo") or {}).get("noindex")),
            "seo": meta.get("seo") or {},
            "applyEmail": meta.get("applyEmail", ""),
            "responsibilities": meta.get("responsibilities") or [],
            "requirements": meta.get("requirements") or [],
            "postedAt": meta["postedAt"],
            "postedIso": dates.iso_datetime(meta["postedAt"]),
            "validThrough": (dates.iso_date(meta["validThrough"])
                             if meta.get("validThrough") else None),
            "url": "/careers/roles/%s/" % slug,
            "body": body,
        })
    roles.sort(key=lambda r: r["postedAt"], reverse=True)
    open_roles = [r for r in roles if not r["archived"]]

    org = seo.organization(site)
    sitemap_entries = []
    n = {"pages": 0}

    def emit(path_url, head_html, body_html, nav, sitemap=None):
        out = os.path.join(BUILD, path_url.strip("/"), "index.html")
        write(out, page(shell, site, head_html, body_html, nav, prefix))
        n["pages"] += 1
        if sitemap:
            sitemap_entries.append(sitemap)

    # ----------------------------------------------------- insights listing
    emit("/insights/",
         seo.head(site, title="%s — %s" % (site["insights"]["title"], site["name"]),
                  description=site["insights"]["intro"], path="/insights/",
                  jsonld=[org, seo.breadcrumbs(site, [("Home", "/"),
                                                      ("Insights", "/insights/")])],
                  extra_links=['<link rel="alternate" type="application/rss+xml" '
                               'title="GISPL Insights" href="%s">'
                               % "/insights/rss.xml"]),
         templates.insights_index(site, listed, list(categories.values()),
                                  base="/insights/"),
         NAV_INSIGHTS,
         {"path": "/insights/", "changefreq": "weekly", "priority": "0.8"})

    # ------------------------------------------------------- article pages
    for post in posts:
        body_html, _ = markdown_render.render(post["body"])
        related = [p for p in listed
                   if p["slug"] != post["slug"] and p["category"] == post["category"]][:3]
        if len(related) < 3:
            related += [p for p in listed
                        if p["slug"] != post["slug"] and p not in related][:3 - len(related)]

        url_abs = seo.absolute(site["baseUrl"], "/insights/%s/" % post["slug"])
        head = seo.head(
            site,
            title=post["seo"].get("title") or "%s — %s Insights" % (post["title"], site["name"]),
            description=post["seo"].get("description") or post["excerpt"],
            path="/insights/%s/" % post["slug"],
            og_type="article",
            image=(post["cover"] or {}).get("src"),
            published=post["publishedIso"],
            modified=post["modifiedIso"],
            noindex=post["noindex"] or post["archived"],
            jsonld=[
                seo.blog_posting(site, post, url_abs, post["authorName"],
                                 (post["cover"] or {}).get("src")),
                seo.breadcrumbs(site, [("Home", "/"), ("Insights", "/insights/"),
                                       (post["title"], "/insights/%s/" % post["slug"])]),
            ],
        )
        emit("/insights/%s/" % post["slug"], head,
             templates.article_page(site, post, body_html, related), NAV_INSIGHTS,
             None if (post["noindex"] or post["archived"]) else
             {"path": "/insights/%s/" % post["slug"],
              "lastmod": post.get("modifiedIso") or post["publishedDate"],
              "changefreq": "monthly", "priority": "0.7"})

    # ------------------------------------------------------ category pages
    for slug, cat in sorted(categories.items()):
        in_cat = [p for p in listed if p["category"] == slug]
        emit("/insights/category/%s/" % slug,
             seo.head(site, title="%s — %s Insights" % (cat["name"], site["name"]),
                      description=cat["description"] or
                      "%s articles from the GISPL team." % cat["name"],
                      path="/insights/category/%s/" % slug,
                      jsonld=[seo.breadcrumbs(site, [
                          ("Home", "/"), ("Insights", "/insights/"),
                          (cat["name"], "/insights/category/%s/" % slug)])]),
             templates.insights_index(site, in_cat, list(categories.values()),
                                      active=cat["name"],
                                      heading_override=cat["name"],
                                      intro_override=cat["description"],
                                      base="/insights/"),
             NAV_INSIGHTS,
             {"path": "/insights/category/%s/" % slug, "changefreq": "weekly",
              "priority": "0.5"} if in_cat else None)

    # -------------------------------------------------------- author pages
    for slug, author in sorted(authors.items()):
        by = [p for p in listed if p["author"] == slug]
        emit("/insights/author/%s/" % slug,
             seo.head(site, title="%s — %s Insights" % (author["name"], site["name"]),
                      description=author["bio"] or
                      "Articles by %s." % author["name"],
                      path="/insights/author/%s/" % slug,
                      jsonld=[{"@context": "https://schema.org", "@type": "Person",
                               "name": author["name"], "jobTitle": author["role"],
                               "description": author["bio"],
                               "url": seo.absolute(site["baseUrl"],
                                                   "/insights/author/%s/" % slug)}]),
             templates.insights_index(site, by, list(categories.values()),
                                      heading_override=author["name"],
                                      intro_override=author["bio"],
                                      base="/insights/"),
             NAV_INSIGHTS,
             {"path": "/insights/author/%s/" % slug, "changefreq": "monthly",
              "priority": "0.3"} if by else None)

    # --------------------------------------------------------- roles board
    teams = sorted(set(r["team"] for r in open_roles if r["team"]))
    locations = sorted(set(r["location"] for r in open_roles if r["location"]))
    types = sorted(set(r["employmentType"] for r in open_roles if r["employmentType"]))

    emit("/careers/roles/",
         seo.head(site, title="%s — %s" % (site["roles"]["title"], site["name"]),
                  description=site["roles"]["intro"], path="/careers/roles/",
                  jsonld=[seo.breadcrumbs(site, [("Home", "/"),
                                                 ("Careers", "/careers.html"),
                                                 ("Open roles", "/careers/roles/")])]),
         templates.roles_index(site, open_roles, teams, locations, types),
         NAV_CAREERS,
         {"path": "/careers/roles/", "changefreq": "daily", "priority": "0.8"})

    for role in roles:
        body_html, _ = markdown_render.render(role["body"])
        url_abs = seo.absolute(site["baseUrl"], "/careers/roles/%s/" % role["slug"])
        head = seo.head(
            site,
            title=role["seo"].get("title") or "%s — Careers at %s" % (role["title"], site["name"]),
            description=role["seo"].get("description")
            or markdown_render.plain_text(role["body"], 160),
            path="/careers/roles/%s/" % role["slug"],
            noindex=role["noindex"] or role["archived"],
            jsonld=[seo.job_posting(site, role, url_abs, body_html),
                    seo.breadcrumbs(site, [("Home", "/"), ("Careers", "/careers.html"),
                                           ("Open roles", "/careers/roles/"),
                                           (role["title"],
                                            "/careers/roles/%s/" % role["slug"])])],
        )
        emit("/careers/roles/%s/" % role["slug"], head,
             templates.job_page(site, role, body_html), NAV_CAREERS,
             None if (role["noindex"] or role["archived"]) else
             {"path": "/careers/roles/%s/" % role["slug"],
              "lastmod": dates.iso_date(role["postedAt"]),
              "changefreq": "weekly", "priority": "0.6"})

    # ------------------------------------------------------------- data + feeds
    data_dir = os.path.join(BUILD, "assets", "data")

    def public(p):
        return {k: p[k] for k in ("slug", "title", "excerpt", "url", "categoryName",
                                  "readTime", "dateLabel", "publishedDate")}

    write(os.path.join(data_dir, "insights.json"),
          json.dumps([public(p) for p in listed], ensure_ascii=False, indent=1))
    write(os.path.join(data_dir, "roles.json"),
          json.dumps([{k: r[k] for k in ("slug", "title", "team", "location",
                                         "employmentType", "url", "postedAt")}
                      for r in open_roles], ensure_ascii=False, indent=1))

    index = []
    for p in listed:
        index.append({"t": p["title"], "h": p["url"], "ty": "Insight",
                      "s": p["categoryName"],
                      "k": " ".join([p["excerpt"], p["categoryName"]] + p["tags"])})
    for r in open_roles:
        index.append({"t": r["title"], "h": r["url"], "ty": "Role", "s": r["team"],
                      "k": " ".join([r["team"], r["location"], r["employmentType"]])})
    pages_yml = os.path.join(CONTENT, "pages.yml")
    if os.path.exists(pages_yml):
        for entry in load_yaml(pages_yml) or []:
            index.append({"t": entry["title"], "h": entry["href"], "ty": "Page",
                          "s": "", "k": entry.get("keywords", "")})
    write(os.path.join(data_dir, "search-index.json"),
          json.dumps({"v": 1, "items": index}, ensure_ascii=False, indent=1))

    write(os.path.join(BUILD, "insights", "rss.xml"), feeds.rss(site, listed[:20]))

    for path in ("/", "/services.html", "/service-vapt.html", "/service-ai-security.html",
                 "/vapt-methodology.html", "/sebi-cscrf.html", "/dpdp-readiness.html",
                 "/industries.html", "/about.html", "/careers.html", "/contact.html"):
        sitemap_entries.insert(0 if path == "/" else len(sitemap_entries),
                               {"path": path, "changefreq": "monthly",
                                "priority": "1.0" if path == "/" else "0.6"})
    write(os.path.join(BUILD, "sitemap.xml"), feeds.sitemap(site, sitemap_entries))

    print("build/ — %d pages, %d sitemap entries, %d search items"
          % (n["pages"], len(sitemap_entries), len(index)))
    print("  insights: %d published (%d listed) · roles: %d open of %d"
          % (len(posts), len(listed), len(open_roles), len(roles)))
    if prefix:
        print("  base path: %s" % prefix)
    return 0


if __name__ == "__main__":
    sys.exit(main())
