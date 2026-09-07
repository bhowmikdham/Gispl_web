"""Page bodies for the service catalogue and the industry pages.

Four page types, all rendered from content/ by scripts/build-content.py:

    catalogue_page   /services/                every capability, grouped by practice
    practice_page    /services/<practice>/     one practice area and its capabilities
    capability_page  /services/<capability>/   one framework, standard or service
    industry_page    /industries/<sector>/      one sector

They borrow the visual language the hand-written pages already use — the dark
hero from the insights hub, .gx-section-heading, the icon/number/arrow tile,
the numbered step list from service-vapt.html, the <details> FAQ — so a
generated page is indistinguishable from a hand-written one. What is new is
the *shape*: every capability page walks the visitor from "what is this" to
"who does it apply to" to "what is at stake" to "how GISPL delivers it" to a
consultant, in that order, because that is the order in which a buyer decides.

Markup rules follow templates.py: inline styles everywhere except where a
media query is needed, which lives under the .cp-* classes in site.css.
"""
from .html import esc

MONO = "'IBM Plex Mono'"
SANS = "'IBM Plex Sans'"

# The tile icons, by name. Stroke-only, 24-box, drawn to the same weight as the
# ones on index.html so a generated tile sits next to a hand-written one.
ICONS = {
    "shield": '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
    "clipboard": '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6m-6 5 2 2 4-4"/>',
    "card": '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
    "pulse": '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    "magnifier": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6M7 10h6"/>',
    "graduation": '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6M22 9v7"/>',
    "sliders": '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    "cloud": '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11a3.5 3.5 0 0 0 1 7Z"/>',
    "lock": '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>',
    "network": '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5m0 0-5.5 5.5M12 12l5.5 5.5"/>',
    "bug": '<path d="M9 8V6a3 3 0 0 1 6 0v2M5 12h14M6 16l-2 2M18 16l2 2M6 9 4 7m14 2 2-2"/><rect x="8" y="8" width="8" height="11" rx="4"/>',
    "eye": '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    "server": '<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "fingerprint": '<path d="M7 12a5 5 0 0 1 10 0c0 3-1 6-2 8M9.5 12a2.5 2.5 0 0 1 5 0c0 3-.5 5-1.5 8M12 12v2M4.5 12a7.5 7.5 0 0 1 15 0M5 16c.5 1 1 2 2 3"/>',
    "database": '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    "brain": '<path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3h1V4H9Zm6 0a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v1a3 3 0 0 1-3 3h-1V4h1Z"/>',
    "factory": '<path d="M3 21V9l5 3V9l5 3V9l5 3V4h3v17H3Z"/><path d="M7 17h2m3 0h2"/>',
    "bank": '<path d="M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M3 18h18"/>',
    "hospital": '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/>',
    "building": '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M11 21v-3h2v3"/>',
    "phone": '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    "scale": '<path d="M12 3v18M5 21h14M3 7h18M6 7l-3 7a3 3 0 0 0 6 0L6 7Zm12 0-3 7a3 3 0 0 0 6 0l-3-7Z"/>',
    "plane": '<path d="M10 20 8 22v-1l1-3-6-2v-1l6-2V9L3 6V5l7 1 5-3 1 1-3 5v3l6 2v1l-6 2-1 3Z"/>',
    "chip": '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3"/>',
    "search-doc": '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M14 3v5h5M14 3l5 5"/><circle cx="16.5" cy="16.5" r="3"/><path d="m19 19 2 2"/>',
    "money": '<path d="M3 7h18v10H3zM7 7v10m10-10v10"/><circle cx="12" cy="12" r="2.5"/>',
    "wifi": '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
    "refresh": '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M4 4v5h5M20 20v-5h-5"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/>',
    "cart": '<circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11L21 8H7"/>',
    "alert": '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4m0 3h.01"/>',
}
PRACTICE_ICONS = {
    "compliance-and-certification": "clipboard",
    "consulting-and-maintenance": "sliders",
    "assessments-and-testing": "shield",
    "implementation-and-managed-services": "pulse",
    "cyber-forensics-and-investigations": "magnifier",
}


def icon(name):
    paths = ICONS.get(name) or ICONS["shield"]
    return ('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" '
            'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true">%s</svg>' % paths)


