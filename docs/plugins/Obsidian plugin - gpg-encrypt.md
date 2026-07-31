---
uid: 9edff731-ee62-5bb5-ab98-959ac3d46159
xid:
  - gpg-encrypt
aliases:
  - gpg-encrypt
  - GPG Encrypt
  - lajg-dev/Obsidian-Plugin-GPG-Inline-Encrypt
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gpg-encrypt
alt:
  - https://github.com/lajg-dev/Obsidian-Plugin-GPG-Inline-Encrypt
downloads: 3215
updated at: "2026-05-30T22:57:46Z"
related to:
  - "[[GitHub - 739091759]]"
remind me:
---

# GPG Encrypt

Encrypts selected text or an entire note using the GPG executable installed on the system. Recipient keys are chosen from the operating system keyring, and the encrypted output can optionally be signed with a private key. Both inline encryption of a selected block and full-document encryption run through native GPG, including with security keys such as YubiKey.

```cue
plugin: {
    id:     "gpg-encrypt"
    name:   "GPG Encrypt"
    author: "lajg-dev"
    repo:   "lajg-dev/Obsidian-Plugin-GPG-Inline-Encrypt"

    html_url:    "https://community.obsidian.md/plugins/gpg-encrypt"
    github_url:  "https://github.com/lajg-dev/Obsidian-Plugin-GPG-Inline-Encrypt"
    description: "Encrypt partial text or complete notes using GPG technology, it is compatible with security keys such as YubiKey or traditional GPG encryption methods"
    about:       "Encrypt selected text or entire notes using the GPG executable installed on your system. Select recipient keys from your OS keyring and optionally sign the encrypted output with your private key. Perform inline (selected block) or full-document encryption via native GPG."

    stats: {
        downloads:  3215
        updated_at: 1780181866000
    }
}
```

[^template]: [[Obsidian plugin]]
