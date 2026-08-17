#!/usr/bin/env python3
"""Generate the default Open Graph share image.

    .venv/bin/python scripts/make-og-image.py

Every generated page emits og:image. Without this file that is a dangling
reference on every URL — worse than omitting the tag, because scrapers fetch it
and fail. This produces the one branded fallback used wherever a post has no
cover of its own.

1200x630 is the size LinkedIn, X and Slack all crop cleanly from; anything
smaller than 1200x627 gets downgraded to a small card by LinkedIn.

The build fonts are not the site's fonts: Archivo and IBM Plex ship from Google
Fonts and are not on disk. A system sans is used instead — this is a fallback
image behind a logo, not a typographic surface. Self-hosting the real faces
(planned in Phase 6) would let this use Archivo.
"""
from __future__ import print_function

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover
    raise SystemExit("Pillow is not installed — pip install -r requirements.txt")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "images", "og-default.png")
LOGO = os.path.join(ROOT, "assets", "images", "gispl-logo-ondark.png")

W, H = 1200, 630
NAVY = (7, 20, 43)
NAVY_2 = (11, 30, 59)
ORANGE = (242, 106, 33)
WHITE = (255, 255, 255)

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
MONO_CANDIDATES = [
    "/System/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/Supplemental/Courier New Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def load_font(candidates, size):
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except (OSError, IOError):
                continue
    return ImageFont.load_default()


def main():
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)

    # Soft diagonal wash so the card isn't a flat rectangle.
    for y in range(H):
        t = y / float(H)
        d.line([(0, y), (W, y)],
               fill=(int(NAVY[0] + (NAVY_2[0] - NAVY[0]) * t),
                     int(NAVY[1] + (NAVY_2[1] - NAVY[1]) * t),
                     int(NAVY[2] + (NAVY_2[2] - NAVY[2]) * t)))

    # Diagonal hairlines, echoing the site's hero treatment.
    for x in range(-H, W, 13):
        d.line([(x, H), (x + H, 0)], fill=(255, 255, 255, 8), width=1)

    d.rectangle([0, 0, 10, H], fill=ORANGE)

    if os.path.exists(LOGO):
        logo = Image.open(LOGO).convert("RGBA")
        target_h = 78
        w = int(logo.width * (target_h / float(logo.height)))
        logo = logo.resize((w, target_h), Image.LANCZOS)
        img.paste(logo, (78, 74), logo)

    title = load_font(FONT_CANDIDATES, 62)
    sub = load_font(FONT_CANDIDATES, 30)
    mono = load_font(MONO_CANDIDATES, 21)

    d.text((78, 232), "Cybersecurity, compliance", font=title, fill=WHITE)
    d.text((78, 306), "and cyber forensics.", font=title, fill=ORANGE)
    d.text((78, 410),
           "CERT-IN certified assessments · ISO 27001 · PCI DSS · DPDP",
           font=sub, fill=(196, 205, 222))
    d.text((78, 512), "P R O T E C T   ·   C O M P L Y   ·   G R O W",
           font=mono, fill=(138, 146, 164))

    img.save(OUT, "PNG", optimize=True)
    size_kb = os.path.getsize(OUT) / 1024.0
    print("wrote %s (%dx%d, %.0f KiB)" % (os.path.relpath(OUT, ROOT), W, H, size_kb))
    # The repo holds images to a 256 KiB budget.
    if size_kb > 256:
        print("WARNING: over the 256 KiB image budget", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
