#!/usr/bin/env python3
"""One-shot: assets/data/{posts,jobs}.json -> content/ Markdown files.

Run once, verify, then delete this script (it lives on in git history).

    python3 scripts/migrate-content.py          # write content/
    python3 scripts/migrate-content.py --verify # re-read and diff vs the JSON

SLUGS ARE PRESERVED BYTE-FOR-BYTE. Every slug in posts.json/jobs.json is a
published URL. Some were produced by a lossy slugifier and no slugifier would
reproduce them from the title — "pci-dss-v4-0-is-here-the-deadlines-you-c-t-miss"
cannot be re-derived from "PCI DSS v4.0 is here: the deadlines you can't miss".
So the slug is taken verbatim from the data and used as the filename stem;
nothing is re-slugified.

Read time is the one place this script writes a value it cannot derive. Every
seeded body is a ~27-word stub, so computed read time is "1 MIN READ" for all
nine posts — while index.html hardcodes 4, 7 and 5 MIN READ in its featured
cards. Emitting the computed value would make the site visibly contradict
itself. So the stored value is carried across as readTimeMinutesOverride with a
TODO, and check-content.py warns on every one, making it visible debt that
disappears as real bodies are written.
"""
from __future__ import print_function

import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib import dates, frontmatter  # noqa: E402
from lib.slug import slugify  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "assets", "data")
CONTENT = os.path.join(ROOT, "content")

# Time-of-day given to date-only values, so ordering is stable and JSON-LD gets
# a real timestamp. IST, because these are Indian publication dates.
IST = "+05:30"
DEFAULT_TIME = "T09:00:00" + IST

# Jobs carry no expiry, but JobPosting JSON-LD needs validThrough or Google
# keeps showing closed roles. 12 months from posting is the default; edit the
# file to change one.
VALID_MONTHS = 12

AUTHOR_PROFILES = {
    "GISPL": {
        "slug": "gispl",
        "name": "GISPL",
        "role": "G-Info Technology Solutions",
        "bio": ("Field notes and analysis from the GISPL consulting team — "
                "assessments, compliance, managed security and cyber forensics."),
    },
}

CATEGORY_DESCRIPTIONS = {
    "Phishing": "Social-engineering testing, awareness programmes and the controls that actually stop credential theft.",
    "Compliance": "ISO 27001, PCI DSS, SOC 2 and the audit evidence that satisfies a board and a regulator.",
    "Forensics": "Incident response, evidence handling and what investigations reveal after the fact.",
    "Payments": "Cardholder-data scope, tokenisation and the payment-security mandates that move deadlines.",
    "DPDP": "India's Digital Personal Data Protection Act — consent, data-principal rights and engineering for both.",
}


