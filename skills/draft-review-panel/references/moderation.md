# Moderation and delivery

The main agent performs this step using the original draft, shared brief, and all completed reviews. Do not spawn another agent.

## Decide which findings survive

Verify each quoted passage against the original. Correct an inaccurate quote only if the claimed issue remains supported; otherwise discard the finding. Reject invented reader preferences, unsupported predictions, stylistic preferences presented as rules, and suggestions that alter the author's meaning without justification.

Merge findings about the same underlying problem. Prioritize by consequence: misleading claims and failures to deliver the central promise usually outrank cosmetic concerns. Repetition among reviewers is a useful signal to inspect, never a truth test or vote. A single supported issue may be the most important finding.

For a disagreement, explain the relevant tradeoff and choose according to the stated audience and purpose. A useful resolution might keep evidence while reducing redundant setup. If the choice depends on an unknown goal, give a short conditional recommendation. Do not invent disagreements to make the report interesting. Inspect for an overlooked material issue yourself, but do not require a blind-spot section when none exists.

For factual questions, keep these statuses distinct:

- **Unsupported in the supplied material:** the draft does not establish the claim. This does not show it is false.
- **Verified or contradicted:** the main agent inspected relevant sources; provide those sources and their scope.
- **Unresolved:** verification was unavailable or inconclusive. State what needs checking and whether it affects readiness.

Do not infer real-world accuracy, performance, or reader satisfaction from model agreement. Do not use language-style impressions to identify AI authorship. A textual review of instructions does not demonstrate that the steps work.

## Report

Keep the report proportional to the draft. A short internal message may need only a short verdict and one fix.

1. **Verdict and scope:** suitable for the stated purpose, needs targeted changes, needs substantial revision, or insufficient context to assess. For rough work, discuss readiness for its next stage rather than publication. Identify the selected roles and actual execution mode: independent subagents, batched subagents, mixed execution, or sequential passes.
2. **Prioritized changes:** zero to five. Each includes the passage or anchor, what is wrong, why it matters, and the specific local fix. Separate necessary fixes from optional suggestions. Use a request for evidence or an exact structural instruction when replacement text would require invention.
3. **Tradeoffs:** include only genuine conflicts that affect the recommendation.
4. **Preserve:** name the specific strengths that proposed edits should retain.
5. **Limits or open checks:** list material assumptions, missing access, verification gaps, or incomplete reviews.

An unchanged draft can be the right outcome. Do not add fixes to justify the panel. Do not make a full rewrite, paid bridge, price, headline alternatives, or promotion plan part of every report.

## Optional scoring

Only score if the user asks. Prefer a supplied rubric. Otherwise explain this qualitative readiness scale:

- 9 to 10: suitable for the stated purpose, with at most optional cosmetic suggestions.
- 7 to 8: needs contained fixes.
- 4 to 6: requires substantial changes to deliver its purpose.
- 1 to 3: central purpose or approach needs reconsideration.

Give a short reason based on surviving findings, not an average of reviewers. A material unresolved factual claim prevents an unqualified ready verdict; missing audience or purpose can make a score unassessable. Do not assign caps for punctuation preferences, a missing sales CTA, or a noncommercial purpose. Explain that a score is editorial judgment, not a measured prediction of performance, accuracy, or sales.
