---
name: strategic-decision-framework
description: Analyzes consequential business decisions using selected strategic lenses, real evidence, explicit assumptions, and reversible tests. Use for go/no-go, pricing, priority, or direction choices.
---

# Strategic Decision Framework

Turn a consequential business choice into a concise, evidence-backed decision brief.

Use the smallest set of strategic lenses that materially improves the decision. Keep human judgment visible.

## Operating Rules

1. Ground the analysis in the user's real business material whenever available.
2. Separate evidence, assumptions, preferences, and unknowns.
3. Never invent numbers, customer views, market facts, or source material.
4. Verify current external claims when they could change the decision and research tools are available.
5. Use three to five high-value lenses by default. Apply all ten only when the user explicitly requests a full analysis.
6. Give a working conclusion with conditions, not false certainty.
7. End with a reversible test or concrete next action whenever possible.

## Source Priority

Before analyzing, inspect or request:

1. Current strategy, priorities, goals, and constraints.
2. Customer research, sales notes, support themes, and customer language.
3. Product, offer, pricing, financial, or operational material relevant to the choice.
4. Market and competitor research.
5. Previous decision notes and what happened afterward.
6. Stakeholder requirements and implementation limits.

In a file-based project, search likely strategy, customer, market, product, finance, decision, and research folders before asking the user to repeat information already available.

If important evidence is missing, proceed in **provisional mode** and name what would most change the conclusion.

## Workflow

### Step 1: Frame the Decision

Restate:

- The decision to make.
- The available options, including doing nothing.
- The desired outcome.
- The deadline.
- The main constraints.
- Who is affected.
- Whether the choice is reversible.

If critical information is missing, ask no more than three focused questions at once. If the user wants to proceed immediately, state the assumptions and continue.

### Step 2: Build the Evidence Base

Create four evidence categories, retaining source locations for the brief:

1. **Known:** Directly supported by supplied material or verified sources.
2. **Assumed:** Plausible but not directly supported. Mark a reasoned inference explicitly and cite its premises; it is not a known fact.
3. **Preferred:** A value, priority, risk tolerance, or personal preference.
4. **Unknown:** Information that could materially change the choice.

When sources conflict, compare directness, relevance to this decision, date, sample limits, and method. Keep material disagreements visible. Newer evidence is not automatically better; an old contract can still control a commitment. Separate what a stakeholder actually said from your hypothesis about their needs. Do not resolve disagreement by counting sources.

For current external facts, prefer primary sources. Record the source and date. If research is unavailable, flag the claim instead of treating it as current.

### Step 3: Choose the Analysis Mode

Use **Focused Mode** by default:

- Select three to five lenses that match the decision.
- Explain briefly why each lens was selected.
- Skip lenses that add little value.

Use **Full Mode** only when the user explicitly requests all ten lenses. Broad consequences alone do not activate it. Full Mode and independent review are separate choices.

Read [references/framework-definitions.md](references/framework-definitions.md) before applying the selected lenses.

Available lenses:

1. Managing Blind Spots
2. Stakeholder Views
3. Vital Few Factors
4. First Principles
5. Systems Thinking
6. Jobs to Be Done
7. Opportunity Cost
8. Regret Minimization
9. Second-Order Effects
10. Inversion

### Step 4: Analyze the Options

For each selected lens:

1. Name the lens and why it matters.
2. Apply its method to the actual decision.
3. Identify the insight that changes or sharpens the choice.
4. Cite the supporting evidence or label the point as an assumption.
5. Rate relevance as **High**, **Medium**, or **Low**, with one sentence explaining the rating.

Keep each lens to one or two substantive paragraphs by default. Do not repeat the same point through different frameworks.

### Optional Independent Review

Use independent review when the user requests subagents or a deeper challenge, or when a consequential, difficult-to-reverse decision has material evidence conflicts. Use available, authorized delegation; otherwise perform the two review passes sequentially and disclose that limitation. Read [references/independent-review.md](references/independent-review.md) only when using this mode. Keep ordinary decisions with one agent.

