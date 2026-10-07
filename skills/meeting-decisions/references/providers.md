# Provider retrieval notes

Verified against available Wispr Flow tool descriptions and official Zoom and Granola documentation on 2026-10-06. Tool availability and account access can change. Prefer the current tool schema over names or options recorded here.

## Wispr Flow

Use `search_meetings`, then `get_meeting` with `view_transcript: {}` to request transcript text. Transcript access is opt-in on the fetch call. Notes and summaries alone are insufficient for verbatim claims. Follow the exact continuation offset with `view_transcript.start_char` until the needed range is read. Notes have independent pagination through `view_content`.

For first-person questions, use `get_account_info` to establish the user's identity. A returned calendar ID can be passed to `get_meeting_by_calendar_id`. A calendar event can exist without a captured recording; treat `recorded: false` as missing recording, not an empty conversation. Use the returned `share_link` when available; do not assume everyone can open it. Convert UTC timestamps to the user's timezone.

Wispr Flow's meeting recorder and scratchpad are distinct sources. Retrieve scratchpad notes only when relevant to the user's request and label them as notes.

## Granola

Use the available meeting search or `list_meetings` to locate meetings, `get_meetings` for notes, and `get_meeting_transcript` for the raw transcript when available. A synthesized `query_granola_meetings` response does not prove the full transcript was read. Fetch underlying material for exact quotes and commitments when possible.

At verification, Basic access covers the user's own last 30 days of notes and excludes transcripts; paid plans provide transcript access, subject to permissions. Enterprise policy can further restrict access. Do not promise plan access from the plugin alone. Granola follows the active account context selected in its app; an empty result may reflect the wrong account context or unavailable history. Use the current access result to explain the limitation.

Official reference: https://docs.granola.ai/help-center/sharing/integrations/mcp

## Zoom

Inspect the installed Zoom tool schemas to locate completed meetings and fetch their accessible meeting assets. Prefer an available transcript asset for decisions and attribution; distinguish it from AI Companion summaries. Do not invent Zoom tool names or route private assets through public web search.

The official app supports completed-meeting transcripts, summaries, and recordings, subject to account eligibility, enabled AI features, and host-granted access. Video features require suitable cloud recordings. A meeting appearing on the calendar does not establish that a transcript exists. If the connected tools provide only a summary or an answer without the underlying transcript, explicitly label that evidence limit.

Official reference: https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0083574

## Google Drive

Google Meet saves transcripts and Gemini "Take notes for me" notes as Google Docs in the meeting organizer's Drive, usually in a "Meet Recordings" folder, and attaches them to the calendar event. Use the Drive connector's search to find the document by meeting title, date, or a link the user supplies, then read its full content. A Meet transcript doc is verbatim evidence with speaker names and timestamps; Gemini notes are a summary and must be labeled as notes, not speech. Only the organizer and people they shared the file with can open it; an empty search may mean the user lacks access, not that no transcript exists. Inspect the installed Drive tool schemas rather than assuming tool names.

## Supplied files and other connected sources

Read pasted text or accessible TXT, VTT, SRT, or Markdown transcripts directly. Preserve speaker labels and timecodes while interpreting the text. For PDFs, documents, or other formats, use available extraction tools and disclose unreadable sections. Do not claim audio transcription when only text extraction ran.

Use Notion or email, or other Drive documents, when the user points to material there and the required read tools are available. A calendar can help locate the meeting but is not evidence of what was said. No meeting connector is required for the supplied-text path.
