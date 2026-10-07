---
name: linkedin-carousel-html
description: Create or edit LinkedIn carousels from notes, transcripts, drafts, or article URLs using nine HTML templates. Create an HTML preview first, then export PDF and PNG files only after the user approves the preview and conversion. Automatic export requires Node and a Chromium browser. Use for requests to make a LinkedIn carousel or turn source material into carousel slides.
---

# LinkedIn Carousel (HTML)

Takes whatever the user has (talking, notes, a transcript, a draft, a URL), finds the one carousel worth making, confirms the outline, then builds 1080x1350 slides as HTML for the user to review. PDF and PNG export happens only after the user approves the preview for conversion.

`SKILL_DIR` below means the folder this file lives in. Every command is `node "$SKILL_DIR/scripts/carousel.mjs" <command>`. Resolve this path from the installed skill, not a hardcoded plugin installation directory. If using an explicit brand file, append `--config "<path>"` to every command that uses branding, including `doctor`, `demo`, `html`, `check`, and `build`.

## 0. Pre-flight

1. **Available tools.** Check whether this session can read the packaged files, write downloadable files, and execute Node. Use an available bundled runtime when the host provides one. If Node is available, run `doctor`. It reports the local runtime, browser, brand location, and templates. A user's desktop browser is usable only when the execution environment can actually access it. Do not ask a cloud-session user to install Chrome on their own computer as a fix for a missing browser in the session. If Node or a browser is unavailable, use the fallback below. Never install software or disable the browser sandbox automatically.
2. **Brand.** When Node is available, run `config-path` to find the default user-owned location. Without Node, choose a writable user-owned file outside the skill and follow the setup format. If its file is missing or `first_time_setup` is not `false`, read [setup.md](setup.md). Never save personal settings or photos inside the installed skill. For temporary or hosted sessions, save a separate brand file alongside the user's project, pass `--config`, and offer it as a download for reuse. Do not promise that a later session will retain it. Otherwise acknowledge the saved name and positioning, then confirm the template and image choices below. Saved settings alone do not answer those questions for a new carousel.
3. **Template choice for each new carousel.** If the user already named a valid template, use it without asking again or showing the full menu. "Use my saved template" also counts as a choice when the saved id is valid. Otherwise read [templates/README.md](templates/README.md), show the complete available template list with a short description of each, and ask which one they want. Verify ids with `templates` when Node is available, or the packaged HTML filenames otherwise. Mention a saved preference as an option, never silently select it. Wait for a choice. If they explicitly ask you to choose, recommend the best fit and name it. Unknown or ambiguous names require clarification rather than an automatic fallback. Read the chosen template's header before writing slides.
4. **Photo or logo for each new carousel.** Ask the user to upload the photo or logo they want on the slides, or provide an accessible path. If an image was already supplied and its role is clear, use it without asking again. If an image is saved, offer "reuse saved image", "upload a different photo or logo", or "no image". Without a saved image, offer upload/path or "no image". Wait for an image, explicit reuse, or explicit no-image choice; an omitted answer is not permission to use initials. If unclear whether an upload is a photo or a logo, ask. Accept JPG or PNG; a transparent PNG works well for a logo. Use a normal chat message for uploads when a question tool accepts text only.

Combine the unanswered template and image questions in one message, including the template menu when needed. First-run setup uses this same checkpoint, so do not ask twice. Read source material while waiting, but do not start designing slides until the choices are resolved. Skipping outline approval does not waive missing template or image choices. For edits to an existing carousel, retain its already-approved choices unless the user asks to change them.

A one-off template or image choice must not overwrite saved branding. Copy the saved config into the output folder as `carousel-brand.json`, set this run's template, `photo_path`, and `image_type` there, and pass it with `--config` for checking and exporting. Set `image_type` to `photo` or `logo`; the existing `photo_path` field accepts either. For an explicit no-image choice, clear `photo_path`. Save changes to the reusable brand only when requested. Logos keep their full proportions and transparency; photos keep the template's avatar crop.

## 1. Take the input

