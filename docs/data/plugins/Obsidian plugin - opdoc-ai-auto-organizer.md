---
uid: daae6bcc-4916-5eba-9263-902c90a8b70f
xid:
  - opdoc-ai-auto-organizer
aliases:
  - opdoc-ai-auto-organizer
  - OpDoc AI Auto Organizer
  - rklpoi5678/OpDoc-AI-Auto-Organizer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/opdoc-ai-auto-organizer
alt:
  - https://github.com/rklpoi5678/OpDoc-AI-Auto-Organizer
downloads: 292
updated at: "2026-05-20T10:42:50Z"
related to:
  - "[[GitHub - 1226362783]]"
remind me:
---

# OpDoc AI Auto Organizer

OpDoc AI Auto Organizer processes notes dropped into an inbox folder with a local Ollama model or OpenAI: it analyses the content, injects tags into frontmatter and moves the file to the matching folder. Folder matching uses embedding-based similarity, every action is logged to OpDoc-Log.md, and failures are retried with collision-safe renaming.

```cue
plugin: {
    id:     "opdoc-ai-auto-organizer"
    name:   "OpDoc AI Auto Organizer"
    author: "rklpoi5678"
    repo:   "rklpoi5678/OpDoc-AI-Auto-Organizer"

    html_url:    "https://community.obsidian.md/plugins/opdoc-ai-auto-organizer"
    github_url:  "https://github.com/rklpoi5678/OpDoc-AI-Auto-Organizer"
    description: "Zero-cloud, privacy-first note organizer. Drop files in your Inbox, and let local AI (Ollama) automatically tag and move them to the right folders. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Organize new notes dropped into an Inbox folder with AI (Ollama or OpenAI): analyze content, inject tags into frontmatter, and move files to the correct folder. Match notes to folders via embedding-based similarity, log actions to OpDoc-Log.md, and retry on failures with collision-safe renaming."

    stats: {
        downloads:  292
        updated_at: 1779273770000
    }
}
```

[^template]: [[Obsidian plugin]]
