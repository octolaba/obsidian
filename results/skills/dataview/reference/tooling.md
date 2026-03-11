# Reference: bundled linting and live diagnostics

How to use the skill's read-only tools, interpret their evidence, and keep intent-sensitive changes
under human control.

## Contents

1. [Choose the right tool](#1-choose-the-right-tool)
2. [Query linter](#2-query-linter)
3. [Metadata/schema linter](#3-metadataschema-linter)
4. [Live Dataview doctor](#4-live-dataview-doctor)
5. [Automation and exit codes](#5-automation-and-exit-codes)
6. [From finding to safe rewrite](#6-from-finding-to-safe-rewrite)
7. [Verification boundary](#7-verification-boundary)

---

## 1. Choose the right tool

| Question | Tool |
|---|---|
| Is this query malformed, risky, or structurally expensive? | `dataview-query-lint.mjs` |
| Do fields drift across notes? | `dataview-vault-lint.mjs` |
| What does the live index hold for this target? | `assets/dataview-doctor/` |
| Does the target survive `FROM` and page-local `WHERE`? | live doctor trace |
| Is the complete query faster and result-equivalent? | live doctor repeated query check |
| Does the artifact still match the reviewed source? | `verify.mjs` |
| Do the portable tools still work together? | `test.mjs` |

Run the query linter and schema linter independently. A valid query over inconsistent metadata is
still wrong; a clean schema does not make a malformed query valid.

## 2. Query linter

Portable static mode:

```sh
node scripts/dataview-query-lint.mjs /path/to/vault
node scripts/dataview-query-lint.mjs /path/to/vault \
  --file Dashboards/Projects.md --format json --all
```

The extractor reads Dataview's vault-local `data.json` when present. It honours the custom
DataviewJS fence keyword, inline DQL/JS prefixes, enable switches, inline-in-code-block setting,
callout quote prefixes, backtick/tilde fences and longer closing fences.

Exact source-backed mode:

```sh
node scripts/dataview-query-lint.mjs /path/to/vault \
  --source-root /path/to/obsidian-dataview \
  --format sarif
```

This bundles `src/query/parse.ts:225` from the supplied checkout into an operating-system temporary
directory and augments static findings with parser/AST checks. It never writes into that checkout.
The checkout must carry compatible installed Rollup/TypeScript development dependencies.

Findings separate:

- `severity`: note, warning, or error;
- `confidence`: how strongly the text/AST supports the finding;
- `fixSafety`: safe, likely, or intent-required;
- category: syntax, correctness, cost, settings, JavaScript, or security.

Important rule families:

- `DVM...`: Markdown fence structure;
- `DVQ000`–`DVQ014`: DQL syntax, null/type/precedence, grouping, membership, settings;
- `DVQ101`–`DVQ109`: cost-shape candidates;
- `DVJ...`: DataviewJS async/API/cost/security/lifecycle candidates.

`--all` includes clean extracted blocks in structured output. Text is for interactive review, JSON
for scripts, SARIF for code-scanning interfaces. A warning about no `FROM`, an incoming link source,
or `FLATTEN` is not an instruction to change it: the construct may be required by intent.

## 3. Metadata/schema linter

```sh
node scripts/dataview-vault-lint.mjs /path/to/vault --all
node scripts/dataview-vault-lint.mjs /path/to/vault \
  --file Projects/Alpha.md --format json
```

It inventories raw and canonical field names, inferred types, scalar/list cardinality and authoring
locations. It reports:

- incompatible types for one canonical field;
- scalar/list drift;
- spellings that canonicalize to the same name;
- duplicate frontmatter keys in one note;
- task annotations that collide with serialized task fields;
- quoted values still retyped as dates/durations;
- tag case variants;
- mixed frontmatter/inline authoring.

This is deliberately a partial YAML/Markdown parser. It handles flat scalar/list frontmatter and
Dataview inline fields, while nested mappings, anchors, block scalars and live MetadataCache state
remain outside its claim. Canonicalization of multi-code-point emoji names is approximate. Confirm
a finding with `typeof(field)`, the indexed value, and `file.frontmatter` before migrating notes.

## 4. Live Dataview doctor

Copy the complete `assets/dataview-doctor/` directory into the vault. DataviewJS must be explicitly
enabled and the file should be reviewed as executable code. Invoke it from a `dataviewjs` block:

```js
await dv.view("System/dataview-doctor", {
    target: "Projects/Alpha",
    fields: ["status", "due", "file.day", "file.tags"],
    checks: [
        { label: "Open", expression: 'status = "open"' },
        { label: "Has a date", expression: 'typeof(due) = "date"' }
    ],
    queries: [{
        label: "Project dashboard",
        dql: `
            TABLE status, due
            FROM "Projects"
            WHERE status = "open" AND due
            SORT due
        `,
        repeats: 5
    }]
})
```

The view renders:

- target resolution and the actual indexed field types/values;
- explicit DQL expression checks against the target page;
- complete query result type/count;
- whether the result contains the target path (TABLE/LIST get one untimed run with the ID forced,
  so `WITHOUT ID` cannot hide membership);
- median and p95 over one to ten runs;
- a best-effort target trace through `FROM` and page-local `WHERE` clauses.

Automatic tracing stops before `FLATTEN` or `GROUP BY`, because the row is no longer the original
page. Add explicit `checks` for ambiguous predicates and inspect the complete query for transformed
rows. Timing includes live cache/UI conditions; compare one rewrite under the same conditions and
also compare membership/order.

The doctor calls query/read APIs only. It does not write notes or toggle task checkboxes.

## 5. Automation and exit codes

Query and schema linters:

- `0`: no warning/error (notes alone do not fail);
- `1`: at least one warning/error;
- `2`: invalid CLI/input;
- `3`: exact-parser source or dependencies unavailable.

Formal verifier:

- `0`: all checks pass;
- `1`: artifact validation failed;
- `2`: CLI usage error;
- `3`: source material missing;
- `4`: pinned material identity mismatch.

The compatibility entry point accepts the original `--json`, `--all`, `--top`, and `--min-score`
arguments. Numeric score options are no-ops because explicit severity/confidence replaced the
unexplained score. New automation should call the query linter directly.

A minimal CI sequence:

```sh
node scripts/test.mjs --source-root /path/to/obsidian-dataview
node scripts/verify.mjs --source-root /path/to/obsidian-dataview
node scripts/dataview-query-lint.mjs /path/to/fixture-vault --format sarif
```

Do not make a production vault globally “clean” by suppressing every note. Baseline intentional
findings by rule and location, and review newly introduced warnings.

## 6. From finding to safe rewrite

1. Read the exact source and observed settings captured in the report.
2. State the user's missing-value, exact-membership, cardinality and ordering intent.
3. Confirm one required inclusion and exclusion.
4. Form one minimal rewrite.
5. Run static/exact lint again.
6. Use the live doctor or a temporary diagnostic table to compare result membership and order.
7. For cost changes, compare repeated medians only after warming the same cache.
8. Keep the original when the warning describes an intentional trade-off.

Only fence closure and similarly local syntax changes are generally safe to automate. Adding
`nonnull`, replacing `contains`, moving `LIMIT`, adding `FROM`, or reordering operations can all
change results and require intent.

## 7. Verification boundary

`test.mjs` uses a small checked-in vault with custom settings, clean and deliberately bad DQL,
DataviewJS, schema collisions and task fields. With `--source-root`, it also exercises the real
upstream parser. `verify.mjs` checks source-content fingerprints, implementation invariants,
frontmatter, local links, full citations, reference TOCs and JavaScript syntax.

There is no Obsidian E2E test. The live doctor's JavaScript is syntax-checked and executed once
against a small mocked `dv` API, but its real index/rendering output must be validated in the user's
Obsidian version and platform. This boundary is deliberate and must not be reported as live renderer
verification.
