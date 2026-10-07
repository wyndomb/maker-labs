# First-Run Brand Setup

Runs once, on first use, or when the user says "update my branding". It collects five answers and saves them outside the installed skill. Use the path printed by `config-path`, or an explicit user-owned file passed with `--config`. In a temporary session, offer the brand file for download and explain that reuse requires uploading it again.

## How to run it

1. Use any answers already supplied. Ask the remaining questions below in one message; publication and positioning can be skipped. Template and photo-or-logo choices must be resolved, including an explicit no-image choice when applicable. Use a normal chat message for photo uploads if the host's question tool accepts text only.
2. Wait for the reply. Ask again only for a missing required name, unresolved template choice, or unresolved photo-or-logo choice. Do not default an omitted template or image answer. A positioning line can be empty.
3. Save the config in the format below, creating its parent directory if needed. Never write it into the installed skill.
4. Confirm in one line: "Brand saved. Now let's build your carousel." Then continue with the workflow in `SKILL.md`.

## The five questions (send as one message)

> Let's set up your brand for LinkedIn carousels. This is a one-time setup and takes about a minute.
>
> **1. Your name.** What should appear on every carousel? (e.g. "Sarah Chen")
>
> **2. Your publication or newsletter name** (optional). Some templates show it in the header. Skip it and I'll use your name.
>
> **3. Your positioning line.** A one-line tagline or URL that sits under your name. Keep it under 60 characters. (e.g. "Product design and UX strategy", "yourname.substack.com")
>
> **4. Photo or logo.** Upload the photo or logo you want on your carousel, or give an accessible JPG/PNG path. A transparent PNG works well for a logo. You can also say "no image" to use your initial. If you already supplied an image, I will use that.
>
> **5. Template.** Which template would you like to use? If you already named one, I will use it and skip this menu. Otherwise pick one below. Each has its own colors and feel, and you can switch any time or override it for a single carousel.
>
> - **sticky-notes**. Warm bone and yellow, large readable type, white action cards. Essays, numbered steps or lessons.
> - **editorial-sticker**. Bone background, oversize headline, one yellow sticker. A general-purpose style.
> - **brutalist-mono**. Black background, type only, one yellow word. Manifestos and single-idea posts.
> - **sticker-collage**. Several stickers, hand-drawn arrows, slight tilts. Playful frameworks and lists.
> - **magazine-grid**. Serif headlines, cobalt numerals, hairline rules. Field reports and research-style posts.
> - **gradient-glass**. Navy to violet gradient with frosted glass cards. Tool announcements and technical workflows.
> - **terminal-readme**. Dark code-editor look in a monospace font. Prompts, agent workflows, tool teardowns.
> - **data-card**. White, one huge number, a row of three stats. Only for posts built on real numbers.
> - **swiss-grid**. White, black and one red square with a very large headline. Principles and frameworks.
>
> Reply with your answers (numbered is fine). To see a template before choosing, ask me to "demo" it.

## After the reply

1. **Publication name.** If skipped, set `publication_name` to the same value as `author_name`.
2. **Photo or logo.** Resolve the user's upload or supplied path and verify it is an accessible JPG or PNG. If it is missing or unreadable, ask for a replacement or an explicit no-image choice. Do not silently replace it with initials. Store the image in `photo_path` for compatibility, and store `image_type` as `photo` or `logo`. Logos are embedded without cropping and keep transparency; ask for a PNG/JPG under 5 MB if necessary. For durable local reuse, copy the image into the user-owned brand directory. For a temporary session, use the accessible upload path and explain that it may need uploading again later. The finished HTML embeds the image. Store an empty path only when the user chooses no image.
3. **Template.** Accept a valid named template without repeating the question. Otherwise show the full list above and wait for the user's choice; explicit delegation to the assistant is also a choice. Verify ids against the packaged templates. Clarify ambiguous or unknown names instead of falling back. The chosen template can be saved during first-run setup, but new carousels still confirm it unless the user already requests it or explicitly requests their saved template.
4. If the user asks to see a template first, run `node scripts/carousel.mjs demo <id>` and show them the HTML preview and `overview.png` it prints. The demo does not create a PDF or individual slide PNGs.

## Save format

Run `node "$SKILL_DIR/scripts/carousel.mjs" config-path` to obtain the default path:

- macOS/Linux: `$XDG_CONFIG_HOME/maker-labs/linkedin-carousel-html/branding-config.json`, defaulting to `~/.config/maker-labs/linkedin-carousel-html/branding-config.json`.
- Windows: `%APPDATA%/maker-labs/linkedin-carousel-html/branding-config.json`.
- Override precedence: `--config <path>`, then `CAROUSEL_CONFIG`, then the default above. `doctor`, `demo`, `html`, `check`, and `build` all use the same resolution.

For a hosted or temporary session, choose a writable file outside the skill, pass it with `--config`, and provide it for download. When reusing a downloaded config, resolve its photo again; paths from an earlier machine or session may not exist.

Older versions stored the config beside `SKILL.md`. Do not automatically adopt a config bundled with a shared skill. If the user identifies that file as their own, copy it to the new location, verify its photo path, and leave the original intact.

Write this format:

```json
{
  "version": "2.0",
  "first_time_setup": false,
  "branding": {
    "author_name": "[answer 1]",
    "publication_name": "[answer 2, or answer 1]",
    "positioning": "[answer 3]",
    "photo_path": "[absolute photo or logo path, or empty string after no-image choice]",
    "image_type": "[photo or logo]",
    "template": "[template id]"
  },
  "created_at": "[current ISO timestamp]",
  "last_updated": "[current ISO timestamp]"
}
```

Before saving, confirm: `author_name` is not empty, `positioning` is under 60 characters, `photo_path` is an existing absolute path or empty, `image_type` is `photo` or `logo`, and `template` is a valid user-chosen id. If one check fails, ask about that field only.

## Returning users

For each new carousel, ask for a template from the full list unless the user already chose one or explicitly requested their saved choice. Also ask which photo or logo to use unless supplied or explicitly selected already. Offer reuse of the saved image, replacement, or no image. For a one-off change, use a separate `carousel-brand.json` in the output folder and pass `--config`; keep saved preferences unchanged. Edits to the same carousel retain its approved choices.

## Updating later

"Update my branding": read the config, show the current values as a numbered list, ask which numbers to change, ask only those questions again, write only those fields and refresh `last_updated`.

"Switch my default template to X": confirm the id is valid, set `branding.template`, save, and confirm: "Default template is now X."
