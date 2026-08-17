"""The shared <header>/<footer> that every public page carries.

The header is hand-copied into all 15 public pages. Two things depend on
knowing what "the same header" means:

  * scripts/check-header-sync.py — fails when the copies drift
  * scripts/build-content.py     — stamps that header onto generated pages

Both import from here so they cannot disagree about it. If the definition of a
page's active-nav state lived in two files, the guard would eventually pass on
markup the builder emits differently (or vice versa) and nobody would notice.

The ONLY legitimate per-page difference is the active-nav highlight: the
current page's nav item is weight 600 in #F4915A, every other page's is weight
500 in white-82%. neutralize() rewrites the former to the latter so all 15
pages hash identically.
"""
import hashlib
import io
import os
import re

# The two nav-link style strings. {c} is the cursor, which differs because
# "Services" and "Careers" are dropdown-only spans (cursor:default) while the
# rest are real links (cursor:pointer).
ACTIVE = "font:600 14px 'IBM Plex Sans';cursor:{c};padding:0 14px;color:#F4915A"
INACTIVE = "font:500 14px 'IBM Plex Sans';cursor:{c};padding:0 14px;color:rgba(255,255,255,.82)"

CURSORS = ("pointer", "default")

# Pages that legitimately do not carry the shared shell.
# article.html and job.html are redirect stubs for the old ?slug= URLs — see
# the comment in either file for why that redirect can't live at the CDN.
SKIP = {"admin.html", "404.html", "privacy.html", "terms.html",
        "article.html", "job.html"}

# Generated pages may opt out of the shell check with this marker.
NO_SHELL_MARKER = "<!-- gispl:no-shell -->"


def extract(tag, html):
    """Return the first <tag>...</tag> block verbatim, or None."""
    m = re.search(r"<{t}[\s>].*?</{t}>".format(t=tag), html, re.S)
    return m.group(0) if m else None


def neutralize(s):
    """Collapse per-page differences so identical shells hash identically.

    Rewrites the active-nav highlight to its inactive form and normalizes
    whitespace runs to single spaces.
    """
    if s is None:
        return None
    for c in CURSORS:
        s = s.replace(ACTIVE.format(c=c), INACTIVE.format(c=c))
    return re.sub(r"\s+", " ", s)


def shell_hash(tag, html):
    """Stable hash of a page's normalized shell block. 'MISSING' if absent."""
    return hashlib.md5((neutralize(extract(tag, html)) or "MISSING").encode()).hexdigest()


# --------------------------------------------------------------------------
# Donor extraction — how generated pages get the shared header.
#
# The alternative was a templates/_header.html, but that would be a 16th copy
# of markup that already exists 15 times, and keeping it in step would mean
# generating the 15 hand-written pages from it too. Reading the header back OUT
# of the pages that already have it makes the builder a pure consumer: the 15
# pages stay the source of truth, and generated pages inherit whatever they
# currently say — including future edits — with no second place to update.
#
# The safety property that makes "pick one page as the donor" sound rather than
# arbitrary: donor_shell() first proves all 15 normalize to the same bytes and
# refuses to build otherwise. If they are provably identical, which one donates
# cannot matter.
# --------------------------------------------------------------------------

class ShellDriftError(RuntimeError):
    """Raised when the 15 pages disagree, so there is no single shared shell."""


class Shell(object):
    def __init__(self, header, footer, head_links, scripts):
        self.header = header
        self.footer = footer
        # <link>/<meta> from the donor <head> that every page shares (fonts,
        # favicon, theme-color, site.css) — inherited so a fonts-URL change on
        # the 15 pages reaches generated pages with no second edit.
        self.head_links = head_links
        self.scripts = scripts


_HEAD = re.compile(r"<head[^>]*>(.*?)</head>", re.S | re.I)
# Shared head lines worth inheriting; per-page title/description/og are not.
_INHERIT = re.compile(
    r'<link[^>]+rel="(?:preconnect|stylesheet|icon)"[^>]*>'
    r'|<meta[^>]+name="theme-color"[^>]*>',
    re.I,
)


