"""Markdown -> HTML for article and role bodies.

Replaces the six-line regex in assets/js/article.js, which supported only
paragraphs, **bold**, *italic* and <br>. A 2,000-word technical post rendered
through that came out as an undifferentiated wall of <p> tags: no headings, no
lists, no links, no code, no tables.

mistune over Python-Markdown because the three customizations below are one
renderer subclass here, versus treeprocessor plumbing there.

Output carries NO inline styles — it is plain semantic HTML styled by the
.gx-prose block in assets/css/site.css. That departs from the repo's
inline-style convention deliberately: styling every element inline would bloat
each article and make a typography change a rewrite of all content.
"""
import re

try:
    import mistune
except ImportError:  # pragma: no cover
    raise SystemExit(
        "mistune is not installed.\n"
        "  python3 -m venv .venv && .venv/bin/pip install -r requirements.txt"
    )

from .html import esc
from .slug import slugify

_EXTERNAL = re.compile(r"^(?:https?:)?//", re.I)


class ProseRenderer(mistune.HTMLRenderer):
    """HTML renderer with heading anchors, real figures and safe links."""

    def __init__(self, *args, **kwargs):
        super(ProseRenderer, self).__init__(*args, **kwargs)
        self.headings = []
        self._seen = {}

    def _heading_id(self, text):
        base = slugify(re.sub(r"<[^>]+>", "", text)) or "section"
        n = self._seen.get(base, 0)
        self._seen[base] = n + 1
        return base if n == 0 else "%s-%d" % (base, n + 1)

    def heading(self, text, level, **attrs):
        # Article bodies start at h2: the post title is the page's only h1.
        level = min(level + 1, 6) if level == 1 else min(level, 6)
        hid = self._heading_id(text)
        if level <= 3:
            self.headings.append({"id": hid, "level": level,
                                  "text": re.sub(r"<[^>]+>", "", text)})
        return '<h%d id="%s">%s</h%d>\n' % (level, esc(hid), text, level)

    def image(self, text, url, title=None):
        """Render as <figure> with a caption, and require alt text.

        Intrinsic dimensions aren't known here, so lazy-loading is the useful
        part: article images are all below the fold by definition.
        """
        alt = text or ""
        cap = ('<figcaption>%s</figcaption>' % esc(title or alt)) if (title or alt) else ""
        return ('<figure><img src="%s" alt="%s" loading="lazy" decoding="async">%s</figure>\n'
                % (esc(url), esc(alt), cap))

    def link(self, text, url, title=None):
        """External links get rel="noopener" — they open in the same tab, but
        the attribute costs nothing and covers any future target=_blank."""
        t = (' title="%s"' % esc(title)) if title else ""
        rel = ' rel="noopener"' if _EXTERNAL.match(url or "") else ""
        return '<a href="%s"%s%s>%s</a>' % (esc(url), t, rel, text)


# A lone image on its own line is still an INLINE image to markdown, so mistune
# wraps it in <p>. Since image() emits a block <figure>, that produces
# <p><figure>…</figure></p> — invalid, and browsers silently close the <p>
# early, leaving a stray empty paragraph in the DOM. Unwrap those.
_FIGURE_IN_P = re.compile(r"<p>\s*(<figure>.*?</figure>)\s*</p>", re.S)


def render(markdown_text):
    """Return (html, headings). headings feeds an optional table of contents."""
    renderer = ProseRenderer(escape=True)
    md = mistune.create_markdown(
        renderer=renderer,
        plugins=["table", "strikethrough", "footnotes", "url", "def_list"],
    )
    html = md(markdown_text or "")
    html = _FIGURE_IN_P.sub(r"\1", html)
    return html, renderer.headings


def plain_text(markdown_text, limit=None):
    """Strip markdown to bare text — for meta descriptions and search index."""
    html, _ = render(markdown_text)
    text = re.sub(r"<[^>]+>", " ", html)
    text = (text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
                .replace("&quot;", '"').replace("&#39;", "'"))
    text = " ".join(text.split())
    return text[:limit] if limit else text