CHECK = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M4.5 12.5l5 5L19.5 7"/></svg>')


def _contact_url(service=None, industry=None):
    """contact.html with the enquiry pre-selected. contact.js reads these."""
    from urllib.parse import urlencode
    q = {}
    if service:
        q["service"] = service
    if industry:
        q["industry"] = industry
    return "/contact.html" + ("?" + urlencode(q) if q else "")


# ----------------------------------------------------------------- pieces

def breadcrumb(trail):
    """Small mono trail above an h1. The last item is the current page."""
    parts = []
    for i, (name, url) in enumerate(trail):
        last = i == len(trail) - 1
        if last or not url:
            parts.append('<span style="color:rgba(255,255,255,.55)">%s</span>' % esc(name))
        else:
            parts.append('<a href="%s" style="color:rgba(255,255,255,.72);text-decoration:none">%s</a>'
                         % (esc(url), esc(name)))
    return ('<nav aria-label="Breadcrumb" style="font:500 12px %s;letter-spacing:.12em;'
            'text-transform:uppercase;display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px">'
            '%s</nav>' % (MONO, '<span aria-hidden="true" style="color:rgba(255,255,255,.3)">/</span>'.join(parts)))


def dark_hero(trail, title, lead, ctas="", below="", size=54):
    return (
        '<section id="gx-main" class="cp-hero">'
        '<div style="position:absolute;inset:0;background:radial-gradient(60%% 80%% at 78%% 12%%,'
        'rgba(242,106,33,.16),transparent 60%%),radial-gradient(40%% 60%% at 96%% 0%%,'
        'rgba(169,30,71,.16),transparent 60%%)"></div>'
        '<div style="position:absolute;inset:0;background:repeating-linear-gradient(125deg,'
        'rgba(255,255,255,.03) 0 1px,transparent 1px 13px)"></div>'
        '<div class="gx-in" style="position:relative;padding-top:64px;padding-bottom:64px">'
        '%s'
        '<h1 class="hero-h1" style="font:700 %dpx/1.05 Archivo;letter-spacing:-.025em;'
        'color:#fff;margin:0;max-width:20ch">%s</h1>'
        '<div style="display:flex;gap:16px;margin-top:22px;max-width:62ch">'
        '<div style="width:3px;background:#F26A21;border-radius:2px;flex:none"></div>'
        '<p style="font:400 18px/1.55 %s;color:rgba(255,255,255,.85);margin:0">%s</p>'
        '</div>%s%s</div></section>'
        % (breadcrumb(trail), size, esc(title), SANS, esc(lead), ctas, below)
    )


def hero_ctas(primary_label, primary_url, secondary_label=None, secondary_url=None):
    out = ['<div style="display:flex;gap:14px;margin-top:32px;flex-wrap:wrap">',
           '<a class="gx-cta" href="%s" style="text-decoration:none;display:inline-flex;'
           'align-items:center;gap:9px;background:#F26A21;color:#fff;font:600 15px %s;'
           'padding:15px 26px;border-radius:10px">%s <span style="font-size:16px">&rarr;</span></a>'
           % (esc(primary_url), SANS, esc(primary_label))]
    if secondary_label:
        out.append('<a href="%s" style="text-decoration:none;display:inline-flex;align-items:center;'
                   'gap:9px;border:1px solid rgba(255,255,255,.4);color:#fff;font:600 15px %s;'
                   'padding:15px 26px;border-radius:10px">%s</a>'
                   % (esc(secondary_url), SANS, esc(secondary_label)))
    out.append("</div>")
    return "".join(out)


def facts_strip(facts):
    """The at-a-glance strip: standard, owner, who it applies to, cadence."""
    if not facts:
        return ""
    cells = "".join(
        '<div class="cp-fact"><div class="cp-fact-l">%s</div><div class="cp-fact-v">%s</div></div>'
        % (esc(f.get("label", "")), esc(f.get("value", ""))) for f in facts[:4])
    return '<dl class="cp-facts" style="margin:44px 0 0">%s</dl>' % cells


