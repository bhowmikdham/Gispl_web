"""HTML escaping and small assembly helpers.

esc() mirrors GISPL.util.esc in assets/js/config.js exactly, quotes included.
The JS version escapes quotes because it renders into attribute contexts; this
one must match or the same string would be safe client-side and unsafe when
pre-rendered. Anything interpolated into generated HTML goes through here.
"""

_ESCAPES = (
    ("&", "&amp;"),
    ("<", "&lt;"),
    (">", "&gt;"),
    ('"', "&quot;"),
    ("'", "&#39;"),
)


def esc(value):
    """Escape for both text and attribute contexts."""
    if value is None:
        return ""
    s = str(value)
    for char, repl in _ESCAPES:
        s = s.replace(char, repl)
    return s


def attr(name, value):
    """Render ` name="value"`, or "" when the value is empty."""
    if value is None or value == "":
        return ""
    return ' %s="%s"' % (name, esc(value))


def meta(name, content):
    """A <meta name=...> tag, or "" when there's nothing to say."""
    if not content:
        return ""
    return '<meta name="%s" content="%s">' % (esc(name), esc(content))


def meta_prop(prop, content):
    """A <meta property=...> tag (Open Graph), or "" when empty."""
    if not content:
        return ""
    return '<meta property="%s" content="%s">' % (esc(prop), esc(content))


def truncate(text, limit, suffix="…"):
    """Trim to `limit` characters on a word boundary.

    Used for fallback meta descriptions, where an abrupt mid-word cut looks
    like a bug in the search result.
    """
    if not text:
        return ""
    s = " ".join(str(text).split())
    if len(s) <= limit:
        return s
    cut = s[: max(0, limit - len(suffix))]
    if " " in cut:
        cut = cut[: cut.rindex(" ")]
    return cut.rstrip(" ,;:.–—-") + suffix
