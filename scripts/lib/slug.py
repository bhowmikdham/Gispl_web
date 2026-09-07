"""URL slugs.

Mirrors GISPL.util.slugify in assets/js/config.js, which generated every slug
currently in the data. Keeping the two identical matters during migration: a
slug is a published URL, and a slugifier that disagreed by one character would
silently break inbound links and search rankings.
"""
import re

_AMP = re.compile(r"&")
_NON_ALNUM = re.compile(r"[^A-Za-z0-9]+")
_EDGE_DASH = re.compile(r"^-+|-+$")
_RUN_DASH = re.compile(r"-+")

VALID = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

# Slugs that would collide with a route the builder owns.
RESERVED = {"category", "author", "page", "index", "rss", "feed", "search", "tag"}


def slugify(value):
    """Lowercase, hyphen-separated, ASCII-alphanumeric only."""
    s = _AMP.sub(" and ", str(value))
    s = _NON_ALNUM.sub("-", s)
    s = _EDGE_DASH.sub("", s)
    s = s.lower()
    return _RUN_DASH.sub("-", s)


def is_valid(s):
    return bool(s) and bool(VALID.match(s))


def is_reserved(s):
    return s in RESERVED