### Step 5: Compare the Options

Create a compact comparison using decision criteria that come from the user's goals and constraints.

Check hard constraints before ranking options. Mark a violating option infeasible unless the user changes the constraint. Keep doing nothing or delaying in the comparison when viable.

Use qualitative ratings unless the source material supports numerical scoring. Do not create weighted precision from guesses.

Include:

- Likely upside.
- Main downside.
- Evidence supporting the option.
- Critical assumption.
- Reversibility.
- Cost of delay.

### Step 6: Reach a Working Conclusion

Provide:

1. **Working conclusion:** The best-supported option based on current evidence.
2. **Why:** The two or three reasons that matter most.
3. **Conditions:** What must be true for the conclusion to hold.
4. **Main counterargument:** The strongest case against it.
5. **Confidence:** High, medium, or low, with the reason.
6. **What could change the conclusion:** The missing evidence or event that would justify revisiting it.

If the user explicitly requests analysis without a recommendation, replace the working conclusion with the decision tension they must resolve.

### Step 7: Bridge to Action

For analysis-only requests, end with unresolved questions or evidence that would distinguish options. Do not prescribe an option, pilot, or next step unless the user asks for it. The action specification below applies only when a next action is requested or a recommendation is allowed.

For recommendation requests, recommend one of these:

- A reversible test.
- A small pilot.
- One customer or stakeholder check.
- A short research task.
- A decision deadline with an owner.
- The first implementation step.

Make the action specific enough to start this week or within the stated decision deadline. Include an owner or proposed role, duration, resource cap, observable success condition, stop or reconsider condition, and review date. Use supplied limits where available. Label proposed thresholds and dates as proposals; do not present them as proven benchmarks or commitments. If evidence cannot support a choice, recommend the smallest evidence-gathering step instead of forcing a winner.

Default to a concise brief with a short working conclusion first, followed by supporting analysis. Expand only when the decision or user request calls for it. In analysis-only mode, use a neutral decision tension instead and remove all recommendation fields from the template. Confidence reflects evidence quality and sensitivity to assumptions, never how many agents agree.

## Output Format

```markdown
# Strategic Decision Brief: [Decision]

## Working Conclusion
- Best-supported option:
- Why:
- Conditions:
- Main counterargument:
- Confidence:
- What could change this:

## Decision
- Choice:
- Options:
- Desired outcome:
- Deadline:
- Constraints:

## Evidence Snapshot
| Item | Status | Source or reason |
| --- | --- | --- |
| ... | Known / Assumed / Preferred / Unknown | ... |

## Selected Lenses
1. [Lens]: [why selected]
2. ...

## Analysis
### [Lens]
**Relevance:** High / Medium / Low
[Decision-specific analysis with evidence labels]

## Option Comparison
| Option | Constraint fit | Upside / downside | Evidence / assumption | Reversibility / cost of delay |
| --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... |

## Next Action
[Action, owner, duration, resource cap, success condition, stop condition, and review date. Distinguish supplied constraints from proposed thresholds.]
```

## Safety Boundaries

Keep the skill focused on business strategy and execution.

For decisions involving regulated legal, medical, tax, or investment advice:

1. Analyze the business considerations that fall within scope.
2. Identify where qualified professional advice is needed.
3. Do not present the brief as a substitute for that advice.

## Quality Gate

Before delivering, verify:

1. The actual decision and options are clear.
2. The analysis uses real material or labels missing evidence.
3. Every material claim is sourced, inferred, preferred, or unknown.
4. The selected lenses add distinct value.
5. The conclusion follows from the evidence and states its conditions.
6. The counterargument is strong rather than ceremonial.
7. When an action is appropriate, it is measurable and respects time, budget, and authority limits.
8. Hard constraints, conflicting evidence, and unresolved reviewer disagreements remain visible.
9. Analysis-only requests contain no preferred option or disguised recommendation.

If any check fails, revise before delivering.
