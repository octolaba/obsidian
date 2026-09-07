---
uid: 63d37178-57ca-5a92-9d15-b4aae0a222ce
xid:
  - scuttlebutt
aliases:
  - scuttlebutt
  - Scuttlebutt
  - qkm2000/Scuttlebutt
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/scuttlebutt
alt:
  - https://github.com/qkm2000/Scuttlebutt
downloads: 45
updated at: "2026-07-27T08:13:30Z"
related to:
  - "[[GitHub - 1310893629]]"
remind me:
---

# Scuttlebutt

Scuttlebutt records meeting audio in the sidebar or imports an existing clip, transcribes it against an OpenAI-compatible Whisper or vLLM endpoint you configure, and summarizes the transcript with your local LLM. The summary, the transcript and your own memo are reviewed side by side, the auto-generated title and tags can be adjusted, reusing tags already present in the vault, and context notes steer the summary. The result is saved as one note with an overview and clean sections, date, tags and participants in the frontmatter and the full transcript in a collapsible callout, running only against endpoints you configure, with no cloud service and no account.

```cue
plugin: {
    id:     "scuttlebutt"
    name:   "Scuttlebutt"
    author: "Quek Kar Min"
    repo:   "qkm2000/Scuttlebutt"

    html_url:    "https://community.obsidian.md/plugins/scuttlebutt"
    github_url:  "https://github.com/qkm2000/Scuttlebutt"
    description: "Scuttlebutt - Record or import meeting audio in the sidebar, transcribe it with your local Whisper/vLLM server, then auto-summarize it into a tidy, tagged note. Fully local and private. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Scuttlebutt turns your meetings into notes without leaving your vault. Record straight from the sidebar or import an existing clip, and it transcribes the audio against your own OpenAI-compatible Whisper/vLLM endpoint, then auto-summarizes the transcript with your local LLM. Review the summary, transcript, and your own memo side by side; tweak the auto-generated title and tags (it reuses tags you already have); and add context notes to steer the summary. Save one tidy note: an overview plus clean sections, with date, tags, and participants in the frontmatter and the full transcript tucked into a collapsible callout. Everything runs against endpoints you configure — local-first and private, with no cloud and no accounts. Inspired by anarlog."

    stats: {
        downloads:  45
        updated_at: 1785140010000
    }
}
```

[^template]: [[Obsidian plugin]]
