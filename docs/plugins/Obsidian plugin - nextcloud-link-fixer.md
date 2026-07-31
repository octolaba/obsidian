---
uid: 8994213f-19ee-5380-b5fe-fb83cbf18c61
xid:
  - nextcloud-link-fixer
aliases:
  - nextcloud-link-fixer
  - Nextcloud Link Fixer
  - kfreon/nextcloud-link-fixer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nextcloud-link-fixer
alt:
  - https://github.com/kfreon/nextcloud-link-fixer
downloads: 1081
updated at: "2024-04-02T11:21:21Z"
related to:
  - "[[GitHub - 780893953]]"
remind me:
---

# Nextcloud Link Fixer

Nextcloud Link Fixer repairs wiki-links that Nextcloud Text has escaped, restoring the escaped form to ordinary wiki-link syntax. The fix-wiki-links command runs the repair by hand, or the plugin can correct links automatically when a file is opened.

```cue
plugin: {
    id:     "nextcloud-link-fixer"
    name:   "Nextcloud Link Fixer"
    author: "kfreon"
    repo:   "kfreon/nextcloud-link-fixer"

    html_url:    "https://community.obsidian.md/plugins/nextcloud-link-fixer"
    github_url:  "https://github.com/kfreon/nextcloud-link-fixer"
    description: "Nextcloud breaks Wiki-links. This fixes them."
    about:       "Fix wiki-style links that Nextcloud Text escapes (e.g. \\[\\[note\\]\\]) by restoring proper [[note]] syntax. Run the fix-wiki-links command for manual correction or let it automatically repair links when opening files."

    stats: {
        downloads:  1081
        updated_at: 1712056881000
    }
}
```

[^template]: [[Obsidian plugin]]