def donor_shell(root, pages=None):
    """Extract the shared shell from the hand-maintained pages.

    Raises ShellDriftError with the same report check-header-sync.py prints if
    the pages disagree — a drifted header must fail the build, not get frozen
    into every generated page.
    """
    import glob

    paths = pages or sorted(
        p for p in glob.glob(os.path.join(root, "*.html"))
        if os.path.basename(p) not in SKIP
    )
    if not paths:
        raise ShellDriftError("no donor pages found in %s" % root)

    sources = {}
    for p in paths:
        with io.open(p, encoding="utf-8") as fh:
            sources[os.path.basename(p)] = fh.read()

    for tag in ("header", "footer"):
        buckets = {}
        for name, html in sources.items():
            buckets.setdefault(shell_hash(tag, html), []).append(name)
        if len(buckets) > 1:
            lines = ["DRIFT in <%s> — %d variants:" % (tag, len(buckets))]
            for h, ps in sorted(buckets.items(), key=lambda kv: -len(kv[1])):
                lines.append("  %d pages: %s" % (len(ps), ", ".join(sorted(ps))))
            lines.append("Fix the header before building generated pages.")
            raise ShellDriftError("\n".join(lines))

    donor_name = sorted(sources)[0]
    donor = sources[donor_name]

    header = neutralize(extract("header", donor))
    footer = neutralize(extract("footer", donor))

    head_m = _HEAD.search(donor)
    head_links = ([m.group(0) for m in _INHERIT.finditer(head_m.group(1))]
                  if head_m else [])

    scripts = re.findall(r'<script src="assets/js/site\.js"[^>]*></script>', donor)
    return Shell(header, footer, head_links, scripts)


_NAV_LINK = re.compile(r'(<a\s[^>]*href="([^"]+)"[^>]*style=")([^"]*)(")')


def activate(header, nav_href):
    """Stamp the active-nav highlight onto the nav item matching nav_href.

    donor_shell() returns a neutralized header (every item inactive); this puts
    the orange back on the right one. Also fixes, by construction, the
    article.html bug where an insight page highlighted Careers.
    """
    if not nav_href:
        return header

    def sub(m):
        prefix, href, style, close = m.groups()
        if href != nav_href:
            return m.group(0)
        for c in CURSORS:
            if INACTIVE.format(c=c) in style:
                style = style.replace(INACTIVE.format(c=c), ACTIVE.format(c=c))
                break
        return prefix + style + close

    return _NAV_LINK.sub(sub, header, count=0)


# Root-relative rewriting -----------------------------------------------------
# The 15 pages sit at the root, so their relative URLs ("assets/css/site.css")
# resolve fine. A generated page at /insights/<slug>/ is two levels down, where
# the same string resolves to /insights/<slug>/assets/css/site.css and 404s.
# Every internal URL in an injected shell must therefore become root-absolute.

_SKIP_SCHEME = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//|/|#)", re.I)

_URL_ATTR = re.compile(r'\b(href|src)="([^"]*)"')
_CSS_URL = re.compile(r"url\((['\"]?)(?!/|https?:|data:)([^)'\"]+)\1\)")


def rebase(html, route_map=None, prefix=""):
    """Rewrite relative internal URLs to root-absolute, applying route_map.

    route_map redirects pages the content build now owns, e.g.
    {"insights.html": "/insights/", "roles.html": "/careers/roles/"}.
    prefix nests the whole site under a sub-path (GitHub Pages project sites).
    """
    routes = route_map or {}
    prefix = (prefix or "").rstrip("/")

    def fix(url):
        if not url or _SKIP_SCHEME.match(url):
            # Root-absolute already: it still needs the sub-path prefix.
            if prefix and url.startswith("/") and not url.startswith("//"):
                return prefix + url
            return url
        base, sep, frag = url.partition("#")
        base, qsep, query = base.partition("?")
        if base in routes:
            base = routes[base]
        elif base:
            base = "/" + base.lstrip("./")
        else:
            return url
        return prefix + base + qsep + query + sep + frag

    def attr_sub(m):
        return '%s="%s"' % (m.group(1), fix(m.group(2)))

    def css_sub(m):
        quote = m.group(1)
        return "url(%s%s%s)" % (quote, fix(m.group(2)), quote)

    html = _URL_ATTR.sub(attr_sub, html)
    return _CSS_URL.sub(css_sub, html)
