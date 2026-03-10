# Reference: the data model — what a query can actually see

How text in a vault becomes values a query can reach, at `blacksmithgu/obsidian-dataview` tag
`0.5.70`. Citations are `path:line` in that repository. Most wrong-results reports are decided here,
not in the query.

## Contents

1. [The indexing pipeline](#1-the-indexing-pipeline)
2. [Frontmatter](#2-frontmatter)
3. [Inline fields](#3-inline-fields)
4. [Field names](#4-field-names)
5. [Implicit page fields](#5-implicit-page-fields-file)
6. [Tasks and list items](#6-tasks-and-list-items)
7. [Index structures and their asymmetries](#7-index-structures-and-their-asymmetries)
8. [Field troubleshooting checklist](#8-quick-checklist-when-a-field-isnt-there)

---

## 1. The indexing pipeline

```
Obsidian MetadataCache (frontmatter, frontmatterLinks, tags, links, embeds, sections,
                        headings, listItems)
        │
        │  events: metadataCache "resolve" → reload; vault "rename"/"delete"  (src/data-index/index.ts:97)
        ▼
FileImporter — 2 web workers                    (src/data-index/index.ts:74)
        │
        ▼
parsePage(path, contents, stat, metadata)       (src/data-import/markdown-file.ts:13)
        │  frontmatter → fields (re-typed)
        │  tags, aliases extracted
        │  markdown scanned line-by-line for `key:: value`
        │  list items built from metadata.listItems + a regex on the raw line
        ▼
PageMetadata, canonicalized (links resolved to real paths)  (src/data-index/index.ts:225)
        ▼
FullIndex.pages / tags / etags / links / prefix    +  IndexedDB cache
```

Only `.md` and `.markdown` files are indexed (`src/data-index/index.ts:296`). Everything else —
canvases, PDFs, images — is invisible except as a link target.

**Cache.** Parsed metadata is persisted to IndexedDB keyed by app id and *plugin version*
(`src/data-import/persister.ts:20`). It is consulted only for the first load of a file after startup
and only if `cached.time >= file.stat.mtime` and the version matches (`src/data-index/index.ts:196`).
A plugin upgrade therefore forces a full reparse. **Drop all cached file metadata** (command
palette) plus **Force refresh all views** are the two recovery levers
(`src/main.ts:109`, `src/main.ts:118`).

**Revision.** Every finished import bumps `index.revision` and fires `dataview:refresh-views`,
debounced by `refreshInterval` (`src/data-index/index.ts:89`, `src/main.ts:184`).

---

## 2. Frontmatter

Every YAML key becomes a field. Values are **re-typed** by `parseFrontmatter`
(`src/data-import/markdown-file.ts:327`), recursively into arrays and objects:

| YAML | Dataview type |
|---|---|
| `42`, `4.5` | number |
| `true` / `false` | boolean |
| `[a, b]`, block lists | array |
| nested mapping | object |
| a JS `Date` from the YAML parser | **date, re-read in local time** — see §2.1 |
| string matching a full ISO date | date |
| string matching a full duration | duration |
| string matching `[[Link]]` / `![[Link]]` | link |
| anything else | string |
| `null`, empty value | null |

The retyping is **whole-string**: `2021-01-01` is a date, `2021-01-01 (approx)` is a string. It is
also eager, which surprises people: `version: 5 m` is a **duration of five minutes**;
`code: 3 d` is three days. YAML quoting does **not** stop this: Obsidian removes YAML quoting before
Dataview receives the string, and Dataview then reparses that string (`src/data-import/markdown-file.ts:354`).
Use a representation that does not parse wholly as a Dataview literal, such as `version: v5 m`, if
the value must remain text.

`position` is deleted from frontmatter before storage (`src/data-import/markdown-file.ts:73`).
The untouched YAML is still available as `file.frontmatter` (`src/data-model/markdown.ts:145`) —
the fastest way to see what Dataview was handed.

### 2.1 The unquoted-date timezone trap

`parseFrontmatter` has two paths for a date-looking value:

- a **string** → parsed as a local wall-clock date (`src/data-import/markdown-file.ts:355`);
- a **JS `Date`** → `DateTime.fromJSDate(value)`, which re-expresses a UTC instant in the **local**
  zone (`src/data-import/markdown-file.ts:338`).

If Obsidian's YAML parser hands over a `Date` for `due: 2021-06-15`, the stored value becomes
midnight UTC seen locally:

| Zone | Stored value | `due.day` | `due = date(2021-06-15)` |
|---|---|---|---|
| UTC | `2021-06-15T00:00` | 15 | true |
| `Europe/Moscow` (+3) | `2021-06-15T03:00` | 15 | **false** |
| `America/New_York` (−4) | `2021-06-14T20:00` | **14** | **false** |

Which path a given vault takes is decided by Obsidian, not Dataview — `FrontMatterCache` is typed
`[key: string]: any` (`obsidian-api@cc174432:obsidian.d.ts:3242`), and Obsidian's Properties
documentation shows date properties stored unquoted
(`obsidian-help@a97de34c:Editing and formatting/Properties.md:206`). *Unverified:* which Obsidian
versions yield `Date` objects.

**Diagnostic** — run beside a note that has an unquoted YAML date:

````text
```dataview
TABLE WITHOUT ID due, dateformat(due, "yyyy-MM-dd HH:mm ZZZZ") AS "as stored"
WHERE file.name = "The Note"
```
````

A non-midnight time, or a day one off from the file, means the `Date` path.
**Fix:** quote the value in YAML (`due: "2021-06-15"`), which forces the string path.

### 2.2 `tags` and `aliases` are special-cased

- Keys named `tag` or `tags`, any capitalisation, are split on commas **and whitespace**, then
  `#`-prefixed if needed (`src/data-import/markdown-file.ts:90`). So `tags: project urgent` yields
  two tags in `file.tags`/`file.etags`.
- Keys named `alias` or `aliases` populate `file.aliases`; string values are split on commas only
  (`src/data-import/markdown-file.ts:100`).

They are special-cased **in addition to**, not instead of, ordinary frontmatter import. `parsePage`
still adds every frontmatter key to the page fields (`src/data-import/markdown-file.ts:31`). A page
may therefore expose all three:

- `tags` — the original, retyped frontmatter value;
- `file.etags` — exact normalized tag strings, with `#`;
- `file.tags` — exact tags plus parent tags.

Use the `file.*` forms for tag semantics; use the bare frontmatter field only when its original
shape is intentional.

---

## 3. Inline fields

Three syntaxes (`docs/docs/annotation/add-metadata.md:46`):

| Form | Where it works | Rendering |
|---|---|---|
| `Key:: Value` on its own line | paragraphs, headings, non-task list items | key shown |
| `[Key:: Value]` anywhere in a line | anywhere, including tasks | key shown |
| `(Key:: Value)` anywhere in a line | anywhere | key **hidden** in reading view |

### How lines are chosen

`parseMarkdown` (`src/data-import/markdown-file.ts:134`) walks Obsidian's `sections`, skipping:

- sections of type `list` and `ruling`;
- every line covered by a list item (handled separately);
- lines that do **not** contain `::`;
- lines longer than 32 768 characters.

For each surviving line it first extracts **bracketed** fields; only if there are none does it try
the whole line as `Key:: Value`. For list items (`src/data-import/markdown-file.ts:257`) it extracts
bracketed fields plus emoji shorthands, and falls back to full-line parsing **only when the item is
not a task and has no bracketed fields**.

Consequences:

- A task line's text is never treated as a single full-line field — tasks need `[k:: v]`.
- Two bracketed fields on one line both parse; overlapping matches are dropped, first wins
  (`src/data-import/inline-field.ts:142`).
- Brackets nest and escape correctly, so `[link:: [[Some Page]]]` works
  (`src/data-import/inline-field.ts:34`).
- A key may not contain `[`, `]`, `(`, `)` (`src/data-import/inline-field.ts:85`).
- Markdown emphasis around a full-line key is stripped: `**Bold Field**:: x` gives the key
  `Bold Field` (`src/data-import/inline-field.ts:159`).
- **Nothing in the note body is indexed except fields, tags, links, headings and list items.** Prose
  is not searchable.

### Inline value typing

`parseInlineValue` (`src/data-import/inline-field.ts:103`) is stricter than frontmatter: the whole
value must parse, and there is **no object syntax**.

| Written | Type |
|---|---|
| *(empty)* | null |
| `5`, `-2.5` | number |
| `true` | boolean |
| `2021-01-01`, `2021-01-01T10:00` | date |
| `3 days`, `6hr7min` | duration |
| `[[A Page]]`, `![[A Page]]` | link |
| `#tag` | **string** (there is no tag type) |
| `1, 2, 3` | array of numbers |
| `"a", "b", "c"` | array of strings |
| `a, b, c` | **string** — unquoted text lists do not split (`docs/docs/annotation/types-of-metadata.md:198`) |
| anything else | string |

---

## 4. Field names

Every key is stored twice: verbatim, and under a **canonical alias** produced by
`canonicalizeVarName` (`src/util/normalize.ts:100`) — lowercase, runs of whitespace → one `-`,
every other non-alphanumeric character dropped, emoji preserved. The alias is only added if it does
not collide with an existing verbatim key (`src/data-import/markdown-file.ts:388`).

| Written key | Also reachable as |
|---|---|
| `Due Date` | `due-date` |
| `**Bold Field**` | `bold-field` |
| `someMetaData` | `somemetadata` |
| `Hello!` | `hello` |
| `Multi  Space` | `multi-space` |
| `🎅` | `🎅` |

This is why `due-date` is a field reference and not a subtraction, and why the canonical alias is
the robust way to query a key whose capitalisation varies across notes.

**Duplicate keys become arrays.** A key used more than once in a note — including once in
frontmatter and once inline — collapses to a single value only when there is exactly one occurrence
(`src/data-import/markdown-file.ts:402`). Otherwise the field is an array, and every scalar
comparison against it fails silently. Detect with `TABLE typeof(x), x`.

---

## 5. Implicit page fields (`file.*`)

Built fresh on every query by `PageMetadata.serialize` (`src/data-model/markdown.ts:122`).

| Field | Type | Notes |
|---|---|---|
| `file.path` | string | Full vault path including extension. |
| `file.folder` | string | Parent folder; `""` at the vault root. |
| `file.name` | string | Basename without `.md`. |
| `file.ext` | string | Usually `md`. |
| `file.link` | link | |
| `file.size` | number | Bytes. |
| `file.ctime` / `file.mtime` | date | With time. |
| `file.cday` / `file.mday` | date | Time stripped. |
| `file.tags` | array | Every tag **plus all parent tags**: `#a/b/c` contributes `#a/b/c`, `#a/b`, `#a`. |
| `file.etags` | array | Exact tags only. Use this for "tagged exactly". |
| `file.aliases` | array | |
| `file.inlinks` | array of links | Reverse index over resolved links only. |
| `file.outlinks` | array of links | Body links, embeds **and** frontmatter links. **May contain duplicates** — the "distinct" step builds a `Set` of link *objects*, which does not deduplicate by value (`src/data-model/markdown.ts:114`). Wrap in `unique()` before counting. |
| `file.lists` | array | Every list item, tasks included. |
| `file.tasks` | array | List items that have a checkbox. |
| `file.frontmatter` | object | Raw YAML, un-retyped. |
| `file.starred` | boolean | Bookmarked via the core Bookmarks plugin; polled every 30 s (`src/data-index/index.ts:397`). |
| `file.day` | date | Present only if derivable — see below. |

`file.day` (`src/data-import/markdown-file.ts:307`): the first field named `date` or `day` (any
capitalisation) whose value is a date, or an array starting with one, or a link containing one;
otherwise a `YYYY-MM-DD` or `YYYYMMDD` sequence found **anywhere** in the file name
(`src/util/normalize.ts:26`). The extraction does not validate: a file named `Report 2021-13-45`
produces an **invalid** DateTime that still reports `typeof = "date"`.

**A page field named `file` is dropped** — user fields are only added under keys that do not already
exist, and `file` always does (`src/data-model/markdown.ts:154`).

---

## 6. Tasks and list items

One `ListItem` per entry in Obsidian's `listItems`, matched against
`/^[\s>]*(\d+\.|\d+\)|\*|-|\+)\s*(\[.{0,1}\])?\s*(.*)$/mu` (`src/data-import/markdown-file.ts:183`).
The leading `[\s>]*` is why list items inside callouts are indexed.

### Implicit fields (`src/data-model/markdown.ts:251`)

| Field | Type | Notes |
|---|---|---|
| `text` | string | First line plus continuation lines, each trimmed, joined with `\n`. Includes the field annotations. |
| `line`, `lineCount`, `list` | number | `list` is the start line of the containing list. |
| `path` | string | Same as the page's `file.path`. |
| `link` | link | To the nearest block id, else to the section. |
| `section` | link | To the containing heading, else to the file. |
| `tags` | array | Tags found in this item's text only. |
| `outlinks` | array | Links on the item's lines. |
| `children` | array | Nested items, recursively serialized. |
| `parent` | number | Line of the parent item; absent at root level. |
| `blockId` | string | From `^id`, if present. |
| `task` | boolean | Has a checkbox. |
| `annotated` | boolean | Has at least one inline field. |
| `position` | object | Raw Obsidian position. |
| `subtasks`, `real`, `header` | — | Deprecated aliases for `children`, `task`, `section`. |
| `status` | string | The character between the brackets; `" "` when unchecked. |
| `checked` | boolean | `status` is neither `""` nor `" "` — true for `[-]`, `[/]`, `[>]`. |
| `completed` | boolean | `status` is `x` or `X`. |
| `fullyCompleted` | boolean | This task **and every descendant task** completed (`src/data-import/markdown-file.ts:293`). |

Docs also list `visual` (`docs/docs/annotation/metadata-tasks.md:67`). The serializer never sets it;
it exists so DataviewJS can override the rendered text (`src/ui/views/task-view.tsx:106`).

### Date fields and their aliases (`src/data-model/markdown.ts:227`)

| Exposed as | Read from the first of |
|---|---|
| `created` | `created`, `ctime`, `cday` |
| `due` | `due`, `duetime`, `dueday` |
| `completion` | `completed`, `completion`, `comptime`, `compday` |
| `start` | `start` |
| `scheduled` | `scheduled` |

> `completed` is a **boolean** (the checkbox state). The completion **date** is `completion`.
> Writing `[completed:: 2021-08-22]` stores the date under `completion` and leaves `completed`
> a boolean, because the task built-ins are applied after the inline fields
> (`src/data-model/markdown.ts:281`).

### Emoji shorthands (`src/data-import/inline-field.ts:182`)

Recognised **only on list items**, only in `YYYY-MM-DD` form, and only the **first** occurrence of
each emoji per line:

| Emoji | Field |
|---|---|
| ➕ | `created` |
| 🛫 | `start` |
| ⏳ ⌛ | `scheduled` |
| 📅 📆 🗓 | `due` |
| ✅ | `completion` |

Priority, recurrence and every other Tasks-plugin signifier are **not** parsed
(`docs/docs/annotation/metadata-tasks.md:14`) — they stay inside `text`.

### Name collisions

`addFields` skips any key already present (`src/data-model/markdown.ts:340`), and the task
built-ins are written afterwards. So on a list item these inline field names are **lost or
overwritten**: `symbol`, `link`, `section`, `text`, `tags`, `line`, `lineCount`, `list`, `outlinks`,
`path`, `children`, `task`, `annotated`, `position`, `subtasks`, `real`, `header`, and — for tasks —
`status`, `checked`, `completed`, `fullyCompleted`.

### Where a bullet's metadata goes

For a **non-task** list item, its fields are merged into the **page's** fields, not into the parent
task (`src/data-import/markdown-file.ts:279`). The code that would attach them to the nearest
ancestor task is present but commented out, and `src/data-model/markdown.ts:191` still documents the
intended behaviour. So:

```markdown
- [ ] Ship the thing
    - context [owner:: Ann]
```

`owner` is a **page** field. It is not on the task. To attach it, put it on the task line itself.

### Page fields on tasks

In a `TASK` query only, each task row is a deep copy of the task with the page's serialized fields
merged in for keys the task does not define (`src/query/engine.ts:404`) — so `file.link`, `file.name`
and page-level metadata are available on task rows. In `LIST`/`TABLE` queries the reverse is true:
reach tasks through `file.tasks`.

---

## 7. Index structures and their asymmetries

| Index | Built from | Behaviour |
|---|---|---|
| `pages` | path → `PageMetadata` | |
| `tags` | full tags including parents | **Keys are lowercased on write and on lookup** (`src/data-index/index.ts:545`), so `FROM #Project` finds `#project`. |
| `etags` | exact tags | Same case folding; not reachable from `FROM`. |
| `links` | outgoing link paths | `getInverse` powers `file.inlinks`. |
| `prefix` | vault folder tree | Walks `TFolder` children live (`src/data-index/index.ts:251`). |
| `csv` | parsed CSV files | 5-minute expiry, flushed on modify/delete. |
| `starred` | Bookmarks plugin | Polled every 30 s. |

The asymmetry worth remembering: **tag *sources* are case-insensitive, tag *values* are not.**
`FROM #Project` matches `#project`. For exact case-sensitive membership use
`econtains(file.etags, "#Project")`; for exact case-insensitive membership normalise first, for
example `econtains(map(file.etags, (tag) => lower(tag)), "#project")`.

CSV rows (`src/data-import/csv.ts:13`) go through papaparse with `dynamicTyping`, then the same
frontmatter retyping, and every column is stored under **both** its raw and canonical name.

---

## 8. Quick checklist when a field "isn't there"

1. `TABLE typeof(x), x, file.frontmatter WHERE file.name = "…"`.
2. Is the key capitalised differently somewhere? Try the canonical alias.
3. Is the value a duplicate key (array) rather than a scalar?
4. Is it on a **bullet under** a task rather than on the task line?
5. Is it in a section Obsidian typed as `list` or `ruling`, and therefore skipped by the paragraph
   scan?
6. Is the value an unquoted YAML date, shifted by the local UTC offset?
7. Is the name one of the reserved list-item keys in §6?
8. Did the file change while the index was still building, or before a plugin upgrade invalidated
   the cache? Run **Drop all cached file metadata**.
9. Did a text-looking YAML value parse wholly as a date, duration or link? YAML quoting does not
   suppress Dataview's second parsing pass; change the stored representation if it must stay text.
