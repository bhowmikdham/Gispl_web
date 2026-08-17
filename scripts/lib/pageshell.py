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
import re

# The two nav-link style strings. {c} is the cursor, which differs because
# "Services" and "Careers" are dropdown-only spans (cursor:default) while the
# rest are real links (cursor:pointer).
ACTIVE = "font:600 14px 'IBM Plex Sans';cursor:{c};padding:0 14px;color:#F4915A"
INACTIVE = "font:500 14px 'IBM Plex Sans';cursor:{c};padding:0 14px;color:rgba(255,255,255,.82)"

CURSORS = ("pointer", "default")

# Pages that legitimately do not carry the shared shell.
SKIP = {"admin.html", "404.html", "privacy.html", "terms.html"}

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
