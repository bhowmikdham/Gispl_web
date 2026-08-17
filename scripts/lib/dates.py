"""Date parsing and the site's display formats.

Every date the site shows is derived from one ISO value in front-matter. The
old data carried BOTH a machine date and a hand-typed `dateLabel` ("JUN 2026"),
which could — and did — drift apart. Nothing here is hand-typed.

Month names come from a fixed table, never strftime("%b"): strftime is
locale-sensitive, so a build machine with a non-English locale would silently
emit "JUIN 2026" on some pages and not others.
"""
import datetime
import re

MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

MONTHS_LONG = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"]

# Accepts "2026-06-01" or a full ISO timestamp with optional offset.
_ISO = re.compile(
    r"^(\d{4})-(\d{2})-(\d{2})"
    r"(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?"
    r"(Z|[+-]\d{2}:?\d{2})?)?$"
)


class DateError(ValueError):
    """Raised when a date value cannot be parsed."""


def parse(value):
    """Parse an ISO date/datetime into a datetime.

    Accepts a date, a datetime, or a string. Naive values are returned as-is;
    callers that need a timezone supply it in the source data.
    """
    if isinstance(value, datetime.datetime):
        return value
    if isinstance(value, datetime.date):
        return datetime.datetime(value.year, value.month, value.day)
    if value is None:
        raise DateError("missing date")

    s = str(value).strip()
    m = _ISO.match(s)
    if not m:
        raise DateError("not an ISO date: %r" % value)

    year, month, day = int(m.group(1)), int(m.group(2)), int(m.group(3))
    hour = int(m.group(4) or 0)
    minute = int(m.group(5) or 0)
    second = int(m.group(6) or 0)

    tz = None
    off = m.group(7)
    if off == "Z":
        tz = datetime.timezone.utc
    elif off:
        off = off.replace(":", "")
        sign = 1 if off[0] == "+" else -1
        delta = datetime.timedelta(hours=int(off[1:3]), minutes=int(off[3:5]))
        tz = datetime.timezone(sign * delta)

    try:
        return datetime.datetime(year, month, day, hour, minute, second, tzinfo=tz)
    except ValueError as e:
        raise DateError("invalid date %r: %s" % (value, e))


def label(value):
    """The site's card/meta date format: "JUN 2026"."""
    d = parse(value)
    return "%s %d" % (MONTHS_SHORT[d.month - 1], d.year)


def long_date(value):
    """Human prose format: "1 June 2026"."""
    d = parse(value)
    return "%d %s %d" % (d.day, MONTHS_LONG[d.month - 1], d.year)


def iso_date(value):
    """YYYY-MM-DD — for <time datetime> and sitemap <lastmod>."""
    return parse(value).strftime("%Y-%m-%d")


def iso_datetime(value):
    """Full ISO 8601 — for JSON-LD datePublished and RSS."""
    d = parse(value)
    if d.tzinfo is None:
        return d.strftime("%Y-%m-%dT%H:%M:%S")
    return d.isoformat()
