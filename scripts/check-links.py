#!/usr/bin/env python3
"""Resolve every internal link and asset reference against the files on disk.

    .venv/bin/python scripts/check-content.py   # content
    python3 scripts/check-links.py              # this: links actually resolve

Why this exists: Phase 3 replaced insights.html and roles.html with generated
trees at /insights/ and /careers/roles/. A later branch merge resolved the
shared header in favour of the pre-Phase-3 copy, which pointed at the deleted
pages — 81 dead nav links across all 11 hand-maintained pages, on the two most
used items in the navigation.

Nothing caught it. check-header-sync.py only proves the headers are identical to
EACH OTHER; identical and wrong still passes. This checks the thing that
actually matters: that the target exists.

Resolution mirrors how the site is served — build/ overlaid on the repo root,
exactly as scripts/build-dist.py assembles dist/. A directory URL resolves to
its index.html.

Pass --base-path when the tree was built for a sub-path host, matching the flag
given to build-content.py (GitHub Pages serves this repo under /Gispl_web/).
Without it every generated link looks broken, because they all carry the prefix.
"""
from __future__ import print_function

import io
import os
import re
import sys

try:
    from urllib.parse import unquote, urlsplit
except ImportError:  # pragma: no cover - py2
    from urllib import unquote
    from urlparse import urlsplit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, "build")

REF = re.compile(r'(?:href|src)="([^"]*)"', re.I)
EXTERNAL = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//|#)", re.I)

# The portal is a separate Next.js build staged into dist/ by build-dist.py; it
# is legitimately absent from a content-only checkout.
SKIP_PREFIXES = ("/portal/", "portal/")


def html_files():
    for name in sorted(os.listdir(ROOT)):
        if name.endswith(".html"):
            yield os.path.join(ROOT, name), name
    if os.path.isdir(BUILD):
        for dirpath, _, files in os.walk(BUILD):
            for name in sorted(files):
                if name.endswith(".html"):
                    full = os.path.join(dirpath, name)
                    yield full, os.path.relpath(full, ROOT)


def candidates(target):
    """Filesystem paths a URL could legitimately resolve to."""
    rel = target.lstrip("/")
    out = []
    for base in (BUILD, ROOT):
        p = os.path.join(base, rel)
        out.append(p)
        if target.endswith("/") or not os.path.splitext(rel)[1]:
            out.append(os.path.join(p, "index.html"))
    return out


def resolve(page_path, url):
    """Return the URL path this reference points at, or None to skip it."""
    if not url or EXTERNAL.match(url):
        return None
    path = urlsplit(url).path
    if not path:
        return None
    path = unquote(path)
    if path.startswith("/"):
        return path
    # Relative: resolve against the page's own directory in the served tree.
    page_dir = os.path.dirname(page_path)
    if page_dir.startswith(BUILD):
        page_dir = os.path.relpath(page_dir, BUILD)
    else:
        page_dir = os.path.relpath(page_dir, ROOT)
    if page_dir == ".":
        page_dir = ""
    return "/" + os.path.normpath(os.path.join(page_dir, path)).replace(os.sep, "/").lstrip("/")


def main():
    argv = sys.argv[1:]
    base_path = ""
    if "--base-path" in argv:
        i = argv.index("--base-path")
        if i + 1 >= len(argv):
            print("ERROR: --base-path needs a value", file=sys.stderr)
            return 2
        base_path = "/" + argv[i + 1].strip("/")
        if base_path == "/":
            base_path = ""

    broken = {}
    pages = 0
    refs = 0

    for full, rel in html_files():
        pages += 1
        with io.open(full, encoding="utf-8") as fh:
            html = fh.read()
        for url in REF.findall(html):
            target = resolve(full, url)
            if target is None:
                continue
            if base_path and target.startswith(base_path + "/"):
                target = target[len(base_path):]
            elif base_path and target == base_path:
                target = "/"
            if any(target.startswith(p) or target.lstrip("/").startswith(p)
                   for p in SKIP_PREFIXES):
                continue
            refs += 1
            if not any(os.path.exists(c) for c in candidates(target)):
                broken.setdefault(target, set()).add(rel)

    if broken:
        print("broken internal references:", file=sys.stderr)
        for target in sorted(broken):
            pages_list = sorted(broken[target])
            shown = ", ".join(pages_list[:4])
            more = "" if len(pages_list) <= 4 else " (+%d more)" % (len(pages_list) - 4)
            print("  x %s  <- %s%s" % (target, shown, more), file=sys.stderr)
        print("\n%d broken target(s) across %d page(s)"
              % (len(broken), len({p for s in broken.values() for p in s})),
              file=sys.stderr)
        return 1

    print("all %d internal references resolve across %d page(s)" % (refs, pages))
    if not os.path.isdir(BUILD):
        print("note: build/ absent — generated pages were not checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
