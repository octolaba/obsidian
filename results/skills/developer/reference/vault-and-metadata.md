# Vault and metadata

Everything a plugin does to files: which API layer to use, how to read and write without losing a
user's note, how to find files and frontmatter, what the metadata cache actually contains, and the
storage APIs that are not files at all.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Vault versus adapter](#vault-versus-adapter)
- [Finding files](#finding-files)
- [Paths and the config folder](#paths-and-the-config-folder)
- [Reading](#reading)
- [Writing](#writing)
- [Deleting, renaming, and moving](#deleting-renaming-and-moving)
- [FileManager](#filemanager)
- [Vault events](#vault-events)
- [The metadata cache](#the-metadata-cache)
- [Cached metadata shapes](#cached-metadata-shapes)
- [Storage APIs that are not files](#storage-apis-that-are-not-files)
- [The canvas file format](#the-canvas-file-format)
- [Known gaps](#known-gaps)

## Evidence boundary

Signatures, `@since` tags, and the normative "prefer X over Y" JSDoc come from the typings; rationale
and worked recipes come from the narrative documentation and the submission guidelines. Nothing here
was executed against a running vault. Members the typings leave without a version tag are written
**untagged, availability unknown**: declaration at the 1.13.2 pin does not establish compatibility
with 1.12.7. A lower floor needs another pinned official source or runtime verification.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Every API named states its `@since` and its tier at this pin — *stable* at or below 1.12.7,
*insider-only* above it.

**Which storage to choose** — `data.json`, frontmatter, ordinary files, secrets, or per-device local
storage — is the decision guides reference. This file owns the contracts of the mechanisms once the
choice is made.

## Vault versus adapter

Two layers exist. `Vault` @0.9.7, stable, is "Work with files and folders stored inside a vault"
(api: obsidian.d.ts:7332-7337); `DataAdapter`, reachable as `vault.adapter` (api: obsidian.d.ts:7342),
is "Work directly with files and folders inside a vault. **If possible prefer using the `Vault` API
over this**" **Contract** (api: obsidian.d.ts:2001-2006), untagged, availability unknown.

The guidelines give the two reasons: "**Performance:** The Vault API has a caching layer that can
speed up file reads when the file is already known to Obsidian. **Safety:** The Vault API performs
file operations serially to avoid any race conditions, for example when reading a file that is being
written to at the same time" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:221-222).

The one thing only the adapter can do: "The Vault API only allows access to the files visible inside
the app, files included in hidden folders can only be accessed using the Adapter API" **Contract**
(docs: en/Plugins/Vault.md:7). Reading your own plugin's sibling files, or anything under the config
folder, therefore goes through the adapter.

Two adapter implementations exist and they are **not** the same shape:

| Implementation | Platform | Extras | `@since` | Tier |
|---|---|---|---|---|
| `FileSystemAdapter` (api: obsidian.d.ts:2996) | "Implementation of the vault adapter for desktop" (api: obsidian.d.ts:2993) | `getBasePath()` (api: obsidian.d.ts:3005) and other real-path helpers | untagged | unknown |
| `CapacitorAdapter` (api: obsidian.d.ts:1483) | "Implementation of the vault adapter for mobile devices" (api: obsidian.d.ts:1479) | no `getBasePath` | 1.7.2 | stable |

**Recommendation:** narrow with `adapter instanceof FileSystemAdapter` before touching a desktop-only
member; a bare cast compiles and then throws on mobile. The platform-gating rules themselves belong to
the mobile and compatibility reference.

Every adapter path parameter is documented "use `normalizePath` to normalize beforehand" **Contract**
(api: obsidian.d.ts:2016; api: obsidian.d.ts:2023; api: obsidian.d.ts:2030).

## Finding files

| Call | Returns | `@since` | Tier |
|---|---|---|---|
| `getFileByPath(path)` (api: obsidian.d.ts:7367) | `TFile \| null` | 1.5.7 | stable |
| `getFolderByPath(path)` (api: obsidian.d.ts:7376) | `TFolder \| null` | 1.5.7 | stable |
| `getAbstractFileByPath(path)` (api: obsidian.d.ts:7385) | `TAbstractFile \| null` | 0.11.11 | stable |
| `getRoot()` (api: obsidian.d.ts:7392) | `TFolder` | 0.9.7 | stable |
| `getMarkdownFiles()` (api: obsidian.d.ts:7559) | `TFile[]` | 0.9.7 | stable |
| `getFiles()` (api: obsidian.d.ts:7565) | `TFile[]` | 0.9.7 | stable |
| `getAllLoadedFiles()` (api: obsidian.d.ts:7540) | `TAbstractFile[]` | 0.9.7 | stable |
| `getAllFolders(includeRoot?)` (api: obsidian.d.ts:7547) | `TFolder[]` | 1.6.6 | stable |
| `Vault.recurseChildren(root, cb)` (api: obsidian.d.ts:7553) | static walk | 0.9.7 | stable |

**Never scan to resolve a path.** "This is inefficient, especially for large vaults" and the
anti-pattern is named explicitly — `getFiles().find(file => file.path === filePath)` **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:226; docs: en/Plugins/Releasing/Plugin guidelines.md:231).
Use the typed lookups above.

The path argument is "vault absolute path to the folder or file, with extension, **case sensitive**"
**Contract** (api: obsidian.d.ts:7380). When you do not know whether a path is a file or a folder,
`getAbstractFileByPath` plus `instanceof` is the documented shape — "To check if the return type is a
file, use `instanceof TFile`. To check if it is a folder, use `instanceof TFolder`" **Contract**
(api: obsidian.d.ts:7378-7379; docs: en/Plugins/Vault.md:107; docs: en/Plugins/Vault.md:112-115).

The file types, all @0.9.7 and stable: `TAbstractFile` carries `vault`, `path`, `name`, and
`parent: TFolder | null` (api: obsidian.d.ts:6953-6973); `TFile` adds `stat`, `basename`, and
`extension` (api: obsidian.d.ts:7129-7144); `TFolder` adds `children` and `isRoot()`
(api: obsidian.d.ts:7152-7157; api: obsidian.d.ts:7163).

**A unit trap in the stats.** `FileStats.ctime`/`mtime` are "a unix timestamp, in milliseconds"
(api: obsidian.d.ts:2976; api: obsidian.d.ts:2981), and `DataWriteOptions` says the same
(api: obsidian.d.ts:2150; api: obsidian.d.ts:2156) — but the adapter-level `Stat` documents the same
two fields as "a unix timestamp" with no unit (api: obsidian.d.ts:6814; api: obsidian.d.ts:6819).
**Unverified:** whether the adapter really reports a different unit or the JSDoc is merely abbreviated.
**Recommendation:** read timestamps from `TFile.stat`, where the unit is documented.

## Paths and the config folder

`normalizePath(path)` is untagged, with availability unknown (api: obsidian.d.ts:4606); the typings give it no JSDoc
at all, so its contract comes from the guidelines: use it "whenever you accept user-defined paths to
files or folders in the vault, or when you construct your own paths in the plugin code", and it
cleans up repeated forward and backward slashes, strips leading and trailing slashes, replaces
non-breaking spaces with regular spaces, and runs the result through `String.prototype.normalize`
**Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:262; docs: en/Plugins/Releasing/Plugin guidelines.md:266-269).

`vault.configDir` is "the path to the config folder. This value is typically `.obsidian` but it could
be different" @0.11.1, stable **Contract** (api: obsidian.d.ts:7344-7350). **Recommendation:** never
write the literal `.obsidian` into a path — build it from `configDir`. A hardcoded value silently
misses every vault whose config folder was renamed.

## Reading

Two reads, and the difference is narrower than it looks:

- `read(file)` — "Read a plaintext file that is stored inside the vault, directly from disk. Use this
  if you intend to modify the file content afterwards. Use `Vault.cachedRead` otherwise for better
  performance" @0.9.7, stable **Contract** (api: obsidian.d.ts:7422-7428).
- `cachedRead(file)` — "Use this if you only want to display the content to the user. If you want to
  modify the file content afterward use `Vault.read`" @0.9.7, stable **Contract**
  (api: obsidian.d.ts:7430-7436).

The precise difference: "The only difference between `cachedRead()` and `read()` is when the file was
modified outside of Obsidian just before the plugin reads it. As soon as the file system notifies
Obsidian that the file has changed from the outside, `cachedRead()` behaves *exactly* like `read()`.
Similarly, if you save the file within Obsidian, the read cache is flushed as well" **Contract**
(docs: en/Plugins/Vault.md:31).

Binary and resource variants: `readBinary(file)` @0.9.7 (api: obsidian.d.ts:7442) and
`getResourcePath(file)` — "Returns a URI for the browser engine to use, for example to embed an
image" @0.9.7, stable (api: obsidian.d.ts:7445-7449).

## Writing

Choose the write API by *what* you are writing to, not by what is convenient:

| Target | Use | Why |
|---|---|---|
| The note the user is editing | the `Editor` API | `Vault.modify` loses "cursor position, selection, and folded content" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:198) |
| A file in the background, content depends on current content | `Vault.process` | atomic; "your plugin won't run into conflicts with other plugins modifying the same file" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:206) |
| A file in the background, content is independent | `Vault.modify` | no read to race against |
| Frontmatter | `FileManager.processFrontMatter` | see [FileManager](#filemanager) |
| A new file | `Vault.create` / `createBinary` / `createFolder` | the create pair throws when the target exists |

| Call | `@since` | Tier | Note |
|---|---|---|---|
| `create(path, data, options?)` (api: obsidian.d.ts:7402) | 0.9.7 | stable | |
| `createBinary(path, data, options?)` (api: obsidian.d.ts:7412) | 0.9.7 | stable | "@throws Error if file already exists" (api: obsidian.d.ts:7408) |
| `createFolder(path)` (api: obsidian.d.ts:7420) | 1.4.0 | stable | "@throws Error if folder already exists" (api: obsidian.d.ts:7416) |
| `modify(file, data, options?)` (api: obsidian.d.ts:7483) | 0.9.7 | stable | |
| `append(file, data, options?)` (api: obsidian.d.ts:7501) | 0.13.0 | stable | |
| `appendBinary(file, data, options?)` (api: obsidian.d.ts:7510) | 1.12.3 | stable | |
| `process(file, fn, options?)` (api: obsidian.d.ts:7526) | 1.1.0 | stable | returns the written text |
| `copy(file, newPath)` (api: obsidian.d.ts:7534) | 1.8.7 | stable | |

`process` is the race-free primitive: "**Atomically** read, modify, and save the contents of a note",
whose callback "returns the new content of the note **synchronously**" and whose return value is "the
text value of the note that was written" **Contract** (api: obsidian.d.ts:7512-7526). The narrative
page states the rule flatly: "Always prefer `Vault.process()` over `Vault.read()`/`Vault.modify()` to
avoid unintentional loss of data" **Contract** (docs: en/Plugins/Vault.md:84).

**The asynchronous recipe.** Because the callback must be synchronous, work that needs `await` cannot
happen inside it. The documented sequence is: read with `cachedRead()`, do the async work, then write
with `process()` — and inside the callback, "check that the `data` in the `process()` callback is the
same as the data returned by `cachedRead()`. If they aren't the same, that means that the file was
changed by a different process, and you may want to ask the user for confirmation, or try again"
**Contract** (docs: en/Plugins/Vault.md:88; docs: en/Plugins/Vault.md:90-92; docs: en/Plugins/Vault.md:94).
Skipping that comparison reintroduces exactly the lost-update bug `process` exists to prevent.

## Deleting, renaming, and moving

| Call | Semantics | `@since` | Tier |
|---|---|---|---|
| `Vault.delete(file, force?)` (api: obsidian.d.ts:7457) | "Deletes the file completely"; `force` — "Should attempt to delete folder even if it has hidden children" (api: obsidian.d.ts:7451-7453) | 0.9.7 | stable |
| `Vault.trash(file, system)` (api: obsidian.d.ts:7465) | "Tries to move to system trash. If that isn't successful/allowed, use local trash"; `false` forces local trash (api: obsidian.d.ts:7459-7461) | 0.9.7 | stable |
| `FileManager.trashFile(file)` (api: obsidian.d.ts:2920) | trashes "according the user's preferred 'trash' options (either moving the file to .trash/ or the OS trash bin)" (api: obsidian.d.ts:2914-2915) | 1.6.6 | stable |
| `Vault.rename(file, newPath)` (api: obsidian.d.ts:7474) | "Rename or move a file. **To ensure links are automatically renamed, use `FileManager.renameFile` instead**" (api: obsidian.d.ts:7467-7468) | 0.9.11 | stable |
| `FileManager.renameFile(file, newPath)` (api: obsidian.d.ts:2902) | "Rename or move a file safely, **and update all links to it** depending on the user's preferences" (api: obsidian.d.ts:2896) | 0.11.0 | stable |

**Recommendation:** in plugin code the `FileManager` member is almost always the right one in both
pairs. `Vault.delete` "removes the file without a trace" while `trash()` "moves the file to the trash
bin" **Contract** (docs: en/Plugins/Vault.md:100-101), and only `trashFile` honours the setting the
user actually chose. Reserve `Vault.rename` for paths where links genuinely must not follow.

`FileManager.promptForDeletion(file)` @0.15.0, stable, "resolves to true if the prompt was confirmed
or false if it was canceled" **Contract** (api: obsidian.d.ts:2905-2911) — the way to delete *with*
the user's confirmation instead of behind their back.

## FileManager

`FileManager` @0.9.7, stable, exists to "Manage the creation, deletion and renaming of files from the
UI" (api: obsidian.d.ts:2877-2881) — meaning it applies the user's preferences, which the raw `Vault`
calls do not.

**`processFrontMatter(file, fn, options?)`** @1.4.4, stable (api: obsidian.d.ts:2954) is the only
supported way to touch frontmatter. Its JSDoc carries five separate contracts
(api: obsidian.d.ts:2934-2952):

1. "**Atomically** read, modify, and save the frontmatter of a note."
2. "The frontmatter is passed in as a JS object, and should be mutated **directly**" — returning a new
   object does nothing.
3. The callback "mutates the frontmatter object **synchronously**" — the same constraint as
   `Vault.process`.
4. "@throws YAMLParseError if the YAML parsing fails."
5. "@throws any errors that your callback function throws", under a blunt instruction: "Remember to
   handle errors thrown by this method."

Consequence: a single note with malformed YAML anywhere in the user's vault will reject your write
with an exception rather than a return value. **Recommendation:** wrap every call, and report the
offending path — an unhandled `YAMLParseError` inside a bulk operation aborts the rest of the run. The
guidelines add the positive case for it: hand-parsing is worse because `processFrontMatter` "runs
atomically" and "will also ensure a consistent layout of the YAML produced" **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:212-213).

Three more members that encode user preferences:

- `getAvailablePathForAttachment(filename, sourcePath?)` @1.5.7, stable — "Resolves a unique path for
  the attachment file being saved. **Ensures that the parent directory exists** and **dedupes the
  filename** if the destination filename already exists", with `sourcePath` defaulting to "the
  workspace's active file" **Contract** (api: obsidian.d.ts:2957-2967). Anything that saves an
  attachment should use it rather than inventing a path.
- `getNewFileParent(sourcePath, newFilePath?)` @1.1.13, stable — "Gets the folder that new files
  should be saved to, given the user's preferences"; pass an empty `sourcePath` "if there is no active
  file" **Contract** (api: obsidian.d.ts:2884-2893).
- `generateMarkdownLink(file, sourcePath, subpath?, alias?)` @0.12.0, stable — "Generate a Markdown
  link based on the user's preferences", where `sourcePath` is "where the link is stored in, used to
  compute relative links" and an empty `alias` means "use file name" **Contract**
  (api: obsidian.d.ts:2923-2931). It respects the wikilink-versus-Markdown and relative-versus-absolute
  settings; string concatenation does not.

## Vault events

All four are `on(name, callback): EventRef` on `Vault` @0.9.7, stable, and must be wrapped in
`Component.registerEvent` — see the lifecycle and registration reference.

| Event | Callback | Line |
|---|---|---|
| `create` | `(file: TAbstractFile)` | (api: obsidian.d.ts:7574) |
| `modify` | `(file: TAbstractFile)` | (api: obsidian.d.ts:7580) |
| `delete` | `(file: TAbstractFile)` | (api: obsidian.d.ts:7586) |
| `rename` | `(file: TAbstractFile, oldPath: string)` | (api: obsidian.d.ts:7592) |

`create` fires "when the vault is first loaded for each existing file" unless you register it inside
`onLayoutReady` **Contract** (api: obsidian.d.ts:7567-7570); that startup rule and its cost belong to
the lifecycle and registration and performance references.

## The metadata cache

`MetadataCache` is untagged, with availability unknown (api: obsidian.d.ts:4404). Its class JSDoc defines the
vocabulary every link API uses: "Linktext is any internal link that is composed of a path and a
subpath, such as 'My note#Heading'. Linkpath (or path) is the path part of a linktext. Subpath is the
heading/block ID part of a linktext" **Contract** (api: obsidian.d.ts:4398-4400).

| Member | Purpose | `@since` | Tier |
|---|---|---|---|
| `getFileCache(file)` (api: obsidian.d.ts:4417) | `CachedMetadata \| null` for an open `TFile` | 0.9.21 | stable |
| `getCache(path)` (api: obsidian.d.ts:4422) | same, by path | 0.14.5 | stable |
| `getFirstLinkpathDest(linkpath, sourcePath)` (api: obsidian.d.ts:4411) | "Get the best match for a linkpath" (api: obsidian.d.ts:4407) | 0.12.5 | stable |
| `fileToLinktext(file, sourcePath, omitMdExtension?)` (api: obsidian.d.ts:4431) | "If file name is unique, use the filename. If not unique, use full path" (api: obsidian.d.ts:4427-4428) | untagged | unknown |
| `resolvedLinks` (api: obsidian.d.ts:4438) | source path → destination path → count (api: obsidian.d.ts:4434-4435) | untagged | unknown |
| `unresolvedLinks` (api: obsidian.d.ts:4444) | same shape, unknown destinations (api: obsidian.d.ts:4440) | untagged | unknown |

Four events, all untagged with availability unknown:

| Event | Callback | Contract |
|---|---|---|
| `changed` (api: obsidian.d.ts:4453) | `(file, data, cache)` | "Called when a file has been indexed, and its (updated) cache is now available" (api: obsidian.d.ts:4447) |
| `deleted` (api: obsidian.d.ts:4459) | `(file, prevCache)` | the previous cache is best-effort and "could be null" (api: obsidian.d.ts:4455-4456) |
| `resolve` (api: obsidian.d.ts:4466) | `(file)` | fires after indexing, "sometimes after a file has been indexed" (api: obsidian.d.ts:4462-4463) |
| `resolved` (api: obsidian.d.ts:4471) | `()` | "Called when all files has been resolved. This will be fired each time files get modified after the initial load" (api: obsidian.d.ts:4468) |

**The rename trap.** `changed` is "**not called when a file is renamed for performance reasons. You
must hook the vault rename event for those**" **Contract** (api: obsidian.d.ts:4449-4450). Any index
your plugin keys by path — a backlink table, a cached parse, a settings entry naming a note — goes
stale on rename unless you also subscribe to the vault `rename` event above.

**Indexing is asynchronous.** `changed` and `resolve` are separate events for a reason, and `resolved`
fires repeatedly, not once. **Inference:** the cache for a file you just wrote is not guaranteed to be
current on the next line; wait for the event rather than reading straight back.

## Cached metadata shapes

`CachedMetadata` has **every field optional** (api: obsidian.d.ts:1402) — an empty note yields an
object with nothing in it, and each accessor needs a guard. The fields, with the ones that carry a
version tag marked:

`links`, `embeds`, `tags`, `headings`, `sections`, `listItems`, `frontmatter`, and `blocks` are
untagged (api: obsidian.d.ts:1406-1418; api: obsidian.d.ts:1438-1446; api: obsidian.d.ts:1462);
`footnotes` is @1.6.6 (api: obsidian.d.ts:1423); `footnoteRefs` and `referenceLinks` are @1.8.7
(api: obsidian.d.ts:1428; api: obsidian.d.ts:1433); `frontmatterPosition` and `frontmatterLinks`
are @1.4.0 (api: obsidian.d.ts:1452; api: obsidian.d.ts:1458). The dated fields are stable at pin;
the untagged fields have unknown availability.

Three shapes worth reading closely:

- **`ListItemCache.parent` is negatively encoded.** "Line number of the parent list item
  (position.start.line). If this item has no parent (e.g. it's a root level list), then this value is
  the **negative** of the line number of the first list item (start of the list)" — and the typings
  spell out both uses: "Can be used to deduce which list items belongs to the same group
  (item1.parent === item2.parent). Can be used to reconstruct hierarchy information" **Contract**
  (api: obsidian.d.ts:3760-3769). Treating it as a plain line number produces negative indices on
  every top-level item.
- **`SectionCache.type` is open.** The union lists thirteen names and then admits "Typing is
  non-exhaustive, more types can be available than are documented here" **Contract**
  (api: obsidian.d.ts:5674-5679). Write a default branch.
- **`ListItemCache.task` is a character, not a boolean.** "The space character `' '` is interpreted as
  an incomplete task. Any other character is interpreted as completed task. `undefined` if this item
  isn't a task" **Contract** (api: obsidian.d.ts:3753-3756).

Positions are `Loc` objects with a **0-based** `line`, a `col`, and an `offset`
(api: obsidian.d.ts:3884-3899) — off-by-one against anything user-facing.

Frontmatter helpers, all stable:

| Helper | What it does | `@since` |
|---|---|---|
| `getAllTags(cache)` (api: obsidian.d.ts:3332) | "Combines all tags from frontmatter and note content into a single array" (api: obsidian.d.ts:3329) | untagged |
| `getFrontMatterInfo(content)` (api: obsidian.d.ts:3344) | offsets and text for a raw string; `from`/`to` exclude the `---`, `contentStart` includes it (api: obsidian.d.ts:3255-3260) | 1.5.7 |
| `parseFrontMatterEntry`, `parseFrontMatterAliases`, `parseFrontMatterStringArray`, `parseFrontMatterTags` (api: obsidian.d.ts:4775; api: obsidian.d.ts:4780; api: obsidian.d.ts:4785; api: obsidian.d.ts:4790) | all take the raw frontmatter object, all return `\| null` | untagged |
| `resolveSubpath(cache, subpath)` (api: obsidian.d.ts:5500) | "Resolve the given subpath to a reference in the MetadataCache" (api: obsidian.d.ts:5497) | untagged |

`FrontMatterCache` is an index signature of `any` (api: obsidian.d.ts:3242-3246) — the cache does not
type your frontmatter, so validate before use. **Recommendation:** read frontmatter through the cache
when you only need values, and write it through `processFrontMatter`; never hand-parse the YAML block.

## Storage APIs that are not files

Two storage surfaces do not live in the vault tree. The *choice* between them and `data.json` belongs
to the decision guides reference; the contracts are here.

**`SecretStorage`** @1.11.4, stable, reached as `app.secretStorage`
(api: obsidian.d.ts:5635; api: obsidian.d.ts:458):

- `setSecret(id, secret)` — the id must be a "Lowercase alphanumeric ID with optional dashes" and the
  method "@throws Error if ID is invalid" **Contract** (api: obsidian.d.ts:5639-5645). Deriving an id
  from user input without sanitising it is therefore a crash, not a validation error.
- `getSecret(id)` returns "The secret value or null if not found" **Contract**
  (api: obsidian.d.ts:5650-5654) — handle the null rather than assuming setup happened.
- `listSecrets()` returns the ids, not the values (api: obsidian.d.ts:5656-5661).
- The class `extends Events` (api: obsidian.d.ts:5635) but **declares no events** — there is no way to
  be notified when a secret changes. **Gap.**

Where the value is kept is stated only in the guide, not the typings: "The actual secret is stored in
local storage, keyed to the specific vault" **Contract** (docs: en/Plugins/Guides/Store secrets.md:96).
**Inference:** it therefore does not travel with the vault, and a user on a second device re-enters it.
Your settings hold the secret's **name**, never its value **Contract**
(docs: en/Plugins/Guides/Store secrets.md:36; docs: en/Plugins/Guides/Store secrets.md:81).

**Vault-scoped local storage** @1.8.7, stable: `loadLocalStorage(key)` "Retrieve value from
`localStorage` for this vault" (api: obsidian.d.ts:467-472) and `saveLocalStorage(key, data)` "Save
vault-specific value to `localStorage`. **If data is `null`, the entry will be cleared**", with the
value "Must be serializable" **Contract** (api: obsidian.d.ts:474-480). Note the return type of the
loader is `any | null` (api: obsidian.d.ts:472) — nothing validates the shape you get back.

**Recommendation:** use local storage only where per-device divergence is the *intent* (a window size,
a machine-local path). Anything the user would expect to follow their vault belongs in `data.json`
through `loadData`/`saveData`, which the settings reference owns.

## The canvas file format

A `.canvas` file is JSON with a published schema, shipped as its own declaration file alongside the
API typings. It is a **file format, not a runtime API**: nothing in it is imported from the plugin
module, and no view or extension point for canvas exists at this pin. Unlike the main typings, no
declaration here carries a version tag (api: canvas.d.ts:2-7; api: canvas.d.ts:9-12) — reproducible
with `grep -c "@since" canvas.d.ts` in the `api` checkout, which reports `0` against `859` for
`obsidian.d.ts`. **Consequence:** a canvas reader cannot be version-gated from the typings.

| Shape | Fields |
|---|---|
| `CanvasData` (api: canvas.d.ts:10) | `nodes`, `edges`, plus arbitrary keys "for forward compatibility" (api: canvas.d.ts:14-15) |
| `CanvasNodeData` (api: canvas.d.ts:19) | `id`, `x`, `y`, `width`, `height`, optional `color`, plus arbitrary keys (api: canvas.d.ts:20-28; api: canvas.d.ts:31) |
| `CanvasFileData` (api: canvas.d.ts:37) | `type: 'file'`, `file`, optional `subpath` — "Always starts with a `#`" (api: canvas.d.ts:40) |
| `CanvasTextData` (api: canvas.d.ts:45) | `type: 'text'`, `text` |
| `CanvasLinkData` (api: canvas.d.ts:51) | `type: 'link'`, `url` |
| `CanvasGroupData` (api: canvas.d.ts:60) | `type: 'group'`, optional `label`, `background`, `backgroundStyle` defaulting to `'cover'` (api: canvas.d.ts:66-67) |
| `CanvasEdgeData` (api: canvas.d.ts:77) | `id`, `fromNode`, `toNode`, optional sides and ends — `fromEnd` "defaults to 'none'", `toEnd` "defaults to 'arrow'" (api: canvas.d.ts:83-89) |

`NodeSide` is `'top' | 'right' | 'bottom' | 'left'` (api: canvas.d.ts:71) and `EdgeEnd` is
`'none' | 'arrow'` (api: canvas.d.ts:74).

**A typo you must not copy.** `CanvasColor` is typed `string` while its own comment says it "can be a
number (like '1') representing one of the (currently 6) supported colors. or can be a custom color
using the hex format '#FFFFFFF'" (api: canvas.d.ts:2-7). The hex example has **seven** `F`
characters, and the "number" is quoted as a string. **Recommendation:** write a six-digit hex string
or a digit as a string, and accept both when reading.

**Recommendation:** because every shape admits arbitrary keys, preserve unknown fields when you
rewrite a canvas — parse, mutate, and serialise the same object rather than reconstructing one.

## Known gaps

- **No narrative page covers the metadata cache.** The pinned developer docs have no `en/Plugins`
  page for it; the only in-tree coverage is the generated TypeScript API reference, which is marked
  "Do not edit this file. It is automatically generated"
  (docs: en/Reference/TypeScript API/MetadataCache.md:6). Everything above therefore rests on the
  typings.
- **`normalizePath` has no JSDoc** (api: obsidian.d.ts:4603-4606); its behaviour is documented only
  in the guidelines, and the two are not cross-referenced.
- **"Atomically" is never defined** for either `Vault.process` (api: obsidian.d.ts:7512) or
  `processFrontMatter` (api: obsidian.d.ts:2934). Nothing states how concurrent calls on the same file
  order against each other. **Unverified.**
- **Timestamp units disagree** between `FileStats` and `Stat` — see [finding files](#finding-files).
- **`SecretStorage` declares no events** and does not say where or how secrets are protected — see
  [storage APIs](#storage-apis-that-are-not-files). **Unverified.**
- **Members people use anyway.** `Vault` declares no `getConfig`/`setConfig`, no
  `getAvailablePath`, and no `raw` event (api: obsidian.d.ts:7337; api: obsidian.d.ts:7594). Code
  that uses them is reaching outside the typed surface.
- **No live run, no evaluation.** Nothing here was executed against a vault, and how this reference
  triggers or routes in a clean context has not been measured.
