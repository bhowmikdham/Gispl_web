#!/usr/bin/env python3
"""Validate everything under content/ before it can be built or published.

    python3 scripts/check-content.py            # errors fail, warnings inform
    python3 scripts/check-content.py --strict    # warnings fail too (CI)

Why an allowlist rather than "check the fields we know about": a typo'd key is
the classic way CMS content rots. `pubishedAt: 2026-08-01` parses as perfectly
valid YAML, gets ignored, and the post silently publishes with the wrong date —
or not at all. Unknown keys are errors here, so the typo surfaces at commit
time instead of in a reader's search result.

Alt text is likewise an error, not a warning. A cover image with no alt is
inaccessible and, once a hundred posts exist, nobody goes back to fix them.
"""
from __future__ import print_function

import io
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib import dates, frontmatter, readtime  # noqa: E402
from lib.slug import is_reserved, is_valid  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")


def _content_dir(argv):
    """Allow --content DIR so the checker can be run against a fixture tree."""
    if "--content" in argv:
        return os.path.abspath(argv[argv.index("--content") + 1])
    return CONTENT

STATUSES = ("draft", "published", "archived")
MAX_DESCRIPTION = 160
MAX_SEO_TITLE = 60
MIN_ALT = 5
THIN_POST_WORDS = 150

DANGEROUS = ("<script", "<iframe", "javascript:", "onerror=", "onload=")

SEED_MARKERS = ("Seed article body", "Seed description", "edit in the admin",
                "replace with the full post")

# collection -> (dir, required fields, optional fields)
COLLECTIONS = {
    "posts": (
        "posts",
        ("title", "excerpt", "category", "author", "status", "publishedAt"),
        ("tags", "updatedAt", "featured", "cover", "seo", "readTimeMinutesOverride",
         "slugOverride"),
    ),
    "roles": (
        "roles",
        ("title", "team", "location", "employmentType", "status", "postedAt"),
        ("remote", "validThrough", "applyEmail", "responsibilities", "requirements",
         "seo", "slugOverride"),
    ),
    "authors": ("authors", ("name", "status"), ("role", "avatar", "links", "seo")),
    "categories": ("categories", ("name", "status"), ("seo", "description")),
}


class Report(object):
    def __init__(self):
        self.errors = []
        self.warnings = []

    def error(self, where, msg):
        self.errors.append("%s: %s" % (where, msg))

    def warn(self, where, msg):
        self.warnings.append("%s: %s" % (where, msg))


def slug_of(filename, collection):
    stem = filename[:-3] if filename.endswith(".md") else filename
    if collection == "posts" and len(stem) > 11 and stem[:10].count("-") == 2:
        return stem[11:]
    return stem


def load_collection(name, report, content_dir):
    """Return {slug: (meta, body, relpath)} for one collection."""
    dirname, required, optional = COLLECTIONS[name]
    path = os.path.join(content_dir, dirname)
    out = {}
    if not os.path.isdir(path):
        return out

    allowed = set(required) | set(optional)
    for filename in sorted(os.listdir(path)):
        if not filename.endswith(".md"):
            continue
        full = os.path.join(path, filename)
        rel = os.path.relpath(full, ROOT)
        if rel.startswith(".."):
            # fixture tree outside the repo — show it relative to itself rather
            # than as a wall of ../../..
            rel = os.path.relpath(full, os.path.dirname(content_dir))
        try:
            meta, body = frontmatter.load(full)
        except frontmatter.FrontmatterError as e:
            report.error(rel, str(e))
            continue

        for key in sorted(set(meta) - allowed):
            report.error(rel, "unknown field %r (typo? allowed: %s)"
                         % (key, ", ".join(sorted(allowed))))
        for key in required:
            if meta.get(key) in (None, "", []):
                report.error(rel, "missing required field %r" % key)

        status = meta.get("status")
        if status is not None and status not in STATUSES:
            report.error(rel, "status %r is not one of %s" % (status, ", ".join(STATUSES)))

        slug = meta.get("slugOverride") or slug_of(filename, name)
        if not is_valid(slug):
            report.error(rel, "slug %r must be lowercase alphanumeric words joined by "
                              "single hyphens" % slug)
        if is_reserved(slug):
            report.error(rel, "slug %r collides with a reserved route" % slug)
        if meta.get("slugOverride"):
            report.warn(rel, "uses slugOverride — filename and URL can now drift")
        if slug in out:
            report.error(rel, "duplicate slug %r (also %s)" % (slug, out[slug][2]))
            continue

        out[slug] = (meta, body, rel)
    return out


