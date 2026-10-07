---
version: alpha
name: "[Brand name]"
description: "[One sentence describing the brand and intended audience response]"
colors:
  primary: "#000000"
  on-primary: "#FFFFFF"
  secondary: "#666666"
  surface: "#FFFFFF"
  on-surface: "#111111"
typography:
  headline-lg:
    fontFamily: "[Confirmed headline font]"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: "[Confirmed body font]"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  md: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

# DESIGN.md: [Brand name]

Before planning or generating an asset, read this entire guide and [design-corrections.md](design-corrections.md). Share this folder together and explicitly instruct the producing agent to use it.

- Follow the current user request, then accepted corrections within their stated scope, then this baseline guide. A change requested for one asset does not permanently change the brand.
- Consult [design-audit.md](design-audit.md) when a needed decision is missing or disputed. Audit proposals and retired rules are not active instructions. Ask about material conflicts that scope or explicit supersession cannot resolve.
- If the corrections file is missing, report the incomplete bundle. Continue with this guide only when the user accepts that limitation or the missing information cannot materially affect the asset.
- Use the relevant format adaptation guidance and the producing agent's format-specific quality checks. Report unavailable fonts, assets, or approximations.
- When the user gives an explicit instruction for future assets, save it in the corrections file with its scope and source, following that file's entry instructions. Keep one-asset edits local and ambiguous interpretations in the audit. If you cannot write the file, return the entry and state that it has not been saved.

## Overview

[Describe the audience and intended response. Identify the few supported design decisions and relationships that make this reference recognizable, explain how they work together, and state which qualities should survive format adaptation. Use observable choices rather than generic adjectives or a repeated token list. Give the agent enough reasoning to make unlisted decisions; keep unsupported interpretations in the audit.]

## Colors

[Explain the functional roles, proportions, pairings, accessibility constraints, and prohibited uses of each color.]

## Typography

[Explain hierarchy, roles, fallback behavior, line length, casing, weight, and when each type role applies.]

## Layout

[Explain spacing rhythm, density, grids, alignment, margins, responsive intent, and grouping behavior.]

## Elevation & Depth

[Explain borders, shadows, tonal layering, overlap, texture, or the deliberate absence of depth.]

## Shapes

[Explain radii, geometry, strokes, containers, crops, and how shape supports the brand character.]

## Components

[Describe recurring components, variants, states, hierarchy, and any relationships that tokens alone cannot express.]

## Do's and Don'ts

- Do [specific repeatable behavior].
- Don't [specific failure that would make the result feel off-brand].

## Logo & Marks

[Include only supported logo variants, placement, clear-space, background, and transformation rules.]

## Imagery

[Describe subject, framing, crop, lighting, texture, illustration, and prohibited treatments.]

## Iconography

[Describe stroke, fill, weight, optical size, corner behavior, and mixing rules.]

## Data Visualization

[Describe series colors, highlights, labels, grid lines, annotation, and accessibility behavior.]

## Voice & Copy

[Include only source-supported headline, casing, terminology, call-to-action, and restriction rules.]

## Asset Adaptation

[Explain which brand decisions stay fixed and which may adapt. For each intended format, describe the reader's job, what should lead, how the brand applies, what can change with content or canvas, and source-supported restrictions. Include only relevant formats. Put baseline guidance here and active amendments in the sibling corrections file so the folder is portable; leave rendering and export mechanics to the producing skill.]
