# DESIGN.md Builder

Turn your brand references into three files that another AI agent can read before making a website, deck, report, or graphic:

- `DESIGN.md`: supported brand decisions and guidance for the formats you need.
- `design-audit.md`: sources, missing details, conflicts, and checks performed.
- `design-corrections.md`: accepted instructions for future assets, limited to the formats they apply to.

## Start here

Supply a website, brand guide, screenshots, design export, existing guide, or written brand rules. Name the formats you want to make. You do not need all of these inputs.

> Use DESIGN.md Builder to turn these references into a reusable design folder for my website and presentations. Record what the sources actually establish, flag missing decisions, and keep unsupported guesses out of the approved guide.

To update existing files, supply the whole folder and your feedback:

> Update this design folder. For future presentations, use the main takeaway as the slide title. Keep the change scoped to presentations and preserve the other approved decisions.

To review without editing:

> Audit this design folder. Report unsupported values, conflicting rules, missing files, and validation results without changing the guide or corrections.

## Use the result

Keep all three files together. In a later asset request, attach the folder or make its files available and say:

> Read DESIGN.md and design-corrections.md before planning this asset. Apply accepted corrections within their scope. Consult design-audit.md for missing or disputed decisions and report any unavailable fonts or assets.

The folder does not automatically apply itself to other chats or tools. It does not include permission to reuse someone else's fonts, logos, or images. Review representative finished assets before claiming that the brand works consistently across formats.

## Requirements and limitations

No API key, connector, or separate Maker Labs skill is required. Website inspection depends on the tools available in your chat; screenshots and pasted rules can supply partial evidence when a site is inaccessible. Screenshots alone do not establish exact font names or design values.

File creation and script execution depend on the host. If saving is unavailable, the agent returns the three file contents for you to save. Automated checks use Python 3.9 or later with no third-party packages. If execution is unavailable, the agent reports a manual review and names the checks it could not run.

The checker covers structure and limited evidence traceability. It is not a complete YAML validator and cannot establish that a cited source supports a value or that finished assets look right.
