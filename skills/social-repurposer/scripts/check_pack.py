#!/usr/bin/env python3
"""Check copy lengths and em dashes. Standard library only; no network or writes."""
import argparse
import json
import re
from pathlib import Path


def conservative_x_length(text):
    """Conservative heuristic, not the official platform counter. See the guide."""
    weight = lambda s: sum(1 if ord(c) < 128 else 2 for c in s)
    total = weight(text)
    for match in re.finditer(r"https?://[^\s]+", text):
        # Charge sentence punctuation separately from short URLs.
        url = match.group().rstrip(".,!?;:)]}>'\"\u2019\u201d")
        total += max(0, 23 - weight(url))
    return total


def check(data):
    errors, warnings, measurements = [], [], []
    if not isinstance(data, dict):
        return {"status": "FAIL", "errors": ["Pack must be a JSON object."]}
    arrays = {}
    for key in ("notes", "linkedin", "threads"):
        value = data.get(key)
        if not isinstance(value, list):
            errors.append(f"{key}: required array (use [] for an omitted channel).")
            value = []
        arrays[key] = value
    if not any(arrays.values()):
        errors.append("Pack contains no drafts.")

    def valid_text(value, label):
        if not isinstance(value, str) or not value.strip():
            errors.append(f"{label}: expected nonempty text.")
            return False
        if "\u2014" in value:
            errors.append(f"{label}: em dash present.")
        return True

    for key in ("notes", "linkedin"):
        for i, value in enumerate(arrays[key], 1):
            label = f"{key} {i}"
            if valid_text(value, label):
                measurements.append({"item": label, "code_points": len(value)})
                if key == "linkedin" and len(value) >= 2600:
                    errors.append(f"{label}: {len(value)} characters; must be below 2600.")

    for i, tweets in enumerate(arrays["threads"], 1):
        if not isinstance(tweets, list) or not tweets:
            errors.append(f"thread {i}: expected nonempty array of tweet bodies.")
            continue
        if not 6 <= len(tweets) <= 10:
            warnings.append(f"thread {i}: {len(tweets)} tweets, outside the 6–10 target; disclose the reason.")
        for j, body in enumerate(tweets, 1):
            label = f"thread {i} tweet {j}"
            if not valid_text(body, label):
                continue
            if re.match(r"^\s*\d+/\d+\s", body):
                errors.append(f"{label}: provide unnumbered body; checker adds numbering.")
            copy = f"{j}/{len(tweets)}\n{body}"
            length = conservative_x_length(copy)
            measurements.append({"item": label, "conservative_x_length": length})
            if length >= 280:
                errors.append(f"{label}: conservative length {length}; shorten or verify with a platform-aware counter.")

    return {
        "status": "FAIL" if errors else "PASS",
        "scope": "Lengths and em dashes only; X counts are conservative, not official.",
        "counts": {key: len(value) for key, value in arrays.items()},
        "measurements": measurements,
        "warnings": warnings,
        "errors": errors,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pack", type=Path)
    args = parser.parse_args()
    try:
        data = json.loads(args.pack.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(json.dumps({"status": "FAIL", "errors": [str(exc)]}))
        return 1
    report = check(data)
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if report["status"] == "FAIL" else 0


if __name__ == "__main__":
    raise SystemExit(main())
