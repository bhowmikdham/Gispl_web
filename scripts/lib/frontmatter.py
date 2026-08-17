"""Split a Markdown file into YAML front-matter and body.

Errors carry the file path and a real line number. A CMS writes these files, so
the person who has to act on a parse error is usually not the person reading
the traceback — "bad YAML" with no location is useless to them.

Line numbers are reported against the ORIGINAL file, not the extracted YAML
block, so they match what the author sees in an editor.
"""
import io
import os

try:
    import yaml
except ImportError:  # pragma: no cover
    raise SystemExit(
        "PyYAML is not installed.\n"
        "  python3 -m venv .venv && .venv/bin/pip install -r requirements.txt"
    )

DELIM = "---"


class FrontmatterError(ValueError):
    """Raised when front-matter is missing or unparseable."""


def split(text, path="<string>"):
    """Return (metadata_dict, body_str).

    The file must start with a `---` line, contain a closing `---`, and the
    block between them must be a YAML mapping.
    """
    lines = text.splitlines()

    if not lines or lines[0].strip() != DELIM:
        raise FrontmatterError(
            "%s:1: file must start with a '---' front-matter block" % path)

    close = None
    for i in range(1, len(lines)):
        if lines[i].strip() == DELIM:
            close = i
            break
    if close is None:
        raise FrontmatterError(
            "%s:1: front-matter block opened but never closed (no second '---')"
            % path)

    raw = "\n".join(lines[1:close])
    try:
        meta = yaml.safe_load(raw)
    except yaml.YAMLError as e:
        # PyYAML line numbers are 0-based within the block; +2 maps back to the
        # original file (1 for the opening ---, 1 for 0-based -> 1-based).
        line = 1
        mark = getattr(e, "problem_mark", None)
        if mark is not None:
            line = mark.line + 2
        problem = getattr(e, "problem", None) or str(e).splitlines()[0]
        raise FrontmatterError("%s:%d: invalid YAML — %s" % (path, line, problem))

    if meta is None:
        meta = {}
    if not isinstance(meta, dict):
        raise FrontmatterError(
            "%s:2: front-matter must be a mapping (key: value), got %s"
            % (path, type(meta).__name__))

    body = "\n".join(lines[close + 1:])
    return meta, body.lstrip("\n")


def load(path):
    """Read a file from disk and split it. Returns (meta, body)."""
    with io.open(path, encoding="utf-8") as fh:
        return split(fh.read(), os.path.relpath(path))


def dump(meta, body):
    """Serialize back to a front-matter file.

    sort_keys=False preserves the field order the caller chose, so a
    round-trip through the migration script produces readable files rather
    than alphabetized ones.
    """
    head = yaml.safe_dump(meta, sort_keys=False, allow_unicode=True,
                          default_flow_style=False, width=100).rstrip("\n")
    return "%s\n%s\n%s\n\n%s" % (DELIM, head, DELIM, body.strip() + "\n")
