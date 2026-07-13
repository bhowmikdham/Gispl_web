#!/usr/bin/env python3
"""Assemble a deployable static tree in <root>/dist/.

The site is plain static files; the client portal is a Next.js app whose
static export lands in portal/out/. This script stages both into dist/ so
the whole thing can be uploaded as-is (later: `aws s3 sync dist/ ...`):

    dist/
      *.html  assets/  robots.txt  favicon…      (the public site)
      portal/**                                   (portal/out/ contents)

The portal is served at /portal/ (its next.config.ts sets basePath:'/portal').
admin.html is intentionally EXCLUDED from dist/ — it is a dev-only tool.

Usage:
    cd portal && npm run build     # produces portal/out/
    cd ..     && python3 scripts/build-dist.py
"""
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
PORTAL_OUT = os.path.join(ROOT, "portal", "out")

# Root files/dirs to publish. admin.html is deliberately omitted.
INCLUDE_FILES = ["robots.txt"]
INCLUDE_DIRS = ["assets"]
EXCLUDE_HTML = {"admin.html"}


def main() -> int:
    if not os.path.isdir(PORTAL_OUT):
        print("ERROR: portal/out/ missing. Run `cd portal && npm run build` first.", file=sys.stderr)
        return 1

    # portal/out must be newer than portal/src, or the export is stale
    src_dir = os.path.join(ROOT, "portal", "src")
    if os.path.isdir(src_dir):
        newest_src = max(
            (os.path.getmtime(os.path.join(dp, f)) for dp, _, fs in os.walk(src_dir) for f in fs),
            default=0,
        )
        out_mtime = os.path.getmtime(PORTAL_OUT)
        if newest_src > out_mtime:
            print("ERROR: portal/src is newer than portal/out — rebuild the portal first.", file=sys.stderr)
            return 1

    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

    n_html = 0
    for f in sorted(os.listdir(ROOT)):
        if f.endswith(".html") and f not in EXCLUDE_HTML:
            shutil.copy2(os.path.join(ROOT, f), os.path.join(DIST, f))
            n_html += 1
    for f in INCLUDE_FILES:
        p = os.path.join(ROOT, f)
        if os.path.exists(p):
            shutil.copy2(p, os.path.join(DIST, f))
    for d in INCLUDE_DIRS:
        p = os.path.join(ROOT, d)
        if os.path.isdir(p):
            shutil.copytree(p, os.path.join(DIST, d))

    shutil.copytree(PORTAL_OUT, os.path.join(DIST, "portal"))

    print(f"dist/ assembled: {n_html} site pages + assets + portal/ (excluded admin.html)")
    print(f"  → {DIST}")
    print("Serve locally:  python3 -m http.server 8080 -d dist")
    return 0


if __name__ == "__main__":
    sys.exit(main())
