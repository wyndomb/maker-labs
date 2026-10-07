# LinkedIn Carousel Skill (HTML)

Turn what you already have into a LinkedIn carousel: something you said out loud, rough notes, a meeting transcript, a long draft, or a published post. You talk or paste, your assistant proposes an outline, and it builds the carousel with your chosen template.

There is no design app to install. The slides are built as plain HTML, with PDF and PNG export after you approve the HTML preview and the session has the required tools.

## What you need

For automatic PDF and PNG export, the assistant's execution environment needs **Node.js 18 or newer** and **Chrome, Edge, Brave, or Chromium**. There are no npm packages to install. The templates load fonts from Google Fonts, so the intended typography needs an internet connection.

The skill can be packaged in Maker Labs or installed as a local skill in a compatible assistant. A plugin installation does not provide Node, a browser, or permanent file storage by itself. The assistant checks what the current session can do before choosing the export path.

If Node is available without a browser, the skill can still create complete HTML for you to download and print to PDF. If Node is unavailable, an assistant with file tools can assemble the HTML from the included templates. Those fallbacks are labeled unchecked and do not promise automatic PNG export.

## Install and start

In Maker Labs, ask: "Turn these notes into a LinkedIn carousel" and supply your source material. No Claude-specific folder or slash command is required.

For a standalone local installation, place the complete folder in your assistant's supported skills directory. For Claude Code, for example:

```bash
cp -r linkedin-carousel-html ~/.claude/skills/linkedin-carousel-html
node ~/.claude/skills/linkedin-carousel-html/scripts/carousel.mjs doctor
```

For the commands below, `SKILL_DIR` means the actual installed skill folder. `doctor` reports the available browser and the brand config location.

## First run

The assistant asks for your name, optional publication, optional positioning line, photo or logo to use, and template choice. It reuses answers you already supplied. If you have not chosen a template, it shows all nine styles with short descriptions and waits for your choice. It also asks you to upload a photo or logo, reuse a saved image, or explicitly choose no image. Logos keep their proportions and transparency.

Local settings live outside the installed skill, at the path printed by:

```bash
node "$SKILL_DIR/scripts/carousel.mjs" config-path
```

On macOS/Linux this defaults to `~/.config/maker-labs/linkedin-carousel-html/branding-config.json`. On Windows it uses `%APPDATA%/maker-labs/linkedin-carousel-html/branding-config.json`. You can select a different file using `--config <path>` or `CAROUSEL_CONFIG`.

For temporary sessions, download the separate brand config and upload it on your next use. Photos may need to be uploaded again. The assistant will not promise cross-session storage that the host does not provide.

For every new carousel, the assistant confirms these template and image choices unless your request already includes them. A saved preference is offered as an option. Edits to an existing carousel keep its approved choices.

## Ways to use it

**Just talk.** Dictate or type what is on your mind:

```
Make a LinkedIn carousel from this: here's what I learned running onboarding calls this month: [your thoughts]
```

**From notes or a transcript:**

```
Turn these meeting notes into a carousel: [paste, or a file path]
```

**From a long draft or a published post:**

```
Make a carousel from drafts/my-post.md
```

```
Turn this into a carousel: https://yournewsletter.com/p/post-slug
```

**A different template for one carousel** (your saved default stays the same):

```
Make a LinkedIn carousel and use brutalist-mono for this one: [your content]
```

## What happens

1. The assistant reads your material and picks the one angle worth a carousel.
2. You see an outline: every slide in a line or two, the details kept from your source, and anything the assistant added. Nothing is built until you say yes.
3. When automatic export is available, the assistant writes the slides and runs a check for cut-off text, empty space and slides that are too wordy.
4. You receive the HTML preview first. Review it and request changes, or confirm that it is ready to convert to PDF.
5. Only after your confirmation does the assistant export the PDF and individual PNG slides. A successful export produces the following files in a writable output folder, with download links when the host supports them:

```
linkedin-carousels/2026-10-01-your-topic/
  carousel.pdf     upload this to LinkedIn
  slides/          one PNG per slide (2160 x 2700)
  carousel.html    preview in any browser
  overview.png     all slides at a glance
  deck.html        the editable source
```

To post it, start a LinkedIn post, choose "Add a document", pick `carousel.pdf` and give it a title.

## Changing a carousel

Say what you want changed:

```
shorten the headline on slide 3
```

```
cut it to seven slides
```

```
try this one in magazine-grid
```

The assistant edits the source and shows the revised HTML preview. It waits for your approval before exporting the revision.

## Templates

| Template | Good for |
|---|---|
| `sticky-notes` | Essays, numbered steps or lessons |
| `editorial-sticker` | General-purpose decks |
| `brutalist-mono` | Manifestos and single-idea posts |
| `sticker-collage` | Playful frameworks and lists |
| `magazine-grid` | Field reports, research-style posts |
| `gradient-glass` | Tool announcements, technical workflows |
| `terminal-readme` | Prompts, agent workflows, tool teardowns |
| `data-card` | Posts built on real numbers |
| `swiss-grid` | Principles and frameworks |

Sample renders are in `templates/previews/`. The `demo` command creates HTML and an overview for review, without a PDF or individual slide exports. To see one with your own name and photo:

```bash
node "$SKILL_DIR/scripts/carousel.mjs" demo magazine-grid
```

To change your default: "Switch my default carousel template to magazine-grid."

## What this skill will not do

- **Invent numbers.** Every statistic, quote and example on a slide comes from what you gave it. If your material has no numbers, the hook is built from a count or a concrete claim you made.
- **Skip the outline.** You approve the angle and the slides before anything is built, unless you tell it to go straight to the build.
- **Write 20 slides.** Decks are six to ten slides, with a word budget per slide.

## Updating your brand

```
Update my carousel branding
```

## Troubleshooting

**No browser available.** On a local computer, use an installed Chromium browser or set `CAROUSEL_BROWSER` to its executable. In a hosted session, installing a browser on your own computer does not fix the remote environment. Ask for HTML-only output instead: `node "$SKILL_DIR/scripts/carousel.mjs" html <deck.html>`. Download `carousel.html`, open it locally, and use Save as PDF.

**The fonts look wrong.** Google Fonts may be unavailable or blocked, causing the browser to use a fallback font. Reconnect and ask the assistant to build again.

**Image unavailable.** Upload the photo or logo again, supply an accessible JPG/PNG path, or explicitly choose no image to use your initial.

**Export failed.** The command returns a failure status and explains what failed. Existing PDF/PNG files may be from an earlier build; do not use them as the revised result. Fix the reported issue and rebuild, or open `carousel.html` in Chrome or Edge and press the Save as PDF button at the top. The page size is already set.

**Start over.** Ask to reset your branding. The assistant uses the separate user-owned brand config, never the installed skill folder.

**Make your own template.** See `templates/README.md`.

## Notes

- Built and tested on macOS with Chrome. The script also looks for browsers in the standard Windows and Linux locations, but those have not been tested yet.
- Keep personal brand configs and photos out of shared packages. The supplied `branding-config.template.json` is intentionally blank.
- A successful rebuild replaces generated slide images and removes obsolete `slide-NN.png` files. Other files in `slides/` are preserved. With `--no-png`, previous generated slide PNGs are removed after the PDF export succeeds.
- Regression checks: `node --test tests/carousel.test.mjs`. Real-browser preview check: `node scripts/carousel.mjs demo sticky-notes --out <temporary-output-folder>`. After approving a preview, use `build <deck.html>` with the same brand config to export.
- Fresh-session Maker Labs behavior and Windows/Linux execution must be verified separately from local macOS tests.
