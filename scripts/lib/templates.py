"""Page bodies for generated pages.

These are ports of the markup that already ships, kept character-for-character
where it matters: insights.html's hero/grid/newsletter, article.html's article
column, roles.html's hero and search well, job.html's two-column layout and
apply card. The goal is that nothing changes visually when the generated pages
replace the hand-written ones — this is where visual regressions hide.

The one intentional difference: category chips were <span data-cat> toggled by
JS display:none; they are now real links to /insights/category/<slug>/. That
turns a client-side filter into indexable pages, and removes the bug where a
chip that matched nothing showed a blank grid with no empty state.
"""
from .html import esc

# Per-category cover tint, matching the hand-written cards, so a card looks the
# same after generation as before. Keyed by category slug.
TINTS = {
    "phishing": "rgba(242,106,33,.24)",
    "compliance": "rgba(242,176,30,.2)",
    "forensics": "rgba(169,30,71,.24)",
    "payments": "rgba(242,106,33,.2)",
    "dpdp": "rgba(242,176,30,.22)",
}
DEFAULT_TINT = "rgba(242,106,33,.22)"

COVER_BG = ("linear-gradient(140deg,#14315B 0%,#0B1E3B 60%,#1B2740 100%)")
STRIPES = ("repeating-linear-gradient(125deg,rgba(255,255,255,.045) 0 1px,"
           "transparent 1px 13px)")

MONO = "'IBM Plex Mono'"
SANS = "'IBM Plex Sans'"


def _cover(tint, height, radius, badge=None, image=None, alt=""):
    """The gradient cover block used on cards and article headers."""
    if image:
        inner = ('<img src="%s" alt="%s" loading="lazy" decoding="async" '
                 'style="width:100%%;height:100%%;object-fit:cover;display:block">'
                 % (esc(image), esc(alt)))
        return ('<div style="position:relative;height:%dpx;border-radius:%dpx;'
                'overflow:hidden;border:1px solid rgba(11,30,59,.1)">%s%s</div>'
                % (height, radius, inner, badge or ""))
    return (
        '<div style="position:relative;height:%dpx;border-radius:%dpx;overflow:hidden;'
        'background:%s;border:1px solid rgba(11,30,59,.1)">'
        '<div style="position:absolute;inset:0;background:%s"></div>'
        '<div style="position:absolute;inset:0;background:radial-gradient('
        '60%% 70%% at 74%% 26%%,%s,transparent 60%%)"></div>%s</div>'
        % (height, radius, COVER_BG, STRIPES, tint, badge or "")
    )


def post_card(post):
    """One article card in the insights grid."""
    tint = TINTS.get(post["category"], DEFAULT_TINT)
    badge = ('<span style="position:absolute;top:18px;left:18px;font:500 10px %s;'
             'letter-spacing:.14em;color:#fff;background:rgba(242,106,33,.95);'
             'padding:5px 11px;border-radius:20px">%s</span>'
             % (MONO, esc(post["categoryName"].upper())))
    cover = post.get("cover") or {}
    return (
        '<a href="%s" class="ins-card" data-cat="%s" style="text-decoration:none;'
        'display:flex;flex-direction:column">%s'
        '<div style="font:500 11px %s;letter-spacing:.1em;color:#8A92A4;margin:16px 0 9px">'
        '%s · %s</div>'
        '<h3 style="font:600 20px/1.25 Archivo;letter-spacing:-.01em;color:#0B1E3B;'
        'margin:0 0 10px">%s</h3>'
        '<p style="font:400 14px/1.6 %s;color:#5B647C;margin:0 0 14px;flex:1">%s</p>'
        '<span style="font:600 14px %s;color:#F26A21">Read article &rarr;</span></a>'
        % (esc(post["url"]), esc(post["categoryName"]),
           _cover(tint, 200, 14, badge, cover.get("src"), cover.get("alt", "")),
           MONO, esc(post["readTime"]), esc(post["dateLabel"]),
           esc(post["title"]), SANS, esc(post["excerpt"]), SANS)
    )


