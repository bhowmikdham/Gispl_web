#!/usr/bin/env python3
"""Guard the script dependencies the pages carry by hand.

    python3 scripts/check-page-scripts.py     # exit 1 on a broken page

Two dependencies exist between the site's scripts, both invisible to any other
check in this repo, and both silently degrade rather than break:

  api.js BEFORE contact.js / dpdp.js / newsletter.js / apply.js
      api.js defines window.GISPL.api. Without it — or loaded after — the form
      scripts see no API and fall back to their `mailto:` handoff. The page
      still renders, the form still "works", and every lead goes to the
      visitor's mail client instead of the backend. This has already been lost
      twice in a branch merge.

  search-core.js BEFORE site.js
      site.js builds the nav search dropdown against the shared scorer.

Generated pages get their tags from scripts/build-content.py, so they cannot
drift; the hand-maintained pages are copy-paste and can. This checks both, by
reading the emitted HTML rather than the builder, so it catches either.
"""
from __future__ import print_function

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, "build")

SRC = re.compile(r'<script[^>]+src="([^"]+)"', re.I)

# consumer -> dependency that must appear before it
REQUIRES = {
    "contact.js": "api.js",
    "dpdp.js": "api.js",
    "newsletter.js": "api.js",
    "apply.js": "api.js",
    "site.js": "search-core.js",
}


def scripts_in(path):
    with io.open(path, encoding="utf-8") as fh:
        html = fh.read()
    return [os.path.basename(s.split("?")[0]) for s in SRC.findall(html)]


def check(path, rel, problems):
    order = scripts_in(path)
    index = {}
    for i, name in enumerate(order):
        index.setdefault(name, i)
    for consumer, dependency in REQUIRES.items():
        if consumer not in index:
            continue
        if dependency not in index:
            problems.append("%s loads %s but never loads %s"
                            % (rel, consumer, dependency))
        elif index[dependency] > index[consumer]:
            problems.append("%s loads %s BEFORE its dependency %s"
                            % (rel, consumer, dependency))


def main():
    problems = []
    checked = 0

    for name in sorted(os.listdir(ROOT)):
        if name.endswith(".html"):
            check(os.path.join(ROOT, name), name, problems)
            checked += 1

    if os.path.isdir(BUILD):
        for dirpath, _, files in os.walk(BUILD):
            for name in sorted(files):
                if not name.endswith(".html"):
                    continue
                full = os.path.join(dirpath, name)
                check(full, os.path.relpath(full, ROOT), problems)
                checked += 1
    else:
        print("note: build/ is absent — checked the hand-maintained pages only.")

    if problems:
        print("script dependency errors:", file=sys.stderr)
        for p in problems:
            print("  x " + p, file=sys.stderr)
        return 1

    print("script dependencies correct across %d page(s)" % checked)
    return 0


if __name__ == "__main__":
    sys.exit(main())
