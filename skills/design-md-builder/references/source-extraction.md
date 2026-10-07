# Source Extraction

Read this reference when creating or updating a `DESIGN.md`.

## Decide Authority Per Decision

Do not assign one source blanket authority over the whole brand. Choose the strongest source for each decision:

1. A current user-confirmed decision.
2. An approved brand guide, design variable, token file, or theme configuration.
3. A maintained component library, template, or production source file.
4. Current rendered output that shows what audiences actually see.
5. A pattern repeated across several real assets.
6. Model inference from a single example.

A current production page may reveal that an older guide is no longer followed. Preserve both facts in the audit and ask which one should control future work when the difference is material.

## Evidence Labels

- **Confirmed:** Explicitly stated by the user or an approved source.
- **Observed:** Repeated in real outputs but not documented as a rule.
- **Inferred:** A useful interpretation that the sources do not explicitly establish.
- **Missing:** Required for the requested asset types but absent from the evidence.

Only confirmed and well-supported observed decisions belong in `DESIGN.md` without qualification. Inferred decisions may appear in a proposed file when clearly surfaced for approval in `design-audit.md`.

## Extraction By Source Type

### Corrections And Review Feedback

Accept feedback from the current conversation, a supplied review, comments on an asset, before-and-after examples, or the `design-corrections.md` beside the target guide. A file named `design-lessons.md` or another user-selected name is equally usable when supplied; preserve its name and update sibling links rather than creating a competing active file. Review existing content: do not treat raw feedback history or proposals as accepted rules merely because of the filename.

For each correction, identify the original wording, the affected asset or example when available, the preferred observable behavior, and its scope: one asset, one format, or the whole brand. Record source, date, and author only when known.

Distinguish three cases:

- **Explicit future instruction:** "For future decks, put the takeaway in the slide title." Record an active correction scoped to presentations. The instruction itself supplies approval; repetition is unnecessary.
- **Local edit:** "Make this heading smaller." Apply only to the named asset when that edit is requested. Do not turn it into a universal heading-size rule. During guide extraction, leave it as local feedback unless the user has established wider scope.
- **Ambiguous feedback:** "This feels too busy." Look for an approved revision or other evidence that explains the intended change. Record a proposed interpretation in the audit if none exists. Repetition can show a recurring problem, but does not establish whether to remove content, simplify layout, or reduce decoration.

Write reusable rules as a condition and an observable action. Preserve exceptions and format scope. For example, "For presentation titles, state the slide's supported takeaway; use a topic label when the slide is a section divider." Do not add that exception as a brand preference unless supported or clearly proposed.

Record accepted reusable instructions in the active corrections file with scope, observable behavior, the baseline rule they amend, source, and date recorded. Use the entry shape in `design-md-spec.md`. Amend an existing correction instead of accumulating duplicates when the new instruction clearly replaces it. Preserve the original feedback in its source and retired-rule history in the audit. Later feedback replaces an earlier rule only when its authority and overlapping scope are clear.

Keep unresolved interpretations out of active corrections and a ready-to-use guide. A proposed guide may contain them only with a clear audit and draft status. Downstream agents read `DESIGN.md` and active corrections together; the audit is evidence and history, not an instruction override. When an authorized consolidation moves a correction into the relevant Colors, Layout, Asset Adaptation, or other baseline section, remove the incorporated active entry and record its destination in the audit. Do not automatically consolidate on every asset request.

### Website

Use both tracks when possible:

- Inspect rendered pages or screenshots for hierarchy, density, responsive behavior, image treatment, and practical component use.
- Inspect HTML, computed styles, stylesheets, CSS variables, theme files, or frontend configuration for exact colors, fonts, spacing, radii, shadows, and breakpoints.

Inspect more than the homepage when the site includes distinct content, product, pricing, or article layouts. Do not automate access to authenticated or private pages without explicit authorization.

### PDF Brand Guide

Read the guide completely. Capture version or date, color values and color space, typography, logo clearance, minimum sizes, imagery, examples, and explicit restrictions. Distinguish print values from digital values. Do not convert CMYK to hex without labeling the conversion as derived.

### Screenshots Or Images

Use images for composition, hierarchy, repeated visual motifs, and approximate color relationships. Treat exact color sampling, font identification, spacing, and responsive behavior as unconfirmed unless another source supports them.

### Slides Or Documents

Inspect theme masters, layouts, document styles, and embedded fonts when available. Compare those settings with representative finished pages because templates may contain unused or stale styles. Capture canvas size, margins, title/body roles, image treatment, footers, charts, and recurring composition patterns.

### Figma Or Other Design Files

Prefer variables, styles, libraries, components, and documented usage rules over visual sampling. Record whether a component or token is actively used. Do not assume every library item belongs in the current brand.

### Frontend Code

Inspect theme configuration, CSS variables, Tailwind configuration, global styles, reusable components, and state variants. Resolve aliases to their final values when practical. Compare with a rendered page because unused or overridden code can mislead extraction.

### Written Brand Description

Use the user's language for audience, character, emotional response, and restrictions. Ask for examples when adjectives are broad enough to produce generic output.

## Conflict Handling

For each conflict, record:

- the decision in dispute
- the competing values or rules
- each source and its date when known
- what current assets use
- the consequence of choosing either option
- the recommended choice and whether user approval is required

Never average conflicting colors, font sizes, or spacing values to manufacture consensus.

## Targeted Questions

Ask after extraction. High-value questions usually concern:

- which source is current
- whether a visually observed pattern is intentional
- which logo variant may be used on which background
- whether paid fonts are licensed for the intended output
- which asset format matters first
- whether accessibility or platform requirements override a brand choice

Keep unresolved questions in the audit when the user does not need to answer them before receiving a useful proposed file.
