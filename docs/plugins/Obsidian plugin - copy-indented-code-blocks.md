---
uid: fb152888-a16a-502d-be5c-8314e046bd82
xid:
  - copy-indented-code-blocks
aliases:
  - copy-indented-code-blocks
  - Copy Indented Code Blocks
  - gvivster/obsidian-copy-indented-code-blocks
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/copy-indented-code-blocks
alt:
  - https://github.com/gvivster/obsidian-copy-indented-code-blocks
downloads: 19
updated at: "2025-11-06T00:39:32Z"
related to:
  - "[[GitHub - 1090644746]]"
remind me:
---

# Copy Indented Code Blocks

This plugin removes the leading indentation of a code block that sits inside a list when its contents are copied. It detects the block's exact leading whitespace and strips it from each line while preserving indentation inside the code, so the pasted result carries no unwanted leading spaces.

```cue
plugin: {
    id:     "copy-indented-code-blocks"
    name:   "Copy Indented Code Blocks"
    author: "Evie Hartman"
    repo:   "gvivster/obsidian-copy-indented-code-blocks"

    html_url:    "https://community.obsidian.md/plugins/copy-indented-code-blocks"
    github_url:  "https://github.com/gvivster/obsidian-copy-indented-code-blocks"
    description: "Removes leading indentation when copying from indented code blocks. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Copy indented code blocks without their list indentation so pasted code has no unwanted leading spaces. Detect and remove the block’s exact leading whitespace from each line while preserving internal indentation, letting you fold code blocks inside lists cleanly."

    stats: {
        downloads:  19
        updated_at: 1762389572000
    }
}
```

[^template]: [[Obsidian plugin]]
