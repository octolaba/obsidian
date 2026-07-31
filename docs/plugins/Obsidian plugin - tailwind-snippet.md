---
uid: 6952bfca-9bb5-5a6c-af50-e195f971cb64
xid:
  - tailwind-snippet
aliases:
  - tailwind-snippet
  - Tailwind Snippet
  - nicholas-wilcox/tailwind-snippet-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tailwind-snippet
alt:
  - https://github.com/nicholas-wilcox/tailwind-snippet-obsidian-plugin
downloads: 1170
updated at: "2025-02-23T15:08:46Z"
related to:
  - "[[GitHub - 655715605]]"
remind me:
---

# Tailwind Snippet

Tailwind Snippet generates a Tailwind v3 CSS snippet from the vault, running Tailwind as a PostCSS plugin and writing the result into the snippets directory so utility classes can be used in note markup. The snippet is updated automatically when files or settings change, and a manual refresh is available from the ribbon icon. Once created, the snippet still has to be enabled by hand.

```cue
plugin: {
    id:     "tailwind-snippet"
    name:   "Tailwind Snippet"
    author: "nicholas-wilcox"
    repo:   "nicholas-wilcox/tailwind-snippet-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/tailwind-snippet"
    github_url:  "https://github.com/nicholas-wilcox/tailwind-snippet-obsidian-plugin"
    description: "Use TailwindCSS utility classes in your markup."
    about:       "Generate a Tailwind v3 CSS snippet from your vault using Tailwind as a PostCSS plugin and save it to your snippets directory. Auto-update the snippet when files or settings change, trigger manual refreshes with the ribbon icon, and enable the snippet manually once created."

    stats: {
        downloads:  1170
        updated_at: 1740323326000
    }
}
```

[^template]: [[Obsidian plugin]]
