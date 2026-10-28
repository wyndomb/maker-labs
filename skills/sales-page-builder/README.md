# Sales Page Builder

Audit a sales page, then fix it with copy you can stand behind. The skill interviews you once about your offer, checks your page the way a visitor sees it, traces every claim to a source, ranks the top five fixes, then plans the structure and writes the copy using only facts you gave it.

Before it ranks the fixes, six reviewers read your page independently, each through one lens:

| Lens | The question it owns |
| --- | --- |
| Offer Value, from Alex Hormozi's *$100M Offers* | Is the offer worth more than the price, and does the page make that obvious? |
| Headline And Facts, from David Ogilvy's books | Do the headline and body sell with specific, believable facts? |
| Conversation And Momentum, from Gary Halbert's *The Boron Letters* | Does it read like one person writing to another, and pull you forward? |
| Buyer Anxiety And Signals, from Rory Sutherland's *Alchemy* | What feels uncertain or risky, even when the offer makes sense? |
| Who It's For, from Seth Godin's *This Is Marketing* | Is it clear who it's for, who it isn't for, and what changes for them? |
| The Skeptical Buyer, built from your offer brief | Would I click, and what stops me? |

Then the skill merges what they found: where they agree, where they disagree and which way to go, and which of their suggestions it had to decline because your offer can't back them up.

It won't add a countdown you don't have, a testimonial nobody gave, or a number you can't back up. When a lens wants a guarantee or a deadline you don't have, the report shows what you'd need for it to be true.

## Try it

- "Run the sales page panel on https://example.com. It's my coaching services page."
- "Panel audit and rewrite my course landing page. Here's the HTML and a newsletter I wrote, for voice."
- "Use Sales Page Builder to build a sales page for my Notion template pack."
- "Just run the Ogilvy lens on my headline."

The first run asks up to two rounds of short questions about your offer and saves the answers as `offer-brief.md`. Later runs reuse it. One of the questions asks what your buyers already tried before finding you, so the page can name it.

You can also share a sales page you admire. The skill borrows its section order and pacing, and never its lines, claims, guarantees, or bonuses. If you sell a digital product, share the product files or the module list, and the "what's inside" section comes from those.

## What you get

- **Audit:** an offer check, the top five fixes, a claim-by-claim trace, a scored checklist with evidence tags, and a list of what needs your input.
- **Audit and rewrite:** everything in the audit, plus a section plan (keep, move, rewrite, add, cut) and new copy for the changed sections.
- **Build:** an offer brief, a section plan for your offer type, and full page copy.

Page structures cover services, courses and cohorts, digital products, memberships and paid newsletters, workshops and events, and lead magnets.

Every report also has a Panel section:

- Each lens's verdict and top finding
- The skeptical buyer's read of your page, from first screen to the moment they'd decide
- A table of real disagreements between lenses, with a recommendation
- Lens suggestions declined by your guardrails, each with what would unlock it
- Lines the panel wants kept as written

Each of the top five fixes shows which lenses raised it.

## Tools and limits

The panel works best where your chat can run subagents, so each lens reads the page without seeing the others. Without subagents it runs the lenses one after another and says so in the report. Six reviewers take longer and use more tokens than a single review.

All six lenses run on the same model. When they agree, that's a reason to look closer, not proof of how real buyers will react. The skeptical buyer is a simulation built from what you told the skill about your audience.

The lenses summarize published ideas from each author's books. None of these people wrote, reviewed, or endorsed this skill.

This review doesn't predict conversion rates. Only traffic plus a test can tell you what moves the number.

## Change the panel

Each lens is one file in `references/panel/`. Drop one by asking the skill to skip it. Add your own by copying a lens file and changing the question it owns, the principles it checks, its guardrails, and what it ignores.

## Credits

Sources and license notices are in [LICENSE-NOTICES.md](LICENSE-NOTICES.md).
