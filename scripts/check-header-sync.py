#!/usr/bin/env python3
"""Verify the hand-duplicated header/footer stay in sync across all public pages.

The header is copied into every page; the ONLY allowed per-page differences are
the active-nav highlight (font 600 + #F4915A on the current page's item).
Run after editing any header: python3 scripts/check-header-sync.py

The definition of "the shared shell" lives in scripts/lib/pageshell.py, which
scripts/build-content.py also imports — so the guard and the builder cannot
disagree about what a correct header looks like.
"""
import glob
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.pageshell import SKIP, shell_hash  # noqa: E402

ok = True
for tag in ("header", "footer"):
    buckets = {}
    for p in sorted(glob.glob("*.html")):
        if p in SKIP:
            continue
        with open(p, encoding="utf-8") as fh:
            buckets.setdefault(shell_hash(tag, fh.read()), []).append(p)
    if len(buckets) > 1:
        ok = False
        print("DRIFT in <%s> — %d variants:" % (tag, len(buckets)))
        for h, ps in sorted(buckets.items(), key=lambda kv: -len(kv[1])):
            print("  %d pages: %s" % (len(ps), ", ".join(ps)))
    else:
        print("<%s> in sync across %d pages"
              % (tag, sum(len(v) for v in buckets.values())))
sys.exit(0 if ok else 1)