def hero(heading, accent, intro, size=56):
    """The dark insights-style hero."""
    accent_html = (' <em style="font:italic 700 %dpx Archivo;letter-spacing:-.02em;'
                   'color:#F26A21">%s</em>' % (size, esc(accent))) if accent else ""
    return (
        '<section id="gx-main" style="position:relative;overflow:hidden;background:#07142B">'
        '<div style="position:absolute;inset:0;background:radial-gradient(60%% 80%% at 78%% 12%%,'
        'rgba(242,106,33,.16),transparent 60%%),radial-gradient(40%% 60%% at 96%% 0%%,'
        'rgba(169,30,71,.16),transparent 60%%)"></div>'
        '<div style="position:absolute;inset:0;background:repeating-linear-gradient(125deg,'
        'rgba(255,255,255,.03) 0 1px,transparent 1px 13px)"></div>'
        '<div class="gx-in" style="position:relative;padding-top:96px;padding-bottom:72px">'
        '<h1 class="hero-h1" style="font:700 %dpx/1.05 Archivo;letter-spacing:-.025em;'
        'color:#fff;margin:0;max-width:20ch">%s%s.</h1>'
        '<div style="display:flex;gap:16px;margin-top:22px;max-width:62ch">'
        '<div style="width:3px;background:#F26A21;border-radius:2px;flex:none"></div>'
        '<p style="font:400 18px/1.55 %s;color:rgba(255,255,255,.85);margin:0">%s</p>'
        '</div></div></section>'
        % (size, esc(heading), accent_html, SANS, esc(intro))
    )


def category_chips(categories, active, base):
    """Real links now, not JS-toggled spans."""
    out = ['<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:34px">']
    items = [("All", base)] + [(c["name"], c["url"]) for c in categories]
    for name, url in items:
        on = (active or "All") == name
        style = ("font:500 11px %s;letter-spacing:.1em;text-transform:uppercase;"
                 "padding:9px 15px;border-radius:22px;white-space:nowrap;"
                 "text-decoration:none;display:inline-block;" % MONO)
        style += ("border:1px solid #F26A21;background:#F26A21;color:#fff"
                  if on else
                  "border:1px solid rgba(11,30,59,.16);background:#fff;color:#5B647C")
        out.append('<a class="ins-chip" href="%s" style="%s"%s>%s</a>'
                   % (esc(url), style,
                      ' aria-current="page"' if on else "", esc(name)))
    out.append("</div>")
    return "".join(out)


def newsletter():
    """Ported verbatim from insights.html — rewired to the API in Phase 6."""
    return (
        '<section style="background:#0B1E3B;"><div class="gx-in" '
        'style="padding-top:74px;padding-bottom:74px;">'
        '<div style="display:flex;justify-content:space-between;align-items:center;'
        'gap:30px;flex-wrap:wrap"><div style="max-width:36ch">'
        '<h2 style="font:700 32px/1.1 Archivo;letter-spacing:-.02em;color:#fff;margin:0">'
        'The brief, once a month.</h2>'
        '<p style="font:400 15px/1.6 %s;color:rgba(255,255,255,.6);margin:14px 0 0">'
        'Regulatory changes, threat trends and practical guidance — no noise.</p></div>'
        '<form id="nlForm" style="display:flex;gap:10px;flex-wrap:wrap">'
        '<input type="email" name="email" required aria-label="Work email" '
        'placeholder="Work email" style="background:rgba(255,255,255,.06);'
        'border:1px solid rgba(255,255,255,.2);border-radius:9px;color:#fff;'
        'font:500 15px %s;padding:14px 16px;min-width:240px;outline:none" />'
        '<button class="gx-cta" style="border:none;cursor:pointer;background:#F26A21;'
        'color:#fff;font:600 15px %s;padding:14px 24px;border-radius:9px">Subscribe →</button>'
        '</form><div id="nlNote" style="display:none;margin-top:14px;font:500 13px %s;'
        'color:#F4915A"></div></div></div></section>'
        % (SANS, SANS, SANS, SANS)
    )


