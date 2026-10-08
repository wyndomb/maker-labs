# Maker Labs

Maker Labs is a set of sixteen independent skills for creators and solo operators, by Wyndo ([AI With Wyndo](https://aiwithwyndo.com)). Install it in Claude chat, Cowork, or Claude Code, or use the Codex marketplace instructions below.

## Install

Choose the instructions for your app below.

**Claude app (web or desktop)**

1. Go to **Customize → Plugins**.
2. Select **Add → Add marketplace** and enter `wyndomb/maker-labs`.
3. Open **Maker Labs** and select **Add**.
4. Turn on **Sync automatically** for the marketplace so you get every update without doing anything.
5. Optional: open the plugin's **Connectors** tab and connect the apps you use. Skip any you don't need.

**Claude Code**

```bash
claude plugin marketplace add wyndomb/maker-labs
claude plugin install maker-labs@ai-with-wyndo
```

**Then try it in Claude.** Type `/maker-labs:start` in a Claude chat for a short menu of what each skill does, or describe what you're working on and Claude picks the right skill.

**Claude updates.** New versions arrive automatically when **Sync automatically** is on. Otherwise open Maker Labs and select **Check for updates**. Your saved settings, such as carousel branding, live outside the plugin and are never overwritten by an update.

### Codex

You need the Codex CLI installed with support for `codex plugin`. Run these commands in your terminal:

```bash
codex plugin marketplace add wyndomb/maker-labs --ref main
codex plugin add maker-labs@ai-with-wyndo
```

The first command adds the **AI With Wyndo** marketplace from this repository. The second installs **Maker Labs**. If `codex plugin` is unavailable, update your Codex CLI before continuing.

Start a new Codex session after installation. If you use the desktop app, restart it so it can pick up the plugin. Connect any apps you want to use with your own accounts when prompted.

**Then try it in Codex.** Name a skill and give it some material, for example:

> Use Anti-Slop to review this draft. Flag generic wording and suggest changes while preserving my voice: [paste your draft]

The `/maker-labs:start` command above is the Claude entry point. In Codex, start by naming the skill you want to use.

**Codex updates.** To fetch the latest marketplace version and install the current plugin, run:

```bash
codex plugin marketplace upgrade ai-with-wyndo
codex plugin add maker-labs@ai-with-wyndo
```

Then start a new session, or restart the desktop app. This setup uses the GitHub marketplace on your computer. Automatic updates and installation across ChatGPT web and mobile are not promised by this setup.

These commands match the Codex CLI help and [OpenAI's marketplace documentation](https://developers.openai.com/plugins/build/plugins). A fresh Maker Labs installation and version-update test in Codex are still pending.

## Skills

Version 0.1.24 contains sixteen skills. Each one works on its own; use them in any order.

### Find something to say

- **Inverse Ideation**: find an angle nobody else is taking. It researches what mainstream sources, practitioners, and critics are already saying about your topic, maps the crowded takes, then flips them into fresh, defensible angles and checks that the best ones aren't already out there. You get one recommended angle with the evidence behind it, so you stop writing the same post as everyone else. Give it a topic and, optionally, your audience.
- **Brain Dump to Content**: turn messy notes, a voice memo, or a ramble into something worth publishing. It finds up to three distinct angles hiding in your own material, lets you pick one, and develops it into a writing brief for a post, newsletter, talk, or team update. It works only from what you give it, flags where your notes are thin, and anonymizes sensitive details by default.
- **News Digest**: get a short, source-linked briefing on any topic, company, or set of topics, covering the last 48 hours by default. Every item links to its source so you can check it, and you can ask for a visual HTML version to share. Useful for daily or weekly roundups, or for staying current before you write.

### Write it

- **Interview to Draft**: get a draft that actually sounds like your experience, not generic AI filler. It interviews you one question at a time, digs for your real examples and opinions, checks current facts, and maps where every claim came from. The draft is built from your words; anything missing comes back to you as a question instead of being made up. Works for newsletters, articles, LinkedIn posts, essays, and proposals.
- **Voice Builder**: capture how you write and speak in one portable `VOICE.md`. It studies your long-form writing and, if you choose, your own words from Wispr Flow, Granola, Zoom, or Google Drive transcripts, then writes rules backed by quotes from your work, before-and-after examples, and a test against one of your real pieces. Keep the file anywhere and use it as the source of truth whenever you write, in Claude or any other tool. See [usage notes](skills/voice-md-builder/README.md).
- **SEO Brief**: decide whether to create a new page, update an existing one, or skip the topic, backed by real search data. It uses OpenSEO for keyword and search-result research, reads the articles that currently rank, and gives you a writing plan with the angle, outline, evidence to gather, metadata, and internal links. If search data isn't available, it says so and labels the brief as provisional.

### Make it better

- **Draft Review Panel**: get feedback from three to five reviewers chosen for your draft's audience, purpose, and format, such as a skeptical reader, an editor, or a subject expert. They review independently, then you get one prioritized list of fixes tied to specific passages. It doesn't rewrite your draft, so the decisions stay yours. See [usage notes](skills/draft-review-panel/README.md).
- **Anti-Slop**: make a draft sound human again. In edit mode it removes AI-sounding patterns, filler, and tangled sentences while keeping your point, your quirks, and your voice, then shows what changed. In flag mode it only points out the patterns, line by line, so you can fix them yourself. Works on emails, posts, newsletters, reports, and anything else you write.

### Spread it

- **Social Repurposer**: turn one newsletter, voice note, or set of rough ideas into a full pack of social drafts: by default 10 Substack Notes, 5 LinkedIn posts, and 3 X threads. Each channel gets its own writer that follows that platform's style, while keeping your voice and your actual ideas. If the source is thin, it asks one to three quick questions instead of padding. Nothing is published or scheduled.
- **LinkedIn Carousel**: turn notes, a transcript, a draft, or an article link into a LinkedIn carousel using one of nine designed templates. You approve an HTML preview first, then export a PDF and individual PNG slides. Your name, photo or logo, and default template are saved once and reused. Automatic export needs Node and a Chromium browser; otherwise you get print-ready HTML.
- **DESIGN.md Builder**: turn your brand references (website, past designs, style notes) into a reusable brand guide that any AI tool can follow when making websites, slides, lead magnets, or reports. It records where each rule came from, flags gaps and conflicts, and keeps a list of accepted corrections so the same design mistakes stop repeating. See [usage notes](skills/design-md-builder/README.md).

### Decide and plan

- **Strategic Decision Framework**: pressure-test a business decision such as a launch, a price change, or which project to do next. It looks at the choice through a few strategic lenses, separates evidence from assumptions, and recommends a small, reversible test with clear measures of success, so you can decide with more than gut feel.
- **Competitor Analysis**: see how you really compare. It researches your competitors and the alternatives customers actually use, including doing nothing or a spreadsheet, and gives you a dated, sourced comparison with pricing, gaps, and what it means for your positioning. Unknowns are stated, not guessed. See [usage notes](skills/competitor-analysis/README.md).
- **Visual Plan Builder**: before a complex piece of work, get a visual HTML plan you can review at a glance: assumptions, options, workflow, risks, and how you'll know it worked. Useful for agreeing on direction before anything gets built or written.

### Run your day

- **Daily Work Brief**: start the day knowing what matters. It reads your email and calendar, and Slack if you connect it, then recommends where to start, flags requests waiting on you, checks whether threads are still open, and prepares you for today's meetings. It's read-only: it never sends, books, or changes anything.
- **Meeting Decisions**: find out what was actually agreed. It pulls meeting transcripts or notes from Zoom, Granola, Wispr Flow, Google Drive (Google Meet transcripts and Gemini notes), or files you supply, and lists decisions, action items with owners, and open questions, each linked to the moment it was said. It separates real commitments from suggestions and can trace how a decision changed across meetings.

New here? In Claude, run `/maker-labs:start` for a short menu, or add your task after it (`/maker-labs:start I have messy notes for a newsletter`) to go straight to the right skill. You can also start by naming the skill and supplying the relevant draft, decision, or task. Each works independently; there is no router or required handoff. Pasted text remains a valid input.

Optional app connections: Gmail, Google Calendar, Google Drive, Notion, Zoom, Granola, Wispr Flow, and Slack. Each reader needs their own service access and any required authentication. Connections do not authorize sending, publishing, or changing events. Social Repurposer saves to Notion only when asked and when the target is accessible.

Existing ideation and social-writing subagent workflows are preserved. New skills include usage notes and evaluation cases. File creation, preview, research, and delegation depend on the tools available in the reader's chat.

Anti-Slop adapts Peter Yang's no-ai-slop; its attribution and MIT license are included in the skill folder.


## Connection setup and limits

Connect only the apps you use. Adding an app to this package does not connect your account or grant access to anyone else's data. The meeting skill works with pasted text or uploaded TXT, VTT, SRT, or Markdown transcripts without any connector. It retrieves existing material; it does not record calls or create missing transcripts.

Granola transcript access depends on the account plan and permissions. Zoom requires accessible meeting assets and enabled transcription or summary features. Wispr Flow needs a captured meeting with an available transcript. If only notes are accessible, the skill labels that limitation and avoids presenting notes as verbatim speech. See the meeting skill's [provider reference](skills/meeting-decisions/references/providers.md).

OpenSEO uses its hosted MCP connection. Each reader must authorize their own OpenSEO account through the host's supported login flow. It is optional to the workflows: the other skills and uploaded-transcript path remain usable without it. This is not an OpenSEO app-directory binding, and authentication or an optional skip flow in every host has not been verified. Avoid connecting a duplicate server if OpenSEO is already available in your chat. See [OpenSEO setup](https://openseo.so/docs/mcp).

OpenSEO can supplement competitor research with keyword, SERP, domain, and backlink evidence. Research tools may consume the reader's credits; follow the live tool's cost and confirmation rules. SEO Brief uses this connection for a focused writing plan. A research request does not authorize saved reports, tracking, or public sharing. No credentials are included in this package.


## Try SEO Brief

“Use SEO Brief for this topic and my OpenSEO project. Tell me whether to create a page, update an existing one, or reconsider, then give me a writing brief.”

Supply a topic, keyword, draft, or existing URL. The skill reuses project context and asks only for missing audience, purpose, and market information. Each reader uses their own OpenSEO account. No Search Console connection is required for a new-topic brief. Research tools may consume credits; normal runs start small and follow the current tool's cost rules. Without usable research, the skill states what is missing rather than inventing search metrics.

## Try Daily Work Brief

“Use Daily Work Brief to prepare me for today. My main goal is [optional goal].”

Connect your own email and calendar using the host's supported connection flow, or supply your schedule and relevant work threads. Gmail and Google Calendar are optional connections in this package; already connected alternatives can work when equivalent read tools are available. The skill asks which work account or calendar to use only when the choice is ambiguous. It does not require a role interview or a goal before starting.

Slack is optional. Where the available tools support it, the skill checks recent direct mentions, messages addressed to you, and relevant meeting context. Channel-only connections ask you to select relevant channels; unavailable Slack does not block the rest of the brief. No connection grants access to another reader's accounts.

The default review covers today's calendar, recent email activity, and a focused check for outstanding work. It reports source gaps and search limits. It recommends actions without sending messages, changing mail flags, saving drafts, booking time, or setting up automatic delivery. Each run is on demand. The same skill can summarize supplied records when connections are unavailable, with snapshot limitations stated. See [the skill](skills/daily-work-brief/SKILL.md).

## What this plugin runs, sends, and fetches

- **No data collection.** The plugin has no server of its own, no analytics, and no telemetry. It stores nothing outside the files you ask it to create.
- **OpenSEO (optional).** The bundled MCP connection points to `https://app.openseo.so/mcp`. When you connect it and use SEO Brief or Competitor Analysis, your topic, keywords, and URLs are sent to OpenSEO under your own account. See [OpenSEO](https://openseo.so).
- **Your own apps (optional).** The plugin lists the official connectors for Gmail, Google Calendar, Google Drive, Slack, Zoom, Granola, Wispr Flow, and Notion on its **Connectors** tab. Nothing connects until you sign in to each one with your own account. Daily Work Brief, Meeting Decisions, Voice Builder, and Social Repurposer use them to read your data. Voice Builder reads only the transcripts you choose and keeps only your own words. They are read-only except that Social Repurposer saves to Notion when you ask.
- **Web research.** Skills such as News Digest, Competitor Analysis, and Inverse Ideation use whatever web search tools your session already has.
- **Local scripts.** Some skills ship readable scripts that run only when the skill needs them: `linkedin-carousel-html` runs a Node script that drives a local Chromium browser to export PDF/PNG; the carousel HTML templates load fonts from Google Fonts (fonts.googleapis.com, fonts.gstatic.com). `design-md-builder`, `visual-plan-builder`, `social-repurposer`, and `voice-md-builder` include Python scripts that read only local files. `design-md-builder` can run Google's `@google/design.md` linter (pinned to 0.4.0, via npx) only when you explicitly ask for that check.

## License

MIT. See [LICENSE](LICENSE). Anti-Slop adapts Peter Yang's no-ai-slop under its MIT license, included in `skills/anti-slop/LICENSE`.
