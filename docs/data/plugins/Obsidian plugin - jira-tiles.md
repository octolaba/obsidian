---
uid: 1df87db3-023a-5fc9-be79-c89426588d1c
xid:
  - jira-tiles
aliases:
  - jira-tiles
  - Jira Tiles
  - sshah7433/obsidian-jira-tiles
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/jira-tiles
alt:
  - https://github.com/sshah7433/obsidian-jira-tiles
downloads: 84
updated at: "2026-06-26T18:56:33Z"
related to:
  - "[[GitHub - 1280304634]]"
remind me:
---

# Jira Tiles

Jira Tiles embeds live Atlassian Jira Cloud issues as tiles in a note, written as fenced code blocks or produced from auto-linked issue URLs. A tile shows the issue icon, summary, status, priority, due date and fix versions, assignee, custom fields, the fetch timestamp, a refresh control and a button that opens the issue in Jira. API tokens are stored in SecretStorage, Jira fields can be discovered, responses use TTL caching with an offline fallback, and tiles reflow for mobile.

```cue
plugin: {
    id:     "jira-tiles"
    name:   "Jira Tiles"
    author: "Sidd Shah"
    repo:   "sshah7433/obsidian-jira-tiles"

    html_url:    "https://community.obsidian.md/plugins/jira-tiles"
    github_url:  "https://github.com/sshah7433/obsidian-jira-tiles"
    description: "Embed live Atlassian Jira Cloud issues as rich tiles in your notes via code blocks or auto-linked issue URLs. Mobile-friendly. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed live Jira issue tiles in notes via fenced code blocks to show issue icon, bold summary, status, priority, due date & fix versions, assignee, custom fields, fetch timestamp, refresh control and an Open in Jira button. Store Atlassian Cloud API tokens in SecretStorage, discover Jira fields, and use TTL caching with offline fallback; tiles reflow for mobile."

    stats: {
        downloads:  84
        updated_at: 1782500193000
    }
}
```

[^template]: [[Obsidian plugin]]