def insights_index(site, posts, categories, active=None, heading_override=None,
                   intro_override=None, base="/insights/"):
    """The listing page: hero, chips, grid, newsletter."""
    ins = site["insights"]
    if heading_override:
        head_html = hero(heading_override, None, intro_override or ins["intro"], 48)
    else:
        head_html = hero(ins["heading"], ins["headingAccent"], ins["intro"])

    if posts:
        grid = ('<div id="insGrid" class="svc-grid" style="display:grid;'
                'grid-template-columns:repeat(3,1fr);gap:26px">%s</div>'
                % "".join(post_card(p) for p in posts))
    else:
        # The old page had no empty state: a chip matching zero posts rendered
        # a blank grid with no explanation.
        grid = ('<p style="font:400 16px/1.6 %s;color:#5B647C">No articles here yet. '
                '<a href="/insights/" style="color:#F26A21">Browse all insights →</a></p>'
                % SANS)

    return (
        "%s"
        '<section style="background:#fff;"><div class="gx-in" '
        'style="padding-top:80px;padding-bottom:80px;">%s'
        '<h2 style="position:absolute;width:1px;height:1px;overflow:hidden;'
        'clip:rect(0 0 0 0);white-space:nowrap">All articles</h2>%s</div></section>%s'
        % (head_html, category_chips(categories, active, base), grid, newsletter())
    )


# Kept as a plain constant rather than inlined into the %-formatted template:
# the CSS is full of `100%!important`, which %-formatting reads as a format spec.
ROLES_CSS = """<style>
@media(max-width:820px){
  .rl-well{flex-direction:column!important}
  .rl-well .rl-cell{border-right:none!important;border-bottom:1px solid rgba(11,30,59,.12)!important;width:100%!important}
  .rl-well .rl-btn{width:100%!important;justify-content:center!important;min-height:54px!important}
}
.rl-chip:hover{border-color:#F26A21!important}
.gx-role-row:hover{background:#FBFBFD}
select.rl-sel{border:none;outline:none;background:transparent;font:600 15px 'IBM Plex Sans';color:#0B1E3B;cursor:pointer;width:100%}
</style>
"""


def role_row(role):
    """One row in the roles list — ported byte-for-byte from roles.js roleRow()
    so the static rows and the JS-filtered rows are indistinguishable."""
    pill = ('<span style="font:500 11px %s;letter-spacing:.06em;color:#5B647C;'
            'border:1px solid rgba(11,30,59,.14);padding:6px 12px;border-radius:20px;'
            'white-space:nowrap">%s</span>')
    return (
        '<a href="%s" class="gx-role-row" style="text-decoration:none;display:flex;'
        'align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;'
        'padding:22px 26px;border-bottom:1px solid rgba(11,30,59,.09)">'
        '<div style="display:flex;flex-direction:column;gap:6px;flex:1 1 240px;min-width:0">'
        '<span style="font:600 19px Archivo;color:#0B1E3B">%s</span>'
        '<span style="font:500 11px %s;letter-spacing:.12em;color:#C4632A">%s</span></div>'
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">%s%s'
        '<span style="font:600 14px %s;color:#F26A21;display:inline-flex;'
        'align-items:center;gap:6px;margin-left:6px">View role '
        '<span style="font-size:15px">&rarr;</span></span></div></a>'
        % (esc(role["url"]), esc(role["title"]), MONO, esc(role["team"]),
           pill % (MONO, esc(role["location"])),
           pill % (MONO, esc(role["employmentType"])), SANS)
    )