def regulator_chips(items):
    if not items:
        return ""
    chip = ('<span style="font:500 11px %s;letter-spacing:.08em;color:rgba(255,255,255,.82);'
            'border:1px solid rgba(255,255,255,.22);padding:7px 13px;border-radius:20px;'
            'white-space:nowrap">%s</span>')
    return ('<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:30px">%s</div>'
            % "".join(chip % (MONO, esc(x)) for x in items))


def section_heading(title, side=None, dark=False):
    color = "#fff" if dark else "#0B1E3B"
    side_html = ""
    if side:
        side_html = ('<p%s>%s</p>' % (' style="color:rgba(255,255,255,.7)"' if dark else "", esc(side)))
    return ('<div class="gx-section-heading"><h2 style="font:700 40px/1.07 Archivo;'
            'letter-spacing:-.02em;color:%s;margin:0">%s</h2>%s</div>'
            % (color, esc(title), side_html))


def check_list(items):
    if not items:
        return ""
    return ('<ul class="cp-check">%s</ul>'
            % "".join('<li>%s<span>%s</span></li>' % (CHECK, esc(x)) for x in items))


def stakes(items):
    if not items:
        return ""
    return ('<div class="cp-stakes">%s</div>'
            % "".join('<div class="cp-stake">%s</div>' % esc(x) for x in items))


def steps_list(steps, dark=True):
    """The numbered engagement list from service-vapt.html. `data-gx-stagger`
    lets site.js reveal the rows one after another."""
    if not steps:
        return ""
    line = "rgba(255,255,255,.12)" if dark else "rgba(11,30,59,.12)"
    head = "#fff" if dark else "#0B1E3B"
    body = "rgba(255,255,255,.66)" if dark else "#5B647C"
    rows = []
    for i, st in enumerate(steps, 1):
        rows.append(
            '<div class="cp-step" style="border-top:1px solid %s">'
            '<span style="font:500 13px %s;color:#F26A21;flex:none;padding-top:3px">%02d</span>'
            '<div><h3 style="font:600 19px Archivo;color:%s;margin:0 0 7px">%s</h3>'
            '<p style="font:400 15px/1.6 %s;color:%s;margin:0;max-width:60ch">%s</p></div></div>'
            % (line, MONO, i, head, esc(st.get("title", "")), SANS, body, esc(st.get("text", ""))))
    return ('<div class="cp-steps" data-gx-stagger style="border-bottom:1px solid %s">%s</div>'
            % (line, "".join(rows)))


def deliverables_grid(items):
    if not items:
        return ""
    cards = []
    for i, d in enumerate(items, 1):
        cards.append(
            '<div class="gx-ben" style="background:#fff;border:1px solid rgba(11,30,59,.1);'
            'border-radius:14px;display:flex;flex-direction:column">'
            '<div style="font:500 12px %s;letter-spacing:.1em;color:#C4632A;margin-bottom:14px">%02d</div>'
            '<h3 style="font:600 19px Archivo;color:#0B1E3B;margin:0 0 8px">%s</h3>'
            '<p style="font:400 15px/1.6 %s;color:#5B647C;margin:0">%s</p></div>'
            % (MONO, i, esc(d.get("title", "")), SANS, esc(d.get("text", ""))))
    return ('<div class="ben-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">%s</div>'
            % "".join(cards))


def faq_block(items):
    """<details> accordion — the same markup the hand pages use, so the
    FAQPage JSON-LD built from the data matches what is on screen."""
    if not items:
        return ""
    out = ['<div style="border-bottom:1px solid rgba(11,30,59,.12)">']
    for qa in items:
        out.append(
            '<details class="gx-faq" style="border-top:1px solid rgba(11,30,59,.12)">'
            '<summary style="display:flex;justify-content:space-between;align-items:center;'
            'gap:18px;padding:19px 0;cursor:pointer">'
            '<span style="font:600 17px Archivo;color:#0B1E3B">%s</span>'
            '<span class="gx-faq-x" style="flex:none;font:500 22px/1 %s;color:#F26A21;'
            'transition:transform .2s ease">+</span></summary>'
            '<p style="font:400 15px/1.65 %s;color:#5B647C;margin:0;padding:0 40px 20px 0;'
            'max-width:64ch">%s</p></details>'
            % (esc(qa.get("q", "")), SANS, SANS, esc(qa.get("a", ""))))
    out.append("</div>")
    return "".join(out)


