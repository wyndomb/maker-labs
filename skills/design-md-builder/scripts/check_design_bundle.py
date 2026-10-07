#!/usr/bin/env python3
"""Check a design folder: token provenance and the three-file contract.

Runs three groups of dependency-free checks on a folder containing DESIGN.md,
design-audit.md, and design-corrections.md:

  preflight   the structural checks from check_design_md.py
  provenance  token references resolve, literal token values trace to the
              audit, and template example values are not left unexplained
  bundle      files exist, sibling links resolve, the consumption block comes
              before the first section, correction entries are complete and
              active, and proposed bundles carry a status line

Each group reports PASS, NEEDS REVISION, or INCOMPLETE. A PASS means the file
structure and traceable values are consistent. It does not prove a value is
correct, that a cited source supports it, or that the guide renders well.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_design_md import inspect as preflight  # noqa: E402

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE = SKILL_DIR / "assets" / "DESIGN.template.md"
TOKEN_GROUPS = ("colors", "typography", "spacing", "rounded", "components")
CORRECTION_FIELDS = ("Scope", "Instruction", "Overrides", "Source", "Recorded")
EMPTY_STATE = "No corrections recorded yet."
INACTIVE_WORDING = re.compile(
    r"\b(?:proposed|proposal|unresolved|unclear|tbd|to be confirmed|pending approval|needs approval)\b",
    re.IGNORECASE,
)
REFERENCE = re.compile(r"\{([A-Za-z0-9_.-]+)\}")
HEX = re.compile(r"#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b")
RGB = re.compile(r"rgba?\([^)]*\)", re.IGNORECASE)
PX = re.compile(r"-?\d+(?:\.\d+)?px")
LINK = re.compile(r"\]\(([^)\s]+)\)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("folder", type=Path, help="Design folder to check")
    parser.add_argument("--guide", default="DESIGN.md", help="Guide filename")
    parser.add_argument("--audit", default="design-audit.md", help="Audit filename")
    parser.add_argument("--corrections", default="design-corrections.md", help="Corrections filename")
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    return parser.parse_args()


def split_front_matter(text: str) -> tuple[str, str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return "", text
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i]), "\n".join(lines[i + 1 :])
    return "\n".join(lines[1:]), ""


def unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    if " #" in value:
        value = value.split(" #", 1)[0].rstrip()
    return value


def flatten_front_matter(front: str) -> tuple[dict[str, str], set[str], list[str]]:
    """Return leaf paths, group paths, and unparsed lines from simple block YAML."""
    leaves: dict[str, str] = {}
    groups: set[str] = set()
    unparsed: list[str] = []
    stack: list[tuple[int, str]] = []
    for raw in front.splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        stripped = raw.strip()
        if stripped.startswith("- "):
            continue  # list items, such as omitted entries, carry no tokens
        match = re.match(r"""^(?P<key>"[^"]+"|'[^']+'|[^:]+?)\s*:(?:\s+(?P<value>.*))?$""", stripped)
        if not match:
            unparsed.append(stripped)
            continue
        while stack and stack[-1][0] >= indent:
            stack.pop()
        key = unquote(match.group("key"))
        path = ".".join([p for _, p in stack] + [key])
        value = match.group("value")
        if value is None or value.strip() == "":
            groups.add(path)
            stack.append((indent, key))
        else:
            leaves[path] = unquote(value)
    return leaves, groups, unparsed


def norm_color(value: str) -> str:
    return re.sub(r"\s+", "", value).lower()


def hex_to_rgb(value: str) -> str | None:
    digits = value.lstrip("#")
    if len(digits) in (3, 4):
        digits = "".join(c * 2 for c in digits[:3])
    if len(digits) not in (6, 8):
        return None
    r, g, b = (int(digits[i : i + 2], 16) for i in (0, 2, 4))
    return f"rgb({r},{g},{b})"


def traceable_parts(path: str, value: str) -> list[tuple[str, str]]:
    """Return (kind, text) pieces of a literal value that the audit should cite."""
    parts: list[tuple[str, str]] = []
    if path.endswith(".fontFamily"):
        first = value.split(",")[0].strip().strip("\"'")
        if first:
            parts.append(("font", first))
        return parts
    parts += [("color", m.group(0)) for m in HEX.finditer(value)]
    parts += [("color", m.group(0)) for m in RGB.finditer(value)]
    parts += [("px", m.group(0)) for m in PX.finditer(value) if float(m.group(0)[:-2]) != 0]
    return parts


