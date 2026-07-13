#!/usr/bin/env python3
"""Verify the hand-duplicated header/footer stay in sync across all public pages.

The header is copied into every page; the ONLY allowed per-page differences are
the active-nav highlight (font 600 + #F4915A on the current page's item).
Run after editing any header: python3 scripts/check-header-sync.py
"""
import re, glob, hashlib, sys

SKIP = {"admin.html", "404.html", "privacy.html", "terms.html"}
ACTIVE   = "font:600 14px 'IBM Plex Sans';cursor:{c};padding:0 14px;color:#F4915A"
INACTIVE = "font:500 14px 'IBM Plex Sans';cursor:{c};padding:0 14px;color:rgba(255,255,255,.82)"

def normalized(tag, path):
    html = open(path, encoding="utf-8").read()
    m = re.search(rf"<{tag}[\s>].*?</{tag}>", html, re.S)
    if not m: return None
    s = m.group(0)
    for c in ("pointer", "default"):
        s = s.replace(ACTIVE.format(c=c), INACTIVE.format(c=c))
    return re.sub(r"\s+", " ", s)

ok = True
for tag in ("header", "footer"):
    buckets = {}
    for p in sorted(glob.glob("*.html")):
        if p in SKIP: continue
        s = normalized(tag, p)
        buckets.setdefault(hashlib.md5((s or "MISSING").encode()).hexdigest(), []).append(p)
    if len(buckets) > 1:
        ok = False
        print(f"DRIFT in <{tag}> — {len(buckets)} variants:")
        for h, ps in sorted(buckets.items(), key=lambda kv: -len(kv[1])):
            print(f"  {len(ps)} pages: {', '.join(ps)}")
    else:
        print(f"<{tag}> in sync across {sum(len(v) for v in buckets.values())} pages")
sys.exit(0 if ok else 1)
