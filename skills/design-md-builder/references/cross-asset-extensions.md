# Cross-Asset Extensions

Read this reference when one `DESIGN.md` will guide websites, slides, lead magnets, reports, social graphics, or other formats.

## Separate Shared Brand Decisions From Format Technique

`DESIGN.md` should hold decisions that remain true across formats:

- visual character and desired audience response
- semantic color roles
- typography roles and fallback hierarchy
- spacing rhythm and density
- shape, border, and elevation language
- logo, imagery, iconography, and chart treatment
- composition tendencies and restrictions
- voice or copy rules when the source material supports them

The asset-producing skill remains responsible for format technique such as responsive web behavior, slide overflow, printable margins, page breaks, animation, export settings, and accessibility requirements.

## Optional Custom Sections

The official format preserves unknown sections. Add these after the standard sections when the evidence supports them:

### Logo & Marks

Include approved variants, safe backgrounds, clear space, minimum size, placement tendencies, and prohibited transformations. Point to existing files rather than embedding or copying unauthorized assets.

### Imagery

Describe subject matter, framing, crop behavior, lighting, texture, illustration style, treatment, and what to avoid.

### Iconography

Describe stroke or fill style, weight, corner behavior, optical size, color roles, and mixing restrictions.

### Data Visualization

Define series colors, highlight behavior, grid lines, labels, number formatting, annotation style, and accessibility rules.

### Voice & Copy

Include this only when the brand references establish it. Capture headline character, casing, sentence rhythm, terminology, calls to action, and banned constructions. Keep long editorial guidance in a separate writing file when it would overwhelm the visual reference.

### Asset Adaptation

Include guidance for the intended formats inside the generated `DESIGN.md`. Start by distinguishing shared brand commitments, such as color roles, font families, imagery, and restrictions, from adaptable choices, such as title size, content density, placement, and reading sequence. Use evidence and accepted corrections to decide which choices belong in each group. A brand may deliberately use different themes or type treatments for different formats.

For each intended format, state:

1. **Reader's job:** What should the person understand, decide, or do?
2. **Opening priority:** Which answer, evidence, offer, instruction, or interaction should lead?
3. **Brand application:** How should the established type roles, colors, imagery, spacing, and logo behavior support that job?
4. **Allowed adaptation:** What may change for the content, canvas, reading distance, or reading speed?
5. **Scoped restrictions:** Which accepted corrections or source rules apply here, and under what conditions?

These are starting points for reasoning, not claims about the user's brand:

| Format | Reader job and composition guidance | Typical adaptation |
| --- | --- | --- |
| Landing page | Understand the offer, assess relevant proof, and find the intended next action. If using a tool is the page's purpose, prioritize the working tool. | Adapt hierarchy and column structure to the content and screen. Do not prescribe a centered hero and card grid for every offer. |
| Personal website | Understand whose work this is, whether it is relevant, and where to explore or make contact. Let the user's actual goal determine whether work samples, biography, or an offer leads. | Preserve identity while allowing portfolios, articles, and service pages to have different structures. |
| Presentation | Follow an argument or explanation in a sequence. Make each slide's takeaway apparent; use labels where navigation or section division is the actual job. | Adapt type scale and density to live presentation versus a deck read independently. Shared typography does not imply reusing web font sizes. |
| Lead magnet or guide | Learn or complete a practical task, then find the instructions again. Prioritize steps, examples, and useful reference material. | Use hierarchy suitable for sustained reading and navigation. Adapt covers and interior pages differently; avoid carrying promotional hero proportions through every page. |
| Report or proposal | Understand the finding or recommendation and inspect the evidence. Keep supporting detail available without giving every item equal prominence. | Let tables and diagrams use the space required for comparison while keeping prose readable. |
| Social graphic or carousel | Recognize the idea quickly and follow a short sequence when present. | Adapt crop, hierarchy, and density to the canvas. Avoid scaling a landscape slide into a portrait graphic unchanged. |

Use only the formats in scope. Do not fill the guide with every row of this reference or invent exact type sizes, dimensions, spacing, or token values. If audience or delivery context is missing, label the adaptation as a proposed choice in the audit and ask only if it would materially change the result.

Preserve the brand's own aesthetic. A colorful brand may need expressive imagery and large color fields; a restrained brand may rely on type and spacing. Neither is a universal default. Apply accepted corrections at their stated scope, so a slide-specific preference does not silently change websites or printable guides.

Write baseline adaptation instructions in the user's `DESIGN.md` and active amendments in the sibling `design-corrections.md`; referring only to this skill's reference files would break portability. Leave rendering mechanics, file export, and detailed templates to the producing skill.

## Downstream Consumption Contract

Before creating an asset, the producing skill or agent should:

1. Read the complete `DESIGN.md` and `design-corrections.md` before planning. Follow the current user request, then accepted corrections within their scope, then the baseline. Consult `design-audit.md` only when a needed decision is missing or disputed; its proposals and history are not active instructions. Report a missing corrections file rather than assuming it contains no rules.
2. Read Asset Adaptation for the requested format, identify the reader's current job, and choose the hierarchy before selecting components. Apply the relevant tokens and scoped rules; do not force all assets into one structure.
3. Check that required fonts, logos, images, and icons are available and permitted.
4. Apply its own format-specific quality rules.
5. Report any approximation or conflict instead of silently substituting a new style.
6. Review a rendered result. When the user gives an explicit instruction for future work, save an accepted correction at its stated scope using the instructions in the folder. This does not require the builder to be installed. Keep one-asset edits local and ambiguous interpretations in the audit. If unable to save, return the entry and state that it has not been saved. Consolidate corrections into the baseline only during an authorized guide update, retiring incorporated active entries into the audit.

One successful asset does not prove cross-format consistency. Test at least one representative web surface, one presentation surface, and one document or lead-magnet surface before making that claim.
