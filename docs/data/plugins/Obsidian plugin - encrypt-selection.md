---
uid: 43f76b71-80bf-501f-9852-e46eda94f0a6
xid:
  - encrypt-selection
aliases:
  - encrypt-selection
  - Encrypt Selection
  - shockwave3301/encrypt-selection
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/encrypt-selection
alt:
  - https://github.com/shockwave3301/encrypt-selection
downloads: 43
updated at: "2026-07-31T20:15:47Z"
related to:
  - "[[GitHub - 1318297593]]"
remind me:
---

# Encrypt Selection

Encrypts a selected passage inside a note rather than the whole note or vault, replacing it with an opaque token while the surrounding text stays readable and searchable. Encryption is AES-256-GCM with PBKDF2 key derivation over 600,000 rounds; the password is held in memory until Obsidian closes and is never written to disk, with an optional hint and a confirmation field to catch typos. Decryption runs from anywhere inside the token, either as a peek that shows the text in a window without changing the file or in place for editing, and reading view renders a lock that decrypts on click. It has no dependencies, makes no network requests, sends no telemetry, and runs on desktop and mobile.

```cue
plugin: {
    id:     "encrypt-selection"
    name:   "Encrypt Selection"
    author: "Shockwave3301"
    repo:   "shockwave3301/encrypt-selection"

    html_url:    "https://community.obsidian.md/plugins/encrypt-selection"
    github_url:  "https://github.com/shockwave3301/encrypt-selection"
    description: "Encrypt and decrypt selected text in place with AES-256-GCM. No external tools, binaries or key files. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt one piece of text inside a note, not the whole note or vault. Highlight it, run Encrypt selection from the command palette, and type a password. It becomes an opaque token; the rest of the note stays readable and searchable. To read it back, put your cursor anywhere in the token and run Decrypt (peek). The text appears in a window; the note is never changed. Use Decrypt in place only when you want to edit it. Features: - AES-256-GCM encryption with PBKDF2 key derivation, 600,000 rounds - Peek mode reads your text without writing it back to disk - Works from the cursor; no need to select the token precisely - Reading view shows a lock you click to decrypt, not a wall of base64 - Password held in memory until Obsidian closes, never saved to disk - Optional hint and a confirm field to catch typos - No dependencies, no network requests, no telemetry - Works on desktop and mobile Lose the password and the text is gone for good."

    stats: {
        downloads:  43
        updated_at: 1785528947000
    }
}
```

[^template]: [[Obsidian plugin]]
