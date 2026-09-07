---
uid: 86a6107c-9b90-5627-ab44-b09988ea690f
xid:
  - codex-session-archive
aliases:
  - codex-session-archive
  - Codex Session Archive
  - nicklennonliu/obsidian-codex-session-archive
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/codex-session-archive
alt:
  - https://github.com/nicklennonliu/obsidian-codex-session-archive
downloads: 159
updated at: "2026-06-30T12:45:06Z"
related to:
  - "[[GitHub - 1283044169]]"
remind me:
---

# Codex Session Archive

Codex Session Archive exports local Codex JSONL session logs into Markdown notes, grouped by workdir or project and carrying frontmatter with the session id, project, cwd, source path and tags. Base64 data images are extracted into a media folder and linked in a way that tolerates spaces, and sessions already exported are skipped unless overwriting is requested. The plugin is desktop-only.

```cue
plugin: {
    id:     "codex-session-archive"
    name:   "Codex Session Archive"
    author: "river"
    repo:   "nicklennonliu/obsidian-codex-session-archive"

    html_url:    "https://community.obsidian.md/plugins/codex-session-archive"
    github_url:  "https://github.com/nicklennonliu/obsidian-codex-session-archive"
    description: "Export local Codex archived sessions to Markdown notes grouped by workspace. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Export local Codex JSONL session logs to Markdown notes in your vault, grouped by workdir/project and enriched with frontmatter (session id, project, cwd, source path, tags). Extract data:image;base64 images to a media/ folder and write image links that handle spaces; skip already-exported sessions unless overwritten. Desktop-only."

    stats: {
        downloads:  159
        updated_at: 1782823506000
    }
}
```

[^template]: [[Obsidian plugin]]