def roles_index(site, roles, teams, locations, types):
    """The jobs board.

    Critically different from the old insights page: all rows ship as static,
    indexable HTML. roles.js replaces #resultRows only once a filter is
    applied, so the crawlable list and the interactive list come from one
    source and cannot drift — which is exactly the bug insights.js had, where
    an unconditional grid.innerHTML overwrote hand-written cards.
    """
    cfg = site["roles"]
    opts = lambda vals, label: "".join(  # noqa: E731
        ['<option value="All">%s</option>' % esc(label)]
        + ['<option value="%s">%s</option>' % (esc(v), esc(v)) for v in vals])

    chip = ("font:500 11px %s;letter-spacing:.1em;text-transform:uppercase;"
            "padding:9px 15px;border-radius:22px;cursor:pointer;white-space:nowrap;"
            "border:1px solid rgba(11,30,59,.16);background:#fff;color:#5B647C" % MONO)
    chips = "".join('<span class="rl-chip" data-team="%s" style="%s">%s</span>'
                    % (esc(t), chip, esc(t)) for t in ["All"] + list(teams))

    cell = ("flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:6px 20px;"
            "border-right:1px solid rgba(11,30,59,.12);min-width:190px")
    lbl = "font:500 10px %s;letter-spacing:.14em;color:#8A92A4;flex:none" % MONO

    return ROLES_CSS + (
        '<main id="gx-main">'
        '<section style="position:relative;overflow:hidden;background:#07142B">'
        '<div style="position:absolute;inset:0;background:url(\'/assets/images/hero-city.jpg\') '
        'center/cover no-repeat"></div>'
        '<div style="position:absolute;inset:0;background:linear-gradient(4deg,'
        'rgba(6,16,31,.97) 6%%,rgba(6,16,31,.6) 44%%,transparent 72%%)"></div>'
        '<div style="position:absolute;inset:0;background:linear-gradient(90deg,'
        'rgba(6,16,31,.86) 0%%,rgba(6,16,31,.3) 42%%,transparent 66%%)"></div>'
        '<div class="gx-in" style="position:relative;padding-top:104px;padding-bottom:44px">'
        '<h1 style="font:700 52px/1.05 Archivo;letter-spacing:-.02em;color:#fff;'
        'margin:0 0 14px;max-width:18ch;text-shadow:0 2px 34px rgba(0,0,0,.45)">%s</h1>'
        '<p style="font:400 18px/1.55 %s;color:rgba(255,255,255,.82);margin:0;'
        'max-width:60ch">%s</p>'
        '<div class="rl-well" style="display:flex;align-items:stretch;background:#fff;'
        'border-radius:12px;margin-top:34px;max-width:920px;'
        'box-shadow:0 34px 70px -30px rgba(0,0,0,.65);overflow:hidden">'
        '<div class="rl-cell" style="flex:1 1 auto;display:flex;align-items:center;'
        'gap:12px;padding:6px 20px;border-right:1px solid rgba(11,30,59,.12);min-width:0">'
        '<span style="font-size:18px;color:#8A92A4;flex:none">&#9906;</span>'
        '<input id="rq" placeholder="Search roles — e.g. penetration tester, SOC, ISO 27001…" '
        'aria-label="Search roles by keyword" style="width:100%%;border:none;outline:none;'
        'background:transparent;font:500 15px %s;color:#0B1E3B;padding:16px 0" /></div>'
        '<div class="rl-cell" style="%s"><span style="%s">LOCATION</span>'
        '<select id="rloc" class="rl-sel" aria-label="Filter by location">%s</select></div>'
        '<div class="rl-cell" style="%s"><span style="%s">TYPE</span>'
        '<select id="rtype" class="rl-sel" aria-label="Filter by employment type">%s</select>'
        '</div></div></div></section>'
        '<section style="background:#fff"><div class="gx-in" '
        'style="padding-top:54px;padding-bottom:80px">'
        '<div id="teamChips" style="display:flex;gap:10px;flex-wrap:wrap;'
        'margin-bottom:26px">%s</div>'
        '<div style="font:500 12px %s;letter-spacing:.1em;color:#8A92A4;margin-bottom:14px">'
        'SHOWING <span id="resCount">%d</span> OF <span id="resTotal">%d</span> ROLES</div>'
        '<div id="resultsWrap" style="border:1px solid rgba(11,30,59,.1);border-radius:16px;'
        'overflow:hidden"><div id="resultRows">%s</div></div>'
        '<div id="resEmpty" style="display:none;padding:40px 26px;text-align:center;'
        'font:400 16px/1.6 %s;color:#5B647C">No roles match those filters. '
        '<a href="/careers/roles/" style="color:#F26A21">Clear filters →</a></div>'
        '</div></section></main>'
        % (esc(cfg["heading"]), SANS, esc(cfg["intro"]), SANS,
           cell, lbl, opts(locations, "All locations"),
           cell, lbl, opts(types, "All types"),
           chips, MONO, len(roles), len(roles),
           "".join(role_row(r) for r in roles), SANS)
    )


