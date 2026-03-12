# Performance diagnosis and optimisation

Use this reference when Tasks blocks render slowly, Obsidian startup/cache loading is slow, or a
query design needs performance review.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Cost model](#cost-model)
- [Measurement protocol](#measurement-protocol)
- [Query review ladder](#query-review-ladder)
- [Custom-function patterns](#custom-function-patterns)
- [Symptom matrix](#symptom-matrix)
- [What the static linter can and cannot say](#what-the-static-linter-can-and-cannot-say)
- [Validation](#validation)

## Evidence boundary

No representative vault benchmark was collected for this skill. Do not claim that a query form is
“fast”, that a vault size is safe, or that a rewrite improved performance without measurements.

The source does expose timing instrumentation. `PerformanceTracker` creates marks/measures and logs
`<label>: <duration> milliseconds` when enabled
(`src/lib/PerformanceTracker.ts:32`, `src/lib/PerformanceTracker.ts:43`,
`src/lib/PerformanceTracker.ts:56`, `src/lib/PerformanceTracker.ts:70`). Timed regions include
vault loading and query search/render (`src/Obsidian/Cache.ts:244`,
`src/Renderer/QueryResultsRenderer.ts:152`).

## Cost model

Observed execution:

1. `SearchInfo` provides a copy of all cached tasks
   (`src/Query/SearchInfo.ts:21`);
2. filters run sequentially;
3. sorting runs;
4. the task limit slices;
5. grouping builds the group tree;
6. group limits apply;
7. rendering produces rows/tree
   (`src/Query/Query.ts:360`).

**Inference:** work usually grows with the number of candidate tasks, filters, comparisons during
sorting, group memberships, and rendered rows. Custom functions can add arbitrary work.

`query.allTasks` exposes the vault task collection to custom functions. Calling `.find()` or
`.filter()` on it once per candidate task can create quadratic-style work. `query.searchCache`
exists to memoise shared results across a query execution
(`src/Scripting/QueryContext.ts:23`).

This is an algorithmic warning, not a measured threshold.

## Measurement protocol

1. Record Tasks/Obsidian/device versions and vault task count.
2. Copy the exact query and note path.
3. Record result count and whether tree/columns/multiple grouping are enabled.
4. Enable Tasks' performance logging for the shortest useful period.
5. Reload/run the same query several times, separating cold and warm observations.
6. Copy only relevant timing lines.
7. Summarise with:

   ```bash
   node scripts/tasks-profile.mjs tasks-performance.log
   ```

8. Change one factor.
9. Repeat the same observations.
10. Report distributions/raw samples, not one cherry-picked run.

The profiler calculates count, minimum, median, p95, and maximum by label. It cannot attribute cause
or control other Obsidian work.

## Query review ladder

Use only after measuring or when reviewing obvious complexity.

1. **Correctness first.** Preserve the intended result set; test positive/negative fixtures.
2. **Scope early in human design.** Add a clear path/folder/status/date scope when it is part of the
   actual intent. Source still executes filters in written order, so put selective cheap filters
   before expensive custom functions.
3. **Avoid repeated vault scans in per-task JS.** Compute shared maps/sets through
   `query.searchCache`.
4. **Avoid unnecessary sort keys.** Sorting has comparison cost; keep only user-visible ordering.
5. **Use `limit` knowingly.** It runs after filtering/sorting, so it reduces grouping/rendering but
   not earlier search/sort work.
6. **Control rendered rows.** `show tree` can render non-matching descendants; multi-tag grouping can
   place one task in multiple groups.
7. **Review regex/custom code.** Prefer a built-in field filter when semantics are equivalent, but
   do not assert speed without before/after timings.
8. **Split dashboards only for usability or measured gain.** More blocks can repeat scanning work.

## Custom-function patterns

Potentially expensive:

```javascript
query.allTasks.filter(other => other.file.path === task.file.path)
```

executed for every candidate task.

Prefer shared computation:

```javascript
const counts = query.searchCache.countsByPath ??=
    query.allTasks.reduce((map, other) => {
            map.set(other.file.path, (map.get(other.file.path) ?? 0) + 1);
            return map;
        }, new Map());
return (counts.get(task.file.path) ?? 0) > 10;
```

Verify the exact `searchCache` API and return values against
[scripting](scripting.md) before using a recipe. Treat all custom code as executable and review its
security as well as cost.

## Symptom matrix

| Symptom | Separate first | Useful comparison |
|---|---|---|
| Slow startup | vault load/cache versus query render | load timing with dashboards closed/open |
| One slow block | search versus render | same filters with layout/group/tree removed |
| Slow only after JS | repeated scans/regex/property access | built-in equivalent or cached computation |
| Correct search, slow display | row count/tree/groups/CSS | `limit`, flat list, snippets disabled |
| Mobile-only slowness | device/engine/theme/plugin set | same vault/query on desktop and mobile |

## What the static linter can and cannot say

`tasks-query-lint.mjs` flags:

- per-task `query.allTasks.find/filter/map/reduce` without visible `searchCache`;
- oversized or nested-quantifier regexes;
- tree/group-limit/query constructs with known semantic cost or ambiguity;
- custom JS where a simple built-in may be clearer.

These are review prompts, not proof of slowness. The linter has no Obsidian cache, task count, device
profile, or runtime measurements.

## Validation

A performance recommendation is valid only if:

- result semantics stayed the same;
- input/device conditions were recorded;
- several comparable observations exist;
- the relevant timing distribution improved meaningfully;
- no correctness, portability, or maintainability regression was introduced.

Otherwise label it an unverified optimisation hypothesis.
