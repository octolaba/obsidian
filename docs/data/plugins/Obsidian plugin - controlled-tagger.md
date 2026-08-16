---
uid: 8d065da7-3488-5d8d-a88f-fc4a43a893a9
xid:
  - controlled-tagger
aliases:
  - controlled-tagger
  - Controlled Tagger
  - yuriyagn/controlled-tagger
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/controlled-tagger
alt:
  - https://github.com/yuriyagn/controlled-tagger
downloads: 37
updated at: "2026-08-02T15:51:14Z"
related to:
  - "[[GitHub - 1319179777]]"
remind me:
---

# Controlled Tagger

Suggests tags for a note using OpenAI-compatible models, drawing only from a local, user-managed whitelist and requiring confirmation before anything is written to the note. The whitelist check is enforced locally, so tags invented by the model are blocked. Hierarchical tag libraries can be managed and imported, several models configured, and operations stay local with no telemetry.

```cue
plugin: {
    id:     "controlled-tagger"
    name:   "Controlled Tagger"
    author: "Yu Rui"
    repo:   "yuriyagn/controlled-tagger"

    html_url:    "https://community.obsidian.md/plugins/controlled-tagger"
    github_url:  "https://github.com/yuriyagn/controlled-tagger"
    description: "Suggest, review, and manage controlled tags with OpenAI-compatible models. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Recommend tags from a local, user-managed whitelist with OpenAI-compatible models and require your confirmation before writing tags to a note. Enforce local whitelist checks to block model-invented tags, manage/import hierarchical tag libraries, support multiple models, and keep operations local with no telemetry."

    stats: {
        downloads:  37
        updated_at: 1785685874000
    }
}
```

[^template]: [[Obsidian plugin]]
