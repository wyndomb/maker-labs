# Audit Checklist

Score each item **Pass**, **Partial**, or **Fail**, with the evidence from the page. Score only what the page shows.

Each item carries an evidence tag so the user knows how much weight it deserves:

- **Consensus:** widely repeated by practitioners and usability researchers. It isn't a controlled finding for this specific page.
- **Mixed:** studies point both ways, or the effect depends on context.
- **Trust:** an honesty standard. It isn't a conversion claim.

The order follows impact. Value proposition comes first, friction last.

## First: Assess The Page

Before scoring, note:

- **Page type:** sales page, services page, course page, signup page, homepage doing sales work, or event page.
- **Primary goal:** buy, book, apply, sign up, or contact.
- **Traffic:** where visitors come from (the user's answer, or "unknown"). Cold traffic needs more explanation than a warm list.

## Scored Items

| # | Check | Tag | Pass when |
| --- | --- | --- | --- |
| 1 | Value proposition is clear in seconds | Consensus | A cold visitor can name what's offered, who it's for, and why it matters from the first screen |
| 2 | Headline is specific | Consensus | The headline names an outcome or situation a competitor couldn't claim word for word |
| 3 | Primary action on the first screen | Consensus | The main CTA renders without scrolling at desktop and 375x812 |
| 4 | First screen renders promptly | Consensus | Headline and CTA appear on first paint, with no long blank or faded hero |
| 5 | Button text matches what happens | Consensus | The label describes the actual next step (checkout, booking, sending a message, scrolling). External-link icons only on external links |
| 6 | Proof matches the offer | Trust + Consensus | Proof shows results for buyers of this offer, not only the seller's audience size or credentials |
| 7 | Proof sits near the decision | Consensus | At least one relevant proof item appears near the main CTA, form, or price |
| 8 | Every claim traces to a source | Trust | The claim trace has no Unsourced, Stale, or Assumption items |
| 9 | Urgency and scarcity are real or absent | Trust | Every deadline, limit, or "last chance" matches the brief and hasn't passed |
| 10 | Content is current | Trust | No expired events, promos, dates, or stale featured items |
| 11 | Price or pricing method is visible | Mixed | The page states a price, range, or how the price gets set. For high-ticket services, showing a range is a judgment call |
| 12 | Top objections answered before the ask | Consensus | The page answers the brief's top objections before the form or checkout. Also check the ones buyers commonly have even when the brief doesn't list them: cost, "what if it doesn't work," "will it work for my situation or tools," time and effort, and, for services, data access |
| 13 | Problem framing attracts the right buyer | Consensus | The pains named on the page match what the offer solves. A pain the offer doesn't fix invites the wrong inquiries |
| 14 | Ask repeated after objections | Consensus | A CTA follows the FAQ or objection section, so a reader whose doubt was just answered can act without scrolling |
| 15 | Form asks only what's needed | Mixed | Each field earns its place for the next step, and optional fields are marked. Fewer fields usually help, but not always, so there's no fixed limit ([CXL](https://cxl.com/blog/reduce-form-fields)). Open-ended fields carry an example or help text |
| 16 | Reassurance at the point of action | Consensus | Near the form or checkout: what happens next, when, and what happens to their details. Promises made earlier on the page (a call, a download) match what the form actually starts |
| 17 | Outcome before mechanism | Consensus | Sections lead with what changes for the buyer, then explain how |
| 18 | Scannable hierarchy | Consensus | Someone skimming the headings gets the argument. Important elements stand out visually. The same stats or proof aren't repeated in several places while other proof is missing |
| 19 | One primary path | Mixed | Secondary links don't compete with the main CTA at decision points |
| 20 | Nav labels match destinations | Consensus | Each nav label lands where a visitor would expect |
| 21 | Voice and AI tells | Trust | The copy passes the AI-tell checks in copy rules and matches the user's guardrails |

## Test Ideas Only

Suggest these as experiments, never as rules. They rest on thin evidence, or the right answer depends on the audience:

- **First-person button copy** ("Get my guide" vs "Get your guide"). The often-quoted 90% lift comes from one test reported by Unbounce ([source](https://unbounce.com/a-b-testing/failed-ab-test-results)). One reported replication found 24%.
- Long page vs short page, navigation removed vs kept, video vs text, and other page-type experiments. For a fuller list sorted by offer type, use the test ideas in [form and tests](form-and-tests.md).

Note that a low-traffic page can't produce a meaningful A/B result. Suggest judging changes by inquiry quality or sales conversations instead.

## Not Scored

These need data beyond the page. List them with what each would need:

- Message match with the traffic source (needs the ad, email, or post that sends visitors)
- Form or checkout drop-off (needs analytics)
- Post-submit or thank-you experience (needs a test submission the user makes or approves)
- Abandonment recovery emails (needs the email setup)
- Tracking and testing cadence (needs analytics access and traffic volume). If there's no measurement, suggest the minimum: page views, form views, submissions, and the traffic source (UTM tags on the links the user shares)

For deeper form work (field types, labels, multi-step forms, error messages, what happens after submit), run the form check in [form and tests](form-and-tests.md).

## Deliberately Left Out

- Stacking cognitive biases (loss aversion, FOMO) and price anchoring without real tiers. These trade trust for clicks.
- Hard rules like "5 fields maximum" or "grade 6 reading level." These are folded into items 15 and 21 as judgment calls.
