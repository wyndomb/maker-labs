# Reading the day's sources

Apply this reference during live retrieval. Adapt to the actual read tools exposed in the reader's chat; do not assume a particular provider, search syntax, account identity endpoint, or permission is available. Gmail and Google Calendar are optional Maker Labs bindings. Another already connected email/calendar provider can work through its equivalent read tools. Plain text and calendar exports also work, with snapshot coverage stated.

## Keep retrieval useful and bounded

Start from lightweight account/calendar metadata when selection is ambiguous, then today's events and recent message summaries. Use returned sender, participant, thread, and event identifiers to narrow follow-ups. Read full relevant threads before making decisions.

Typical budget: at most 100 email summaries across recent and outstanding-item searches, 15 full candidate threads, and 30 Slack hits followed by up to five relevant threads. These are sensible initial caps, not completeness claims. Follow pagination within the cap; use a targeted query when a high-stakes candidate needs resolution. If the cap is reached or results remain truncated, state that plainly and offer a deeper pass. Never silently substitute an unbounded mailbox export.

Do not retry persistent authentication, access, or rate-limit failures repeatedly. Use working sources and identify the gap. Do not describe a failed search as an empty result. A no-result query establishes only what that query returned.

## Email

1. Search the chosen work account for activity in the last 48 hours, covering both read and unread mail. Do not restrict discovery to the inbox folder: archived mail can still contain an open request. Respect explicitly excluded folders or personal scopes.
2. Make a focused seven-day pass for direct requests, upcoming deadlines, and the reader's own promises, using supported search fields and known projects/participants. Avoid relying exclusively on the literal words "urgent" or "deadline". Older outstanding work may exist; this is a bounded catch-up.
3. Use matching sent replies and full thread retrieval to establish the latest status. Search results and snippets alone are leads. Confirm whose email address is the reader's from available account context, without guessing from a name.
4. Search relevant participant/project terms for today's meetings when preparation context is missing. Fetch linked documents or attachments only when needed, readable, and in scope. Do not download a whole collection to find one detail.

If only inbound mail is available, disclose that replies could not be verified. Suppress resolved requests; do not infer completion from a vague reply such as "I'll take a look." Preserve changes to deadlines and ownership. A request addressed to a whole team does not automatically belong to the reader.

## Calendar

- Query events overlapping the reader's local day, using timezone-aware bounds, then focus preparation on events still ahead or currently in progress. Today's definition comes from the reader's timezone, even when event records use UTC or another timezone.
- Use current event details, recurrence exceptions, cancellation status, and the reader's attendance response. Exclude cancelled and declined meetings from the upcoming agenda; note a cancellation only if it changes a previously expected plan. Mark tentative/unanswered invitations as such.
- Show event times in the reader's timezone. Treat all-day events as all-day, not midnight meetings. Deduplicate mirrored invitations. Distinguish busy periods and focus holds from meetings with other people.
- Extract preparation from the description and relevant current threads. Separate explicit requested materials from your suggested questions. If a meeting has no agenda, say so without inventing one.
- Flag actual overlaps, including personal busy blocks as "busy" when authorized availability is visible. Do not read unrelated personal descriptions to infer work priorities.
- A free interval is free only across calendars actually checked. If suggesting time for work, state the calendars covered and known constraints. Never book it. Tomorrow's meetings need only be checked if explicitly requested or a known preparation deadline falls today.

## Optional Slack, without mandatory channel setup

Use Slack when the reader requests it or an authorized, connected Slack source is available and relevant to this briefing. Honour any opt-out. Skip it cleanly if unavailable; the email/calendar brief remains useful. Do not install or join channels as part of retrieval.

Inspect the supported search tools and identity context first. If they allow it, search recent direct mentions and messages addressed to the reader, then use today's meeting participants or known project terms for a few focused context searches. Default to the same recent window as email. Retrieve relevant thread replies to confirm current status. A team-wide mention is not automatically a personal task.

Do not claim that all Slack adapters expose mentions, DMs, membership listings, or search modifiers. Only use operators that the live tool documents. A failed personal-mention search must not turn into scanning every accessible channel.

If the connection requires a channel, list a small set of relevant accessible channels when supported and ask the reader to choose one or a few. If channel discovery is unavailable, ask for channel names or links, and continue the email/calendar portion while waiting. Never silently choose a broad channel set. Optional favourite channels can refine later runs when the reader supplies them; do not promise automatic cross-chat retention.

Resolve contradictory Slack/email statuses by checking timestamps and the full context. A later message overrides an earlier one only when it clearly refers to the same action and changes its status. Report unresolved conflicts.

Availability varies by account, workspace plan, and administrator permissions. Rely on the Slack connector's current tool descriptions rather than assuming a fixed set of capabilities.
