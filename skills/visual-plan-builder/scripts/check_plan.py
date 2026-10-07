#!/usr/bin/env python3
"""Check a generated standalone plan. Does not judge content or rendered layout."""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

VOID = set("area base br col embed hr img input link meta param source track wbr".split())
class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        self.title = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title": self.title = True
        if tag == "script": self.errors.append("Scripts are unnecessary in a static plan")
        if any(k.startswith("on") for k in attrs): self.errors.append("Inline event handler")
        if tag in {"iframe", "object", "embed", "base"}: self.errors.append("Embedded or base URL dependency")
        if tag == "link" and attrs.get("rel") == "stylesheet": self.errors.append("External stylesheet")
        for k in ("src", "srcset", "poster"):
            if attrs.get(k) and not attrs[k].startswith("data:"): self.errors.append("Non-contained media dependency")
        if attrs.get("href", "").strip().lower().startswith("javascript:"): self.errors.append("Executable URL")
        if tag not in VOID: self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID: self.handle_endtag(tag)
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append("Unexpected closing tag: " + tag)
        else: self.stack.pop()

def check(path):
    text = Path(path).read_text()
    p = Check()
    p.feed(text)
    errors = p.errors
    if p.stack: errors.append("Unclosed tags: " + ", ".join(p.stack))
    if not p.title: errors.append("Missing document title")
    if re.search(r"\{\{[^{}]+\}\}", text): errors.append("Unfilled template placeholder")
    if re.search(r"@import|url\(\s*['\"]?(?!data:)", text, re.I): errors.append("CSS network or file dependency")
    return errors

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: check_plan.py plan.html")
    errors = check(sys.argv[1])
    print("\n".join(errors) if errors else "PASS: static HTML checks; content and visual review still required")
    raise SystemExit(1 if errors else 0)
