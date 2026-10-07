# Templates

Each template is one HTML file: a header comment with its rules, a font link, a style block, and a short sample deck (hook, content, CTA). The skill copies the file, keeps the styles, and replaces the sample slides with real ones.

To see any template with your own brand on it:

```bash
node scripts/carousel.mjs demo sticky-notes
```

Sample renders of every template are in `previews/`. `demo` creates `carousel.html`, a layout report, and `overview.png` only. Review the HTML first; export a PDF only after the user approves conversion.

| ID | Best for | Look |
|---|---|---|
| `sticky-notes` | Essays, numbered steps or lessons, action-driven posts. | Warm bone, large body type, one yellow highlight per slide, white action cards. |
| `editorial-sticker` | General-purpose decks. | Bone background, oversize headline, one yellow sticker, coral squiggle. |
| `brutalist-mono` | Manifestos, hot takes, single-idea posts. | Black background, type only, one yellow word, one coral rule. |
| `sticker-collage` | Frameworks, lists, opinionated takes. | Bone background, several stickers, hand-drawn arrows, slight tilts. |
| `magazine-grid` | Field reports and research-style posts. | Stone background, serif headlines, cobalt numerals, hairline rules. |
| `gradient-glass` | Tool announcements, technical workflows. | Navy to violet gradient, frosted glass cards, cyan accent. |
| `terminal-readme` | Prompts, agent workflows, tool teardowns. | Dark code-editor look, monospace everywhere. |
| `data-card` | Posts built on real numbers: surveys, benchmarks, results. | White, one very large number, a three-stat row. |
| `swiss-grid` | Principles, frameworks, philosophical takes. | White, black, one red square, very large headline. |

## How a template is picked

1. A template the user names for this carousel wins, for this carousel only.
2. If no template was selected, show the complete list above with the descriptions and ask the user to choose. A saved template is an option, not an automatic selection.
3. Wait for a valid choice, an explicit request to reuse the saved choice, or explicit delegation to the assistant. Clarify invalid names. Do not silently fall back.
4. Keep the approved template when editing the same carousel unless the user asks to change it.

## Adding your own template

Copy `sticky-notes.html` to `templates/<new-id>.html` and change it. The script finds it by file name, so there is nothing else to register. The contract:

- The file is a fragment: one comment header, one Google Fonts `<link>`, one `<style>` block, then the sample slides. No `<html>` or `<body>`, no JavaScript.
- Every slide is `<section class="slide hook">`, `<section class="slide content">` or `<section class="slide cta">`, with a `data-max-words` budget.
- `.slide` is already 1080x1350, a flex column, with overflow hidden (see `_base.css`). Your CSS sets its colors, font and padding, and styles what goes inside.
- Tokens the script fills in: `{{AUTHOR_NAME}}`, `{{AUTHOR_INITIAL}}`, `{{PUBLICATION_NAME}}`, `{{PUBLICATION_NAME_UPPER}}`, `{{POSITIONING_TEXT}}`, `{{PAGE}}`, `{{TOTAL}}`, `{{PAGE_RAW}}`, `{{TOTAL_RAW}}`.
- The avatar is always `<div class="avatar" data-initial="{{AUTHOR_INITIAL}}"></div>`. Give it a size and font-size.
- Put `data-decor` on decoration that bleeds off the slide or sits behind text, so the checker ignores it.
- `data-allow-gap="N"` on a slide raises the empty-band limit from 180px when the design wants open space.
- Body copy 28px or larger. A phone shows the slide at about a third of its size.

Run `node scripts/carousel.mjs demo <new-id>` until the checker reports no errors and no warnings, then inspect the HTML preview and overview image.