def faq_section(items, title="Questions we hear on the first call."):
    if not items:
        return ""
    return (
        '<section style="background:#fff"><div class="gx-in" style="padding-top:80px;'
        'padding-bottom:80px"><div class="why-grid" style="display:grid;'
        'grid-template-columns:1fr 1.4fr;gap:60px;align-items:start">'
        '<div><h2 style="font:700 36px/1.1 Archivo;letter-spacing:-.02em;color:#0B1E3B;'
        'margin:0;max-width:16ch">%s</h2>'
        '<p style="font:400 15px/1.65 %s;color:#5B647C;margin:18px 0 0;max-width:38ch">'
        'Anything else — ask, and you get a straight answer rather than a brochure.</p></div>'
        '<div>%s</div></div></div></section>' % (esc(title), SANS, faq_block(items)))


def tile(cap, number, verb="Explore"):
    return (
        '<a class="gx-svc-card gx-service-tile" href="%s"><div class="gx-card-top">'
        '<span class="gx-card-icon">%s</span><span class="gx-card-number">%02d</span></div>'
        '<h3>%s</h3><p>%s</p><span class="gx-card-footer">%s <span class="gx-card-arrow" '
        'aria-hidden="true">&#8599;</span></span></a>'
        % (esc(cap["url"]), icon(cap.get("icon") or PRACTICE_ICONS.get(cap.get("practice"), "shield")),
           number, esc(cap["title"]), esc(cap.get("summary") or cap.get("tagline", "")), esc(verb)))


def tiles(caps, verb="Explore"):
    if not caps:
        return ""
    return ('<div class="svc-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">%s</div>'
            % "".join(tile(c, i, verb) for i, c in enumerate(caps, 1)))


def industry_chips(inds):
    if not inds:
        return ""
    chip = ('<a href="%s" style="text-decoration:none;font:500 12px %s;letter-spacing:.06em;'
            'color:#0B1E3B;border:1px solid rgba(11,30,59,.16);background:#fff;padding:9px 15px;'
            'border-radius:22px;white-space:nowrap;display:inline-flex;align-items:center;'
            'min-height:40px">%s</a>')
    return ('<div style="display:flex;gap:10px;flex-wrap:wrap">%s</div>'
            % "".join(chip % (esc(i["url"]), MONO, esc(i["title"])) for i in inds))


def side_card(heading, text, cta_label, cta_url, site, links=None, links_title=None):
    """The sticky consultant card. Phone and email come from site.yml so the
    number here can never disagree with contact.html."""
    phone = site.get("phone", "")
    phone_display = phone.replace("+91 ", "") if phone.startswith("+91 ") else phone
    email = site.get("email", "")
    extra = ""
    if links:
        extra = (
            '<div style="margin-top:26px;padding-top:22px;border-top:1px solid rgba(11,30,59,.1)">'
            '<div style="font:500 11px %s;letter-spacing:.14em;color:#8A92A4;margin-bottom:12px">%s</div>'
            '<div style="display:flex;flex-direction:column;gap:9px">%s</div></div>'
            % (MONO, esc(links_title or "RELATED"),
               "".join('<a href="%s" style="text-decoration:none;font:500 14px %s;color:#0B1E3B;'
                       'display:flex;justify-content:space-between;gap:10px">'
                       '<span>%s</span><span style="color:#F26A21">&rarr;</span></a>'
                       % (esc(u), SANS, esc(n)) for n, u in links)))
    return (
        '<aside class="cp-aside" style="background:#fff;border:1px solid rgba(11,30,59,.1);'
        'border-radius:16px;padding:28px 26px;box-shadow:0 30px 60px -40px rgba(7,20,43,.4)">'
        '<h2 style="font:600 21px Archivo;color:#0B1E3B;margin:0 0 8px">%s</h2>'
        '<p style="font:400 14px/1.6 %s;color:#5B647C;margin:0 0 18px">%s</p>'
        '<a class="gx-cta" href="%s" style="text-decoration:none;display:flex;justify-content:center;'
        'align-items:center;gap:9px;background:#F26A21;color:#fff;font:600 15px %s;'
        'padding:14px 22px;border-radius:10px">%s <span>&rarr;</span></a>'
        '<div style="margin-top:16px;display:flex;flex-direction:column;gap:6px;font:400 13px/1.5 %s;'
        'color:#5B647C"><span>Toll-free (India) <a href="tel:%s" style="color:#0B1E3B;'
        'text-decoration:none;font-weight:600">%s</a></span>'
        '<span><a href="mailto:%s" style="color:#0B1E3B;text-decoration:none;font-weight:600">%s</a></span></div>'
        '%s</aside>'
        % (esc(heading), SANS, esc(text), esc(cta_url), SANS, esc(cta_label), SANS,
           esc(phone.replace(" ", "")), esc(phone_display), esc(email), esc(email), extra)
    )


