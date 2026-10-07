# Validation and delivery

## Mechanical check

Save a temporary UTF-8 JSON object in this shape. Arrays contain only the actual copy; metadata is kept elsewhere. Thread tweet strings are **unnumbered** because the checker adds the final `i/total` prefix and a newline.

```json
{
  "notes": ["Complete Note text"],
  "linkedin": ["Complete LinkedIn post text"],
  "threads": [["First tweet body", "Second tweet body"]]
}
```

From the skill directory, run:

```sh
python3 scripts/check_pack.py /path/to/pack.json
```

The checker prints actual item counts, LinkedIn code-point character counts, conservative X length checks including numbering, em-dash failures, and thread-length warnings. The coordinator compares actual counts with the plan and does the editorial review. The checker does not validate facts, voice, repetition, CTA rules, or source attribution.

X counting is deliberately conservative: non-ASCII characters count as two, ASCII characters as one, and each HTTP(S) URL is charged at least 23 characters or its longer literal weighted length. This can overcount punctuation, emoji sequences, and long links; it is not the official X counter. When it rejects a near-limit tweet, shorten it or use an available platform-aware counter and report that actual result. Never call the script's X counts exact platform counts. If platform rules change or live acceptance matters, verify the current platform behavior.

LinkedIn counts include spaces and line breaks, exclude metadata, and use Unicode code points. Label the counting convention in the review if relevant to unusual emoji or combined characters.

If Python cannot run, use another available deterministic counter. If no counter can run, clearly mark length validation as unverified. Do not fabricate exact counts.

The delivered text must match the checked text. Count again after edits, adding numbering, or changing links. Use `i/total` followed by a newline for the delivered tweet prefix to match the script. Use fully qualified HTTP(S) URLs; normalize bare-domain links before checking so their link treatment is not missed.

## Chat delivery

Title the result `[Source title or working title] - Social Repurposing Pack`.

Include:

1. **Source summary:** input type, supplied URL if any, core argument, intended reader, observed voice, and relevant limitations. Keep this short.
2. **Substack Notes:** each numbered and type-labeled, with complete copy.
3. **LinkedIn posts:** each numbered, style/angle-labeled, with complete copy and measured character count outside it.
4. **X threads:** each labeled by strategy and angle, all numbered tweets, tweet count, and the actual length-validation status outside the copy.
5. **Review:** actual output counts, source and voice checks performed, counting method, reduced counts or short threads, and anything needing human judgment. Do not expose private internal reasoning.

Only include requested channels. Keep review notes separate from copy. If the pack is too long for one response, deliver clearly labeled parts or a complete local document when supported, without silently omitting drafts. A downloadable file should contain the complete pack and a usable link should be returned.

## Optional Notion delivery

Only write when the user requested Notion delivery and supplied a target. A connected account alone is not an instruction to write.

- Inspect the target and existing properties first.
- Create one draft page or entry named `[Source title or working title] - Social Repurposing Pack`.
- Put the full drafts in the page body under source summary, Notes, LinkedIn, X threads, and review.
- Use existing compatible fields for source URL, creation date, and draft status. Omit unavailable fields; do not change the database schema.
- Read back to verify the saved content before claiming success. If a write times out or has an uncertain outcome, check for the created page before retrying to avoid duplicates.
- Return the verified page link and brief summary. If access or writing fails, deliver the complete pack in chat or a local file and describe the limitation. Do not require a Notion connection to use the skill.

Saving drafts never authorizes publishing, posting, scheduling, or sending them.