| The user gives you | What to do |
|---|---|
| Spoken or dictated thoughts, a pasted voice-note transcript | Treat it as raw thinking. Expect repetition, false starts and mis-transcribed words. Keep their phrasing where it is vivid. |
| Notes or a meeting / notetaker transcript | Use pasted text, an uploaded file, or an accessible file path. If they name a notetaker app and a tool for it is connected in this session, pull the note with that tool. Otherwise ask them to paste or upload it, or give an accessible path. Do not guess. |
| A long-form draft or published post in an uploaded or accessible file | Read the whole file before deciding anything. |
| A URL | Fetch it with the session's web tool. If it is paywalled or comes back thin (under about 300 words), say so and ask them to paste the text. |
| Only a topic ("a carousel about onboarding") | There is no source yet, so get one. Ask up to three questions in a single message: their actual take, one example from their own work, and any real numbers they have. Build from the answers. |

## 2. Find the carousel in it

1. **Inventory the source.** List the specifics it contains: numbers, named tools, people and examples, steps, lines worth quoting, opinions. Only what is really there.
2. **Pick one angle.** Steps, Mistakes, Lessons, Stats, Examples, or Story (before and after). One carousel carries one angle. A long source usually holds several carousels. Choose the strongest and mention the others in one line.
3. **Thin source.** If the inventory has fewer than four specifics, ask one question to get more. Do not pad.
4. **Template fit.** If the chosen template fights the content, explain why and ask before switching. `data-card` only works when the source has real numbers.

## 3. Outline checkpoint (always)

Before building, show:

- The angle and the template.
- Each slide in one or two lines: headline, the point, the action.
- **From your source:** the specific details you kept (at least four for a long source).
- **Added by me:** anything not in the source, with where it came from. Write "Nothing" if nothing.

Wait for a yes or for changes. Skip this only when the user has said to build without checking in.

## Content rules

1. **The hook is specific.** A count ("5 mistakes"), a number from the source, a named thing, or a concrete claim the user made. No generic hooks like "Most advice about X is wrong".
2. **Nothing is invented.** Every number, statistic, quote and named example comes from the source. Do not supply a statistic from memory to make a slide stronger. If the user asks for outside facts, search for them, keep the source link, and list them under "Added by me".
3. **One idea per slide, one thing to do.** Each content slide ends with something the reader can do or check today, in the template's action element. When the source is a story or an opinion with no natural step, use a concrete takeaway instead of a made-up instruction.
4. **Their voice.** Tighten the user's wording. Do not polish it into generic copy.
5. **Long sources keep their detail.** Feature the strongest four or five examples in full instead of summarising fifteen into principles.
6. **The CTA slide** gives two or three actions tied to this topic, beyond "follow me".
7. **Six to ten slides.** Word budgets come from the template header and are upper limits. Shorter reads better on a phone.

## 4. Build the HTML preview

1. Create the output folder in a writable location for the user: `linkedin-carousels/YYYY-MM-DD-topic-slug/`.
2. Copy `templates/<id>.html` there as `deck.html`. Leave the `<link>` and `<style>` blocks exactly as they are.
3. Replace the sample slides with the real ones, using only the markup patterns the template shows. Every word of sample copy goes. Keep the `{{TOKENS}}` (the script fills in name, publication, positioning, photo and page numbers) and keep each slide's `data-max-words`.
4. Run `check linkedin-carousels/<folder>/deck.html`. It writes `carousel.html`, prints a per-slide report and saves `overview.png`. A failed check or render must be resolved before automatic export. If the environment cannot render, use the fallback and clearly label the output unchecked.

## 5. Check and fix (three passes at most)

