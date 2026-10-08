#!/usr/bin/env python3
"""Measure countable features of a person's writing or speech for VOICE.md.

Usage:
    python3 voice_stats.py [--label NAME] FILE [FILE ...]

Reads plain text or Markdown files (one sample per file) and prints a
Markdown report: sentence and paragraph rhythm, punctuation habits, pronoun
use, recurring words and phrases across samples, and common AI-sounding
phrases. Standard library only. It reads only the files given and writes
nothing.

The numbers are evidence to check against close reading, not rules.
"""

import argparse
import re
import statistics
import sys
from collections import Counter
from pathlib import Path

STOPWORDS = set("""
a about above after again against all am an and any are aren't as at be because been before being
below between both but by can can't cannot could couldn't did didn't do does doesn't doing don't down
during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here
here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself
let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves
out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their
theirs them themselves then there there's these they they'd they'll they're they've this those through
to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's
where where's which while who who's whom why why's with won't would wouldn't you you'd you'll you're
you've your yours yourself yourselves also just like get got one really will even much many make made
thing things way well still now new use using used know want need going go see say said said yeah
""".split())

AI_PHRASES = [
    "delve", "delving", "tapestry", "landscape", "leverage", "game-changer", "game changer",
    "unlock", "unleash", "elevate", "in today's", "fast-paced", "ever-evolving", "navigate the",
    "it's important to note", "it is important to note", "in conclusion", "at the end of the day",
    "seamless", "robust", "cutting-edge", "harness", "embark", "journey", "realm", "testament to",
    "not just", "more than just", "let's dive", "dive into", "deep dive", "in the world of",
    "whether you're", "key takeaway", "furthermore", "moreover", "additionally",
]

EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
EMOTICON = re.compile(r"(?<!\w)[:;]-?[)(DPp](?!\w)")
TRAILING = re.compile(r"[\s\"')\]]*(?:(?:[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F3FB-\U0001F3FF\uFE0F]|[:;]-?[)(DPp])[\s]*)*$")
CONTRACTION = re.compile(r"\b\w+'(s|re|ve|ll|d|m|t)\b", re.I)
WORD = re.compile(r"[A-Za-z][A-Za-z'\-]*")
TIMESTAMP = re.compile(r"^\s*(\[?\d{1,2}:\d{2}(:\d{2})?([.,]\d+)?\]?\s*(-->\s*\d{1,2}:\d{2}(:\d{2})?([.,]\d+)?)?)\s*$")


