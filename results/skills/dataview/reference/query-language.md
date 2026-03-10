# Reference: the Dataview Query Language

Complete grammar and evaluation semantics of DQL as implemented at `blacksmithgu/obsidian-dataview`
tag `0.5.70`. Citations are `path:line` in that repository. `src/…` is implementation, `docs/…` is
documented contract.

## Contents

1. [Where queries live](#1-where-a-query-can-live)
2. [Query structure](#2-query-structure)
3. [Query types](#3-query-types)
4. [`FROM` sources](#4-from--sources)
5. [Data commands](#5-data-commands)
6. [Expressions](#6-expressions)
7. [Values, comparison and truthiness](#7-values-comparison-truthiness)
8. [Functions](#8-functions)
9. [DQL boundaries](#9-what-dql-cannot-do)

---

## 1. Where a query can live

| Form | Syntax | Gate | Notes |
|---|---|---|---|
| DQL block | ` ```dataview ` … ` ``` ` | always on | Full query language. |
| DataviewJS block | ` ```dataviewjs ` … ` ``` ` | **off by default** (`src/settings.ts:104`) | Keyword configurable. When disabled, renders `Dataview JS queries are disabled…` (`src/ui/views/js-view.ts:19`). |
| Inline DQL | `` `= <expression>` `` | on by default | One **expression**, not a query. No query type, no data commands (`docs/docs/queries/dql-js-inline.md:63`). Prefix configurable. |
| Inline DataviewJS | `` `$= <js>` `` | off by default; needs **both** JS toggles | Full `dv` API. When disabled, renders the literal text `(disabled; enable in settings)` (`src/ui/views/js-view.ts:58`). |

Inline queries are also evaluated inside fenced code blocks unless
`inlineQueriesInCodeblocks` is turned off (`src/main.ts:269`). Any file whose path contains
`?no-dataview` renders every Dataview construct as inert code (`src/api/plugin-api.ts:610`).

An inline DQL expression is evaluated with `this` bound to the containing page's serialized metadata
(`src/query/engine.ts:442`), so `` `= this.file.name` `` works and `` `= this.due - date(today)` ``
works. Storing an inline query in a field stores the *text*, not the value
(`docs/docs/resources/faq.md:57`).

---

## 2. Query structure

```
<QUERY TYPE> [fields]
[FROM <source>]
<DATA COMMAND> <expression>
<DATA COMMAND> <expression>
...
```

Parsed as: one header clause, then **at most one** `FROM`, then any number of data commands
(`src/query/parse.ts:197`). Only the query type is mandatory.

- **Whitespace and newlines are interchangeable.** Clause separation is whitespace, not line breaks.
- **`//` line comments** are allowed anywhere a clause separator is (`src/query/parse.ts:87`,
  `src/query/parse.ts:216`). They run to end of line and are not recognised inside strings.
- **Keywords are case-insensitive** (`/TABLE|LIST|TASK|CALENDAR/i`, `/WHERE/i`, …). Field names are
  case-sensitive.
- **Data commands may repeat and appear in any order**, and they execute in written order
  (`docs/docs/queries/differences-to-sql.md:13`). Two `WHERE`s, three `SORT`s, nested `GROUP BY`s
  are all legal.

### 2.1 The `SORT`-after-bare-header parse failure

`SORT` is **not** in the reserved-word list (`src/expression/parse.ts:84`, which contains only
`FROM`, `WHERE`, `LIMIT`, `GROUP`, `FLATTEN`). The `LIST` and `TABLE` headers greedily parse an
expression after the keyword (`src/query/parse.ts:121`, `src/query/parse.ts:135`). Therefore:

| Query | Result |
|---|---|
| `LIST`<br>`SORT file.name` | **parse error** — `SORT` is taken as the LIST output expression |
| `TABLE`<br>`SORT file.name` | **parse error** — `SORT` is taken as the first column |
| `LIST WITHOUT ID`<br>`SORT file.name` | **parse error** |
| `TASK`<br>`SORT file.name` | works — the `TASK` header consumes nothing (`src/query/parse.ts:152`) |
| `CALENDAR file.day`<br>`SORT file.name` | works |
| `LIST`<br>`FROM ""`<br>`SORT file.name` | works |
| `LIST`<br>`WHERE true`<br>`SORT file.name` | works |
| `LIST file.link`<br>`SORT file.name` | works |
| `LIST`<br>`GROUP BY x` / `FLATTEN x` / `LIMIT 5` | work — all three are reserved words |

The reported error is a parsimmon "Expected one of the following" pointing at the `SORT` line, which
reads as if the sort syntax were wrong. Fix by giving the header a field, or by putting any other
clause first.

---

## 3. Query types

### `LIST [WITHOUT ID] [expression]`

Bullet list. With no expression, renders the row id (a file link, or the group key after
`GROUP BY`). With an expression, renders `id: value` as a widget pair; `WITHOUT ID` renders only the
value (`src/query/engine.ts:306`). At most **one** expression — for more, concatenate with `+`.

### `TABLE [WITHOUT ID] expr [AS "Header"], expr, …`

One column per expression. The first column is the row id, headed by `tableIdColumnName`
(default `File`) or, after `GROUP BY`, by the group field's name (`src/query/engine.ts:351`).
`WITHOUT ID` drops it. Unnamed columns are headed by the source text of the expression with
newlines stripped (`src/query/parse.ts:100`). Headers containing spaces must be quoted.

### `TASK`

Operates on **tasks**, not pages. `FROM` still selects *pages*; every task in every matched page
becomes a row, with the page's fields merged in for keys the task does not already define
(`src/query/engine.ts:394`). Consequences:

- `TASK FROM #x` returns *all* tasks of every note carrying `#x` anywhere, including notes where
  only one task has the tag. Filter exact task tags with `WHERE econtains(tags, "#x")`.
- The row id is `<path>#<line>` and is not rendered.
- The rendered list re-nests: a matching task drags its children along even if the children do not
  match (`src/ui/views/task-view.tsx:308`, `docs/docs/queries/query-types.md:430`).
- Checking a box in the view **rewrites the source file** (`src/ui/views/task-view.tsx:374`) — the
  only DQL construct that mutates the vault.

### `CALENDAR <date expression>`

Dots on a month grid. The expression must evaluate to a date or `null`; anything else stops the view
from rendering (`docs/docs/queries/query-types.md:481`). `SORT` and `GROUP BY` parse but have no
visible effect.

---

## 4. `FROM` — sources

A source is a **set of file paths**, resolved before any row exists (`src/data-index/resolver.ts:12`).
With no `FROM`, the source is `Sources.folder("")` — the entire vault (`src/query/parse.ts:205`).

| Syntax | Meaning | Sharp edges |
|---|---|---|
| `#tag` | Files carrying the tag **or any subtag** | Lookup is case-**in**sensitive (`src/data-index/index.ts:545`). Includes tags from frontmatter `tags`/`tag`, body tags, and tags inside list items. |
| `"folder"` | Files under the folder, recursively | Must be the full vault path. **A trailing `/` matches nothing.** Only `.md`/`.markdown` are returned (`src/data-index/index.ts:296`). |
| `"folder/File"` | One file | A folder of the same name wins; force the file with `"folder/File.md"` (`docs/docs/reference/sources.md:37`). |
| `[[Note]]` | Files linking **to** `Note` | Full scan of `resolvedLinks` (`src/data-index/resolver.ts:45`). If `Note` does not resolve, falls back to files whose raw links mention it. |
| `outgoing([[Note]])` | Files `Note` links to | Reads `resolvedLinks`, so **unresolved links are silently missing**; errors if `Note` itself does not exist. |
| `csv("path.csv")` | Rows of a CSV, not pages | Path resolved relative to the containing note; `http(s)://` and `file://` are fetched (`src/data-index/index.ts:350`) and cached for 5 minutes. |
| `-X` / `!X` | Complement | Enumerates **every markdown file** and subtracts (`src/data-index/resolver.ts:82`) — the most expensive source form. |
| `A and B`, `A or B` | Intersection, union | |
| `( … )` | Grouping | |

`and` and `or` **share one precedence and associate left**, exactly as in expressions
(`src/expression/parse.ts:415`): `FROM #a or #b and #c` is `(#a or #b) and #c`. Parenthesise.

`[[]]` and `[[#]]` refer to the current file (`docs/docs/reference/sources.md:53`).

---

## 5. Data commands

Executed in written order over an array of `{ id, data }` rows (`src/query/engine.ts:50`).

### `WHERE <expression>`

Keeps rows whose value is **truthy** (not merely `true`). A row whose expression *errors* is
dropped and the error recorded (`src/query/engine.ts:61`). If **every** row errors, the whole query
fails with `Every row during operation 'where' failed with an error` (`src/query/engine.ts:195`).

### `SORT <expr> [ASC|DESC|ASCENDING|DESCENDING], …`

Multi-key, first key wins ties downward. Direction defaults to ascending
(`src/query/parse.ts:102`). Implemented by evaluating `<` and then `>` through the binary-operator
table for each comparison (`src/query/engine.ts:90`) — two full expression evaluations per
comparison, which is why sorting is ~25× the per-row cost of filtering.

**A row whose sort key errors is dropped from the result entirely** (`src/query/engine.ts:77`), not
merely sorted last.

Sorting is **not stable across types**: values of different types are ordered by *type name*
(§7.2), and `null` sorts before everything.

### `GROUP BY <expr> [AS name]`

Sorts by the key, then merges adjacent equal keys (`src/query/engine.ts:132`). Produces **one row
per distinct key**, whose data object has exactly three keys:

```
{ key: <the group key>, rows: [ …the original row data objects… ], <name>: <the group key> }
```

`<name>` is the `AS` name, or the source text of the expression. **Every other field is gone** —
a bare `status` after `GROUP BY` evaluates to `null`. Reach through `rows`:

- `rows.field` — "swizzling": indexing an array with a string maps over its elements
  (`src/expression/context.ts:161`, `docs/docs/queries/data-commands.md:73`).
- `length(rows)` — group size.
- `rows.file.link` — the usual `LIST rows.file.link` idiom.

`GROUP BY` may be repeated to nest; the id meaning stacks (`src/query/engine.ts:168`). Rows whose
key errors are dropped.

### `FLATTEN <expr> [AS name]`

One output row per element of the value; non-arrays are wrapped in a one-element array
(`src/query/engine.ts:180`). Each output row is a **deep copy** of the whole input row with
`name` set to the element (`src/query/engine.ts:182`).

| Input value | Output |
|---|---|
| `[a, b, c]` | 3 rows |
| `[]` | **0 rows — the input row disappears** |
| `null` / missing field | 1 row with `name = null` |
| scalar | 1 row |

`FLATTEN <name>` where `<name>` matches the most recent `GROUP BY` name undoes the grouping id
(`src/query/engine.ts:189`).

### `LIMIT <expr>`

Evaluated **once, with no row context** (`src/query/engine.ts:107`) — it cannot reference fields.
Must be a number or the query fails. Implemented as `Array.slice(0, n)`:

| `LIMIT` | Effect |
|---|---|
| `0` | no rows |
| `1.9` | 1 row |
| `-1` | **all rows except the last** |
| more than the row count | all rows |

---

## 6. Expressions

### 6.1 Literals

| Form | Type | Notes |
|---|---|---|
| `1`, `-2.5` | number | |
| `"text"` | string | `\"` and `\\` are the only escapes that collapse; `\w` stays `\w` (`src/expression/parse.ts:240`) — regexes can be written literally. |
| `true` / `false` | boolean | Also `True`/`False`. |
| `[[Note]]`, `[[Note#Head]]`, `[[Note#^block]]`, `[[Note\|Alias]]` | link | |
| `![[Note]]` | embedded link | |
| `[1, 2]`, `list(1, 2)` | array | |
| `{ a: 1 }`, `object("a", 1)` | object | |
| `date(2021-04-18)` | date | See below. |
| `dur(2 days)` | duration | |
| `(x, y) => x + y` | function | Used by `map`, `filter`, `any`, `all`, `none`, `sort`, `reduce`, `minby`, `maxby`. |
| `null` | null | |
| `#tag` | **string** | There is no tag type; `#tag` in an expression is parsed as a tag token and used only in `FROM`. |

**There is no bare date literal.** `2021-01-01` in an expression is `2021 - 1 - 1` = `2019`. Dates
must go through `date(…)`.

`date(…)` accepts `YYYY-MM[-DD[THH[:mm[:ss[.SSS]]]]]` plus an optional zone (`+HH`, `+HH:MM`, `Z`,
`[Zone/Name]`) (`src/expression/parse.ts:325`), or a shorthand:

`now`, `today`, `yesterday`, `tomorrow`, `sow`/`start-of-week`, `eow`/`end-of-week`,
`som`/`start-of-month`, `eom`/`end-of-month`, `soy`/`start-of-year`, `eoy`/`end-of-year`
(`src/expression/parse.ts:55`). `today` is midnight local; `now` includes the time.

`dur(…)` units, all singular/plural/abbreviated (`src/expression/parse.ts:14`):
`year|yr`, `month|mo`, `week|wk|w`, `day|d`, `hour|hr|h`, `minute|min|m`, `second|sec|s`.
Multiple units may be juxtaposed or comma-separated: `dur(1 day, 3 hours)`, `dur(6hr7min)`.

### 6.2 Identifiers and field access

An identifier starts with a Unicode letter or emoji and continues with letters, digits, `_`, `-` or
emoji (`src/expression/parse.ts:265`). **`-` is a valid identifier character**, which is what makes
the canonical alias `due-date` reachable — and what makes `total-spent` a field reference rather than
a subtraction. Subtraction needs spaces: `total - spent`.

- `a.b` — index an object, a link (resolves the target page), a date/duration unit, or map over an
  array (`src/expression/context.ts:124`).
- `a[expr]` — index with a computed key; arrays take numbers, objects and links take strings.
- `a[0]` on a string returns a character; out-of-range indices return `null`.
- `row.x` / `row["x"]` — the escape hatch. `row` is special-cased to mean "all globals plus this
  row's data" (`src/expression/context.ts:138`), so it reaches fields whose names are reserved words
  or contain spaces.
- `this.x` — the page containing the query (`src/query/engine.ts:298`). Only meaningful in a
  rendered block.
- **An unknown variable evaluates to `null`, never to an error** (`src/expression/context.ts:64`).
  Typos are silent.

Reserved words unusable as bare variables: `FROM`, `WHERE`, `LIMIT`, `GROUP`, `FLATTEN`
(`src/expression/parse.ts:84`). `SORT`, `TABLE`, `LIST`, `TASK`, `CALENDAR`, `AS` are **not**
reserved.

Indexing a **date** accepts `year`, `month`, `weekyear`, `week`, `weekday`, `day`, `hour`, `minute`,
`second`, `millisecond`; anything else returns `null` (`src/expression/context.ts:182`).

> `d.weekyear` returns Luxon's `weekNumber` — the **ISO week number**.
> `d.week` returns `floor(day / 7) + 1` — a week-of-month approximation, **not** a week number.
> There is no `quarter`. For a real week number use `d.weekyear` or `dateformat(d, "WW")`.

Indexing a **duration** accepts `year(s)`, `month(s)`, `weeks`, `day(s)`, `hour(s)`, `minute(s)`,
`second(s)`, `millisecond(s)` and returns the duration converted wholly to that unit — `dur(90
minutes).hours` is `1.5` (`src/expression/context.ts:206`).

### 6.3 Operator precedence

Four levels, each **left-associative** (`src/expression/parse.ts:576`):

```
1 (tightest)   *   /   %
2              +   -
3              >   >=   <   <=   =   !=
4 (loosest)    and  or  &  |        ← ONE level, left to right
```

Consequences, all confirmed by execution:

- `a or b and c` ≡ `(a or b) and c`. `true or false and false` is **false**.
- `a = 1 or a = 2` ≡ `((a = 1) or (a = 2))` — this one happens to be right.
- `x > 1 and x < 5 or y` ≡ `(((x > 1) and (x < 5)) or y)` — also right, by luck of left-to-right.
- `y or x > 1 and x < 5` ≡ `((y or (x > 1)) and (x < 5))` — **wrong**, and it is why every
  mixed `and`/`or` expression needs explicit parentheses.
- `1 < 2 < 3` is `(1 < 2) < 3` = `true < 3` = `true` (boolean sorts before number).
- `!a = b` is `(!a) = b`; `!` binds to the postfix chain only (`src/expression/parse.ts:533`).

### 6.4 Binary operators

The whole dispatch table (`src/expression/binaryop.ts:96`). Anything not listed is a **run-time
error** that drops the row.

| Left | Op | Right | Result |
|---|---|---|---|
| any | `<` `<=` `>` `>=` `=` `!=` | any | boolean, via the universal comparator (§7.2) |
| any | `and` `&` | any | `isTruthy(a) && isTruthy(b)` |
| any | `or` `\|` | any | `isTruthy(a) \|\| isTruthy(b)` |
| number | `+ - * / %` | number | number |
| string | `+` | any | string (right side rendered with `Values.toString`) |
| any | `+` | string | string |
| string | `*` | number | repetition (negative ⇒ `""`) |
| date | `-` | date | duration |
| date | `+`/`-` | duration | date |
| duration | `+`/`-` | duration | duration |
| duration | `*`/`/` | number | duration |
| array | `+` | array | concatenation |
| object | `+` | object | merge, right wins |
| null | `+ - * / %` | null | null |
| date | `+`/`-` | null | null |
| null | `+`/`-` | date | null |

**Not defined, therefore an error:** `number + null`, `number - null`, `duration + null`,
`array + null`, `number + string` is fine only because of the string rules, `array + non-array`, and
every arithmetic mix of unrelated types. This is the mechanism behind most silently-dropped rows.

Because `and`/`or` are truthiness operators over any type, `a and b` where `a` is `0`, `""`, `[]`,
`{}` or `null` is `false` without an error.

---

## 7. Values, comparison, truthiness

### 7.1 Types

`boolean`, `number`, `string`, `date`, `duration`, `link`, `array`, `object`, `function`, `null`,
`html`, `widget` (`src/data-model/value.ts:8`). `typeof(x)` returns these names as strings.

### 7.2 Comparison

One universal comparator handles every operator (`src/data-model/value.ts:171`):

1. `null` is smaller than everything; two nulls are equal.
2. **Different types are ordered by their type *name*, alphabetically.** They are therefore never
   equal. Ascending order of a mixed column:

   `null < array < boolean < date < duration < link < number < object < string < widget`

3. Same-type rules: strings by `localeCompare`; numbers numerically; dates and durations by
   instant/length; links by normalized path, then type, then subpath
   (`src/data-model/value.ts:203`); arrays
   element-wise then by length; objects by sorted key list then values; `html`, `widget` and
   `function` always compare equal.

Practical consequences:

- `"5" = 5` is false. `"true" = true` is false. A number stored as a quoted YAML string never
  matches a numeric comparison.
- `WHERE due < date(today)` is true for every row where `due` is missing.
- `WHERE status != "done"` is true for every row where `status` is missing.
- `SORT rating DESC` puts rows without a rating **last**; `SORT rating` puts them **first**.
- A column that mixes numbers and strings sorts all numbers before all strings regardless of value.

### 7.3 Truthiness

`WHERE` and the boolean operators use `isTruthy` (`src/data-model/value.ts:272`):

| Type | Falsy when |
|---|---|
| null | always |
| number | `0` |
| string | `""` (note `"0"` and `"false"` are **truthy**) |
| boolean | `false` |
| array | empty |
| object | no keys |
| link | empty path |
| date | epoch millis exactly `0` |
| duration | zero seconds |
| function, html, widget | never |

`WHERE field` is therefore a good "has a usable value" test, except for numeric `0` and empty
strings.

---

## 8. Functions

Every function is built from typed variants; calling one with an unmatched type signature throws
`No implementation of 'f' found for arguments: …` and drops the row
(`src/expression/functions.ts:149`).

### 8.1 Vectorization — read this before using any function

A function declared with `vectorize(n, positions)` behaves elementwise when called with `n`
arguments and an **array** in one of those positions; the result is an array, truncated to the
shortest vectorized array (`src/expression/functions.ts:109`).

```
contains(list("a","b"), list("a","z"))  →  [true, false]     not a boolean
default(list(null, 2), "X")             →  ["X", 2]          not the list
choice(list(true,false), 1, 2)          →  [1, 2]            not 1
regexmatch("a", list("a","b"))          →  [true, false]
```

Because every non-empty array is truthy, a vectorized call inside `WHERE` **passes every row**.
When you mean "treat the array as one value", use the non-vectorized twin (`ldefault` for
`default`) or wrap the result: `any(contains(...))`, `all(...)`.

Vectorized positions by arity:

| Function | Vectorized on |
|---|---|
| `date`, `dur`, `number`, `round`, `trunc`, `floor`, `ceil`, `lower`, `upper`, `striptime`, `localtime`, `elink`, `link`, `embed` | arg 0 (1-arg form) |
| `contains`, `icontains`, `econtains`, `join`, `reduce` | arg 1 (2-arg form) |
| `containsword`, `regextest`, `regexmatch`, `startswith`, `endswith`, `padleft`, `padright`, `substring`, `truncate`, `default`, `link`, `embed` | args 0 and 1 (2-arg form) |
| `regexreplace`, `replace`, `padleft`, `padright`, `substring`, `truncate` | args 0, 1, 2 (3-arg form) |
| `choice` | arg 0 |
| `dateformat`, `durationformat`, `currencyformat` | arg 0 (2-arg form) |
| **not vectorized:** `ldefault`, `split`, `hash`, `meta`, `sum`, `average`, `product`, `sort`, `filter`, `map`, `unique`, `flat`, `slice`, `length`, `typeof` | |

### 8.2 Constructors and coercion

| Signature | Behaviour |
|---|---|
| `list(...)` / `array(...)` | Varargs → array. |
| `object(k, v, …)` | Even arity required; keys must be strings. |
| `date(any)` | From a string: must parse **entirely** as a date or shorthand, else `null` (`date("2021-01-01 extra")` is `null`). From a link: tries display text, then path, then the target's `file.day` (`src/expression/functions.ts:262`). |
| `date(string, format)` | Luxon `fromFormat`; **throws** on mismatch. `"x"`/`"X"` mean epoch millis/seconds. |
| `dur(any)` | Whole-string parse or `null`. |
| `number(any)` | Extracts the **first** number found in a string: `number("v1.5")` = `1.5`; `number("abc")` = `null`. |
| `string(any)` | Rendering, not serialization: dates use the *settings* date format, `null` becomes `renderNullAs` (default `\-`), arrays are joined with `, `. |
| `link(path[, display[, embed]])`, `embed(link[, bool])`, `elink(url[, display])` | `elink` returns a widget, not a link. |
| `typeof(any)` | Type name, or `"unknown"`. |
| `meta(link)` | `{ display, embed, path, subpath, type }` — the only way to see a link's parts. |

### 8.3 Numbers and aggregation

`round(n[, digits])`, `trunc`, `floor`, `ceil`, `min(...)`, `max(...)`, `minby(arr, f)`,
`maxby(arr, f)`, `sum(arr)`, `product(arr)`, `average(arr)`, `reduce(arr, "+"|f)`.

- `min`/`max` **ignore nulls** and use the universal comparator, so `max` over mixed types returns
  the alphabetically-last type, not the largest value.
- `sum`, `product`, `average` are `reduce` with a string operator, which has **no null handling**:
  one missing value anywhere in the array throws `No implementation found for 'number + null'`. This
  is the most common cause of a whole query erroring out. Always
  `sum(nonnull(rows.x))`.
- `reduce(arr, lambda)` *does* skip nulls (`src/expression/functions.ts:761`) — the string and
  lambda forms differ.
- `average(list())` is `null`; `sum(list())` is `null`.

### 8.4 Containment and arrays

| Function | Semantics |
|---|---|
| `contains(container, value)` | **object** → has key. **string** → substring. **array** → recurses into elements, so an array of strings ends in a *substring* test per element: `contains(list("#project"), "#proj")` is **true**. Documented as an equality test (`docs/docs/reference/functions.md:312`) — a doc/implementation conflict. |
| `icontains` | Same, case-insensitive. |
| `econtains` | **Exact**: array elements compared with `=`. Use this for tag and status membership. |
| `containsword(s, w)` | Case-insensitive whole-word regex match. Escapes the needle. |
| `length(x)` | array/object/string/null only — `length(5)` **throws**. `length(null)` is `0`. |
| `sort(arr[, keyfn])`, `reverse`, `unique`, `flat(arr[, depth])`, `slice(arr[, s[, e]])`, `nonnull`, `firstvalue` | `unique` uses the universal comparator. |
| `filter(arr, f)`, `map(arr, f)` | Return `null` when given `null`, not `[]`. |
| `any(arr[, f])`, `all(arr[, f])`, `none(arr[, f])` | Also varargs. `any(list())` is `false`, `all(list())` is `true`. |
| `join(arr[, sep])` | Default separator `", "`. Elements rendered with `string()`. |
| `extract(obj, k1, …)` | Sub-object; vectorizes manually over an array first argument. |

### 8.5 Strings

| Function | Sharp edge |
|---|---|
| `regextest(pattern, field)` | Unanchored `RegExp.test`. **Pattern first.** |
| `regexmatch(pattern, field)` | **Auto-anchored**: wrapped in `^…$` unless the pattern already starts with `^` *or* ends with `$` (`src/expression/functions.ts:569`). `regexmatch("Hello", "Hello world")` is false. |
| `regexreplace(field, pattern, replacement)` | **Field first** — inverted relative to the two above. Global, throws on an invalid pattern. |
| `replace(s, from, to)` | Literal (`split`/`join`), not regex. Global. |
| `split(s, delimiter[, limit])` | **Delimiter is a regex** (`docs/docs/reference/functions.md:630` documents this). `split("a.b.c", ".")` returns six empty strings; escape as `"\\."`. |
| `lower`, `upper` | Locale-aware. |
| `startswith`, `endswith` | Return `null` (not `false`) if either side is null. |
| `padleft/padright(s, len[, pad])`, `substring(s, start[, end])` | |
| `truncate(s, len[, suffix="..."])` | Truncates when `len(s) > len - len(suffix)`, so strings *already shorter than `len`* get mangled: `truncate("abc", 5)` = `"ab..."`. Guard with `choice(length(s) > n, truncate(s, n), s)`. |

### 8.6 Formatting and utility

| Function | Notes |
|---|---|
| `default(value, fallback)` | Vectorized — see §8.1. |
| `ldefault(value, fallback)` | The list-safe version. |
| `choice(cond, then, else)` | Vectorized on the condition. |
| `display(x)` | Strips Markdown and wiki-link syntax; arrays joined with `", "`. |
| `dateformat(date, fmt)` | Luxon tokens, locale-aware. `"WW"` = ISO week, `"cccc"` = weekday name. |
| `durationformat(dur, fmt)` | Luxon duration tokens: `"h:mm"`, `"d 'days'"`. |
| `currencyformat(n[, code])` | `Intl.NumberFormat`, defaults to USD. |
| `striptime(date)` | Rebuilds the date from `year`/`month`/`day` of its **local** representation. |
| `localtime(date)` | Converts a zoned date to local. |
| `hash(seed[, text][, variant])` | Deterministic 53-bit hash — for stable pseudo-random ordering. |

---

## 9. What DQL cannot do

State these plainly rather than inventing syntax:

- **No joins.** The only cross-page reach is indexing through a link (`author.file.name`), one hop
  at a time, and it costs a metadata-cache lookup per row.
- **No `HAVING`.** Filter groups with a `WHERE` placed *after* `GROUP BY`, operating on `rows`.
- **No aggregation across the query's page rows without `GROUP BY`.** Aggregates over an array
  already present on one row work anywhere; for a vault-wide total, group the page rows by a
  constant: `GROUP BY true`.
- **No user-defined functions, no variables, no `WITH`.** `FLATTEN <expr> AS name` is the only way
  to name an intermediate value, and it costs a deep copy per row.
- **Group rows can be sorted after grouping.** Use expressions over `rows`, such as
  `SORT length(rows) DESC`; the resulting row order controls table/list groups
  (`docs/docs/queries/structure.md:152`).
- **No access to note *body text*.** Only frontmatter, inline fields, tags, links, headings and list
  items are indexed; the prose is not. `file.lists[].text` is the closest thing.
- **No section-level rows.** Rows are pages, tasks or list items — never sections.
- **No `explain`, no query plan, no timing output.** Diagnostics are collected internally
  (`src/query/engine.ts:206`) but never surfaced in the UI.
- **No stable JavaScript object identity** across refreshes, and no incremental evaluation: page
  paths and task path/line identifiers are usable values, but every visible query reconstructs its
  result objects in full on every index revision.
