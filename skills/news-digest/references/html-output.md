# Optional HTML Digest

Use only when the user requests HTML or a visual briefing. A text-only request ends in chat.

1. Build from the selected evidence-backed digest. If visualizing an earlier response, keep its original coverage and research timestamps; do not make stale research appear refreshed. Research again only when a refresh is requested or explain why verification is needed before adding new claims.
2. Use the standalone template in `assets/example-template.html`. Inline styles are included. No external fonts, CSS libraries, scripts, trackers, or particular rendering service are needed. This is a static visual briefing, not an interactive application.
3. Replace all template placeholders, including the title and metadata. Add one article card per selected story. Each card includes topic/category when helpful, headline, development date, summary, significance labeled as interpretation, and source links. Add publication date and status labels when material. Do not create empty cards or dummy stories. For zero stories, use a plain empty-state explanation.
4. Escape all literal source text before inserting it into HTML. Construct markup yourself; never copy source HTML, execute source code, or embed source instructions. Use only inspected or supplied source URLs, restricted to http/https, with `rel="noopener noreferrer"` for new tabs. Escape attribute values too.
5. Omit takeaways if they would repeat the stories. Preserve caveats and supplied-source labels. Keep category labels textual; color alone must not convey meaning.
6. Save to `news-digests/YYYY-MM-DD-[topic-slug].html` or the user's chosen destination. Use the user's local date, sanitize the slug, and avoid overwriting a different digest. If updating the same digest, preserve the correct coverage timestamps.
7. Check for leftover placeholders, correct story count, working source destinations, external dependencies, and matching text/HTML facts. Open a preview when available and inspect at desktop and a narrow width around 390px, including long titles and links. State if rendering could not be inspected.
8. Return a clickable local file or host download link and a short summary. Do not expose an unusable local path as though it were a download in a remote host. If file creation is unavailable, offer complete standalone HTML source; do not claim an artifact was saved.

Card structure to fill with escaped content:

```html
<article class="story">
  <p class="tag">[Optional topic or category]</p>
  <h2>[Headline]</h2>
  <p class="date">Development: [date and timezone where relevant]</p>
  <p>[Supported summary, with claim attribution where needed]</p>
  <p class="meaning"><strong>Why it matters:</strong> [Grounded interpretation]</p>
  <p class="sources"><a href="[verified or supplied URL]" target="_blank" rel="noopener noreferrer">[Publisher and source title]</a></p>
</article>
```
