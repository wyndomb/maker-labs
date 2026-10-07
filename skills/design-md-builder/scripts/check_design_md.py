#!/usr/bin/env python3
"""Run dependency-free structural preflight checks on a DESIGN.md file."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


STANDARD_SECTIONS = [
    "Overview",
    "Colors",
    "Typography",
    "Layout",
    "Elevation & Depth",
    "Shapes",
    "Components",
    "Do's and Don'ts",
]

ALIASES = {
    "Brand & Style": "Overview",
    "Layout & Spacing": "Layout",
    "Elevation": "Elevation & Depth",
}

PLACEHOLDER_PATTERNS = [
    re.compile(r"\b(?:TODO|TBD|FIXME)\b", re.IGNORECASE),
    re.compile(
        r"\[(?:Brand name|Confirmed [^\]]+|One sentence [^\]]+|Describe [^\]]+|Explain [^\]]+|Include [^\]]+|specific [^\]]+)\]",
        re.IGNORECASE,
    ),
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=Path, help="Path to DESIGN.md")
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    return parser.parse_args()


def add(items: list[dict[str, str]], severity: str, message: str) -> None:
    items.append({"severity": severity, "message": message})


def inspect(path: Path) -> dict[str, object]:
    findings: list[dict[str, str]] = []

    if not path.is_file():
        add(findings, "error", f"File not found: {path}")
        return summarize(path, findings)

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    if not lines or lines[0].strip() != "---":
        add(findings, "error", "The file must begin with YAML front matter.")
        frontmatter = ""
        body = text
    else:
        try:
            closing = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
        except StopIteration:
            add(findings, "error", "The YAML front matter has no closing --- fence.")
            frontmatter = "\n".join(lines[1:])
            body = ""
        else:
            frontmatter = "\n".join(lines[1:closing])
            body = "\n".join(lines[closing + 1 :])

    if not re.search(r"(?m)^name\s*:\s*\S", frontmatter):
        add(findings, "error", "YAML front matter is missing a non-empty name.")

    colors_match = re.search(
        r"(?ms)^colors\s*:\s*\n(?P<block>(?:^[ \t]+.*(?:\n|$))*)", frontmatter
    )
    if not colors_match:
        add(findings, "warning", "No colors map found; verify the omission is documented in the audit.")
    elif not re.search(r"(?m)^[ \t]+primary\s*:\s*\S", colors_match.group("block")):
        add(findings, "error", "The colors map is missing a primary token.")

    for pattern in PLACEHOLDER_PATTERNS:
        if pattern.search(text):
            add(findings, "error", "Unresolved template placeholder found.")
            break

    headings = re.findall(r"(?m)^##\s+(.+?)\s*$", body)
    canonical = [ALIASES.get(heading, heading) for heading in headings]

    for section in STANDARD_SECTIONS:
        count = canonical.count(section)
        if count > 1:
            add(findings, "error", f"Duplicate standard section: {section}.")
        elif count == 0:
            add(findings, "warning", f"Standard section is absent: {section}.")

    present_standard = [heading for heading in canonical if heading in STANDARD_SECTIONS]
    expected_order = sorted(present_standard, key=STANDARD_SECTIONS.index)
    if present_standard != expected_order:
        add(findings, "error", "Standard sections are out of specification order.")

    if not headings:
        add(findings, "error", "No level-two DESIGN.md sections were found.")

    if not re.search(r"(?m)^#\s+", body):
        add(findings, "warning", "The document has no level-one title.")

    return summarize(path, findings)


def summarize(path: Path, findings: list[dict[str, str]]) -> dict[str, object]:
    errors = sum(item["severity"] == "error" for item in findings)
    warnings = sum(item["severity"] == "warning" for item in findings)
    return {
        "file": str(path),
        "status": "PASS" if errors == 0 else "FAIL",
        "summary": {"errors": errors, "warnings": warnings},
        "findings": findings,
    }


def main() -> int:
    args = parse_args()
    result = inspect(args.file)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        summary = result["summary"]
        print(
            f"DESIGN.md preflight: {result['status']} "
            f"({summary['errors']} errors, {summary['warnings']} warnings)"
        )
        for item in result["findings"]:
            print(f"- {item['severity'].upper()}: {item['message']}")

    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