def found_in_audit(kind: str, text: str, audit: str, audit_flat: str) -> bool:
    if kind == "font":
        return text.lower() in audit.lower()
    if kind == "px":
        return re.search(rf"(?<![\d.]){re.escape(text)}", audit) is not None
    candidate = norm_color(text)
    if candidate in audit_flat:
        return True
    if candidate.startswith("#"):
        rgb = hex_to_rgb(candidate)
        return rgb is not None and (rgb in audit_flat or rgb.replace("rgb(", "rgba(")[:-1] in audit_flat)
    return False


def result(name: str, findings: list[dict[str, str]], incomplete: bool = False) -> dict[str, object]:
    errors = [f for f in findings if f["severity"] == "error"]
    status = "NEEDS REVISION" if errors else ("INCOMPLETE" if incomplete else "PASS")
    return {"check": name, "status": status, "findings": findings}


def add(findings: list[dict[str, str]], severity: str, message: str) -> None:
    findings.append({"severity": severity, "message": message})


def check_provenance(guide_text: str, audit_text: str | None) -> dict[str, object]:
    findings: list[dict[str, str]] = []
    front, _ = split_front_matter(guide_text)
    leaves, groups, unparsed = flatten_front_matter(front)
    for line in unparsed:
        add(findings, "warning", f"Front matter line not parsed; review by hand: {line}")

    defined = set(leaves) | groups
    for path, value in leaves.items():
        for ref in REFERENCE.findall(value):
            if ref not in defined:
                add(findings, "error", f"{path} references {{{ref}}}, which is not defined.")

    for start in leaves:
        seen = [start]
        current = start
        while True:
            refs = REFERENCE.fullmatch(leaves.get(current, "").strip())
            if not refs:
                break
            current = refs.group(1)
            if current in seen:
                add(findings, "error", f"Reference cycle: {' -> '.join(seen + [current])}.")
                break
            seen.append(current)

    if audit_text is None:
        add(findings, "error", "Audit file is missing, so token values cannot be traced.")
        return result("provenance", findings)

    sources = re.search(r"(?ms)^##\s+Sources Reviewed\s*$(?P<body>.*?)(?=^##\s|\Z)", audit_text)
    source_rows = []
    if sources:
        rows = [r for r in sources.group("body").splitlines() if r.strip().startswith("|")]
        source_rows = [r for r in rows[2:] if re.sub(r"[|\s-]", "", r)]
    incomplete = not source_rows
    if incomplete:
        add(findings, "warning", "Audit has no filled Sources Reviewed table; provenance cannot be established.")

    template_leaves: dict[str, str] = {}
    if TEMPLATE.is_file():
        template_leaves, _, _ = flatten_front_matter(split_front_matter(TEMPLATE.read_text(encoding="utf-8"))[0])

    audit_flat = norm_color(audit_text)
    for path, value in leaves.items():
        if path.split(".")[0] not in TOKEN_GROUPS or REFERENCE.fullmatch(value.strip()):
            continue
        untraced = [text for kind, text in traceable_parts(path, value) if not found_in_audit(kind, text, audit_text, audit_flat)]
        if not untraced:
            continue
        if template_leaves.get(path) == value:
            add(findings, "error", f"{path}: {value} matches the template example and is not cited in the audit.")
        else:
            add(findings, "error", f"{path}: {', '.join(untraced)} not found in the audit. Cite its source or record its derivation.")

    return result("provenance", findings, incomplete)


def sections_before_first_h2(body: str) -> str:
    match = re.search(r"(?m)^##\s", body)
    return body[: match.start()] if match else body


def link_targets(text: str) -> list[str]:
    targets = []
    for target in LINK.findall(text):
        if re.match(r"^[a-z]+:", target, re.IGNORECASE) or target.startswith("#"):
            continue
        targets.append(target.split("#", 1)[0])
    return [t for t in targets if t]


