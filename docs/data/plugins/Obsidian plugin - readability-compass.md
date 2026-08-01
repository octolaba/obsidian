---
uid: 04431605-8c21-5706-bb5d-8a64fa506de6
xid:
  - readability-compass
aliases:
  - readability-compass
  - Readability Compass
  - maxonamission/obsidian-readability-compass
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/readability-compass
alt:
  - https://github.com/maxonamission/obsidian-readability-compass
downloads: 88
updated at: "2026-07-17T23:45:36Z"
related to:
  - "[[GitHub - 1300098507]]"
remind me:
---

# Readability Compass

Measures how readable a note is with LIX, which combines sentence length with the share of long words and so needs no syllable counting or word lists, working in any language with space-separated words; ten languages add a Flesch variant. A target audience can be chosen, roughly CEFR B1, B2, C1, or a custom ceiling, and the status bar reports whether the note or a selection is on target. A side panel explains the verdict with per-section scores, the longest sentences with click-to-jump, counts, and reading time, while commands insert a report callout or write the score into note properties for Bases views. Only running text is measured, with front matter, code, tables, URLs, and tags stripped first, and everything is computed locally.

```cue
plugin: {
    id:     "readability-compass"
    name:   "Readability Compass"
    author: "Max"
    repo:   "maxonamission/obsidian-readability-compass"

    html_url:    "https://community.obsidian.md/plugins/readability-compass"
    github_url:  "https://github.com/maxonamission/obsidian-readability-compass"
    description: "Check the readability of your writing to ensure it fits your readers. See a language-independent score (LIX) and specify your own target. Check scores in the status bar and details in the side panel. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "You write for readers, but can they actually follow you? Readability Compass gives you one honest signal, right where you write. It measures sentence length plus the share of long words (LIX): no syllable guessing, no word lists, so it works in any language with space-separated words. Ten languages add their own Flesch variant on top. Choose your audience (≈ CEFR B1, B2, C1, or your own ceiling); the status bar shows whether the note — or a selection — is on target. The side panel explains the verdict: per-section scores show which part of a long note drifts off target, longest sentences with click-to-jump, counts and reading time. Commands cover the score moments, including a report inserted as a callout; write the score into note properties and build Bases views over your whole vault. Only running text is measured: front matter, code, tables, URLs and tags are stripped first. Everything is computed locally. No network calls, no telemetry, no account. Free and GPL-3.0."

    stats: {
        downloads:  88
        updated_at: 1784331936000
    }
}
```

[^template]: [[Obsidian plugin]]
