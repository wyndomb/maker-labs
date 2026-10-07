"""Synthetic regression cases; run with python3 -m unittest discover -s tests."""
import copy
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from check_design_bundle import check_bundle, check_provenance
from check_design_md import inspect


GUIDE = '''---
name: "Synthetic test brand"
colors:
  primary: "#345678"
  action: "{colors.primary}"
---
# Synthetic test brand
[Corrections](design-corrections.md) [Audit](design-audit.md)
## Overview
A synthetic checker fixture, not a real brand.
## Colors
Use primary for accents.
'''
AUDIT = '''# Audit
- Overall readiness: Ready with caveats
## Sources Reviewed
| Source | Type | Date | What it established | Limitations |
| --- | --- | --- | --- | --- |
| Synthetic brief | Fixture | 2026-10-05 | primary #345678 | No real brand |
'''
CORRECTIONS = '''# Corrections
[Guide](DESIGN.md) [Audit](design-audit.md)
## Active corrections
No corrections recorded yet.
'''
ENTRY = '''### C001: Takeaway titles
- Scope: Presentations
- Instruction: Use the supported takeaway as the slide title.
- Overrides: Adds guidance
- Source: User accepted the previously proposed title rule.
- Recorded: 2026-10-05
'''


class BundleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.folder = Path(self.temp.name)
        self.names = {"guide": "DESIGN.md", "audit": "design-audit.md", "corrections": "design-corrections.md"}
        self.texts = {"guide": GUIDE, "audit": AUDIT, "corrections": CORRECTIONS}
        for role, name in self.names.items():
            (self.folder / name).write_text(self.texts[role], encoding="utf-8")

    def check(self, entry=None):
        texts = copy.copy(self.texts)
        if entry is not None:
            texts["corrections"] = CORRECTIONS.replace("No corrections recorded yet.\n", entry)
        return check_bundle(self.folder, self.names, texts)

    def test_valid_partial_bundle(self):
        self.assertEqual(self.check()["status"], "PASS")
        self.assertEqual(check_provenance(GUIDE, AUDIT)["status"], "PASS")
        self.assertEqual(inspect(self.folder / "DESIGN.md")["status"], "PASS")

    def test_source_quote_does_not_reject_accepted_rule(self):
        self.assertEqual(self.check(ENTRY)["status"], "PASS")

    def test_each_blank_field_rejected(self):
        for field in ("Scope", "Instruction", "Overrides", "Source", "Recorded"):
            with self.subTest(field=field):
                entry = "\n".join(f"- {field}:" if line.startswith(f"- {field}:") else line for line in ENTRY.splitlines())
                findings = self.check(entry)["findings"]
                self.assertTrue(any(f"missing or placeholder '{field}'" in f["message"] for f in findings))

    def test_proposed_instruction_rejected(self):
        self.assertEqual(self.check(ENTRY.replace("Instruction: Use", "Instruction: Proposed: Use"))["status"], "NEEDS REVISION")

    def test_duplicate_correction_id_rejected(self):
        self.assertEqual(self.check(ENTRY + ENTRY)["status"], "NEEDS REVISION")

    def test_broken_link_rejected(self):
        self.texts["guide"] += "\n[Missing](missing.md)\n"
        self.assertEqual(self.check()["status"], "NEEDS REVISION")

    def test_missing_corrections_rejected(self):
        self.texts["corrections"] = None
        self.assertEqual(self.check()["status"], "NEEDS REVISION")

    def test_proposed_bundle_requires_status(self):
        self.texts["audit"] = AUDIT.replace("Ready with caveats", "Needs approval")
        self.assertEqual(self.check()["status"], "NEEDS REVISION")
        self.texts["guide"] = GUIDE.replace("## Overview", "Status: Proposed, awaiting approval.\n## Overview")
        self.assertEqual(self.check()["status"], "PASS")

    def test_missing_evidence_rejected(self):
        self.assertEqual(check_provenance(GUIDE, AUDIT.replace("#345678", "unspecified"))["status"], "NEEDS REVISION")

    def test_empty_sources_incomplete(self):
        self.assertEqual(check_provenance(GUIDE, "# Audit\nprimary #345678\n")["status"], "INCOMPLETE")

    def test_undefined_reference_rejected(self):
        self.assertEqual(check_provenance(GUIDE.replace("{colors.primary}", "{colors.missing}"), AUDIT)["status"], "NEEDS REVISION")

    def test_reference_cycle_rejected(self):
        guide = GUIDE.replace('primary: "#345678"', 'primary: "{colors.action}"')
        self.assertEqual(check_provenance(guide, AUDIT)["status"], "NEEDS REVISION")

    def test_custom_filenames(self):
        for role, old in list(self.names.items()):
            new = "custom-" + old
            for key in self.texts:
                self.texts[key] = self.texts[key].replace(f"]({old})", f"]({new})")
            self.names[role] = new
            (self.folder / new).write_text(self.texts[role], encoding="utf-8")
        self.assertEqual(self.check()["status"], "PASS")


if __name__ == "__main__":
    unittest.main()
