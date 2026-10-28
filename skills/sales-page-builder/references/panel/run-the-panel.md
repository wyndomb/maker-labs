# Run The Panel

Six lenses review the page independently, then the main agent merges what they found. The panel adds judgment on top of the audit. It never replaces the claim trace, and it never outranks a trust problem.

## The Lenses

| Lens | File | The question it owns |
| --- | --- | --- |
| Offer Value (Hormozi) | [hormozi.md](hormozi.md) | Is the offer worth more than the price, and does the page make that obvious? |
| Headline And Facts (Ogilvy) | [ogilvy.md](ogilvy.md) | Do the headline and body sell with specific, believable facts? |
| Conversation And Momentum (Halbert) | [halbert.md](halbert.md) | Does it read like one person writing to another, and pull the reader forward? |
| Buyer Anxiety And Signals (Sutherland) | [sutherland.md](sutherland.md) | What feels uncertain or risky, even when the offer makes sense? |
| Who It's For (Godin) | [godin.md](godin.md) | Is it clear who it's for, who it isn't for, and what change it promises? |
| The Skeptical Buyer | [skeptical-buyer.md](skeptical-buyer.md) | Would I click, and what stops me? |

Run all six by default. The user can drop lenses, run a single lens ("just the Ogilvy lens on my headline"), or add their own by writing a new lens file in the same shape. Respect the user's choice and list the lenses that ran in the report.

## 1. Prepare The Packets

Before dispatch, build one packet per lens:

- [The reviewer contract](contract.md), the lens file, the page text and render notes, the full offer brief, and the claim trace.
- **Skeptical buyer exception:** only the brief's audience, buyer language, heard entries from What They've Tried, and objections, plus the page and render notes. No claim trace, proof flags, conflicts, guardrails, or private facts.

Don't include your own audit opinions, the checklist scores, or what you expect a lens to find. The point is an independent read.

Announce the panel in one line before dispatch: which lenses are running and how (parallel subagents, batches, or sequential passes).

## 2. Dispatch

- **Subagents available:** launch the lenses concurrently, one subagent per lens. With fewer slots, run them in batches. Each subagent gets only its packet.
- **No subagents:** run each lens as a sequential pass in this conversation. Write that lens's findings in full before reading the next lens file, and read the skeptical buyer lens first, before anything else shapes your view of the page. Say in the report that the passes were sequential, not independent.
- **A lens fails:** retry once. If it fails again, run it as a pass in the main conversation and disclose the substitution.

Reviewers return findings only. They don't browse, edit files, submit forms, contact anyone, or launch more agents.

## 3. Synthesize (Main Agent)

Don't hand this step to another subagent.

1. **Check every anchor.** Each quoted line must appear on the page. Fix a slightly wrong quote if the finding still holds. Otherwise drop the finding.
2. **Apply the guardrails.** A fix that adds urgency, scarcity, guarantees, bonuses, testimonials, logos, results, or numbers the brief doesn't support becomes a decline-with-unlock: name the tactic, say what's missing, give the closest supportable line, and name the evidence that would unlock it. A fix that breaks the user's own guardrails gets dropped and noted. Collect these under "Declined by guardrails."
3. **Merge duplicates.** Findings about the same passage or problem become one item. Record which lenses raised it.
4. **Rank.** Merge the surviving panel findings into the audit's top 5 using the same impact order from the main skill:
   - Level 1 trust problems from the audit (tampering, untrue or unsourced claims, broken or stale items) always stay on top. No number of lenses outranks them.
   - Within the other levels, a finding raised by two or more lenses moves up. A skeptical buyer finding about clarity or an unanswered question also moves up, because it's the closest the panel gets to a visitor's view.
   - Agreement between lenses is a signal to look closer, never proof. All six run on the same model. Say this once in the report.
5. **Show real disagreements.** When two lenses push the same passage in opposite directions, put it in the disagreements table with your recommendation. Resolve it when the brief answers the question (traffic temperature, price, voice sample, guardrails). Leave it conditional when it depends on something the brief doesn't say. Don't invent disagreements to fill the table. Write "No real disagreements" if there are none.
6. **Lock the keepers.** A line that two or more lenses list under Keep, and that passes the claim trace, stays as written in any rewrite. Mark it "(kept, panel)."
7. **Hand off to the rewrite.** In Audit and rewrite and Build, Step 5 uses the ranked fixes. Each rewritten section notes which findings it answers.

## Disagreements These Lenses Often Have

Use these to recognize a real conflict quickly. Don't assume they apply to every page.

- **Hormozi vs Godin:** a bigger dream outcome that appeals widely, against a narrow audience that names who it isn't for. The brief's audience and price usually settle it.
- **Ogilvy vs Halbert:** more facts and longer copy, against momentum and fewer words. Usually both can win: keep the facts, cut the decoration, and fix the transitions.
- **Hormozi vs Sutherland:** pushing urgency and a strong guarantee, against lowering anxiety and pressure. With no real deadline in the brief, Sutherland's direction is the only one available.
- **Any lens vs the skeptical buyer:** when a marketer lens praises a line the buyer doubted, the buyer's doubt wins unless the claim trace shows the line is sourced and the fix is to show that source.

## Build Mode

With no page to review, run the panel on the drafted copy after Step 5. Give each lens the draft instead of a live page, and skip render notes. Revise once using the synthesis, then deliver. Don't loop the panel more than once unless the user asks.
