"""sitemap.xml and the insights RSS feed.

Neither exists on the site today; robots.txt has the sitemap line commented out
awaiting a domain. Both are generated so they cannot go stale — the old failure
mode was a hand-maintained list that silently stopped matching reality.

Only indexable content goes in. Drafts, archived posts and anything marked
noindex are excluded here, and check-content.py re-reads the BUILT files to
assert that, because a rule enforced only at generation time is a rule nobody
can prove held.
"""
from .html import esc
from .seo import absolute

XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n'


def sitemap(site, entries):
    """entries: [{"path", "lastmod"(optional), "changefreq", "priority"}]"""
    base = site["baseUrl"]
    out = [XML_HEAD, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n']
    for e in entries:
        out.append("  <url>\n    <loc>%s</loc>\n" % esc(absolute(base, e["path"])))
        if e.get("lastmod"):
            out.append("    <lastmod>%s</lastmod>\n" % esc(e["lastmod"]))
        if e.get("changefreq"):
            out.append("    <changefreq>%s</changefreq>\n" % esc(e["changefreq"]))
        if e.get("priority"):
            out.append("    <priority>%s</priority>\n" % esc(e["priority"]))
        out.append("  </url>\n")
    out.append("</urlset>\n")
    return "".join(out)


def rss(site, posts, path="/insights/rss.xml"):
    """RSS 2.0 for the insights feed."""
    base = site["baseUrl"]
    self_url = absolute(base, path)
    items = []
    for p in posts:
        items.append(
            "    <item>\n"
            "      <title>%s</title>\n"
            "      <link>%s</link>\n"
            "      <guid isPermaLink=\"true\">%s</guid>\n"
            "      <description>%s</description>\n"
            "      <category>%s</category>\n"
            "      <pubDate>%s</pubDate>\n"
            "    </item>\n"
            % (esc(p["title"]), esc(absolute(base, p["url"])),
               esc(absolute(base, p["url"])), esc(p["excerpt"]),
               esc(p["categoryName"]), esc(p["rfc822"]))
        )
    return (
        XML_HEAD
        + '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
        + "  <channel>\n"
        + "    <title>%s — Insights</title>\n" % esc(site["name"])
        + "    <link>%s</link>\n" % esc(absolute(base, "/insights/"))
        + '    <atom:link href="%s" rel="self" type="application/rss+xml" />\n' % esc(self_url)
        + "    <description>%s</description>\n" % esc(site["insights"]["intro"])
        + "    <language>en</language>\n"
        + "".join(items)
        + "  </channel>\n</rss>\n"
    )
