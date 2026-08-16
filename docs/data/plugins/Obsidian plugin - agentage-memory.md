---
uid: eadff96d-eccc-5471-a9dc-2aa22ce56913
xid:
  - agentage-memory
aliases:
  - agentage-memory
  - Agentage Sync
  - agentage/obsidian-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/agentage-memory
alt:
  - https://github.com/agentage/obsidian-sync
downloads: 476
updated at: "2026-08-03T07:34:54Z"
related to:
  - "[[GitHub - 1249594461]]"
remind me:
---

# Agentage Sync

Agentage Sync keeps the vault in two-way sync with a hosted memory over Git, so MCP clients such as Claude, ChatGPT or Cursor can read and write notes without them being pasted in. Notes stay plain Markdown that can be exported at any time, a status indicator shows the current state, concurrent edits merge, and a real conflict is flagged in a note rather than dropped silently. It requires an account with OAuth sign-in, connects to an EU-based hosted service, is desktop only for now, and includes up to 100 MB of memory.

```cue
plugin: {
    id:     "agentage-memory"
    name:   "Agentage Sync"
    author: "Agentage"
    repo:   "agentage/obsidian-sync"

    html_url:    "https://community.obsidian.md/plugins/agentage-memory"
    github_url:  "https://github.com/agentage/obsidian-sync"
    description: "Let Claude, ChatGPT, Cursor, and any MCP client read and write your Obsidian vault. Two-way Git sync to a private memory, safe merges with    flagged conflicts, plain Markdown you own, up to 100 MB - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Keep writing in Obsidian, and let the AI tools you already use pick up where you left off. Ask Claude, ChatGPT, or Cursor about any note in your vault without pasting it in first. Agentage Sync keeps your vault in two-way sync with a hosted memory, so any MCP client can read and write your notes. Your notes stay plain Markdown you own and can export anytime. Sync runs over Git, a status indicator shows the current state, and concurrent edits merge safely. A real conflict is flagged in a note, never dropped silently. You choose which memory your vault syncs to. Please note: - An account is required. Sign in once with OAuth; the token lives in Obsidian's encrypted storage, never in your notes. - This connects over the network to Agentage's hosted service (EU-based). - Desktop only for now. - Up to 100 MB of memory is included."

    stats: {
        downloads:  476
        updated_at: 1785742494000
    }
}
```

[^template]: [[Obsidian plugin]]
