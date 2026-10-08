# Research Method

Use the web search tool available in the current host. No particular provider, CLI, API key, or installation is required.

## Inputs

Extract these from the request:

- `topic`: the subject to investigate
- `audience`: who needs a differentiated angle
- `timeframe`: default to the past 7 to 30 days for fast-moving topics and use a longer window for evergreen topics
- `platform`: optional; use it only to shape the final hooks

Include the current date when the topic is recent or likely to change.

## Independent Research Lanes

When subagents are available, delegate these lanes in parallel. When they are unavailable, run them sequentially without changing their boundaries.

Start with two targeted web searches per lane. Allow one additional follow-up search only when coverage is too thin to identify repeated claims. Each scout returns no more than five distinct repeated claims.

### Mainstream scout

Map the most visible framing across official announcements, news coverage, popular explainers, large creators, and vendor commentary.

Useful query shapes:

```text
[topic] latest discussion analysis
[topic] official announcement reaction
```

### Practitioner scout

Map what users and practitioners repeat, celebrate, question, or complain about across Reddit, forums, practitioner blogs, comments, and publicly accessible social posts.

Useful query shapes:

```text
site:reddit.com [topic] discussion experience
[topic] practitioner experience LinkedIn X forum
```

### Dissent scout

Find skeptical interpretations, failed experiments, unintended consequences, hidden costs, and minority positions.

Useful query shapes:

```text
[topic] criticism failure limitations
[topic] overlooked consequence skeptical analysis
```

Adapt queries to the topic. Do not force marketing, technology, or creator terminology onto unrelated subjects.

For newsy topics, each relevant scout may add a recent-news search:

```text
[topic] news last 48 hours
```

## Scout Return Contract

Each scout returns findings in this structure:

```markdown
### Repeated claim
- Claim:
- Assumption:
- Emotional frame:
- Audience centered:
- Independent sources: [title, URL, date, source type]
- Recurrence: high, medium, or low
- Access or coverage limit:
```

Scouts must:

- report claims and sources without proposing final angles
- distinguish independent reporting from syndicated or copied coverage
- record dates for fast-moving topics
- note when social-platform indexing or access is incomplete

## Coordinator Synthesis

The coordinator merges semantically equivalent claims and removes duplicated or syndicated sources.

Label a cluster:

- `crowded` when its underlying claim appears in at least three independent sources across at least two source types
- `emerging` when it appears repeatedly but does not meet the crowded threshold
- `isolated` when it appears only once or comes from one source family

Only crowded and emerging clusters belong in the final narrative map. An isolated take may inspire a search, but it is not evidence that the internet conversation is crowded.

## Collision Check

After generating candidates, collision-check the strongest three. Start with two searches per candidate:

1. its central claim in quotation marks when phrasing permits
2. a plain-language paraphrase using the claimed mechanism or consequence plus the topic

Run one additional search only when the first two leave the collision level ambiguous.

For each candidate, return:

- `low collision`: no materially similar argument found in credible coverage
- `medium collision`: pieces of the argument exist, but the proposed mechanism, audience, or consequence is meaningfully different
- `high collision`: substantially the same argument already appears repeatedly
- the closest existing take and a link
- the exact distinction that remains, if any

Reject high-collision candidates. Do not claim uniqueness. Report only what the search could and could not find.

## Search availability

If a search fails or coverage is weak, try another available search source. Report material coverage limits. If no live search is available, request supplied sources or a search-enabled session. Do not invent sources or treat unsearched angles as low collision. A supplied-source analysis is provisional and cannot establish coverage of the current internet conversation.
