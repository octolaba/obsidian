# Code review

How to run a review of an Obsidian plugin or theme and how to write it up. This file owns the
**procedure** and the **report format** only. Every rule a finding cites lives in the reference that
owns its subject, and this file points there by name rather than restating it — a rule written down
twice gets fixed once.

## Contents

- [Evidence boundary](#evidence-boundary)
- [The tier model](#the-tier-model)
- [Step 0: intake](#step-0-intake)
- [Step 1: the automated pass](#step-1-the-automated-pass)
- [Step 2: the manual sweep](#step-2-the-manual-sweep)
- [Severity and escalation](#severity-and-escalation)
- [Grandfathering](#grandfathering)
- [The report format](#the-report-format)
- [Worked example](#worked-example)
- [Validate the review](#validate-the-review)
- [Known gaps](#known-gaps)

## Evidence boundary

This file is procedure, not API surface: every rule it routes to is a documented sentence quoted in
the reference that owns it, and nothing here was executed against a live directory submission. The
report format and the sweep order are this skill's **Recommendation**; the tier model is read from
the source classes of the pinned pages.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Where a step names an API, its `@since` and its tier at this pin — **stable** at or below
1.12.7, **insider-only** above it — come from the reference that owns it.

## The tier model

A finding's **tier is a property of its source**, not of the reviewer's opinion. Derive it
mechanically from the pinned page the rule comes from; if you cannot cite a pinned page, you do not
have a finding, you have advice — say so.

| Tier | Source class | Normative strength, quoted | Where the rules are written up |
|---|---|---|---|
| `policy` | Developer policies | "Plugins and themes that don't follow these policies will be removed from the directory." (docs: en/Developer policies.md:3) | security and policies |
| `submission` | Submission requirements, the Submit guides, the Manifest reference | "requirements that all plugins must follow to be published" (docs: en/Plugins/Releasing/Submission requirements for plugins.md:1) | security and policies; releasing; project setup |
| `guideline` | Plugin guidelines, Theme guidelines | "the guidelines on this page are recommendations, depending on their severity, we may still require you to address any violations" (docs: en/Plugins/Releasing/Plugin guidelines.md:3) | the subject-owning reference |
| `checklist` | The October self-critique checklists | "A checklist for plugin developers to self-critique their plugins." (docs: en/Obsidian October plugin self-critique checklist.md:2) | the subject-owning reference |
| `convention` | The two templates and the typings' JSDoc | Observed template shape or a JSDoc remark; never stated as a rule | project setup; lifecycle and registration; whichever reference owns the API |

Two facts that make the model useful rather than bureaucratic:

- The guidelines page is the **empirical** review list: "This page lists common review comments plugin
  authors get when submitting their plugin" **Contract**
  (docs: en/Plugins/Releasing/Plugin guidelines.md:1). Guideline findings are what a human reviewer
  historically wrote back.
- The same sentence that calls them recommendations also authorises escalation
  (docs: en/Plugins/Releasing/Plugin guidelines.md:3). See
  [Severity and escalation](#severity-and-escalation).

The bundled linters use exactly this vocabulary and bind their exit status to it: findings at
`policy`, `submission`, or `guideline` exit `1`; `checklist` and `convention` findings alone are
printed and exit `0`. Keep the written report consistent with that split, so "the linter passed" and
"the review found nothing blocking" mean the same thing.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section.

## Step 0: intake

Never open a file before these are answered or recorded as assumptions.

1. **Plugin or theme.** They share the naming and policy rules and almost nothing else.
2. **State: `--new` or `--published`.** This is the single most consequential intake answer, because
   identity rules are one-way. Pre-first-release, naming and `id` rules are hard requirements.
   Post-release, the `id` is stable API **Observed** (sample: AGENTS.md:76) and the record contains a
   removal reading "ID changed, no response from developer after 30 days" **Observed**
   (rel: community-plugins-removed.json:630). On a published plugin, an `id` that violates the current
   charset rule is reported as *informational, with a counter-warning not to change it*.
3. **Target `minAppVersion`,** and how it compares with the stable app at this pin, 1.12.7
   **Observed** (rel: desktop-releases.json:3). A review that recommends an insider-only API to a
   plugin targeting 1.10 is worse than no review.
4. **The mobile claim.** Read `isDesktopOnly` from the manifest. It is a declaration with
   consequences: a plugin using Node.js or Electron APIs "**must** set `isDesktopOnly` to `true`"
   **Contract** (docs: en/Plugins/Releasing/Submission requirements for plugins.md:38). When it is
   `false`, the whole mobile rule set applies; when it is `true`, most of it does not. Do not sweep
   mobile rules against a plugin that has honestly excluded mobile.
5. **Bundle or repository.** An installed plugin folder contains a built `main.js`, not sources. In
   that case source rules cannot run at all — manifest, `versions.json`, and repository-shape checks
   are everything you have. Say this in the report's limitations block; a clean bundle-mode review is
   not a clean review. The bundled `plugin-lint.mjs` detects this and prints the same limitation.
6. **What the author wants.** A tier floor ("only things that block submission") changes the sweep
   depth, not the tiers themselves.
7. **For "nobody can install it":** the tag, the release assets, and whether the release is still a
   draft. Release mechanics are owned by the releasing reference and cause more delistings than the
   policy list does.

## Step 1: the automated pass

Run the machines first; they are cheap, and their output shapes where you spend attention.

**The bundled linters.** `plugin-lint.mjs` and `theme-lint.mjs` implement the rules that are traceable
to a pinned page, tag each finding with its tier and citation, and emit `text`, `json`, or `sarif`.
They read files only: they never execute the project, install dependencies, or write to it. Heuristic
rules are labelled as candidates. Pass `--new` or `--published` to match the intake answer.

```sh
node scripts/plugin-lint.mjs --plugin-root <dir> [--new|--published] [--release] [--format text|json|sarif]
node scripts/theme-lint.mjs  --theme-root  <dir> [--new|--published] [--format text|json|sarif]
```

Read the report, not the status: exit `0` means clean **or advisory-only** — a run carrying only
`checklist` and `convention` findings exits `0`, and exit `1` means at least one finding at `policy`,
`submission`, or `guideline`. In a bundle-mode run (an installed plugin folder rather than a
repository) only the manifest and `versions.json` checks ran; the printed `limitations` block names
every family that was skipped, and a clean report there is not a clean review.

**The project's own lint, if it has one.** The plugin template wires a first-party ESLint rule set:
`eslint-plugin-obsidianmd` as a dev dependency **Observed** (sample: package.json:20), spread as
`...obsidianmd.configs.recommended` in the **last** position of the flat config **Observed**
(sample: eslint.config.mts:31) so it wins over local blocks, and executed in CI on every branch and
every pull request **Observed**
(sample: .github/workflows/lint.yml:3-7; sample: .github/workflows/lint.yml:27).
If `npm run lint` fails in a submission you are reviewing, the
author has not run their own gate — say that once and move on.

**It lints the manifest too.** `manifest.json` is deliberately absent from `globalIgnores`
**Observed** (sample: eslint.config.mts:6-16), the parser is told to accept `.json` via
`extraFileExtensions` **Observed** (sample: eslint.config.mts:27), and the manifest is listed in
`allowDefaultProject` **Observed** (sample: eslint.config.mts:24). The machinery underneath is
visible in the lock file: the rule set pulls in `@eslint/json` **Observed**
(sample: package-lock.json:2333) plus `eslint-plugin-json-schema-validator`
(sample: package-lock.json:2342), `eslint-plugin-no-unsanitized`
(sample: package-lock.json:2343), `eslint-plugin-security` (sample: package-lock.json:2344),
`@microsoft/eslint-plugin-sdl` (sample: package-lock.json:2334), and `eslint-plugin-depend`
(sample: package-lock.json:2340). **Inference:** manifest schema checks and the `innerHTML` family are
plausibly already covered by CI in any project scaffolded from the template.

**Positioning — read this before quoting the ESLint plugin.** It is a **CI-grade complement** to this
review, not a substitute and not a source. **Gap:** its rule bodies are not vendored in any pinned
source here, so no individual rule id can be verified, quoted, or used as evidence. Run it, read its
output, and then justify each finding you keep with a citation into the pinned documentation. A
finding whose only support is "ESLint flagged it" is not reportable at any tier.

## Step 2: the manual sweep

Sweep in tier order — `policy` → `submission` → `guideline` → `checklist` → `convention`. Highest
consequence first, and the first two tiers are gates rather than opinions. **Always complete the
policy and submission sweeps**, even under a tier floor; sample the rest if the author asked for a
floor, and record what you sampled.

| Sweep | What you are looking for | Rules owned by |
|---|---|---|
| `policy` | README disclosures versus observed behaviour (network, accounts, payment, files outside the vault, ads); telemetry including transitive; self-update or fetch-and-eval; obfuscated or minified committed source; LICENSE presence; fork provenance; theme network assets | security and policies |
| `submission` | Manifest required fields and shapes; description rules; `id` and `name`; truthfulness of `isDesktopOnly`; command ids; leftover sample code; root `README`/`LICENSE`/screenshot; version, tag, and release assets | security and policies (rules); project setup (manifest and naming); releasing (release and submission mechanics) |
| `guideline` | Global `app`; console noise; resource cleanup and leaf handling; default hotkeys; workspace and editor access; vault write API and path lookup; `normalizePath`; editor-extension reconfiguration; hardcoded styling; settings UI copy; theme scope, `!important`, `:has()` | lifecycle and registration; workspace, views, and state; vault and metadata; settings; UI surfaces; editor extensions; themes and CSS |
| `checklist` | `configDir` instead of a hardcoded folder; `trashFile`; `loadData`/`saveData`; `as any`; `var`; `moment` imported from `obsidian`; deferred views; production minification; `onLayoutReady`; committed lock file | the same owners, plus performance and mobile and compatibility |
| `convention` | Bundler externals, production build settings, template shape, typings-level idioms | project setup; lifecycle and registration |

Two sweep habits that pay for themselves:

- **Read the README against the code, not on its own.** Most policy findings are a mismatch between
  what the code does and what the README admits. The directory renders that README inside the app
  **Contract** (rel: README.md:21), so it is the disclosure surface, not documentation.
- **Check the manifest against the code, not against itself.** `isDesktopOnly: false` beside a Node
  import is a submission finding; `isDesktopOnly: true` makes the same import correct.

## Severity and escalation

Plugins run with the app's privileges. "Due to technical limitations, Obsidian cannot reliably
restrict plugins to specific permissions or access levels. This means that plugins will inherit
Obsidian's access levels" **Contract** (help: en/Extending Obsidian/Plugin security.md:26), and users
are told plugins can reach their files, the network, and other programs **Contract**
(help: en/Extending Obsidian/Plugin security.md:28-30).

**Consequence: a security finding is never style.** The clearest case is the `innerHTML` family, whose
own guideline states that injected markup "can allow a potential attacker to execute arbitrary code on
the user's computer" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:82). Its source
page is nominally recommendations — and that same page authorises requiring a fix "depending on their
severity" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:3).

How to express that without breaking the model:

- **Keep the tier bound to the source.** The finding stays `guideline` because that is where the rule
  is written. Do not relabel it `policy`; the tier is how a reader finds the rule.
- **Carry the escalation in the finding's `consequence` and in a `blocking: yes` line**, justified by
  the sentence above. Say "blocking" in words rather than inventing a sixth tier.
- **Never demote a `policy` finding** because the diff is small or the author is well-meaning. Policy
  violations are removal-grade by their own wording (docs: en/Developer policies.md:3).
- **Never inflate a heuristic.** A pattern match is a candidate. Report it at `medium` or `low`
  confidence with the reason it might be wrong, and let the author resolve it.

## Grandfathering

The directory predates the rules you are applying. Live entries contain `id` values with uppercase
letters, a dot, and underscores **Observed**
(rel: community-plugins.json:185; rel: community-plugins.json:4301; rel: community-plugins.json:6926),
while the rule reads "The ID must
contain only lowercase letters and hyphens, can't end with `plugin`, and can't contain `obsidian`"
**Contract** (docs: en/Reference/Manifest.md:27).

The operational reading:

- **Rules bind new submissions.** Apply identity rules strictly when the intake state is `--new`.
- **Rules also bind re-reviews.** Review is automated per version at submission **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:59) and every plugin version is scanned
  **Contract** (help: en/Extending Obsidian/Plugin security.md:37), so a legacy violation can surface
  on a later release. Report it — but report it as *informational* on a published plugin, with the
  cost of changing it stated.
- **Never advise changing a published `id`.** See [Step 0](#step-0-intake). A **name** may be changed
  by editing `manifest.json`, but "If the new name is invalid, the directory delists the plugin until
  you resolve the problem" **Contract** (docs: en/Reference/Manifest.md:37) — so a rename is itself a
  risk to weigh, not a free fix.
- **Do not cite the directory as permission.** That other plugins break a rule is evidence about
  history, not an exemption.

## The report format

One block per finding, in tier order, then three closing blocks. Keep it terse; a review nobody reads
fixes nothing.

```text
[<id>] <one-line title>
  tier:        policy | submission | guideline | checklist | convention
  confidence:  high | medium | low
  blocking:    yes | no            (only when it differs from the tier's default)
  location:    <path> line <n>     (in the reviewed project)
  evidence:    <what the code does, in one sentence>
  rule:        "<quoted rule>" (alias: path:line)
  consequence: <what happens to the user or the submission if it stands>
  fix:         <the smallest change that resolves it>
```

Rules for the fields:

- **`location`** names the **reviewed** project and is written `path` line `n`, never `path:n`. The
  `path:line` shape is reserved for citations into the pinned sources, and mixing them makes a review
  unreadable. The linters emit the same information as their machine-readable `file:line` field.
- **`rule`** is the only place a pinned citation appears, and it must be verifiable — quote enough of
  the sentence that a reader can confirm it at that line.
- **`consequence`** is what makes a finding actionable. "Violates a guideline" is not a consequence;
  "the automated review will block installability" and "an attacker-controlled note can execute code"
  are.
- **`fix`** is minimal and concrete. If the fix is a redesign, say so and give the first step.
- **`confidence`** is about the *evidence*, not the rule: `high` when you read the offending code,
  `medium` for a strong pattern match, `low` for a heuristic that has known false positives.

Closing blocks, all three mandatory:

```text
Assumptions
  - <intake answers you had to guess, each one testable>

Limitations
  - <what was not reviewed, and why: bundle mode, sampled tiers, unavailable sources>

Validated with
  - <tools and modes actually run, plus what was checked by hand>
```

Two prohibitions worth stating in the report itself when relevant: this review **cannot predict the
directory's automated verdict** — its criteria are not published in any pinned source — and it is
**not a security audit**; the help site tells users to commission an independent one for sensitive
data **Contract** (help: en/Extending Obsidian/Plugin security.md:33).

## Worked example

Three findings from a review of a hypothetical plugin at intake state `--new`, `isDesktopOnly: false`,
`minAppVersion` 1.5.0. Every `rule` line below is a real rule, re-verified at the cited line.

```text
[REV-1] Network calls to a third-party service are not disclosed in the README
  tier:        policy
  confidence:  medium
  location:    src/sync.ts line 44
  evidence:    requestUrl() posts note content to an external host; README has no
               section describing a remote service.
  rule:        "Network use. Clearly explain which remote services are used and why
               they're needed." (docs: en/Developer policies.md:28)
  consequence: Disclosure-gated behaviour without disclosure is a policy violation, and
               the README is what the directory renders on the plugin's detail page
               (rel: README.md:21), so users cannot learn this anywhere else.
  fix:         Add a README section naming the service, the data sent, and why it is
               needed. If it is optional, say what happens when it is off.

[REV-2] innerHTML is assigned an interpolated string built from note content
  tier:        guideline
  confidence:  high
  blocking:    yes
  location:    src/render.ts line 118
  evidence:    containerEl.innerHTML = `<div>${title}</div>` where title comes from a
               file's frontmatter.
  rule:        "Building DOM elements from user-defined input, using `innerHTML`,
               `outerHTML` and `insertAdjacentHTML` can pose a security risk."
               (docs: en/Plugins/Releasing/Plugin guidelines.md:80)
  consequence: Markup in a note can "execute arbitrary code on the user's computer"
               (docs: en/Plugins/Releasing/Plugin guidelines.md:82), and plugins inherit
               the app's access levels (help: en/Extending Obsidian/Plugin security.md:26).
               Guideline tier by source, blocking by consequence
               (docs: en/Plugins/Releasing/Plugin guidelines.md:3).
  fix:         Build the node with createEl()/createDiv()/createSpan()
               (docs: en/Plugins/Releasing/Plugin guidelines.md:92); pass the title as
               text rather than markup.

[REV-3] Manifest description opens with "This is a plugin" and has no final period
  tier:        submission
  confidence:  high
  location:    manifest.json line 6
  evidence:    "This is a plugin that syncs your notes"
  rule:        "Avoid starting your description with 'This is a plugin'"
               (docs: en/Plugins/Releasing/Submission requirements for plugins.md:24) and
               "End with a period `.`."
               (docs: en/Plugins/Releasing/Submission requirements for plugins.md:30)
  consequence: The plugin "won't be installable from within Obsidian until the automated
               review passes" (docs: en/Plugins/Releasing/Submit your plugin.md:61), and
               each correction requires a new release with an incremented version
               (docs: en/Plugins/Releasing/Submit your plugin.md:59) — so this costs a
               version number if it reaches submission.
  fix:         Rewrite as an action statement ending with a period, for example
               "Sync notes with <service>."

Assumptions
  - Intake state --new: no published release exists, so identity rules are applied hard.
  - isDesktopOnly is false as declared, so mobile rules were swept.

Limitations
  - Source review covered src/ only; no dependency tree audit was performed, and
    transitive telemetry cannot be ruled out from reading first-party code.
  - The checklist and convention tiers were sampled, not swept, at the author's request.
  - This review cannot predict the directory's automated verdict; its criteria are not
    published.

Validated with
  - plugin-lint.mjs --new (bundled), theme rules not applicable.
  - The project's own npm run lint (passes).
  - Manual policy and submission sweeps, complete.
```

The rules quoted above are owned elsewhere: REV-1 and REV-3 by the security-and-policies reference
(its Disclosures and Submission-requirements sections), REV-2 by the same reference's DOM-safety
section. This file supplied only the shape.

## Validate the review

Before handing it over:

1. Every finding carries a tier **derived from its citation's source page**, not from judgement.
2. Every citation was re-resolved against the pinned source at the line given.
3. Reviewed-project locations are written `path` line `n` and are never confused with citations.
4. Heuristic findings state their false-positive mode and carry `medium` or `low` confidence.
5. Linter output was **interpreted**: anything dropped has a stated reason, and nothing was pasted
   through unread.
6. Mobile, performance, and security were each swept or explicitly declared out of scope.
7. The intake state (`--new` versus `--published`) is visible in the report, and no advice contradicts
   it — in particular, no advice to change a published `id`.
8. The three closing blocks are present, and the limitations block names bundle mode or sampling if
   either applied.
9. Nothing claims the submission will pass.

## Known gaps

- **The ESLint rule set is not in evidence** — see [Step 1](#step-1-the-automated-pass). Its rule ids
  cannot be cited.
- **The directory's automated review criteria are unpublished.** "Reviewed automatically" is the whole
  of the documented process (docs: en/Plugins/Releasing/Submit your plugin.md:59); the scorecard's
  categories are named but not specified (help: en/Extending Obsidian/Plugin security.md:37).
- **No review was executed against a live directory submission**, and the app is closed source, so
  every enforcement claim here is read from documentation and directory data.
- **Agent behaviour is not evaluated.** How reliably this procedure is triggered and followed in a
  clean context has not been measured, and nothing here is evidence about it.
- **Theme reviews have a thinner rule corpus.** The theme guidelines and theme checklist are short
  compared with their plugin counterparts, so more theme findings land at `convention` with no pinned
  rule behind them — report those as advice, not findings.