def check_seo(meta, body, rel, report, fallback):
    seo = meta.get("seo") or {}
    if not isinstance(seo, dict):
        report.error(rel, "seo must be a mapping")
        return
    for key in sorted(set(seo) - {"title", "description", "canonical", "noindex"}):
        report.error(rel, "unknown seo field %r" % key)

    description = seo.get("description") or fallback
    if not description:
        report.error(rel, "no meta description (set excerpt or seo.description)")
    elif len(description) > MAX_DESCRIPTION:
        report.error(rel, "meta description is %d chars, max %d — it will be "
                          "truncated in search results" % (len(description), MAX_DESCRIPTION))

    title = seo.get("title")
    if title and len(title) > MAX_SEO_TITLE:
        report.error(rel, "seo.title is %d chars, max %d" % (len(title), MAX_SEO_TITLE))


def check_cover(meta, rel, report):
    cover = meta.get("cover")
    if not cover:
        return False
    if not isinstance(cover, dict):
        report.error(rel, "cover must be a mapping with src and alt")
        return False
    src = cover.get("src")
    if not src:
        return False

    alt = (cover.get("alt") or "").strip()
    if not alt:
        report.error(rel, "cover.src is set but cover.alt is empty — every image "
                          "needs alt text")
    elif len(alt) < MIN_ALT:
        report.error(rel, "cover.alt %r is too short to describe the image" % alt)
    elif alt.lower() in os.path.basename(src).lower():
        report.error(rel, "cover.alt %r is just the filename, not a description" % alt)

    on_disk = os.path.join(ROOT, src.lstrip("/"))
    if not os.path.exists(on_disk):
        report.error(rel, "cover.src %s does not exist on disk" % src)
    return True


def check_body(body, rel, report, collection):
    lowered = body.lower()
    for bad in DANGEROUS:
        if bad in lowered:
            report.error(rel, "body contains %r — raw HTML/JS is not allowed in "
                              "content" % bad)
    for marker in SEED_MARKERS:
        if marker.lower() in lowered:
            report.warn(rel, "body is still placeholder text (%r)" % marker)
            break
    if collection == "posts":
        words = readtime.word_count(body)
        if words < THIN_POST_WORDS:
            report.warn(rel, "body is %d words — thin for an indexable article" % words)


def check_dates(meta, rel, report, field):
    value = meta.get(field)
    if value in (None, ""):
        return
    try:
        dates.parse(value)
    except dates.DateError as e:
        report.error(rel, "%s: %s" % (field, e))


def main():
    strict = "--strict" in sys.argv
    content_dir = _content_dir(sys.argv)
    report = Report()

    posts = load_collection("posts", report, content_dir)
    roles = load_collection("roles", report, content_dir)
    authors = load_collection("authors", report, content_dir)
    categories = load_collection("categories", report, content_dir)

    for slug, (meta, body, rel) in sorted(posts.items()):
        check_seo(meta, body, rel, report, meta.get("excerpt"))
        check_cover(meta, rel, report)
        check_body(body, rel, report, "posts")
        check_dates(meta, rel, report, "publishedAt")
        check_dates(meta, rel, report, "updatedAt")

        cat = meta.get("category")
        if cat and cat not in categories:
            report.error(rel, "category %r has no file at content/categories/%s.md"
                         % (cat, cat))
        author = meta.get("author")
        if author and author not in authors:
            report.error(rel, "author %r has no file at content/authors/%s.md"
                         % (author, author))

        tags = meta.get("tags")
        if tags is not None and not isinstance(tags, list):
            report.error(rel, "tags must be a list")

        if meta.get("readTimeMinutesOverride"):
            report.warn(rel, "readTimeMinutesOverride is set — remove it once the "
                             "real body is written so read time is computed")
        if not meta.get("cover"):
            report.warn(rel, "no cover image — share previews will have no image")

    for slug, (meta, body, rel) in sorted(roles.items()):
        first_line = body.strip().split("\n")[0] if body.strip() else ""
        check_seo(meta, body, rel, report, first_line[:MAX_DESCRIPTION])
        check_body(body, rel, report, "roles")
        check_dates(meta, rel, report, "postedAt")
        check_dates(meta, rel, report, "validThrough")
        for field in ("responsibilities", "requirements"):
            value = meta.get(field)
            if value is not None and not isinstance(value, list):
                report.error(rel, "%s must be a list" % field)

    for slug, (meta, body, rel) in sorted(categories.items()):
        used = sum(1 for m, _, _ in posts.values() if m.get("category") == slug)
        if used == 0:
            report.warn(rel, "category has no published posts")
        elif used == 1:
            report.warn(rel, "category has only 1 post — thin for its own page")

    print("checked %d posts, %d roles, %d authors, %d categories"
          % (len(posts), len(roles), len(authors), len(categories)))

    if report.warnings:
        print("\n%d warning(s):" % len(report.warnings))
        for w in report.warnings:
            print("  ! " + w)
    if report.errors:
        print("\n%d ERROR(s):" % len(report.errors))
        for e in report.errors:
            print("  x " + e)
        return 1
    if strict and report.warnings:
        print("\n--strict: warnings are errors")
        return 1
    print("\nOK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
