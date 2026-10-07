# OpenSEO operations for a single content brief

Tool contracts checked 2026-10-06. Use the live tool descriptions for required parameters, cost rules, and changes. Match tools by function when host prefixes differ. No project IDs, credentials, or fixed market belong in this skill.

## Setup and context

- `list_projects({})`: read project IDs, domains, country codes, and language defaults. Choose a clear match or ask. Do not assume the first project belongs to this task.
- `get_project_context({projectId})`: read the business, audience, goals, key pages, and research log before paid research. Missing context is an intake question, not permission to update the project.
- `whoami` is for an explicit account/connection check. It may initialize billing for a new hosted account; it is not a routine prerequisite for a brief. Never infer a zero balance from a missing balance field.

Each user authenticates their own OpenSEO connection through the host's supported flow. Do not embed credentials or ask the user to paste a key in chat. Official setup: https://openseo.so/docs/mcp

## Bounded research

| Need | Tool and usage |
| --- | --- |
| Discover candidates | `research_keywords`: pass `projectId`, one or two `seeds` with verified `locationCode` and `languageCode`, and normally `resultLimit: 150`. Keep `includeClickstreamData: false` unless specifically useful and within scope. Each seed can succeed or fail independently. |
| Check known terms | `get_keyword_metrics`: pass a short `keywords` list, `projectId`, market, and language. Use when discovery has not already returned the needed metrics. Keep clickstream refinement off by default. |
| Verify search task and competing URLs | `get_serp_results`: pass `projectId`, two or three finalist queries with consistent country/language, normally `depth: 10`. Follow per-query status; do not treat failed queries as empty search results. The tool returns result rows, not the full ranking articles. |
| Check an existing page's demand | `get_search_console_performance`: use `dimensions: ["query"]`, a page-equals filter, `dataState: "final"`, and a suitable window such as `last_3_months`. For relevant query-to-page mapping use `dimensions: ["query", "page"]` with a bounded filter. Only the selected project's connected property is accessible. |
| Inspect estimated rankings when first-party data is unavailable | Optionally use `get_ranked_keywords` with an explicitly chosen exact URL or domain scope and the same country/language. Treat this as third-party estimates; it does not establish the complete content inventory or replace Search Console. |

Normal default scope: one or two seeds (or one short metrics call), search results for up to three finalists, one relevant first-party query when useful, and three to five page reads. Stop once the page decision and outline have enough evidence. Expand only to resolve a material uncertainty. Avoid whole-domain audits, backlink studies, competitor inventories, local grids, or rank tracking for a routine brief.

Track planned and actual calls. Follow the live provider's cost rules and any lower user budget. Current tools require confirmation before a planned batch over 2,000 credits; do not split a larger plan into smaller batches to bypass that boundary. Do not claim a fixed brief price. If returned credit metadata is missing, state that usage is unavailable; if only some calls report charges, label the sum as partial. Avoid duplicating successful billable calls after an ambiguous timeout: check available results first and explain the uncertainty before considering a repeat.

Use the country and language consistently across tools. For cities, obtain a supported location through `search_serp_locations` only when local intent matters; do not invent a location code/name. City volume and national difficulty may describe different scopes, so label them separately.

## Evidence interpretation

- Monthly keyword volume, difficulty, and traffic estimates are provider estimates. CPC describes advertising cost and is not proof of conversion value. Missing difficulty or intent can be a market limitation; do not fill it from memory.
- Close variants may share volume. Do not sum them into a claimed total audience. Search results help determine whether terms share a page purpose; do not enforce a universal overlap threshold.
- Search Console dates are Pacific Time and recent data can be incomplete. Prefer finalized data, retain the returned date range, and compare equivalent scopes/windows. Its CTR is a fraction: 0.04 means 4%. Average position is not an exact live rank.
- Search Console is a bounded view. Use `hasMore` and `nextStartRow` if completeness is necessary; otherwise disclose the limit. Server-side position/impression filters operate over the top returned pool described by the live tool, so they are not an exhaustive site-wide opportunity search.
- Fresh search results describe what appeared in the sampled market and time. They do not prove causation, authority scores, conversion performance, or that a format will rank.
- Read original articles through available page-reading tools. Record source URL, date accessed, and full/partial/unavailable coverage. When supplied copies are used, label them as supplied snapshots rather than live fetches.

## Failures and fallback

Distinguish no connection, no project, insufficient credits, unsupported market metrics, rate limits, and empty results. Handle each returned per-item failure without discarding successful research. Retry a transient failure at most once when safe, avoiding duplicate billing; stop on authorization or insufficient-credit failures until the condition changes.

An unavailable Search Console connection need not block a new-topic brief. Unavailable OpenSEO research means a provisional supplied-evidence brief, not invented live metrics. If page extraction fails, try another accessible relevant source; if the missing page materially affects the angle, state the unresolved question. Never claim full competitor review from snippets.

Official capability and setup reference: https://openseo.so/docs/mcp
