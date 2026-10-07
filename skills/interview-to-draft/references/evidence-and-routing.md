# Evidence and Review Routing

Use this reference to decide what may enter the draft and what must return to research or the speaker.

## Evidence types

| Type | Meaning | Allowed use |
| --- | --- | --- |
| `firsthand` | Speaker experience, decision, observation, or judgment | Attribute to the speaker when needed; do not generalize beyond the account |
| `provided` | User-supplied file, transcript, dataset, or artifact | State only what the artifact supports |
| `verified` | Current external claim checked against an authoritative source | Cite or link according to the output format |
| `inference` | Reasoned conclusion from supported material | Label as interpretation; never present as directly reported fact |

Treat remembered figures, unnamed research, and "people say" statements as unverified until checked.

## Evidence map fields

Each material claim should have:

- `claim_id`
- `planned_claim`
- `evidence_type`
- `source_location`
- `status`
- `required_action`
- `notes`

Allowed statuses:

- `supported`
- `needs_research`
- `needs_creator`
- `remove`
- `qualified`

## Material claim test

Map a claim when removing or changing it would alter:

- The central argument
- A causal explanation
- A recommendation
- A factual assertion
- A performance or outcome claim
- A personal story
- A limitation or promise

Ordinary transitions and clearly subjective phrasing do not need their own rows.

## Review routing

### `editorial_fix`

Use for repetition, order, clarity, pacing, formatting, or grammar when the fix does not add substance. Revise directly.

### `research_gap`

Use for a factual statement whose truth depends on external evidence. Verify it, qualify it, or remove it. Research cannot decide the speaker's opinion.

### `creator_gap`

Use when only the speaker can supply the missing example, decision, motivation, reaction, limitation, or judgment. Ask one targeted question and append the answer to the interview record.

### `unsupported_addition`

Use when the draft contains an idea, experience, conclusion, emotion, or result absent from the evidence. Remove it. Do not preserve it merely because it sounds plausible.

### `judgment_call`

Use when two supported directions create a real editorial tradeoff, such as specificity versus broader relevance. Show the options and ask the user to choose.

## Drafting rule

A polished sentence does not repair weak evidence. Route the underlying gap before rewriting the prose.

