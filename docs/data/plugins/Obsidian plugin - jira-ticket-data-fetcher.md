---
uid: 65cc3ab7-3991-5924-8c39-4ddcd114f3e0
xid:
  - jira-ticket-data-fetcher
aliases:
  - jira-ticket-data-fetcher
  - Jira Ticket Data Fetcher
  - ghostdrift/JiraTicketObsidianPlugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/jira-ticket-data-fetcher
alt:
  - https://github.com/ghostdrift/JiraTicketObsidianPlugin
downloads: 90
updated at: "2026-06-27T05:22:24Z"
related to:
  - "[[GitHub - 1227386484]]"
remind me:
---

# Jira Ticket Data Fetcher

Jira Ticket Data Fetcher fetches Jira issue fields into a note's frontmatter, taking the issue key from the note basename. Which Jira field maps to which frontmatter key is configurable, and note aliases are built from the mapped values through customizable templates. The Jira issue URL can also be inserted into the note content.

```cue
plugin: {
    id:     "jira-ticket-data-fetcher"
    name:   "Jira Ticket Data Fetcher"
    author: "Jessica Crowson"
    repo:   "ghostdrift/JiraTicketObsidianPlugin"

    html_url:    "https://community.obsidian.md/plugins/jira-ticket-data-fetcher"
    github_url:  "https://github.com/ghostdrift/JiraTicketObsidianPlugin"
    description: "Fetches data for Jira tickets directly from Obsidian. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Fetch Jira issue fields into note frontmatter using the note basename as the issue key. Map Jira fields to frontmatter keys and build note aliases from mapped values using customizable templates. Insert the Jira issue URL into note content when needed."

    stats: {
        downloads:  90
        updated_at: 1782537744000
    }
}
```

[^template]: [[Obsidian plugin]]
