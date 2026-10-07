# Bundled DESIGN.md Specification

This is the runtime format reference for this skill. Use it locally; extracting a brand does not require fetching an external specification.

Reviewed 2026-09-07. During intentional skill maintenance, update this reference and its templates together and record a new review date.

## Design File Format

### Structure And Authority

A DESIGN.md combines YAML tokens with Markdown explanations. Tokens supply concrete values; prose explains when and why to apply them. Keep both consistent. Use front matter with `name` for predictable identification and add tokens only when supported by evidence.

Start YAML with `---` on the first line and end it with another `---`. An optional H1 title follows. Use H2 headings for design sections. Do not invent tokens to satisfy an example or a checker.

### Front Matter

| Field | Shape and use |
| --- | --- |
| `name` | Brand or design-system name as a string. Required by this skill. |
| `description` | Optional concise description. |
| `colors` | Semantic token names mapped to CSS color strings. If present, include `primary` and explain its role in prose. A primary brand color is not automatically the action color. Quote hex values so YAML does not read them as comments. Prefer `#RRGGBB` when the source provides suitable values. Other valid CSS color representations are allowed. |
| `typography` | Semantic roles mapped to properties: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, and optionally `fontFeature` and `fontVariation`. Preserve only supported values; do not invent a font or fill missing properties from the template. |
| `spacing` | Named dimensions, or numbers for ratios and counts. |
| `rounded` | Named corner-radius dimensions. |
| `components` | Named components with supported token properties and optional related names for variants. |
| `omitted` | Optional list of intentionally absent categories, as strings or objects with `section` and `reason`. Explain evidence gaps in the audit. |

Dimension values in this token format use `px`, `em`, or `rem`. A typography `lineHeight` can also be a unitless multiplier; `fontWeight` can be numeric or its quoted equivalent. Keep print-specific units such as points and inches in relevant adaptation prose instead of forcing them into digital token fields. Never convert print values into digital values without recording the derivation.

Supported component properties are `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, and `width`. Use a literal or a reference to a defined token, for example `"{colors.primary}"`. References use an exact path in braces, must resolve, and must not form cycles. Most references point to a primitive value; a component's `typography` can reference a whole typography role such as `"{typography.body-md}"`.

Token names should describe the brand's actual roles. Do not adopt the template's palette, font sizes, spacing, radii, or component examples as defaults. Remove unsupported entries and record what is missing. Omission communicates unavailable evidence, not a design decision that a feature must never exist.

### Markdown Sections

Use the following order for sections that are present. Irrelevant or unsupported sections can be omitted rather than filled with guesses.

1. `Overview`: visual character, audience response, and rationale, centered on the supported decisions and relationships that make the reference recognizable and the qualities to preserve across intended formats. Accepted alias: `Brand & Style`.
2. `Colors`: roles, pairings, proportions, and restrictions.
3. `Typography`: hierarchy, usage, and fallback behavior.
4. `Layout`: spacing, alignment, density, and responsive intent. Accepted alias: `Layout & Spacing`.
5. `Elevation & Depth`: borders, shadows, layers, or intentional flatness. Accepted alias: `Elevation`.
6. `Shapes`: geometry, radii, crops, and strokes.
7. `Components`: recurring patterns, variants, and states.
8. `Do's and Don'ts`: observable positive rules and meaningful restrictions.

Use each standard H2 section at most once. Add evidence-backed custom sections after the standard sections and preserve useful existing custom sections during updates. Support in consuming tools may vary. A parser accepting a file does not prove a tool will follow every instruction in it.

## Design Folder Contract

The folder combines the brand guide, evidence audit, active corrections, consumption instructions, and cross-asset adaptation guidance.

### Output Folder

Default new output:

```text
design/
  DESIGN.md
  design-audit.md
  design-corrections.md
```

`DESIGN.md` holds the baseline brand decisions and supported format adaptations. `design-corrections.md` holds accepted amendments that remain active. `design-audit.md` holds evidence, uncertainty, conflicts, validation results, and any retired-rule history. Preserve user-selected names and existing locations during updates, and adjust sibling links accordingly.

### Consumption And Precedence

Embed the following instructions in the generated guide, before the standard H2 sections:

- Read the whole guide and the sibling corrections file before planning or generating an asset.
- Follow the current user request, then accepted corrections within their stated scope, then the baseline guide. A request for this asset alone does not permanently change the brand.
- If active corrections conflict and neither scope nor explicit supersession resolves the conflict, consult the audit and ask when the choice is material. Do not silently choose the newest date as authority.
- Consult the audit for needed but missing or disputed decisions. Audit proposals and history do not override active rules.
- If the corrections file is missing, report that the bundle is incomplete. Do not claim no corrections exist. Continue with the guide only when the user accepts that limitation or the missing information cannot materially affect the requested asset.
- Preserve the brand while adapting composition and production mechanics to the requested format. Report unavailable fonts, assets, and approximations.

### Active Correction Entries

An initial corrections file contains its usage and update instructions plus `No corrections recorded yet.` Do not populate it with sample brand preferences. When explicit reusable feedback is supplied, replace the empty-state text with entries using this shape:

```markdown
### C001: [Short rule name]

- Scope: [Named format or whole brand, including conditions]
- Instruction: [Observable action for future assets]
- Overrides: [Specific baseline section or earlier correction, or "Adds guidance"]
- Source: [User wording or review reference; author and source date only if known]
- Recorded: [Actual date this entry was saved]
```

All entries in this file are active and accepted. Do not put proposals, unresolved interpretations, one-asset-only edits, or retired entries here. Explicit instructions for future work count as acceptance; ambiguous feedback does not. Do not expand a slide rule to all formats. Preserve the user's intent when turning wording into an actionable instruction.

On explicit reusable feedback, the asset-building agent should update this file when it has write access, without requiring the builder to be installed. If it cannot write, return the proposed entry and say it has not been saved. Ordinary asset requests do not authorize unrelated changes to the brand guide.

When a later accepted instruction clearly replaces an earlier one, remove or revise the superseded active entry and record the change in the audit. During an authorized guide consolidation, move the rule into the relevant baseline section, remove the incorporated active correction, and record its destination in the audit. Preserve other entries. If none remain, restore the empty-state text. Never imply that recording or consolidating a correction proves better visual output.

### Adaptation And Checks

Use `cross-asset-extensions.md` to write supported adaptation guidance inside the user's guide. Consumers should not need access to this skill's references.

Use `check_design_bundle.py` on the folder for structural, token reference, audit traceability, sibling link, and correction format checks. Manually confirm that sources actually support traced values and that correction scopes match the feedback. Report checks actually performed. Full YAML/schema validation, visual fidelity, and cross-format performance are separate claims and require their own evidence. This workflow does not require fetching an external specification or an automatic generate-and-improve loop.