def proof_band(items):
    if not items:
        return ""
    cells = "".join(
        '<div><div class="gx-count" style="font:700 40px/1 Archivo;letter-spacing:-.02em;color:#fff">%s</div>'
        '<div style="font:500 12px %s;letter-spacing:.1em;color:rgba(255,255,255,.62);margin-top:10px;'
        'text-transform:uppercase">%s</div></div>'
        % (esc(p.get("value", "")), MONO, esc(p.get("label", ""))) for p in items[:4])
    return ('<div class="ben-grid" style="display:grid;grid-template-columns:repeat(%d,1fr);gap:26px;'
            'padding:34px 36px;background:#0B1E3B;border-radius:16px;margin-top:40px">%s</div>'
            % (min(4, len(items)), cells))


def cta_band(title, text, cta_label, cta_url):
    return (
        '<section style="background:#07142B"><div class="gx-in" style="display:flex;'
        'justify-content:space-between;align-items:center;gap:30px;flex-wrap:wrap;'
        'padding-top:62px;padding-bottom:62px">'
        '<div style="max-width:52ch"><h2 style="font:700 34px/1.1 Archivo;letter-spacing:-.02em;'
        'color:#fff;margin:0">%s</h2>'
        '<p style="font:400 16px/1.6 %s;color:rgba(255,255,255,.66);margin:12px 0 0">%s</p></div>'
        '<a class="gx-cta" href="%s" style="text-decoration:none;display:inline-flex;align-items:center;'
        'gap:9px;background:#F26A21;color:#fff;font:600 15px %s;padding:16px 28px;border-radius:10px;'
        'flex:none">%s <span>&rarr;</span></a></div></section>'
        % (esc(title), SANS, esc(text), esc(cta_url), SANS, esc(cta_label))
    )


def insights_section(posts, post_card, title="Reading on this topic."):
    if not posts:
        return ""
    return (
        '<section style="background:#F6F7F9;border-top:1px solid rgba(11,30,59,.08)">'
        '<div class="gx-in" style="padding-top:72px;padding-bottom:80px">'
        '<div class="gx-section-heading"><h2 style="font:700 36px/1.1 Archivo;letter-spacing:-.02em;'
        'color:#0B1E3B;margin:0">%s</h2>'
        '<p><a href="/insights/" style="color:#C4632A;text-decoration:none;font-weight:600">'
        'All insights &rarr;</a></p></div>'
        '<div class="svc-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:26px">%s</div>'
        '</div></section>' % (esc(title), "".join(post_card(p) for p in posts[:3]))
    )


# ------------------------------------------------------------------ pages

