"""Reading time, computed from the body — never typed by an author.

The old records carried a hand-written string ("6 MIN READ") that no process
checked against the text. Editing a post never updated it.

220 wpm is the usual figure for adult non-fiction on screen. Code blocks and
tables are scanned rather than read, so they are excluded from the count
instead of inflating it.
"""
import re

WORDS_PER_MINUTE = 220

_FENCED_CODE = re.compile(r"```.*?```", re.S)
_INDENTED_CODE = re.compile(r"^(?: {4}|\t).*$", re.M)
_TABLE_ROW = re.compile(r"^\s*\|.*\|\s*$", re.M)
_INLINE_CODE = re.compile(r"`[^`]*`")
_URLS = re.compile(r"https?://\S+")
# Keep link TEXT, drop the target: [read the guide](https://…) -> read the guide
_LINK = re.compile(r"\[([^\]]*)\]\([^)]*\)")
_IMAGE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
_WORD = re.compile(r"[A-Za-z0-9’']+")


def word_count(markdown):
    """Approximate prose word count for a markdown body."""
    if not markdown:
        return 0
    t = str(markdown)
    t = _FENCED_CODE.sub(" ", t)
    t = _IMAGE.sub(" ", t)
    t = _LINK.sub(r"\1", t)
    t = _INLINE_CODE.sub(" ", t)
    t = _INDENTED_CODE.sub(" ", t)
    t = _TABLE_ROW.sub(" ", t)
    t = _URLS.sub(" ", t)
    return len(_WORD.findall(t))


def minutes(markdown):
    """Whole minutes, minimum 1 — a post is never '0 MIN READ'."""
    return max(1, int(round(word_count(markdown) / float(WORDS_PER_MINUTE))))


def label(markdown):
    """The site's display format: "6 MIN READ"."""
    return "%d MIN READ" % minutes(markdown)
