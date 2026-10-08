# Spoken sources

Tool names and options change. Inspect the connector's current tool descriptions before calling anything, and prefer them over names written here. The goal in every case is the same: find a few conversations where the person talks at length, read the full transcript, and keep only their own turns.

## Before retrieving

1. Confirm who the person is in each source. Ask for the name or email they use there if it is not obvious. Speaker labels may be a name, an email, "Speaker 1", or "You".
2. Ask which kind of conversation shows them at their most natural: podcasts, interviews, workshops, coaching calls, or long one-to-ones. Status meetings and standups rarely help.
3. Retrieve three to six conversations. Stop when another one would add little.

## Wispr Flow

Search meetings, then fetch each one with its transcript view enabled. Transcripts are paged: follow the continuation offset until you have read enough of the person's turns. Use the account info tool to confirm the person's identity. A meeting with no recording has no transcript, which is different from an empty conversation.

Dictations and scratchpad notes are the person speaking alone and are often excellent spoken samples. Label them as dictation, not conversation. Timestamps are in UTC.

## Granola

Search or list meetings, then fetch the raw transcript, not only the notes. AI-generated notes and summaries are not the person's words and must not be quoted as spoken voice. Transcript access depends on the person's Granola plan and the account selected in the Granola app. If only notes are available, say so and use another source.

## Zoom

Use the connector to find completed meetings and fetch their transcript asset. AI Companion summaries are not the person's words. A meeting on the calendar does not mean a transcript exists. Transcripts depend on the account's recording and transcription settings.

## Google Drive

Search Drive for transcript documents: Google Meet saves transcripts as Google Docs, usually in a "Meet Recordings" folder, and people often keep podcast or video transcripts there too. Read the whole document. Gemini "Take notes" documents are summaries, not speech. Only the organizer and people they shared the file with can open a Meet transcript.

## Supplied transcripts

Read pasted or uploaded TXT, VTT, SRT, Markdown, or document transcripts directly. Keep speaker labels to filter turns. Strip timestamps before running the stats script.

## Extracting the person's turns

- Keep only lines spoken by the person. Drop everything else before analysis, and never copy others' words into `VOICE.md`.
- Merge consecutive turns into passages. Turns of a sentence or two ("yeah", "sounds good") say little; long explanations, stories, and disagreements say the most.
- Automatic transcripts contain recognition errors. Do not turn a likely transcription error into a vocabulary rule.
- Filler words ("um", "like", "you know") are real speech habits but usually belong in the bridge's "leave out of writing" list, not in the written rules.
- If none of the person's turns are substantial, say the spoken source was too thin and continue with written samples.
