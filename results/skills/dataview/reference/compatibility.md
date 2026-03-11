# Reference: version, platform and upgrade compatibility

Compatibility boundary for the skill and its pinned primary source.

## Contents

1. [Studied identity](#1-studied-identity)
2. [Runtime compatibility](#2-runtime-compatibility)
3. [Version-sensitive surfaces](#3-version-sensitive-surfaces)
4. [Upgrade procedure](#4-upgrade-procedure)
5. [What is deliberately not promised](#5-what-is-deliberately-not-promised)

---

## 1. Studied identity

Primary source:

- repository: `blacksmithgu/obsidian-dataview`;
- exact Git tag: `0.5.70`;
- exact commit: `77ab745aee787d519642a87ed8f68be12fdc4b0d`;
- research basis: implementation source, documentation and upstream tests.

The tag is newer than the version embedded in `manifest.json` and `package.json`, both `0.5.68`
(`manifest.json:4`, `package.json:3`). At this pin, commits between the tags affect release
machinery and inline-field rendering; the artifact records the Git tag/commit as identity and
reports the embedded version rather than silently normalising it.

The checked-in verifier fingerprints the pinned material itself and exits distinctly when the
source is missing or the relevant source tree no longer matches.

## 2. Runtime compatibility

The manifest declares:

- minimum Obsidian version `0.13.11`;
- `isDesktopOnly: false`, so mobile installation is permitted (`manifest.json:5`).

This is a declared compatibility contract, not proof that every query, custom view or large
dashboard behaves identically on desktop and mobile.

Platform-sensitive surfaces:

- filesystem paths and `file://` CSV access;
- developer console availability;
- Electron-only globals used by DataviewJS;
- memory/rendering cost of large tables;
- emoji code-point differences in field names;
- keyboard commands and Live Preview selection behaviour.

For a mobile-only report, reproduce on the named platform and avoid claiming desktop source
inspection proves the UI result.

## 3. Version-sensitive surfaces

Always collect the installed Dataview version before answering:

```js
dv.paragraph(dv.api.version.current)
```

or inspect Settings → Community plugins → Dataview.

Treat these as especially version-sensitive:

- parser grammar and function catalogue;
- task metadata aliases and emoji shorthands;
- default settings and JS gates;
- inline-field Live Preview rendering;
- public `dv`/`DataviewAPI` methods;
- cache and refresh behaviour;
- task source rewriting.

If the installed version is outside `0.5.68`–`0.5.70`:

1. keep stable DQL fundamentals as hypotheses;
2. do not assert a trap or API method from this skill without checking that version;
3. ask for the exact error and a minimal fixture;
4. prefer a diagnostic query that reveals runtime type/value;
5. label any unverified transfer from this pin.

## 4. Upgrade procedure

When moving the research pin:

1. hydrate the new submodule commit and confirm its exact tag;
2. run upstream unit tests;
3. run `node scripts/verify.mjs --source-root <new-root>`;
4. inspect failures in parser, settings, data import, task rendering and API invariants;
5. regenerate the source fingerprint only after reviewing the diff;
6. run the fixture integration suite;
7. update frontmatter and the Sources and evidence section;
8. record changed behaviour, not a source-tree inventory;
9. leave the submodule clean.

For a user's vault upgrade:

1. save a backup/version-history checkpoint;
2. record current settings and custom prefixes;
3. keep a small dashboard containing representative LIST, TABLE, TASK, CALENDAR, inline DQL and
   DataviewJS examples;
4. update the plugin;
5. wait for full reindex;
6. compare result counts, types and one must-match/must-not-match fixture;
7. drop cached metadata only if results remain inconsistent.

## 5. What is deliberately not promised

- Datacore is a separate successor project and is not covered.
- A manifest mobile flag is not a mobile performance benchmark.
- Source-read behaviour involving Obsidian's renderer or MetadataCache is not a live experiment
  unless the artifact explicitly records one.
- Current upstream issue status is not inferred from the pinned source tree.
- DataviewJS copied from third parties is not trusted merely because the API surface is documented.