def job_page(site, role, body_html):
    """Role detail + apply card — ported from job.html."""
    pill = ('<span style="font:500 11px %s;letter-spacing:.06em;color:rgba(255,255,255,.8);'
            'border:1px solid rgba(255,255,255,.22);padding:6px 12px;border-radius:20px;'
            'white-space:nowrap">%s</span>')
    metas = "".join(pill % (MONO, esc(v)) for v in
                    [role["location"], role["employmentType"]] if v)

    def bullets(title, items):
        if not items:
            return ""
        lis = "".join("<li>%s</li>" % esc(i) for i in items)
        return ('<div style="margin-top:26px">'
                '<h3 style="font:500 13px %s;letter-spacing:.12em;text-transform:uppercase;'
                'color:#F26A21;margin:0 0 12px">%s</h3>'
                '<ul style="margin:0;padding-left:20px;font:400 15px/1.8 %s;color:#33405C">'
                '%s</ul></div>' % (MONO, esc(title), SANS, lis))

    closed = ""
    if role.get("archived"):
        closed = ('<p style="background:#FFF4EC;border:1px solid rgba(242,106,33,.3);'
                  'border-radius:10px;padding:14px 16px;font:400 14px/1.6 %s;color:#5B647C;'
                  'margin:0 0 20px">This role is closed. '
                  '<a href="/careers/roles/" style="color:#F26A21">See current openings →</a>'
                  '</p>' % SANS)

    return (
        '<main id="gx-main" style="background:#F6F7F9;min-height:70vh;padding:0 0 90px">'
        '<div style="background:#07142B;padding:26px 0 30px">'
        '<div style="max-width:1208px;margin:0 auto;padding:0 24px">'
        '<a href="/careers/roles/" style="text-decoration:none;font:500 12px %s;'
        'letter-spacing:.12em;color:rgba(255,255,255,.6)">&larr; ALL OPEN ROLES</a>'
        '<div style="margin-top:18px">'
        '<div style="font:500 11px %s;letter-spacing:.16em;color:#F4915A;'
        'text-transform:uppercase">%s</div>'
        '<h1 style="font:700 40px/1.1 Archivo;letter-spacing:-.015em;color:#fff;'
        'margin:8px 0 14px">%s</h1>'
        '<div style="display:flex;gap:10px;flex-wrap:wrap">%s</div></div></div></div>'
        '<div style="max-width:1208px;margin:0 auto;padding:0 24px;margin-top:34px;'
        'display:grid;grid-template-columns:1fr 380px;gap:40px;align-items:start" '
        'class="job-grid"><div>%s'
        '<div class="gx-prose" style="background:#fff;border:1px solid rgba(11,30,59,.08);'
        'border-radius:16px;padding:34px 38px">'
        '<div style="font:400 16px/1.7 %s;color:#33405C">%s</div>%s%s</div></div>'
        '<aside id="applyCard" style="position:sticky;top:96px;background:#fff;'
        'border:1px solid rgba(11,30,59,.1);border-radius:16px;padding:28px 26px;'
        'box-shadow:0 30px 60px -40px rgba(7,20,43,.4)">'
        '<h2 style="font:600 20px Archivo;color:#0B1E3B;margin:0 0 4px">Apply for this role</h2>'
        '<p style="font:400 13px/1.5 %s;color:#5B647C;margin:0 0 18px">'
        'Attach your CV and we\'ll be in touch about next steps.</p>'
        '<div id="applyMount" data-role-slug="%s" data-role-title="%s" '
        'data-apply-email="%s"></div></aside></div></main>'
        % (MONO, MONO, esc(role["team"]), esc(role["title"]), metas, closed,
           SANS, body_html,
           bullets("What you'll do", role.get("responsibilities")),
           bullets("What we're looking for", role.get("requirements")),
           SANS, esc(role["slug"]), esc(role["title"]), esc(role.get("applyEmail") or ""))
    )


