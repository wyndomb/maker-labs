# Competitor Analysis

Use this skill to compare competitors and the alternatives customers already use, then connect the evidence to a real pricing, offer, positioning, or market decision.

## Use in Maker Labs

With a Maker Labs version containing this skill available in your chat, select Competitor Analysis from the skill menu or ask, "Use the competitor analysis skill." If your host exposes slash commands, use the command it shows for this skill. Naming the skill in a normal message also works as an instruction to use it.

The skill starts with the intake below, then uses the research tools available in that chat. No separate Tavily account, API key, or research plugin is required.

## Standalone Package

The `competitor-analysis` folder also contains the complete skill, supporting reference, and output template. Use your host's supported skill import or installation method. Installation and slash-command availability depend on the host. The skill does not install tools or change account settings.

## Try It

Use a natural request such as:

> Use the competitor analysis skill to compare our client reporting service with these two platforms and the manual spreadsheet process our interviewees use. I need to decide what to include in a paid pilot.

Other useful triggers:

- "Research these competitors for a pricing decision."
- "Compare our offer with the options customers use today."
- "Find evidence-backed positioning gaps in this category."

## What to Provide

Starting the skill with a slash command opens a short intake interview. It asks all six questions and distinguishes the required answers from the optional ones. Answers already supplied are filled in for you to correct if needed.

**Required before research:**

1. Your product, service, offer, or idea.
2. The target customer and the problem you solve.
3. The decision the comparison should help you make.

**Optional:**

4. Competitors or alternatives you want included.
5. Customer evidence, such as interview notes or sales feedback.
6. Boundaries such as geography, category, price range, or delivery requirements.

You can skip any or all optional questions. The skill can discover competitors and clearly label assumptions where evidence is missing. If a required answer is unclear, it helps you define it before starting research.

## What You Receive

The main output is `competitor-analysis.md`, or a complete brief in chat when saving files is unavailable:

- A decision takeaway with research scope and date.
- A comparison of competitors and practical customer alternatives.
- Important differences, pricing qualifiers, and implications.
- Explicit uncertainties and one recommended next action.
- A supporting claim ledger and source list.

## Research Requirements

Use the host's built-in web search and fetch, open, or page-extraction tools. An interactive browser is used only when important details need interaction or remain unclear in extracted text, and only if that tool is available. It is not required for ordinary research.

No Tavily account, API key, paid connector, or companion skill is required. Tool access varies by chat. If live page access is unavailable, the skill can analyze supplied material with its age and limitations clearly labeled, or provide a research plan. It will not invent current facts.

Customer evidence is optional. When it is absent, proposed customer priorities are labeled as assumptions to validate.

## Troubleshooting

**Pricing is hidden behind a sales call.**  
Record it as `Not publicly disclosed`, cite the reviewed page, and treat a sales inquiry as a possible next action. Do not estimate a price.

**A capability is missing from the homepage.**  
Check product documentation or help pages. If it is still absent, write `Not found on reviewed pages`.

**Review sites conflict with the company website.**  
Show both sources, label the claim as contested, and explain what would resolve it.

**The result is just a feature table.**  
Ask the skill to rebuild the criteria from customer triggers, desired outcomes, objections, and switching costs.

**Live research is unavailable.**  
The skill analyzes any supplied sources with clear limitations. If no usable evidence is supplied, it provides a research plan with the exact questions and sources needed. It does not ask you to install a research service.

**A pricing page cannot be accessed.**  
Record `Unable to verify`, explain the access limit, and avoid assuming the company hides its prices.
