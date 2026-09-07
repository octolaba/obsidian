---
uid: cdbbd7df-7887-53e3-9df8-8a54735df674
xid:
  - azure-devops-workitems
aliases:
  - azure-devops-workitems
  - Azure DevOps Work Items
  - fvandillen/obsidian-azure-devops-workitems
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/azure-devops-workitems
alt:
  - https://github.com/fvandillen/obsidian-azure-devops-workitems
downloads: 29
updated at: "2026-08-03T13:38:58Z"
related to:
  - "[[GitHub - 1321691863]]"
remind me:
---

# Azure DevOps Work Items

References Azure DevOps work items in notes, typed with an az# trigger or by pasting a work item URL, keeping a plain Markdown link in the file while rendering a chip that shows type, id, title and state. Inline autocomplete, a command picker and hover cards with assignee, iteration, tags and a snippet are included. Authentication uses a personal access token, Microsoft Entra sign-in, or an existing az login session.

```cue
plugin: {
    id:     "azure-devops-workitems"
    name:   "Azure DevOps Work Items"
    author: "Florian van Dillen"
    repo:   "fvandillen/obsidian-azure-devops-workitems"

    html_url:    "https://community.obsidian.md/plugins/azure-devops-workitems"
    github_url:  "https://github.com/fvandillen/obsidian-azure-devops-workitems"
    description: "Reference Azure DevOps work items inline. Type a trigger, search, and drop a rich work item chip into your note. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Reference Azure DevOps work items in notes using az# or by pasting a work item URL, keeping plain Markdown links while rendering rich chips with type, id, title and state. Use inline autocomplete, a command-picker and hover cards showing assignee, iteration, tags and a snippet. Authenticate with a PAT, Microsoft Entra sign-in, or an existing az login."

    stats: {
        downloads:  29
        updated_at: 1785764338000
    }
}
```

[^template]: [[Obsidian plugin]]
