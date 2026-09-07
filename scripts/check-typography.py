#!/usr/bin/env python3
"""Guard the eyebrow rule in CLAUDE.md § Typography conventions.

    python3 scripts/check-typography.py

Mono caps LABEL DATA. Two failures are mechanically detectable, and this guard
catches both on the 11 hand-maintained pages:

  1. A mono-caps run long enough to be a sentence rather than a label.
  2. A mono-caps run sitting immediately above a heading — the section-eyebrow
     pattern CLAUDE.md bans, where the eyebrow ends up carrying the subject the
     heading should carry.

Test 1 of the three in CLAUDE.md — "does it restate something already on
screen?" — needs a human to judge and is not checked here.

Both rules have an ALLOW list. Adding to it is the intended escape hatch, but
every entry states why it earns the treatment, so the next person can tell a
real label from a slogan that talked its way in.
"""
from __future__ import print_function

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAGES = ["index", "services", "service-vapt", "service-ai-security",
         "vapt-methodology", "sebi-cscrf", "dpdp-readiness", "industries",
         "about", "careers", "contact"]

# Longer than this and it has stopped being a label. The longest legitimate
# label on the site is a standards expansion at 38 characters, so the bar sits
# just under it and those four are allowlisted by name.
MAX_LABEL = 34

# Strings owned by the shared header/footer, which check-header-sync.py guards.
SHELL = {
    "INDIA · UAE · USA · CANADA · AUSTRALIA",
    "CYBERSECURITY · COMPLIANCE · FORENSICS",
    "EXPLORE", "SPOTLIGHT", "SERVICES", "INDUSTRIES", "COMPANY",
    "CERT-IN", "ISO 27001", "PCI DSS",
}

# Long runs that are genuinely label data, with the reason each one earns it.
ALLOW_LONG = {
    "PENETRATION TESTING EXECUTION STANDARD": "PTES, expanded",
    "TECHNICAL GUIDE TO SECURITY TESTING": "NIST SP 800-115, expanded",
    "COMMON VULNERABILITY SCORING SYSTEM": "CVSS, expanded",
    "WEB SECURITY TESTING GUIDE": "OWASP WSTG, expanded",
    "PENALTY PER DAY, PLUS EXCHANGE ACTION": "stat label under a figure",
    "FIRST-AUDIT DEADLINE PASSED · 30 JUN 2026": "regulatory date badge",
}

# Labels allowed to sit above a heading: card badges that name the audience or
# the set, which the heading beneath deliberately does not repeat.
ALLOW_ABOVE_HEADING = {
    "EXPERIENCED PROFESSIONALS": "careers card badge — names the audience",
    "GRADUATES & ENTRY-LEVEL": "careers card badge — names the audience",
    "INTERNSHIPS": "careers card badge — names the audience",
}

MONO_EL = re.compile(r"<(\w+)([^>]*?IBM Plex Mono[^>]*?)>([^<]{1,240})</\1>")
# A heading, or a display paragraph doing a heading's job — several sections set
# their statement as <p ... 30px Archivo> rather than an <h2>, and an eyebrow
# above one of those is the same mistake.
ABOVE = re.compile(
    r"<(span|div|p)[^>]*?IBM Plex Mono[^>]*?>([^<]{1,120})</\1>\s*"
    r"(?:<[^/][^>]*>\s*)?<(h1|h2|h3|p style=\"font:[3-9]00 (?:2[4-9]|[3-9]\d)px[^\"]*Archivo)",
    re.S,
)
MONTHS = ("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG",
          "SEP", "OCT", "NOV", "DEC")


def unescape(t):
    for a, b in (("&amp;", "&"), ("&middot;", "·"), ("&times;", "×"),
                 ("&rarr;", "→"), ("&nbsp;", " "), ("&ndash;", "–"),
                 ("&mdash;", "—")):
        t = t.replace(a, b)
    return " ".join(t.split())


def is_caps(t):
    return bool(t) and t == t.upper() and re.search("[A-Z]", t)


def is_numeric(t):
    return bool(re.fullmatch(r"[\d.,+%×/–—-]+", t))


def is_date(t):
    return any(m in t for m in MONTHS) or bool(re.search(r"\b(19|20)\d\d\b", t))


def main():
    problems = []
    for page in PAGES:
        path = os.path.join(ROOT, page + ".html")
        with io.open(path, encoding="utf-8") as fh:
            html = fh.read()

        for _tag, _attrs, raw in MONO_EL.findall(html):
            text = unescape(raw)
            if text in SHELL or not is_caps(text) or is_numeric(text):
                continue
            if len(text) > MAX_LABEL and text not in ALLOW_LONG:
                problems.append(
                    "%s.html: mono-caps run of %d chars is a sentence, not a "
                    "label\n    %s\n    fix: set it in Plex Sans sentence case, "
                    "or allowlist it in ALLOW_LONG with a reason"
                    % (page, len(text), text))

        for _tag, raw, heading in ABOVE.findall(html):
            text = unescape(raw)
            if text in SHELL or not is_caps(text) or is_numeric(text):
                continue
            if is_date(text) or text in ALLOW_ABOVE_HEADING:
                continue
            what = heading if heading.startswith("h") else "display paragraph"
            problems.append(
                "%s.html: mono-caps eyebrow sits above a %s\n    %s\n"
                "    fix: promote it into the heading and demote the heading to "
                "a sans scope line, or delete it if the heading already says it"
                % (page, what, text))

    if problems:
        print("Typography guard failed (CLAUDE.md § Typography conventions):\n",
              file=sys.stderr)
        for p in problems:
            print("  " + p + "\n", file=sys.stderr)
        print("%d problem(s)" % len(problems), file=sys.stderr)
        return 1

    print("typography OK — %d pages, no mono-caps sentences and no section "
          "eyebrows above headings" % len(PAGES))
    return 0


if __name__ == "__main__":
    sys.exit(main())