def clean(text):
    """Strip Markdown and transcript markup, keep paragraph breaks."""
    text = text.replace("\u2019", "'").replace("\u2018", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\A\s*---\n.*?\n---\s*\n", "", text, flags=re.S)
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"`[^`]*`", " ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"https?://\S+", " ", text)
    lines = []
    for line in text.splitlines():
        if line.strip().upper() == "WEBVTT" or TIMESTAMP.match(line) or re.fullmatch(r"\s*\d+\s*", line):
            continue
        lines.append(line)
    return "\n".join(lines)


def paragraphs_of(text):
    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    return [p for p in paras if not re.fullmatch(r"#+\s.*", p)]


def sentences_of(para):
    para = re.sub(r"^\s*([-*+]|\d+[.)])\s+", "", para, flags=re.M)
    para = re.sub(r"[*_#>]+", "", para)
    para = re.sub(r"\s+", " ", para).strip()
    parts = re.split(r"(?<=[.!?…])[\"')\]]*\s+(?=[A-Z0-9\"'(\[])", para)
    return [s for s in parts if WORD.search(s)]


def pct(n, d):
    return f"{(100.0 * n / d):.0f}%" if d else "n/a"


def per_k(n, words):
    return f"{(1000.0 * n / words):.1f}" if words else "n/a"


def quantile(values, q):
    if not values:
        return 0
    values = sorted(values)
    i = min(len(values) - 1, max(0, int(round(q * (len(values) - 1)))))
    return values[i]


def ngrams(tokens, n):
    return [" ".join(tokens[i:i + n]) for i in range(len(tokens) - n + 1)]


def analyze(samples, label):
    all_sent_lens, para_word_lens, para_sent_lens = [], [], []
    words_total = 0
    raw_all = ""
    sentence_starts = Counter()
    word_doc_freq, word_freq = Counter(), Counter()
    phrase_doc_freq = Counter()
    list_lines = heading_lines = total_lines = 0
    questions = exclaims = 0

    for name, raw in samples:
        total_lines += sum(1 for l in raw.splitlines() if l.strip())
        list_lines += sum(1 for l in raw.splitlines() if re.match(r"^\s*([-*+]|\d+[.)])\s+", l))
        heading_lines += sum(1 for l in raw.splitlines() if re.match(r"^\s*#{1,6}\s", l))
        text = clean(raw)
        raw_all += "\n" + text
        doc_words, doc_phrases = set(), set()
        for para in paragraphs_of(text):
            sents = sentences_of(para)
            if not sents:
                continue
            para_sent_lens.append(len(sents))
            para_word_lens.append(sum(len(WORD.findall(s)) for s in sents))
            for s in sents:
                toks = [t.lower() for t in WORD.findall(s)]
                if not toks:
                    continue
                all_sent_lens.append(len(toks))
                words_total += len(toks)
                sentence_starts[toks[0]] += 1
                core = TRAILING.sub("", s).rstrip("\"')] ")
                questions += core.endswith("?")
                exclaims += core.endswith("!")
                for t in toks:
                    if t not in STOPWORDS and len(t) > 2:
                        word_freq[t] += 1
                        doc_words.add(t)
                for n in (2, 3):
                    for g in ngrams(toks, n):
                        parts = g.split()
                        if all(p in STOPWORDS for p in parts):
                            continue
                        doc_phrases.add(g)
        word_doc_freq.update(doc_words)
        phrase_doc_freq.update(doc_phrases)

    n_docs = len(samples)
    n_sent = len(all_sent_lens)
    lower = raw_all.lower()
    tokens_all = [t.lower() for t in WORD.findall(raw_all)]

    out = []
    out.append(f"# Voice stats: {label}")
    out.append("")
    out.append(f"- Samples: {n_docs}")
    out.append(f"- Words: {words_total}")
    out.append(f"- Sentences: {n_sent}")
    if words_total < 1500:
        out.append("- Note: under 1,500 words. Treat every figure below as weak evidence.")
    out.append("")

    out.append("## Rhythm")
    if all_sent_lens:
        out.append(f"- Sentence length (words): median {statistics.median(all_sent_lens):.0f}, "
                   f"mean {statistics.mean(all_sent_lens):.1f}, "
                   f"10th percentile {quantile(all_sent_lens, 0.1)}, 90th percentile {quantile(all_sent_lens, 0.9)}")
        short = sum(1 for x in all_sent_lens if x <= 6)
        long_ = sum(1 for x in all_sent_lens if x >= 30)
        out.append(f"- Short sentences (6 words or fewer): {pct(short, n_sent)}")
        out.append(f"- Long sentences (30 words or more): {pct(long_, n_sent)}")
        if len(all_sent_lens) > 1:
            out.append(f"- Variation (std dev of sentence length): {statistics.pstdev(all_sent_lens):.1f}")
    if para_word_lens:
        one = sum(1 for x in para_sent_lens if x == 1)
        out.append(f"- Paragraph length: median {statistics.median(para_word_lens):.0f} words, "
                   f"median {statistics.median(para_sent_lens):.0f} sentences")
        out.append(f"- One-sentence paragraphs: {pct(one, len(para_sent_lens))}")
        if statistics.median(para_sent_lens) <= 1 and words_total < 3000:
            out.append("- Warning: most paragraphs are one sentence. If the samples are excerpts or pasted fragments, paragraph figures are unreliable.")
    out.append(f"- Questions: {pct(questions, n_sent)} of sentences; exclamations: {pct(exclaims, n_sent)}")
    out.append("")

    out.append("## Punctuation per 1,000 words")
    marks = {
        "Em dash (—)": raw_all.count("—"),
        "Spaced or double hyphen ( - / --)": len(re.findall(r"(?<=\S)[ \t]-[ \t](?=\S)|(?<=\w)--(?=\w|\s)", raw_all)),
        "Parentheses": raw_all.count("("),
        "Colon": len(re.findall(r":(?!//)", EMOTICON.sub("", raw_all))),
        "Semicolon": raw_all.count(";"),
        "Ellipsis": raw_all.count("…") + raw_all.count("..."),
        "Exclamation mark": raw_all.count("!"),
        "Question mark": raw_all.count("?"),
    }
    for k, v in marks.items():
        out.append(f"- {k}: {per_k(v, words_total)}")
    out.append(f"- Emoji: {per_k(len(EMOJI.findall(raw_all)), words_total)}; text emoticons such as :) {per_k(len(EMOTICON.findall(raw_all)), words_total)}")
    out.append("")

    out.append("## Person and tone markers per 1,000 words")
    counts = Counter(tokens_all)
    groups = {
        "I / me / my": ["i", "me", "my", "mine", "myself", "i'm", "i've", "i'd", "i'll"],
        "we / us / our": ["we", "us", "our", "ours", "we're", "we've", "we'll"],
        "you / your": ["you", "your", "yours", "you're", "you've", "you'll", "you'd"],
    }
    for k, ws in groups.items():
        out.append(f"- {k}: {per_k(sum(counts[w] for w in ws), words_total)}")
    out.append(f"- Contractions: {per_k(len(CONTRACTION.findall(raw_all)), words_total)}")
    starts = ["and", "but", "so", "because", "or"]
    out.append("- Sentences starting with: " + ", ".join(
        f'"{w.capitalize()}" {pct(sentence_starts[w], n_sent)}' for w in starts))
    out.append("")

    out.append("## Formatting")
    out.append(f"- List lines: {pct(list_lines, total_lines)} of non-empty lines")
    out.append(f"- Markdown headings: {heading_lines}")
    bold = len(re.findall(r'(\*\*|__)(?=\S)[^*_\n]+?(?<=\S)\1', raw_all))
    no_bold = re.sub(r'(\*\*|__)(?=\S)[^*_\n]+?(?<=\S)\1', ' ', raw_all)
    italic = len(re.findall(r'(?<![*_\w])([*_])(?=\S)[^*_\n]+?(?<=\S)\1(?![*_\w])', no_bold))
    out.append(f"- Bold per 1,000 words: {per_k(bold, words_total)}; italic per 1,000 words: {per_k(italic, words_total)}")
    out.append("")

    min_docs = 2 if n_docs >= 2 else 1
    plural = "sample" if min_docs == 1 else "samples"
    out.append(f"## Recurring words (in at least {min_docs} {plural})")
    rec = [(w, c) for w, c in word_freq.most_common() if word_doc_freq[w] >= min_docs][:30]
    out.append(", ".join(f"{w} ({c})" for w, c in rec) if rec else "None found.")
    out.append("")

    out.append(f"## Recurring phrases (in at least {min_docs} {plural})")
    phrase_counts = Counter()
    for n in (3, 2):
        for g in ngrams(tokens_all, n):
            if phrase_doc_freq[g] >= min_docs:
                phrase_counts[g] += 1
    rec_p, seen = [], set()
    for g, c in phrase_counts.most_common():
        if c < 3 or any(g in s for s in seen):
            continue
        rec_p.append((g, c))
        seen.add(g)
        if len(rec_p) >= 20:
            break
    out.append(", ".join(f'"{g}" ({c})' for g, c in rec_p) if rec_p else "None found.")
    out.append("")

    out.append("## Common AI-sounding phrases")
    found = []
    for p in AI_PHRASES:
        c = len(re.findall(r"\b" + re.escape(p) + r"\b", lower))
        if c:
            found.append(f'"{p}" ({c})')
    out.append("Found: " + ", ".join(found) if found else "None of the checked phrases appear.")
    if found:
        out.append("Some of these are normal terms in certain fields (for example \"harness\" or \"robust\" in tech). Confirm how each is used before adding it to the Never list.")
    out.append("")
    out.append("Check every figure against the samples before turning it into a rule.")
    return "\n".join(out)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--label", default="samples", help="Name for the report, e.g. 'written' or 'spoken'")
    ap.add_argument("files", nargs="+", help="Text or Markdown files, one sample per file")
    args = ap.parse_args(argv)
    samples = []
    for f in args.files:
        p = Path(f)
        if not p.is_file():
            print(f"Not a file: {f}", file=sys.stderr)
            return 2
        samples.append((p.name, p.read_text(encoding="utf-8", errors="replace")))
    print(analyze(samples, args.label))
    return 0


if __name__ == "__main__":
    sys.exit(main())
