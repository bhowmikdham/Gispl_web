#!/usr/bin/env python3
"""Generate a branded share card per insight post.

    .venv/bin/python scripts/make-post-covers.py

Without a per-post cover every article shares the same og-default.png, so nine
different posts look identical in a LinkedIn feed and the image tells a reader
nothing about what they are about to open.

These are typographic cards, not photographs: the post title set in the Fusion
palette over the site's navy ground and diagonal hairlines. Brand strings come
from content/site.yml for the same reason make-og-image.py reads them — a baked
PNG survives every grep, so a hard-coded tagline here would go stale silently.

Idempotent: re-running reproduces the same bytes for an unchanged title.
"""
from __future__ import print_function

import io
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover
    raise SystemExit("Pillow is not installed — pip install -r requirements.txt")

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib.frontmatter import load as load_frontmatter  # noqa: E402

POSTS = os.path.join(ROOT, "content", "posts")
OUT_DIR = os.path.join(ROOT, "assets", "images", "covers")
LOGO = os.path.join(ROOT, "assets", "images", "gispl-logo-ondark.png")
SITE_YML = os.path.join(ROOT, "content", "site.yml")

W, H = 1200, 630
NAVY = (7, 20, 43)
NAVY_2 = (11, 30, 59)
ORANGE = (242, 106, 33)
WHITE = (255, 255, 255)
MUTED = (138, 146, 164)

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
MONO_CANDIDATES = [
    "/System/Library/Fonts/Menlo.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]

# The image budget the repo holds every asset to.
MAX_KIB = 256


def load_font(candidates, size):
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except (OSError, IOError):
                continue
    return ImageFont.load_default()


def wrap(draw, text, font, max_width):
    """Greedy wrap on measured width — titles vary from 5 to 11 words."""
    words, lines, line = text.split(), [], ""
    for word in words:
        trial = (line + " " + word).strip()
        if draw.textlength(trial, font=font) <= max_width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def card(title, category, tagline):
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)

    for y in range(H):
        t = y / float(H)
        d.line([(0, y), (W, y)],
               fill=(int(NAVY[0] + (NAVY_2[0] - NAVY[0]) * t),
                     int(NAVY[1] + (NAVY_2[1] - NAVY[1]) * t),
                     int(NAVY[2] + (NAVY_2[2] - NAVY[2]) * t)))
    for x in range(-H, W, 13):
        d.line([(x, H), (x + H, 0)], fill=(255, 255, 255, 8), width=1)
    d.rectangle([0, 0, 10, H], fill=ORANGE)

    if os.path.exists(LOGO):
        logo = Image.open(LOGO).convert("RGBA")
        target_h = 62
        w = int(logo.width * (target_h / float(logo.height)))
        logo = logo.resize((w, target_h), Image.LANCZOS)
        img.paste(logo, (78, 66), logo)

    mono = load_font(MONO_CANDIDATES, 20)
    d.text((78, 178), "   ".join(category.upper()), font=mono, fill=ORANGE)

    # Step the title down until it fits four lines — long headlines should not
    # overflow the card, and short ones should not look lost on it.
    for size in (60, 54, 48, 42):
        title_font = load_font(FONT_CANDIDATES, size)
        lines = wrap(d, title, title_font, W - 156)
        if len(lines) <= 4:
            break
    y = 236
    for line in lines[:4]:
        d.text((78, y), line, font=title_font, fill=WHITE)
        y += int(size * 1.18)

    d.line([(78, H - 108), (W - 78, H - 108)], fill=(255, 255, 255, 26), width=1)
    # Tracked, but only as far as the card is wide — letter-spacing every
    # character of the full lockup runs it off the right edge.
    foot = load_font(MONO_CANDIDATES, 18)
    lockup = tagline
    for gap in ("  ", " ", ""):
        spaced_lockup = gap.join(tagline)
        if d.textlength(spaced_lockup, font=foot) <= W - 156:
            lockup = spaced_lockup
            break
    d.text((78, H - 82), lockup, font=foot, fill=MUTED)
    return img


def main():
    with io.open(SITE_YML, encoding="utf-8") as fh:
        site = yaml.safe_load(fh)
    tagline = site.get("tagline", "")

    if not os.path.isdir(OUT_DIR):
        os.makedirs(OUT_DIR)

    written, over_budget = 0, []
    for name in sorted(os.listdir(POSTS)):
        if not name.endswith(".md"):
            continue
        meta, _ = load_frontmatter(os.path.join(POSTS, name))
        slug = name[:-3]
        # Strip the leading YYYY-MM-DD- so the file matches the published slug.
        if len(slug) > 11 and slug[4] == "-" and slug[7] == "-":
            slug = slug[11:]
        out = os.path.join(OUT_DIR, slug + ".png")
        card(meta["title"], meta.get("category", ""), tagline).save(
            out, "PNG", optimize=True)
        kib = os.path.getsize(out) / 1024.0
        if kib > MAX_KIB:
            over_budget.append((slug, kib))
        written += 1

    print("wrote %d cover(s) to %s" % (written, os.path.relpath(OUT_DIR, ROOT)))
    for slug, kib in over_budget:
        print("WARNING: %s is %.0f KiB, over the %d KiB budget"
              % (slug, kib, MAX_KIB), file=sys.stderr)
    return 1 if over_budget else 0


if __name__ == "__main__":
    sys.exit(main())
