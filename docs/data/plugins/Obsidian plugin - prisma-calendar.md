---
uid: c5fbb811-7d7c-56cf-a687-77088845a8bf
xid:
  - prisma-calendar
aliases:
  - prisma-calendar
  - Prisma Calendar
  - real1tyy/Prisma-Calendar
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/prisma-calendar
alt:
  - https://github.com/real1tyy/Prisma-Calendar
downloads: 25431
updated at: "2026-08-04T20:46:43Z"
related to:
  - "[[GitHub - 1059267284]]"
remind me:
---

# Prisma Calendar

Reads the notes in a chosen folder and turns those carrying date properties into events: Start and End datetime values give timed events, a Date value gives an all-day event, and the property names are chosen during setup. Existing notes with date-like properties are picked up as they are, so no schema, migration or restructuring is imposed. Every event stays an ordinary note that can be opened, written in, and linked like any other file.

```cue
plugin: {
    id:     "prisma-calendar"
    name:   "Prisma Calendar"
    author: "Matej Vavro Productivity"
    repo:   "real1tyy/Prisma-Calendar"

    html_url:    "https://community.obsidian.md/plugins/prisma-calendar"
    github_url:  "https://github.com/real1tyy/Prisma-Calendar"
    description: "Prisma turns any note with a date into a flexible planning system inside Obsidian. There are no rigid schemas or predefined structures — just your data, your rules, fully under your control. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Prisma is not just a calendar plugin. It turns any note with a date into a flexible planning system inside Obsidian. There are no rigid schemas or predefined structures — just your data, your rules, fully under your control. It lets you see your entire vault through time. Prisma reads notes inside a folder you choose and turns them into events based on their frontmatter properties: Start / End — datetime values for timed events (e.g. Start: 2025-06-15T09:00) Date — a date value for all-day events (e.g. Date: 2025-06-15) You choose which property names Prisma should look for during setup. If you already have notes with date-like properties, Prisma picks them up and visualizes them automatically — no migration, no restructuring, no new system to learn. Every event is a regular Obsidian note. You can open it, write inside it, link to other notes, and use it like any other file in your vault. Prisma doesn't own your data — it just visualizes what's already there."

    stats: {
        downloads:  25431
        updated_at: 1785876403000
    }
}
```

[^template]: [[Obsidian plugin]]