def capability_page(site, cap, body_html, related, inds, posts, post_card, siblings):
    """One capability. See the module docstring for the order and why."""
    service_label = cap["label"] if cap["label"] != cap["title"] else cap["title"]
    enquiry = _contact_url(service=service_label)

    trail = [("Home", "/"), ("Services", "/services/"),
             (cap["practiceShort"], cap["practiceUrl"]), (cap["title"], None)]
    hero = dark_hero(trail, cap["title"], cap["tagline"] or cap["summary"],
                     hero_ctas("Request a proposal", enquiry,
                               "All " + cap["practiceShort"].lower() + " services", cap["practiceUrl"]),
                     facts_strip(cap["facts"]))

    links = [(c["title"], c["url"]) for c in siblings if c["slug"] != cap["slug"]][:6]
    aside = side_card("Talk to a consultant",
                      "A scoped proposal for %s, usually within two working days. No commitment, "
                      "no brochure — a conversation with someone who has done this before." % cap["title"],
                      "Request a proposal", enquiry, site, links,
                      "MORE IN " + cap["practiceShort"].upper())

    applies = ""
    if cap["appliesTo"]:
        applies = ('<div style="margin-top:44px"><h2 style="font:700 28px/1.15 Archivo;letter-spacing:-.015em;'
                   'color:#0B1E3B;margin:0 0 20px">Who this applies to</h2>%s</div>'
                   % check_list(cap["appliesTo"]))
    at_stake = ""
    if cap["stakes"]:
        at_stake = ('<div style="margin-top:44px"><h2 style="font:700 28px/1.15 Archivo;letter-spacing:-.015em;'
                    'color:#0B1E3B;margin:0 0 20px">What is at stake</h2>%s</div>'
                    % stakes(cap["stakes"]))

    explainer = (
        '<section style="background:#fff"><div class="gx-in" style="padding-top:72px;padding-bottom:80px">'
        '<div class="cp-grid"><div>'
        '<div class="gx-prose" style="font:400 17px/1.8 %s;color:#33405C">%s</div>%s%s</div>%s</div>'
        '</div></section>' % (SANS, body_html, applies, at_stake, aside)
    )

    how = ""
    if cap["steps"]:
        how = ('<section style="background:#0B1E3B"><div class="gx-in" style="padding-top:80px;'
               'padding-bottom:80px">%s%s</div></section>'
               % (section_heading("How GISPL delivers %s." % cap["title"],
                                  "A fixed scope, a named lead and a timeline agreed before work "
                                  "starts — so the answer is agreed rather than discovered.", dark=True),
                  steps_list(cap["steps"], dark=True)))

    gets = ""
    if cap["deliverables"]:
        gets = ('<section style="background:#F4F2ED"><div class="gx-in" style="padding-top:80px;'
                'padding-bottom:80px">%s%s</div></section>'
                % (section_heading("What you get.",
                                   "Evidence you can hand to an auditor, a regulator or a board — "
                                   "not a slide deck."),
                   deliverables_grid(cap["deliverables"])))

    faq = faq_section(cap["faq"])

    rel_html = ""
    if related or inds:
        parts = []
        if related:
            parts.append(section_heading("Often paired with %s." % cap["title"],
                                         "The capabilities clients most often scope alongside this one."))
            parts.append(tiles(related, "Explore service"))
        if inds:
            parts.append('<div style="margin-top:%dpx"><h2 style="font:700 24px/1.15 Archivo;'
                         'letter-spacing:-.015em;color:#0B1E3B;margin:0 0 16px">Where we deliver it</h2>%s</div>'
                         % (48 if related else 0, industry_chips(inds)))
        rel_html = ('<section style="background:#F6F7F9;border-top:1px solid rgba(11,30,59,.08)">'
                    '<div class="gx-in" style="padding-top:80px;padding-bottom:80px">%s</div></section>'
                    % "".join(parts))

    reading = insights_section(posts, post_card)
    band = cta_band("Find out exactly where you stand.",
                    "A scoped proposal for %s — fixed price, named lead, agreed timeline." % cap["title"],
                    "Request a proposal", enquiry)
    return ('<main style="display:contents">%s%s%s%s%s%s%s%s</main>'
            % (hero, explainer, how, gets, faq, rel_html, reading, band))


