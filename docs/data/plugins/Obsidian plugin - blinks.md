---
uid: ce5fa851-b86f-5fd2-af54-dc5072700b1a
xid:
  - blinks
aliases:
  - blinks
  - Blinks
  - diagonalcounty/blinks
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/blinks
alt:
  - https://github.com/diagonalcounty/blinks
downloads: 74
updated at: "2026-07-11T22:10:16Z"
related to:
  - "[[GitHub - 1297813293]]"
remind me:
---

# Blinks

Blinks changes how block links are written: after picking a note with the ordinary link autocomplete, a doubled caret typed before the closing brackets opens a phrase search over that note. Results show section context and a short preview, and choosing a block inserts a standard Obsidian block link with a readable slug id, writing that id onto the target line if it is not there yet. The recorded inputs present this as an alternative to random opaque block ids that are hard to remember and noisy in git.

```cue
plugin: {
    id:     "blinks"
    name:   "Blinks"
    author: "diagonalcounty"
    repo:   "diagonalcounty/blinks"

    html_url:    "https://community.obsidian.md/plugins/blinks"
    github_url:  "https://github.com/diagonalcounty/blinks"
    description: "Block links that don't make you type #^fa5d4c and pretend you meant it. [[note^^ → phrase search → readable ^slugs. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Blinks makes linking to a specific paragraph feel like something a human would design—not a scavenger hunt ending in #^fa5d4c. The problem Obsidian’s file picker is great. Everything after that is awkward. You remember the words (“Chrissy delivered beds,” “the problem,” “reunion rocks”), not a random block id. Native block search is token-y, opaque ids are painful in git, and the usual flow—pick a note, get stuck with ]], back up, type #^—breaks your train of thought. What Blinks does 1. Pick a note the normal way with [[ (Tab or click—yes, even when Obsidian closes the link with ]]). 2. Move before the closing brackets and type ^^. 3. Search that note by phrase. Results show section context + a short preview. 4. Pick a block. Blinks inserts a real Obsidian block link with a readable id, e.g. [[Note#^current-people-bios-have|bios]] and writes ^current-people-bios-have on the target line if it isn’t there yet. Those are standard #^ block links.. don't worry. ;-)"

    stats: {
        downloads:  74
        updated_at: 1783807816000
    }
}
```

[^template]: [[Obsidian plugin]]