def check_bundle(folder: Path, names: dict[str, str], texts: dict[str, str | None]) -> dict[str, object]:
    findings: list[dict[str, str]] = []
    for role, name in names.items():
        if texts[role] is None:
            add(findings, "error", f"Missing {role} file: {name}.")

    for role, text in texts.items():
        if text is None:
            continue
        for target in link_targets(text):
            if not (folder / target).exists():
                add(findings, "error", f"{names[role]} links to {target}, which does not exist.")

    guide = texts["guide"]
    if guide is not None:
        _, body = split_front_matter(guide)
        opening = sections_before_first_h2(body)
        for role in ("corrections", "audit"):
            if f"]({names[role]})" not in opening:
                add(findings, "error", f"Consumption block before the first section does not link {names[role]}.")

        audit = texts["audit"] or ""
        readiness = re.search(r"(?mi)^-?\s*Overall readiness:\s*(.+)$", audit)
        needs_status = "proposed" in folder.resolve().name.lower() or bool(
            readiness and "needs approval" in readiness.group(1).lower() and "/" not in readiness.group(1)
        )
        if needs_status and not re.search(r"(?m)^Status:\s*\S", opening):
            add(findings, "error", "Proposed or unapproved bundle has no 'Status:' line before the first section.")

    corrections = texts["corrections"]
    if corrections is not None:
        for role in ("guide", "audit"):
            if f"]({names[role]})" not in corrections:
                add(findings, "error", f"Corrections file does not link {names[role]}.")
        active = re.search(r"(?ms)^##\s+Active corrections\s*$(?P<body>.*)", corrections)
        if not active:
            add(findings, "error", "Corrections file has no '## Active corrections' section.")
        else:
            section = active.group("body")
            entries = re.split(r"(?m)^###\s+", section)[1:]
            has_empty_state = EMPTY_STATE in section
            if not entries and not has_empty_state:
                add(findings, "error", f"No entries and no '{EMPTY_STATE}' empty-state text.")
            if entries and has_empty_state:
                add(findings, "error", "Entries exist but the empty-state text is still present.")
            ids: list[str] = []
            for entry in entries:
                heading = entry.splitlines()[0].strip()
                id_match = re.match(r"(C\d+):\s*\S", heading)
                if not id_match:
                    add(findings, "error", f"Entry heading '{heading}' is not in 'C001: Short rule name' form.")
                else:
                    ids.append(id_match.group(1))
                for field in CORRECTION_FIELDS:
                    value = re.search(rf"(?m)^-[ \t]*{field}:[ \t]*([^\n]*)$", entry)
                    if not value or not value.group(1).strip() or value.group(1).strip().startswith("["):
                        add(findings, "error", f"{heading}: missing or placeholder '{field}'.")
                recorded = re.search(r"(?m)^-[ \t]*Recorded:[ \t]*([^\n]*)$", entry)
                if recorded and not re.search(r"\d{4}-\d{2}-\d{2}", recorded.group(1)):
                    add(findings, "warning", f"{heading}: 'Recorded' has no YYYY-MM-DD date.")
                # A quoted source or an override target may legitimately mention
                # a proposal. Check leading status wording in the active rule;
                # judging acceptance from arbitrary words causes false failures.
                rule_values = [heading.split(":", 1)[-1].strip()]
                for field in ("Scope", "Instruction"):
                    value = re.search(rf"(?m)^-[ \t]*{field}:[ \t]*([^\n]*)$", entry)
                    if value:
                        rule_values.append(value.group(1).strip())
                inactive = next((match for value in rule_values
                                 if (match := INACTIVE_WORDING.match(value))), None)
                if inactive:
                    add(findings, "error", f"{heading}: contains '{inactive.group(0)}'. Move unresolved or proposed rules to the audit.")
            for dup in sorted({i for i in ids if ids.count(i) > 1}):
                add(findings, "error", f"Duplicate correction ID {dup}.")

    return result("bundle", findings)


def main() -> int:
    args = parse_args()
    folder = args.folder
    names = {"guide": args.guide, "audit": args.audit, "corrections": args.corrections}
    texts: dict[str, str | None] = {}
    for role, name in names.items():
        path = folder / name
        texts[role] = path.read_text(encoding="utf-8") if path.is_file() else None

    pre = preflight(folder / args.guide)
    checks = [
        {"check": "preflight", "status": "PASS" if pre["status"] == "PASS" else "NEEDS REVISION", "findings": pre["findings"]},
        check_provenance(texts["guide"], texts["audit"]) if texts["guide"] is not None
        else result("provenance", [{"severity": "error", "message": "Guide file is missing."}]),
        check_bundle(folder, names, texts),
    ]

    if args.json:
        print(json.dumps({"folder": str(folder), "checks": checks}, indent=2))
    else:
        for check in checks:
            errors = sum(f["severity"] == "error" for f in check["findings"])
            warnings = len(check["findings"]) - errors
            print(f"{check['check']}: {check['status']} ({errors} errors, {warnings} warnings)")
            for item in check["findings"]:
                print(f"  - {item['severity'].upper()}: {item['message']}")

    statuses = {c["status"] for c in checks}
    if "NEEDS REVISION" in statuses:
        return 1
    return 2 if "INCOMPLETE" in statuses else 0


if __name__ == "__main__":
    sys.exit(main())