def practice_page(site, practice, body_html, inds, posts, post_card):
    caps = practice["capabilities"]
    trail = [("Home", "/"), ("Services", "/services/"), (practice["title"], None)]
    count = ('<div style="margin-top:30px;font:500 12px %s;letter-spacing:.12em;color:rgba(255,255,255,.62)">'
             '%d CAPABILITIES</div>' % (MONO, len(caps)))
    hero = dark_hero(trail, practice["title"], practice["lead"],
                     hero_ctas("Request a proposal", _contact_url(service=practice["short"]),
                               "Every capability", "/services/"), count)

    aside = side_card("Talk to a consultant",
                      "Tell us where you are and what the regulator, customer or board is asking "
                      "for. You get a scoped proposal, not a sales call.",
                      "Request a proposal", _contact_url(service=practice["short"]), site,
                      [(i["title"], i["url"]) for i in inds][:6], "SECTORS WE SERVE")
    approach = (
        '<section style="background:#fff"><div class="gx-in" style="padding-top:72px;padding-bottom:80px">'
        '<div class="cp-grid"><div><div class="gx-prose" style="font:400 17px/1.8 %s;color:#33405C">%s</div>%s</div>%s</div>'
        '</div></section>' % (SANS, body_html, proof_band(practice["proof"]), aside)
    )
    grid = ('<section style="background:#F4F2ED"><div class="gx-in" style="padding-top:80px;'
            'padding-bottom:80px">%s%s</div></section>'
            % (section_heading("Every %s capability." % practice["short"].lower(),
                               "Each one has its own page: what it is, who it applies to, what is at "
                               "stake, and how the engagement runs."),
               tiles(caps, "Explore service")))
    how = ""
    if practice["steps"]:
        how = ('<section style="background:#0B1E3B"><div class="gx-in" style="padding-top:80px;'
               'padding-bottom:80px">%s%s</div></section>'
               % (section_heading("How an engagement runs.",
                                  "The same discipline on every %s engagement, whatever its size."
                                  % practice["short"].lower(), dark=True),
                  steps_list(practice["steps"], dark=True)))
    reading = insights_section(posts, post_card)
    band = cta_band("Find out exactly where you stand.",
                    "Scoped proposals for any %s engagement, usually within two working days."
                    % practice["short"].lower(),
                    "Request a proposal", _contact_url(service=practice["short"]))
    return '<main style="display:contents">%s%s%s%s%s%s</main>' % (hero, approach, grid, how, reading, band)


def catalogue_page(site, practices, total):
    trail = [("Home", "/"), ("Services", None)]
    jump = ('<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:34px">%s</div>'
            % "".join('<a href="#%s" style="text-decoration:none;font:500 12px %s;letter-spacing:.06em;'
                      'color:#fff;border:1px solid rgba(255,255,255,.28);padding:9px 15px;border-radius:22px;'
                      'white-space:nowrap;display:inline-flex;align-items:center;gap:8px;min-height:40px">'
                      '%s <span style="color:#F4915A">%02d</span></a>'
                      % (esc(p["slug"]), MONO, esc(p["title"]), len(p["capabilities"])) for p in practices))
    hero = dark_hero(trail, "Every capability, mapped.",
                     "%d capabilities across %d practice areas — each with its own page explaining "
                     "what it is, who it applies to, what is at stake and how GISPL delivers it."
                     % (total, len(practices)),
                     hero_ctas("Request a proposal", _contact_url(), "Services overview", "/services.html"),
                     jump)
    sections = []
    for n, p in enumerate(practices):
        rows = []
        for c in p["capabilities"]:
            rows.append(
                '<a class="cp-cat-row" href="%s"><div><h3 style="font:600 19px Archivo;color:#0B1E3B;'
                'margin:0 0 6px">%s</h3><p style="font:400 14px/1.6 %s;color:#5B647C;margin:0">%s</p></div>'
                '<span class="gx-card-arrow" aria-hidden="true">&#8599;</span></a>'
                % (esc(c["url"]), esc(c["title"]), SANS, esc(c["summary"] or c["tagline"])))
        sections.append(
            '<section id="%s" style="background:%s;scroll-margin-top:96px"><div class="gx-in" '
            'style="padding-top:72px;padding-bottom:72px">'
            '<div class="gx-section-heading"><h2 style="font:700 36px/1.1 Archivo;letter-spacing:-.02em;'
            'color:#0B1E3B;margin:0">%s</h2><p>%s <a href="%s" style="color:#C4632A;font-weight:600;'
            'text-decoration:none;white-space:nowrap">About this practice &rarr;</a></p></div>'
            '<div class="cp-cat-list">%s</div></div></section>'
            % (esc(p["slug"]), "#fff" if n % 2 == 0 else "#F6F7F9", esc(p["title"]), esc(p["lead"]),
               esc(p["url"]), "".join(rows)))
    band = cta_band("Not sure which one you need?",
                    "Describe the ask — a regulator's letter, a customer questionnaire, a board "
                    "question — and we map it to the right engagement.",
                    "Talk to a consultant", _contact_url())
    return '<main style="display:contents">%s%s%s</main>' % (hero, "".join(sections), band)


