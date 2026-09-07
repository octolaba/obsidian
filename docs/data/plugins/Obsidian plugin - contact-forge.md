---
uid: dc5443cf-6090-572c-9ce3-fdb33f9a4bc5
xid:
  - contact-forge
aliases:
  - contact-forge
  - Contact Forge
  - raulanatol/obsidian-contact-forge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/contact-forge
alt:
  - https://github.com/raulanatol/obsidian-contact-forge
downloads: 43
updated at: "2026-07-03T16:36:03Z"
related to:
  - "[[GitHub - 1287081766]]"
remind me:
---

# Contact Forge

Contact Forge treats Obsidian notes as the source of truth for contacts and syncs a chosen subset one-way to macOS Contacts. It pushes only managed fields such as name, organisation, emails and phone numbers, leaving photos, unmanaged fields and the note body untouched. Cards are stamped with a cf-uid and an obsidian:// backlink so matches survive, and every run reports desync in a Sync Report and asks for confirmation before writing.

```cue
plugin: {
    id:     "contact-forge"
    name:   "Contact Forge"
    author: "@raulanatol"
    repo:   "raulanatol/obsidian-contact-forge"

    html_url:    "https://community.obsidian.md/plugins/contact-forge"
    github_url:  "https://github.com/raulanatol/obsidian-contact-forge"
    description: "Obsidian is the source of truth for your contacts; sync a chosen subset one-way to macOS Contacts, with desync alerts. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync selected Obsidian contact notes one-way to macOS Contacts, pushing only managed fields (name, org, emails, phones) while keeping the note body and full record in Obsidian. Stamp cards with a cf-uid and obsidian:// backlink to preserve matches, show per-run desync alerts in a Sync Report, and require confirmation before writing; photos and unmanaged fields stay untouched."

    stats: {
        downloads:  43
        updated_at: 1783096563000
    }
}
```

[^template]: [[Obsidian plugin]]
