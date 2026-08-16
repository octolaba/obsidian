---
uid: 892c3eeb-55c5-50eb-9e5f-94440ab0cc07
xid:
  - logstravaganza
aliases:
  - logstravaganza
  - Logstravaganza
  - czottmann/obsidian-logstravaganza
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/logstravaganza
alt:
  - https://github.com/czottmann/obsidian-logstravaganza
downloads: 11879
updated at: "2025-11-18T12:40:07Z"
related to:
  - "[[GitHub - 638505184]]"
remind me:
---

# Logstravaganza

Proxies console calls so that log messages and uncaught exceptions, including async and promise errors on the main thread, are copied into a note in the vault. Entries are written as NDJSON, a Markdown table or code blocks, and filenames are device-stamped, which the recorded text presents as simplifying the collecting and sharing of debug output.

```cue
plugin: {
    id:     "logstravaganza"
    name:   "Logstravaganza"
    author: "Carlo Zottmann"
    repo:   "czottmann/obsidian-logstravaganza"

    html_url:    "https://community.obsidian.md/plugins/logstravaganza"
    github_url:  "https://github.com/czottmann/obsidian-logstravaganza"
    description: "A simple proxy for `console.*()` calls which copies log messages and uncaught exceptions to a note."
    about:       "Log all console output and uncaught exceptions (including async/promise errors on the main thread) to a file in your vault. Write logs as NDJSON, Markdown table, or code-block entries with device-stamped filenames to simplify collecting and sharing debug output."

    stats: {
        downloads:  11879
        updated_at: 1763469607000
    }
}
```

[^template]: [[Obsidian plugin]]
