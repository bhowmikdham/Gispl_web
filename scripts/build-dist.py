#!/usr/bin/env python3
"""Assemble a deployable static tree in <root>/dist/.

The site is plain static files; the client portal is a Next.js app whose
static export lands in portal/out/. This script stages both into dist/ so
the whole thing can be uploaded as-is (later: `aws s3 sync dist/ ...`):

    dist/
      *.html  assets/  robots.txt  favicon…      (the hand-written pages)
      insights/**  careers/**  sitemap.xml       (build/ — generated content)
      portal/**                                   (portal/out/ contents)

The portal is served at /portal/ (its next.config.ts sets basePath:'/portal').
admin.html is intentionally EXCLUDED from dist/ — it is a dev-only tool.

Usage:
    cd portal && npm run build                    # produces portal/out/
    cd ..     && .venv/bin/python scripts/build-content.py   # produces build/
              && python3 scripts/build-dist.py

Options:
    --api-base URL   Point the site's forms at a deployed site-api. Without it
                     assets/js/api.js keeps its empty default and every form
                     falls back to its `mailto:` handoff — which is what the
                     GitHub Pages review deploy runs on.
"""
import io
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
PORTAL_OUT = os.path.join(ROOT, "portal", "out")
CONTENT_BUILD = os.path.join(ROOT, "build")

# Root files/dirs to publish. admin.html is deliberately omitted.
INCLUDE_FILES = ["robots.txt"]
INCLUDE_DIRS = ["assets"]
EXCLUDE_HTML = {"admin.html"}
# admin.html never ships, so its script is dead weight in dist/ — and it maps
# out the admin UI for anyone who fetches it. Drop it alongside the page.
EXCLUDE_ASSETS = {"admin.js"}


# The one line in assets/js/api.js that decides whether the site has a backend.
API_BASE_LINE = re.compile(r'^(\s*var API_BASE = )".*?"(; /\* build-dist:api-base \*/)$', re.M)


def stamp_api_base(api_base: str) -> None:
    """Rewrite dist/assets/js/api.js so the forms post instead of opening a mailto."""
    path = os.path.join(DIST, "assets", "js", "api.js")
    with io.open(path, encoding="utf-8") as fh:
        src = fh.read()
    # A silent no-op here would ship a site whose forms look wired up and are
    # not, so a missed marker is a hard error.
    new, n = API_BASE_LINE.subn(lambda m: '%s"%s"%s' % (m.group(1), api_base, m.group(2)), src)
    if n != 1:
        raise SystemExit("ERROR: could not find the API_BASE marker in assets/js/api.js")
    with io.open(path, "w", encoding="utf-8") as fh:
        fh.write(new)


def main() -> int:
    argv = sys.argv[1:]
    api_base = ""
    if "--api-base" in argv:
        i = argv.index("--api-base")
        if i + 1 >= len(argv):
            print("ERROR: --api-base needs a URL", file=sys.stderr)
            return 1
        api_base = argv[i + 1].rstrip("/")
        if not api_base.startswith("http"):
            print("ERROR: --api-base must be an absolute URL (https://…)", file=sys.stderr)
            return 1
        if '"' in api_base or "\\" in api_base:
            print("ERROR: --api-base contains a character that cannot go in a JS string", file=sys.stderr)
            return 1

    if not os.path.isdir(PORTAL_OUT):
        print("ERROR: portal/out/ missing. Run `cd portal && npm run build` first.", file=sys.stderr)
        return 1

    # The generated pages ARE the insights and careers sections now. Shipping
    # without them would serve a site whose nav links all 404, so this is a
    # hard error rather than a warning.
    if not os.path.isdir(CONTENT_BUILD):
        print("ERROR: build/ missing — the insights and careers pages live there.\n"
              "  Run: .venv/bin/python scripts/build-content.py", file=sys.stderr)
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
            shutil.copytree(p, os.path.join(DIST, d),
                            ignore=shutil.ignore_patterns(*EXCLUDE_ASSETS))

    # Overlay the generated content tree. dirs_exist_ok merges build/assets/data
    # into the assets/ already copied above rather than replacing it.
    shutil.copytree(CONTENT_BUILD, DIST, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns("*.pyc"))
    n_gen = sum(1 for dp, _, fs in os.walk(CONTENT_BUILD) for f in fs
                if f.endswith(".html"))

    shutil.copytree(PORTAL_OUT, os.path.join(DIST, "portal"))

    if api_base:
        stamp_api_base(api_base)

    print(f"dist/ assembled: {n_html} hand-written pages + {n_gen} generated "
          f"+ assets + portal/")
    print(f"  forms → {api_base}" if api_base
          else "  forms → mailto: fallback (no --api-base given)")
    print(f"  → {DIST}")
    print("Serve locally:  python3 -m http.server 8080 -d dist")
    return 0


if __name__ == "__main__":
    sys.exit(main())
