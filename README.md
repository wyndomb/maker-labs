# Maker Labs

Maker Labs is a set of fifteen independent skills for creators and solo operators, by Wyndo ([AI With Wyndo](https://aiwithwyndo.com)). It works in Claude chat, Cowork, and Claude Code.

Version 0.1.21 contains these skills:

- Opposite Start Ideation: find differentiated angles.
- Brain Dump to Content: paste messy notes, choose an angle, and get a writing brief. Uses the reader's own material and voice, with no required connections. Flags incomplete sources and anonymizes sensitive details by default.
- Interview to Draft: turn real experience into grounded drafts.
- Social Repurposer: adapt a source for different channels.
- Draft Review Panel: paste a draft and get three to five reviewers selected for its audience, purpose, and format. No writing samples or style setup required. Independent reviews use available subagents, with a disclosed sequential fallback. Returns prioritized fixes without rewriting the draft. See [usage notes](skills/draft-review-panel/README.md).
- Anti-Slop: edit generic writing or flag patterns while preserving meaning and voice.
- Strategic Decision Framework: compare business options using evidence, constraints, and measurable next steps. Optional evidence and challenge reviewers use subagents when available and authorized, with a disclosed sequential fallback.
- Visual Plan Builder: create a standalone HTML plan with assumptions, options, workflow, risks, and success checks. It respects execution authorization already given.

- News Digest: source-linked briefings on any topic, with a default 48-hour window, available search tools, and HTML only when requested. Live research depends on available tools; supplied-source summaries are labeled.

- LinkedIn Carousel: turn source material into slides with nine HTML templates. HTML previews are shown first; PDF and individual PNG exports wait for the user's approval of the preview for conversion. Automatic PDF/PNG export requires Node and a Chromium browser in the current execution environment. HTML for manual printing is available when automatic export cannot run. Users choose a template and the photo or logo for each new carousel unless already specified. Logos retain their full proportions. Personal branding is saved separately from the plugin.

- DESIGN.md Builder: turn supplied brand references into a reusable guide, evidence audit, and accepted design corrections. Supports create, update, and audit modes. Website inspection uses available tools. Automated checks require Python 3.9 or later; a disclosed manual review and copyable file contents are available when execution or saving is unavailable. See [usage notes](skills/design-md-builder/README.md).

- Competitor Analysis: compare competitors and customer alternatives for a named business decision, with dated sources, pricing qualifiers, and explicit unknowns. Works with available live research tools or supplied material; unavailable live research is disclosed. See [usage notes](skills/competitor-analysis/README.md).

- Meeting Decisions: find existing meeting transcripts or notes, identify agreed decisions and action items, and trace changes across meetings with source links. Supports Zoom, Granola, Wispr Flow, and supplied transcript files. Distinguishes proposals and unconfirmed assignments from commitments; discloses notes-only and partial coverage.

- SEO Brief: turn one topic, keyword, draft, or page into a sourced Create, Update, or Reconsider recommendation. Uses OpenSEO for keyword and search-result research, available page-reading tools for competing articles, and connected Search Console when helpful. Delivers a writing plan with evidence needs, metadata, and verified internal links. Missing OpenSEO data yields an explicitly provisional supplied-evidence brief. No required writing handoff or automatic remote saving.

- Daily Work Brief: prepare for the workday using the reader's email and calendar, with optional Slack context. Recommends a starting action, verifies current thread status, flags work requests, and prepares for today's meetings. Uses the reader's own accounts and goals, discloses partial coverage, and stays read-only. Slack channel selection is only requested when the available tools require it.

New here? Run `/maker-labs:start` for a short menu, or add your task after it (`/maker-labs:start I have messy notes for a newsletter`) to go straight to the right skill. You can also start by naming the skill and supplying the relevant draft, decision, or task. Each works independently; there is no router or required handoff. Pasted text remains a valid input.

Optional app connections: Gmail, Google Calendar, Notion, Zoom, Granola, Wispr Flow, and Slack. Each reader needs their own service access and any required authentication. Connections do not authorize sending, publishing, or changing events. Social Repurposer saves to Notion only when asked and when the target is accessible.

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
- **Your own apps (optional).** The plugin lists the official connectors for Gmail, Google Calendar, Slack, Zoom, Granola, Wispr Flow, and Notion on its **Connectors** tab. Nothing connects until you sign in to each one with your own account. Daily Work Brief, Meeting Decisions, and Social Repurposer use them to read your data. They are read-only except that Social Repurposer saves to Notion when you ask.
- **Web research.** Skills such as News Digest, Competitor Analysis, and Opposite Start Ideation use whatever web search tools your Claude session already has.
- **Local scripts.** Some skills ship readable scripts that run only when the skill needs them: `linkedin-carousel-html` runs a Node script that drives a local Chromium browser to export PDF/PNG; the carousel HTML templates load fonts from Google Fonts (fonts.googleapis.com, fonts.gstatic.com). `design-md-builder`, `visual-plan-builder`, and `social-repurposer` include Python check scripts that read only local files. `design-md-builder` can run Google's `@google/design.md` linter (pinned to 0.4.0, via npx) only when you explicitly ask for that check.

## License

MIT. See [LICENSE](LICENSE). Anti-Slop adapts Peter Yang's no-ai-slop under its MIT license, included in `skills/anti-slop/LICENSE`.
