---
uid: 6b0623e5-8f4a-560a-b977-2306efb9edc6
xid:
  - copy-as-rich-url
aliases:
  - copy-as-rich-url
  - Copy as Rich URL
  - brianling/obsidian-copy-as-rich-url
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/copy-as-rich-url
alt:
  - https://github.com/brianling/obsidian-copy-as-rich-url
downloads: 121
updated at: "2026-05-21T09:35:17Z"
related to:
  - "[[GitHub - 1245486926]]"
remind me:
---

# Copy as Rich URL

Copy as Rich URL copies the current note to the system clipboard as a rich hyperlink. It writes both an HTML flavour containing an anchor and a plain-text flavour, so rich-text editors paste a single clickable link with the note title as its anchor text while plain-text editors receive the title and the URL on separate lines. It is invoked from the left ribbon icon, the command palette or a custom hotkey, and is aimed at cross-linking tools such as FuseBase, Notion, Confluence, Slack and Gmail back to notes.

```cue
plugin: {
    id:     "copy-as-rich-url"
    name:   "Copy as Rich URL"
    author: "brianling"
    repo:   "brianling/obsidian-copy-as-rich-url"

    html_url:    "https://community.obsidian.md/plugins/copy-as-rich-url"
    github_url:  "https://github.com/brianling/obsidian-copy-as-rich-url"
    description: "Copy the current note as a rich hyperlink to the clipboard. Pastes as a single clickable link in rich-text editors like FuseBase, Notion, and Confluence. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Copy the current note as a rich hyperlink to the system clipboard. The plugin writes both text/html (with a proper anchor tag) and text/plain, so rich-text editors paste a single clickable link with the note title as anchor text, while plain-text editors get the title and URL on separate lines. Invoke via the left ribbon icon, the command palette, or a custom hotkey. Useful for cross-linking knowledge bases like FuseBase, Notion, Confluence, Slack, and Gmail back to your notes."

    stats: {
        downloads:  121
        updated_at: 1779356117000
    }
}
```

[^template]: [[Obsidian plugin]]