def industry_page(site, ind, body_html, caps, posts, post_card, others):
    trail = [("Home", "/"), ("Industries", "/industries.html"), (ind["title"], None)]
    enquiry = _contact_url(industry=ind["short"])
    hero = dark_hero(trail, ind["title"], ind["lead"],
                     hero_ctas("Request a proposal", enquiry, "All industries", "/industries.html"),
                     regulator_chips(ind["regulators"]) + facts_strip(ind["facts"]))

    aside = side_card("Talk to a sector specialist",
                      "Someone who has stood in front of your regulator before. A scoped "
                      "proposal, usually within two working days.",
                      "Request a proposal", enquiry, site,
                      [(o["title"], o["url"]) for o in others][:6], "OTHER SECTORS")
    narrative = (
        '<section style="background:#fff"><div class="gx-in" style="padding-top:72px;padding-bottom:80px">'
        '<div class="cp-grid"><div><div class="gx-prose" style="font:400 17px/1.8 %s;color:#33405C">%s</div>%s</div>%s</div>'
        '</div></section>' % (SANS, body_html, proof_band(ind["proof"]), aside)
    )

    challenges = ""
    if ind["challenges"]:
        cards = "".join(
            '<div class="gx-ben" style="background:#fff;border:1px solid rgba(11,30,59,.1);'
            'border-left:3px solid #F26A21;border-radius:14px">'
            '<h3 style="font:600 19px Archivo;color:#0B1E3B;margin:0 0 8px">%s</h3>'
            '<p style="font:400 15px/1.6 %s;color:#5B647C;margin:0">%s</p></div>'
            % (esc(c.get("title", "")), SANS, esc(c.get("text", ""))) for c in ind["challenges"])
        challenges = ('<section style="background:#F4F2ED"><div class="gx-in" style="padding-top:80px;'
                      'padding-bottom:80px">%s<div class="ben-grid" style="display:grid;'
                      'grid-template-columns:repeat(3,1fr);gap:18px">%s</div></div></section>'
                      % (section_heading("What keeps this sector up at night.",
                                         "The pressures we see on every engagement in %s — and the "
                                         "ones the regulator will ask about first." % ind["short"]),
                         cards))

    what = ""
    if caps:
        what = ('<section style="background:#fff"><div class="gx-in" style="padding-top:80px;'
                'padding-bottom:80px">%s%s</div></section>'
                % (section_heading("What we do for %s." % ind["short"],
                                   "The capabilities most often scoped in this sector. Every one has "
                                   "its own page."),
                   tiles(caps, "Explore service")))

    clients = ""
    if ind["clients"]:
        cols = []
        for g in ind["clients"]:
            lis = "".join(
                '<li style="font:400 14px/1.45 %s;color:rgba(255,255,255,.72);display:flex;gap:9px">'
                '<span style="color:#F26A21;flex:none">&#9656;</span><span>%s</span></li>'
                % (SANS, esc(n)) for n in g.get("names", []))
            cols.append('<div><h3 style="font:600 17px Archivo;color:#fff;margin:0 0 14px;padding-bottom:12px;'
                        'border-bottom:1px solid rgba(255,255,255,.16)">%s</h3>'
                        '<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;'
                        'gap:9px">%s</ul></div>' % (esc(g.get("group", "")), lis))
        clients = ('<section style="background:#0B1E3B"><div class="gx-in" style="padding-top:80px;'
                   'padding-bottom:80px">%s<div style="display:grid;grid-template-columns:repeat(auto-fit,'
                   'minmax(min(100%%,230px),1fr));gap:34px">%s</div></div></section>'
                   % (section_heading("Who trusts us in %s." % ind["short"],
                                      "Named because they agreed to be. Many more did not, and we "
                                      "keep it that way.", dark=True),
                      "".join(cols)))

    faq = faq_section(ind["faq"], "Questions %s teams ask first." % ind["short"])
    reading = insights_section(posts, post_card)
    band = cta_band("Find out exactly where you stand.",
                    "A scoped proposal for your %s programme — fixed price, named lead, agreed timeline."
                    % ind["short"], "Request a proposal", enquiry)
    return ('<main style="display:contents">%s%s%s%s%s%s%s%s</main>'
            % (hero, narrative, challenges, what, clients, faq, reading, band))
