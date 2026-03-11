# Reference: designing metadata that stays queryable

Operational recommendations for users who control a Dataview vault's schema. Implementation claims
refer to `blacksmithgu/obsidian-dataview` tag `0.5.70`; recommendations are labelled explicitly.

## Contents

1. [Treat metadata as a contract](#1-treat-metadata-as-a-contract)
2. [Choose where a field lives](#2-choose-where-a-field-lives)
3. [Choose one type and cardinality](#3-choose-one-type-and-cardinality)
4. [Name fields for long-term use](#4-name-fields-for-long-term-use)
5. [Use tags and fields deliberately](#5-use-tags-and-fields-deliberately)
6. [Handle dates and text retyping](#6-handle-dates-and-text-retyping)
7. [Evolve a vault safely](#7-evolve-a-vault-safely)
8. [Metadata intake checklist](#8-metadata-intake-checklist)

---

## 1. Treat metadata as a contract

**Recommendation.** Define a small contract per note kind before writing a dashboard. A contract
states:

- field name and meaning;
- expected Dataview type;
- scalar or array cardinality;
- whether absence is valid, and what absence means;
- where the field is authored;
- one positive and one negative example note.

Dataview does not enforce a schema. Unknown variables become `null`
(`src/expression/context.ts:64`), and duplicate occurrences become arrays
(`src/data-import/markdown-file.ts:399`). A query can therefore keep rendering while its data
contract silently drifts.

Example recommendation:

| Field | Type | Cardinality | Absence | Location |
|---|---|---|---|---|
| `status` | string | scalar | means `inbox` | frontmatter |
| `due` | date | scalar | undated | frontmatter |
| `owners` | link | array | unowned | frontmatter YAML list |
| `effort` | duration | scalar | unknown, not zero | frontmatter |
| `context` | string | scalar | optional | task inline field |

Keep the contract in a template or schema note; do not infer it independently in every query.

## 2. Choose where a field lives

| Need | Recommended location | Reason |
|---|---|---|
| Attribute of the whole note | frontmatter | One visible value, native Obsidian Properties support. |
| Value that belongs in prose | bracketed or parenthesised inline field | Keeps context while remaining indexed. |
| Attribute of one task/list item | bracketed inline field on that exact line | Full-line task fields are not parsed (`src/data-import/markdown-file.ts:257`). |
| Repeated event/log values | separate notes or list-item rows | Repeating a page key turns it into an array, which changes query semantics. |
| Computed display only | inline DQL | The displayed result is not stored as queryable metadata. |
| Durable computed value used by other queries | write it through a template/automation | Dataview is a display/query engine, not a materialized-view store. |

Do not put a task attribute on a child bullet and expect the parent task to inherit it. Non-task
list fields are merged into the page (`src/data-import/markdown-file.ts:279`).

## 3. Choose one type and cardinality

**Recommendation.** A field used in comparisons should have one type across all participating
notes. Dataview's universal comparator orders unlike types by type name; it does not coerce them
(`src/data-model/value.ts:171`).

Use these authoring patterns:

```yaml
rating: 4
published: 2024-03-18
owners:
  - "[[Ann]]"
  - "[[Lee]]"
aliases:
  - Stable Alias
```

Then validate with:

````text
```dataview
TABLE WITHOUT ID file.link, typeof(rating), typeof(published), typeof(owners), owners
FROM "The Narrow Folder"
```
````

Distinguish:

- **missing** — field is `null`;
- **empty string** — falsy but present in the source;
- **zero** — falsy number and often a valid measurement;
- **empty array** — falsy and usually a valid “none”;
- **duplicate scalar field** — array created accidentally.

`WHERE field` means “truthy”, not “key exists”. For existence independent of value, use
`typeof(field) != "null"`.

## 4. Name fields for long-term use

**Recommendation.**

- Prefer lowercase ASCII `kebab-case` for fields used heavily in DQL.
- Pick one spelling and capitalisation even though Dataview creates a canonical alias.
- Avoid DQL-reserved names `from`, `where`, `limit`, `group`, `flatten`; they require
  `row["name"]` (`src/expression/parse.ts:84`).
- Avoid page field `file`, which cannot override the implicit `file` object
  (`src/data-model/markdown.ts:154`).
- On tasks, avoid built-ins such as `text`, `line`, `path`, `tags`, `status`, `checked`,
  `completed` and `children`; task serialization overwrites them
  (`src/data-model/markdown.ts:255`).

Canonical aliases can collide. Dataview adds an alias only when it does not collide with a verbatim
key (`src/data-import/markdown-file.ts:383`). A schema audit should therefore report both raw and
canonical names.

## 5. Use tags and fields deliberately

Use tags for membership and hierarchy; use fields for a value with a stable domain.

- `FROM #project` is a fast source and includes subtags.
- `file.etags` contains exact tags.
- `file.tags` also contains every parent tag.
- bare `tags` is still the original frontmatter field and may be a string or array
  (`src/data-import/markdown-file.ts:31`).

For exact membership write `econtains(file.etags, "#project")`. `contains` recursively performs
substring matching on string elements (`src/expression/functions.ts:453`).

**Recommendation.** Use a field such as `status: active` rather than mutually exclusive tags when
the value has exactly one valid state. Use tags when a note can independently belong to several
sets.

## 6. Handle dates and text retyping

Dataview reparses every frontmatter string as a possible date, duration or link
(`src/data-import/markdown-file.ts:354`). YAML quoting is removed before this pass and does not
force text:

```yaml
version: "5 m"   # still a five-minute Dataview duration
```

If it must remain text, use a representation that does not parse wholly, for example `v5 m`.

Quoting an ISO date serves a different purpose: it can force Obsidian to hand Dataview a string
rather than a JavaScript `Date`; Dataview then constructs a local wall-clock date. Confirm the
actual runtime value with `dateformat(value, "yyyy-MM-dd HH:mm ZZZZ")`.

**Recommendation.** Keep stored dates in ISO `yyyy-MM-dd`, add time and zone only when the time is
semantically important, and compare date-only values after checking `typeof(value) = "date"`.

## 7. Evolve a vault safely

Use this migration sequence:

1. Inventory raw names, canonical names, types and scalar/array cardinality.
2. Define the target contract and missing-value policy.
3. Update templates before historical notes.
4. Migrate a small folder and run old and new queries side by side.
5. Keep a compatibility expression temporarily, for example
   `default(new-status, old-status)`.
6. Remove compatibility only after the schema audit reports no old field.
7. Re-run one must-match and one must-not-match fixture per important query.

Do not “fix” mixed types inside every query with `string()` or `number()` unless the conversion is
the intended data contract. Query-time coercion can hide bad authoring and, for `number()`, extracts
the first number from arbitrary text (`src/expression/functions.ts:335`).

## 8. Metadata intake checklist

Before consulting on a query, collect:

1. one complete note that must match;
2. one complete note that must not match;
3. exact frontmatter and relevant inline/task lines;
4. the expected type and cardinality of every queried field;
5. what a missing field means;
6. whether the vault uses templates or Obsidian Properties to author the values;
7. output from `scripts/dataview-vault-lint.mjs` when type drift or duplicate keys are plausible.

