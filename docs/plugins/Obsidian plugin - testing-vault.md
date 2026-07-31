---
uid: 766a357c-9404-5ebb-9201-52e0b01f45c4
xid:
  - testing-vault
aliases:
  - testing-vault
  - Testing Vault
  - pedersen/obsidian-testing-vault
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/testing-vault
alt:
  - https://github.com/pedersen/obsidian-testing-vault
downloads: 4072
updated at: "2023-03-28T14:40:50Z"
related to:
  - "[[GitHub - 588233303]]"
remind me:
---

# Testing Vault

Testing Vault generates randomized content and whole test vaults of Lorem Ipsum notes to exercise plugins, renderers or analytics. Single notes or batches of up to ten thousand interconnected notes are created, with links, frontmatter, tags, orphan and leaf notes. A command also wipes the entire vault, and the recorded inputs warn that this deletion is immediate and destructive, so it should not be run in a vault you care about.

```cue
plugin: {
    id:     "testing-vault"
    name:   "Testing Vault"
    author: "pedersen"
    repo:   "pedersen/obsidian-testing-vault"

    html_url:    "https://community.obsidian.md/plugins/testing-vault"
    github_url:  "https://github.com/pedersen/obsidian-testing-vault"
    description: "Randomized vault generator with links between notes, frontmatter, tags, orphan and leaf notes."
    about:       "Generate randomized test content and entire test vaults filled with Lorem Ipsum notes to exercise plugins, renderers, or analytics. Create single notes or batches of interconnected notes (up to 10,000), or wipe the entire vault instantly — deletion is immediate and destructive, so do not run in a vault you care about."

    stats: {
        downloads:  4072
        updated_at: 1680014450000
    }
}
```

[^template]: [[Obsidian plugin]]