def article_page(site, post, body_html, related):
    """The article detail page — article.html's column, now server-rendered."""
    cover = post.get("cover") or {}
    tint = TINTS.get(post["category"], DEFAULT_TINT)
    cover_html = _cover(tint, 320, 16, None, cover.get("src"), cover.get("alt", ""))

    meta_bits = [post["readTime"], post["dateLabel"], post["authorName"]]
    if post.get("updatedLabel"):
        meta_bits.append("Updated " + post["updatedLabel"])

    archived = ""
    if post.get("archived"):
        # Archived posts keep serving so inbound links and rankings survive,
        # but say so rather than passing as current.
        archived = ('<p style="background:#FFF4EC;border:1px solid rgba(242,106,33,.3);'
                    'border-radius:10px;padding:14px 16px;font:400 14px/1.6 %s;'
                    'color:#5B647C;margin:0 0 24px">This article has been archived '
                    'and is no longer maintained.</p>' % SANS)

    rel = ""
    if related:
        rel = (
            '<section style="background:#F6F7F9;border-top:1px solid rgba(11,30,59,.08)">'
            '<div class="gx-in" style="padding-top:64px;padding-bottom:72px">'
            '<h2 style="font:700 28px/1.1 Archivo;letter-spacing:-.02em;color:#0B1E3B;'
            'margin:0 0 28px">More on this</h2>'
            '<div class="svc-grid" style="display:grid;grid-template-columns:repeat(3,1fr);'
            'gap:26px">%s</div></div></section>'
            % "".join(post_card(p) for p in related)
        )

    return (
        '<main id="gx-main" style="background:#fff;min-height:70vh;padding:0 0 90px">'
        '<div style="max-width:1208px;margin:0 auto;padding:0 24px;padding-top:34px">'
        '<a href="/insights/" style="text-decoration:none;font:500 12px %s;'
        'letter-spacing:.12em;color:#5B647C">&larr; ALL INSIGHTS</a></div>'
        '<article class="gx-prose" style="max-width:760px;margin:0 auto;padding:22px 24px 0">'
        '<div style="font:500 11px %s;letter-spacing:.16em;color:#F26A21;'
        'text-transform:uppercase"><a href="%s" style="color:#F26A21;'
        'text-decoration:none">%s</a></div>'
        '<h1 style="font:700 40px/1.15 Archivo;letter-spacing:-.015em;color:#0B1E3B;'
        'margin:10px 0 14px">%s</h1>'
        '<div style="font:500 12px %s;letter-spacing:.08em;color:#8A92A4;'
        'margin-bottom:24px">%s</div>'
        '<div style="margin-bottom:30px">%s</div>%s'
        '<div style="font:400 17px/1.8 %s;color:#33405C">%s</div>'
        '</article></main>%s'
        % (MONO, MONO, esc(post["categoryUrl"]), esc(post["categoryName"]),
           esc(post["title"]), MONO, esc("  ·  ".join(meta_bits)),
           cover_html, archived, SANS, body_html, rel)
    )