def add_months(dt, months):
    month = dt.month - 1 + months
    year = dt.year + month // 12
    month = month % 12 + 1
    day = min(dt.day, [31, 29 if year % 4 == 0 and (year % 100 or year % 400 == 0) else 28,
                       31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
    return dt.replace(year=year, month=month, day=day)


def write(path, text):
    d = os.path.dirname(path)
    if not os.path.isdir(d):
        os.makedirs(d)
    with io.open(path, "w", encoding="utf-8") as fh:
        fh.write(text)


def read_json(name):
    with io.open(os.path.join(DATA, name), encoding="utf-8") as fh:
        data = json.load(fh)
    return data.get("items", data) if isinstance(data, dict) else data


def read_minutes(read_time):
    """'6 MIN READ' -> 6. None when unparseable."""
    if not read_time:
        return None
    digits = "".join(c for c in str(read_time) if c.isdigit())
    return int(digits) if digits else None


# ---------------------------------------------------------------- posts

def post_meta(p):
    meta = {
        "title": p["title"],
        "excerpt": p.get("excerpt", ""),
        "category": slugify(p["category"]),
        "tags": [],
        "author": AUTHOR_PROFILES[p.get("author", "GISPL")]["slug"],
        "status": p.get("status", "published"),
        "publishedAt": p["date"] + DEFAULT_TIME,
        "featured": False,
    }
    minutes = read_minutes(p.get("readTime"))
    if minutes and minutes > 1:
        # TODO: drop once the real article body is written — read time is then
        # computed from word count. check-content.py warns while this is set.
        meta["readTimeMinutesOverride"] = minutes
    meta["seo"] = {"title": None, "description": None, "noindex": False}
    return meta


def migrate_posts(posts):
    out = []
    for p in posts:
        slug = p["slug"]
        stem = "%s-%s" % (dates.iso_date(p["date"]), slug)
        path = os.path.join(CONTENT, "posts", stem + ".md")
        write(path, frontmatter.dump(post_meta(p), p.get("bodyMd", "")))
        out.append((slug, path))
    return out


# ---------------------------------------------------------------- roles

def role_meta(j):
    posted = dates.parse(j["createdAt"])
    loc = j.get("loc", "")
    meta = {
        "title": j["title"],
        "team": j.get("team", ""),
        # Kept verbatim, including "Remote · India": roles.js facets on this
        # exact string, so normalizing it here would silently change the
        # location dropdown on the live jobs board.
        "location": loc,
        "employmentType": j.get("type", ""),
        "remote": "remote" in loc.lower(),
        "status": j.get("status", "published"),
        "postedAt": dates.iso_datetime(j["createdAt"]),
        "validThrough": dates.iso_date(add_months(posted, VALID_MONTHS)),
        "applyEmail": j.get("applyEmail", ""),
        "responsibilities": list(j.get("responsibilities") or []),
        "requirements": list(j.get("requirements") or []),
        "seo": {"title": None, "description": None, "noindex": False},
    }
    return meta


def migrate_roles(jobs):
    out = []
    for j in jobs:
        slug = j["slug"]
        path = os.path.join(CONTENT, "roles", slug + ".md")
        write(path, frontmatter.dump(role_meta(j), j.get("descriptionMd", "")))
        out.append((slug, path))
    return out


# ------------------------------------------------- authors + categories

def migrate_authors(posts):
    written = []
    for name in sorted(set(p.get("author", "GISPL") for p in posts)):
        prof = AUTHOR_PROFILES[name]
        meta = {
            "name": prof["name"],
            "role": prof["role"],
            "status": "published",
            "avatar": {"src": None, "alt": None},
            "links": {"linkedin": None, "email": None},
        }
        path = os.path.join(CONTENT, "authors", prof["slug"] + ".md")
        write(path, frontmatter.dump(meta, prof["bio"]))
        written.append(path)
    return written


def migrate_categories(posts):
    """Categories become real files.

    They were hardcoded in three unlinked places — admin.js CATS, the static
    chips in insights.html, and the post records — which is why they could
    drift. One file per category makes the chip list, the category page, the
    CMS dropdown and the data all resolve to the same source.
    """
    written = []
    for name in sorted(set(p["category"] for p in posts)):
        meta = {
            "name": name,
            "status": "published",
            "seo": {"title": None, "description": None, "noindex": False},
        }
        body = CATEGORY_DESCRIPTIONS.get(name, "")
        path = os.path.join(CONTENT, "categories", slugify(name) + ".md")
        write(path, frontmatter.dump(meta, body))
        written.append(path)
    return written


# ---------------------------------------------------------------- verify

def verify(posts, jobs):
    """Re-read the generated Markdown and diff against the source JSON."""
    problems = []

    src_slugs = set(p["slug"] for p in posts)
    got_slugs = set()
    for p in posts:
        stem = "%s-%s" % (dates.iso_date(p["date"]), p["slug"])
        path = os.path.join(CONTENT, "posts", stem + ".md")
        if not os.path.exists(path):
            problems.append("posts/%s: file missing" % stem)
            continue
        meta, body = frontmatter.load(path)
        derived_slug = stem[len("YYYY-MM-DD-"):]
        got_slugs.add(derived_slug)

        checks = [
            ("slug", derived_slug, p["slug"]),
            ("title", meta.get("title"), p["title"]),
            ("excerpt", meta.get("excerpt"), p.get("excerpt", "")),
            ("category", meta.get("category"), slugify(p["category"])),
            ("author", meta.get("author"), AUTHOR_PROFILES[p.get("author", "GISPL")]["slug"]),
            ("status", meta.get("status"), p.get("status", "published")),
            ("dateLabel", dates.label(meta.get("publishedAt")), p["dateLabel"]),
            ("date", dates.iso_date(meta.get("publishedAt")), p["date"]),
            ("readTime", "%d MIN READ" % (meta.get("readTimeMinutesOverride") or 1), p["readTime"]),
            ("body", body.strip(), (p.get("bodyMd") or "").strip()),
        ]
        for field, got, want in checks:
            if got != want:
                problems.append("posts/%s: %s\n    got:  %r\n    want: %r"
                                % (stem, field, got, want))

    if got_slugs != src_slugs:
        problems.append("post slug set differs: missing=%s extra=%s"
                        % (sorted(src_slugs - got_slugs), sorted(got_slugs - src_slugs)))

    src_jslugs = set(j["slug"] for j in jobs)
    got_jslugs = set()
    for j in jobs:
        path = os.path.join(CONTENT, "roles", j["slug"] + ".md")
        if not os.path.exists(path):
            problems.append("roles/%s: file missing" % j["slug"])
            continue
        meta, body = frontmatter.load(path)
        got_jslugs.add(j["slug"])
        checks = [
            ("title", meta.get("title"), j["title"]),
            ("team", meta.get("team"), j.get("team", "")),
            ("location", meta.get("location"), j.get("loc", "")),
            ("employmentType", meta.get("employmentType"), j.get("type", "")),
            ("status", meta.get("status"), j.get("status", "published")),
            ("applyEmail", meta.get("applyEmail"), j.get("applyEmail", "")),
            ("responsibilities", meta.get("responsibilities"), list(j.get("responsibilities") or [])),
            ("requirements", meta.get("requirements"), list(j.get("requirements") or [])),
            ("postedAt", dates.iso_date(meta.get("postedAt")), dates.iso_date(j["createdAt"])),
            ("body", body.strip(), (j.get("descriptionMd") or "").strip()),
        ]
        for field, got, want in checks:
            if got != want:
                problems.append("roles/%s: %s\n    got:  %r\n    want: %r"
                                % (j["slug"], field, got, want))

    if got_jslugs != src_jslugs:
        problems.append("role slug set differs: missing=%s extra=%s"
                        % (sorted(src_jslugs - got_jslugs), sorted(got_jslugs - src_jslugs)))

    return problems


def main():
    posts = read_json("posts.json")
    jobs = read_json("jobs.json")

    if "--verify" in sys.argv:
        problems = verify(posts, jobs)
        if problems:
            print("VERIFY FAILED — %d difference(s):\n" % len(problems))
            for p in problems:
                print("  " + p)
            return 1
        print("verify: %d posts + %d roles round-trip identically "
              "(slugs, titles, excerpts, categories, dates, labels, read times, bodies)"
              % (len(posts), len(jobs)))
        return 0

    p = migrate_posts(posts)
    r = migrate_roles(jobs)
    a = migrate_authors(posts)
    c = migrate_categories(posts)
    print("wrote %d posts, %d roles, %d authors, %d categories -> content/"
          % (len(p), len(r), len(a), len(c)))
    print("now run: python3 scripts/migrate-content.py --verify")
    return 0


if __name__ == "__main__":
    sys.exit(main())
