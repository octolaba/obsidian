---
uid: f68bf1ce-177a-551a-a7a1-9565655d4df4
xid:
  - nanalstamp
aliases:
  - nanalstamp
  - nanalStamp
  - hskwak82/nanalstamp-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nanalstamp
alt:
  - https://github.com/hskwak82/nanalstamp-obsidian
downloads: 1
updated at: "2026-08-11T10:03:40Z"
related to:
  - "[[GitHub - 1307200851]]"
remind me:
---

# nanalStamp

Seals notes with timestamps anchored to the Bitcoin blockchain by sending only on-device SHA-256 hashes, so note contents and file names stay on the machine. Each note accumulates a hash-chained, signed, OpenTimestamps-anchored history offered as proof of existence and of a continuous edit history, and a proof can be checked with standard open-source tools without trusting the nanalStamp server. Sealing happens automatically as notes settle, and a free local git archive keeps a restorable backup of every sealed version. Paid plans add encrypted storage of the original files, PDF certificates, submission packages and team features.

```cue
plugin: {
    id:     "nanalstamp"
    name:   "nanalStamp"
    author: "HanSeop Kwak"
    repo:   "hskwak82/nanalstamp-obsidian"

    html_url:    "https://community.obsidian.md/plugins/nanalstamp"
    github_url:  "https://github.com/hskwak82/nanalstamp-obsidian"
    description: "Seals each note with a tamper-proof, content-private timestamp anchored to Bitcoin — proof of existence and an unbroken edit history for your research notes, day by day. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Seal notes with tamper-proof timestamps anchored to the Bitcoin blockchain by sending only on-device SHA-256 hashes — your content, and even readable file names, never leave your device. Each note builds a hash-chained, signed, OpenTimestamps-anchored history: proof of existence plus proof of a continuous edit history that cannot be back-dated or assembled after the fact. Verification is independent — anyone can check a proof with standard open-source tools, without trusting the nanalStamp server. Sealing is automatic: notes are sealed as they settle while you write, and a free local git archive keeps a backup of every sealed version — version history you can restore, even deleted notes. Optional paid plans add encrypted original-file storage, PDF certificates, submission packages for audits and disputes, and team features for research groups. Built for research notes, lab notebooks, invention records, and journals — evidence you can only start building today, never retroactively."

    stats: {
        downloads:  1
        updated_at: 1786442620000
    }
}
```

[^template]: [[Obsidian plugin]]