- **Command failure** means checking or rendering did not complete. Read the error, fix an actionable cause, and retry at most twice. Do not hand over older files as a new export.
- **Layout errors** mean text is cut off. Fix every one. Cut words first. Do not shrink type below the template's sizes.
- **Warnings**: an empty band (add the template's fill element or one more real detail from the source), over budget (cut), overlapping text (shorten the longer block).
- **Look at `overview.png`.** It shows each slide at about the size a phone shows it. Can you read the body text? Does each slide have one clear focal point? Do footers and page numbers sit in the same place on every slide?
- Edit `deck.html`, run `check` again. If something still fails after three passes, stop and tell the user exactly which slide and why.

## 6. Show the HTML and wait for approval

After checking and fixing, hand over `carousel.html` as a clickable preview or downloadable file. Open it in the host's preview panel when available. Include `overview.png` when useful, the slide count, and any remaining warnings. Clearly distinguish a checked preview from unchecked HTML produced by the fallback.

Ask: "Here's the HTML preview. Would you like any changes, or is it ready to convert to PDF?" Wait for the user's response. An approved outline, a successful layout check, a template choice, or a general request to make a carousel does not approve PDF conversion. Do not run `build`, generate `carousel.pdf`, or export the individual PNG slides while waiting. The overview image used to review the HTML is allowed. Template `demo` also produces a preview only.

If the user requests changes, update the HTML, check it, and show the revised preview. Wait for approval of that version before exporting. Do not ask again when the current preview and its conversion have already been explicitly approved.

## 7. Convert the approved preview

Only after the user approves conversion, run `build linkedin-carousels/<folder>/deck.html` with the same `--config` used for the approved preview. Preserve its content, template, and branding. The command repeats the check, then writes:

- `carousel.pdf`: one page per slide. This is the file to upload to LinkedIn as a document.
- `slides/slide-01.png` and so on at 2160x2700, for image posts or other platforms.
- `carousel.html`: the browser preview.

If the repeated check requires a visible change, show the revised HTML and obtain approval before converting that revision. Read `slides/slide-01.png` and the densest content slide once at full size before handing over. Give clickable file links or the host's download attachments, the slide count, and any remaining warnings. Link the PDF directly. After a failed build, older PDF/PNG files may remain; do not present them as the revised result.

## 8. Edits by talking

"Shorten the headline on slide 3", "make it seven slides", "swap to brutalist-mono": edit `deck.html`, run `check`, and show the revised HTML preview. Export with `build` only after approval of the revision for conversion. For a template swap, take the new template's `<link>` and `<style>` and rewrite the slides in its markup. The content stays.

## Updating the saved brand

"Update my branding": show the current values from `branding-config.json`, ask which to change, write only those fields, refresh `last_updated`. "Make magazine-grid my default": set `branding.template`. `node "$SKILL_DIR/scripts/carousel.mjs" demo <id>` renders any template's sample deck with the user's brand so they can see it first.

## When automatic export is unavailable

- **Node available, browser unavailable:** run `html <deck.html>` with the same brand config. This assembles a complete `carousel.html` without launching a browser. Provide the HTML file for download, explain that automated checks and PDF/PNG export did not run, and ask the user to open it in Chrome or Edge to review. Wait for approval before walking them through **Save as PDF**. Do not hand over the template fragment `deck.html` as the printable file.
- **No Node, but file creation available:** build `carousel.html` by hand: a full HTML page whose `<head>` preserves the template's font `<link>` tags, whose `<style>` holds `templates/_base.css` followed by the template's style block, whose body holds `<main class="deck">` with the slides, with `templates/_runtime.js` in a `<script>` at the end, and with every `{{TOKEN}}` replaced by you. Ask the user to open it in Chrome or Edge to review. After they approve it for conversion, explain how to use Save as PDF. Tell them the automatic check did not run, so they should look through each slide for cut-off text. Embed the chosen photo or logo directly in the HTML. For a logo, use `background-size: contain`, no repeat, transparent background, and no circular clipping. Use initials only if the user chose no image. If you cannot embed their chosen image, explain the limitation and ask how to proceed; a local image path will not travel with a downloaded file.
- **No file creation or no access to the packaged templates:** provide the approved slide copy and explain the missing capability. Do not claim to have created a PDF or invent a download link.

Google Fonts needs network access for the intended typography. If fonts fail, disclose the fallback and visually review again before calling the result ready.

## Output rules

- Direct, plain language in chat. No hype.
- Say which details came from the source and which you added.
- Never claim the deck is ready while the checker reports an error, is missing, or an expected export is absent. HTML produced without the checker must be labeled unchecked; a checked HTML preview can be labeled ready for review. Before conversion approval, deliver the preview without PDF or individual PNG exports.
- Creating a carousel does not authorize posting or scheduling it.
