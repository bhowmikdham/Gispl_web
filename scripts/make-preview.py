#!/usr/bin/env python3
"""Turn an assembled dist/ tree into a NON-INDEXABLE preview build.

Review deploys (GitHub Pages, staging hosts) serve a full copy of the site on a
different origin. Left alone, search engines index that copy, and it then
competes with the real domain for the same content — a self-inflicted duplicate
that is slow and annoying to undo. This script makes the copy uncrawlable:

  * every .html file gets <meta name="robots" content="noindex,nofollow">
    (an existing robots meta is replaced, not duplicated)
  * robots.txt is overwritten with a blanket Disallow

It mutates the tree in place and is only ever run against a preview build —
never before a production sync.

Usage:
    python3 scripts/build-dist.py
    python3 scripts/make-preview.py dist
"""
import os
import re
import sys

META = '<meta name="robots" content="noindex,nofollow">'
ROBOTS = """# Preview/review deploy — not the production site.
# Indexing is disabled so this copy never competes with the real domain.
User-agent: *
Disallow: /
"""

EXISTING_ROBOTS_META = re.compile(
    r'<meta\s+[^>]*name=["\']robots["\'][^>]*>', re.I
)
HEAD_OPEN = re.compile(r"<head\b[^>]*>", re.I)


def mark(path):
    """Insert the robots meta in one HTML file. True if the file changed.

    Any pre-existing robots meta is stripped first, so the directive we insert
    is the only one on the page and cannot be contradicted by a later tag.
    """
    with open(path, encoding="utf-8") as fh:
        html = fh.read()

    m = HEAD_OPEN.search(html)
    if not m:
        return False

    stripped = EXISTING_ROBOTS_META.sub("", html)
    m = HEAD_OPEN.search(stripped)
    out = stripped[: m.end()] + "\n" + META + stripped[m.end():]

    if out == html:
        return False
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(out)
    return True


def main():
    dist = sys.argv[1] if len(sys.argv) > 1 else "dist"
    if not os.path.isdir(dist):
        print("ERROR: %s/ not found — run scripts/build-dist.py first." % dist,
              file=sys.stderr)
        return 1

    changed = scanned = 0
    for dirpath, _, files in os.walk(dist):
        for f in files:
            if f.endswith(".html"):
                scanned += 1
                if mark(os.path.join(dirpath, f)):
                    changed += 1

    with open(os.path.join(dist, "robots.txt"), "w", encoding="utf-8") as fh:
        fh.write(ROBOTS)

    print("preview mode: %d/%d HTML files marked noindex, robots.txt disallows all"
          % (changed, scanned))
    if scanned == 0:
        print("ERROR: no HTML found under %s/ — refusing to call this a build."
              % dist, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
