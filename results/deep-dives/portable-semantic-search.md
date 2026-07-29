---
source: Meilisearch documentation
version: unversioned
basis: docs
accessed: 2026-08-06
---

# Portable semantic search for the generated documentation catalog

## Executive decision

Use **Meilisearch 1.45.1 with its local Hugging Face embedder** as the default
implementation target. It is the smallest documented system in the survey that
combines all four required surfaces in one long-running process:

1. local query and document embedding;
2. lexical, semantic, and hybrid retrieval;
3. document indexing and replacement;
4. an HTTP search API suitable for a static HTML client.

The deployable unit is not literally one file. It is one server binary plus a
database directory and model files. That distinction applies to every local
semantic engine: the executable can be singular, but the model weights and the
derived index remain data. Meilisearch is nevertheless the closest fit to the
requested “one binary, simple, reliable” operating model.

The ranked alternatives are:

1. **Meilisearch** — best overall and the recommendation.
2. **Orama** — best when “the site must remain entirely static” is a hard
   constraint and client download/start-up cost is acceptable.
3. **Typesense** — best server-side alternative when richer schema and filtering
   controls outweigh the documented 2–6 GB local embedding-model memory budget.

This ranking is based only on official documentation and project-owned package
documentation. No candidate was downloaded, installed, executed, or benchmarked.
The ranking therefore selects an implementation to prototype; it does not claim
measured latency or relevance.

## Research question

What is the lightest portable way to index the projected Markdown catalog under
`docs/`, provide useful semantic search (preferably hybrid full-text plus
semantic retrieval), and expose that search to a static HTML interface without
introducing a large ingestion or serving pipeline?

## Scope and evidence boundary

This is a documentation-level architecture comparison:

- no implementation source was inspected;
- no runtime experiment was performed;
- no packages, binaries, containers, models, or corpora were downloaded;
- no measured performance, memory, index-size, or relevance claims are made;
- managed-only products and multi-service data platforms are out of scope;
- generative answer synthesis and retrieval-augmented generation are out of
  scope—the requirement is retrieval;
- authentication of private content is out of scope because the generated
  catalog is intended to be public.

Official documentation is authoritative for public contracts. Resource estimates
calculated from documented formulas are labelled as arithmetic lower bounds.
Operational recommendations are researcher conclusions rather than vendor
contracts.

## The corpus changes the decision

The current catalog specification projects approximately 13,400 notes and one
agent-written semantic body per note
([`.github/issues/issue-materialize-community-catalog.md:112`](../../.github/issues/issue-materialize-community-catalog.md)).
The catalog is split into plugin, repository, and theme notes under `docs/`
([`.github/issues/issue-materialize-community-catalog.md:44`](../../.github/issues/issue-materialize-community-catalog.md)).
The templates already separate stable metadata, a title, and a deliberately
semantic prose description—for example the plugin body at
[`.github/templates/Obsidian plugin.md:23`](../../.github/templates/Obsidian%20plugin.md)
and repository body at
[`.github/templates/GitHub repository.md:23`](../../.github/templates/GitHub%20repository.md).

That is a small search corpus, not a general document lake. It has three useful
properties:

- records are naturally bounded and already summarized;
- the catalog generator owns stable identifiers and update detection;
- the search index can remain disposable because Markdown is canonical.

The initial design should therefore use **one search record per note**, not an
arbitrary chunking pipeline. Chunking adds identifiers, result reconstruction,
duplicate suppression, and update bookkeeping without a demonstrated need.
Meilisearch itself recommends splitting documents only when they become large
(its [ranking guide](https://www.meilisearch.com/docs/resources/internals/ranking)
uses 10 KB as a practical threshold). If generated bodies
later cross either that threshold or the selected model's input window, split by
Markdown heading with a stable `note-id#heading-id` identifier. Do not introduce
chunking before measuring the generated notes.

## Requirements and decision gates

The following gates are more useful than a feature-count score:

| Gate | Required interpretation |
| --- | --- |
| Semantic completeness | The system must embed both indexed text and a natural-language query, or document a small, reliable companion that does so. A vector database alone does not pass. |
| Portability | A release must work from a binary or ordinary static assets. A cluster, JVM stack, or mandatory managed service does not pass. |
| Lexical retrieval | Optional in the request, but strongly preferred because identifiers, plugin names, aliases, and typos are often better lexical signals than semantic ones. |
| Browser integration | Either a documented HTTP search API or a documented in-browser API must exist. |
| Rebuildability | The index must be derivable from `docs/`, with deterministic model and normalization settings. |
| Operational surface | Prefer one process and one index over a queue, embedding worker, vector store, reranker, and gateway. |

No documentation can establish the word “fast” for this corpus. A candidate
passes this research stage when its architecture is plausibly small and its
documented resource model is bounded; it passes implementation only after the
evaluation described below.

## Comparison at a glance

| Rank | Candidate | Runtime shape | Semantic + lexical | Browser surface | Decisive cost |
| ---: | --- | --- | --- | --- | --- |
| 1 | Meilisearch 1.45.1 | One server binary, model cache, database directory | Local or remote embeddings; semantic, keyword, and hybrid search | REST API; static client uses a search-only key | A backend still has to run; model files are separate from the binary |
| 2 | Orama 3.1.18 | Static JS, serialized index, embedding plug-in, TensorFlow.js backend, model assets | Full-text, vector, and hybrid in the browser | In-process JavaScript API, not HTTP | The browser downloads and holds the model and index |
| 3 | Typesense 30.2 | One server binary, model files, data directory | Built-in or external embeddings; keyword, vector, and hybrid search | REST API with scoped keys | Official sizing says a local ML model needs an additional 2–6 GB RAM |

The versions identify the releases examined where one exists. The continuously
updated documentation sets are mutable and were accessed on 2026-08-06.

## 1. Meilisearch: recommended default

### Why it fits

Meilisearch publishes direct Linux, macOS, and Windows binaries and runs an HTTP
server from that executable
([installation](https://www.meilisearch.com/docs/resources/self_hosting/getting_started/install_locally),
[configuration](https://www.meilisearch.com/docs/resources/self_hosting/configuration/reference)).
Its local Hugging Face embedder runs inside the Meilisearch process, automatically
embeds documents and queries, and is explicitly positioned for self-hosted,
small, or relatively static datasets
([local embedder](https://www.meilisearch.com/docs/capabilities/hybrid_search/how_to/configure_huggingface_embedder)).
That description matches this catalog unusually well.

The same index supports keyword, semantic, and hybrid search. The
`semanticRatio` parameter spans keyword-only (`0`), semantic-only (`1`), and
hybrid values in between
([semantic versus hybrid](https://www.meilisearch.com/docs/capabilities/hybrid_search/advanced/semantic_vs_hybrid)).
The POST search route exposes this through a normal JSON API
([search API](https://www.meilisearch.com/docs/reference/api/search/search-with-post)).
No second lexical engine or rank-fusion service is necessary.

Document writes are asynchronous tasks and the document API supports
add-or-replace semantics keyed by a primary key
([documents API](https://www.meilisearch.com/docs/reference/api/documents/add-or-replace-documents)).
That permits either a simple full rebuild or content-hash-driven incremental
upserts. The engine re-embeds changed content rather than requiring a separate
embedding ledger
([embedder selection](https://www.meilisearch.com/docs/capabilities/hybrid_search/how_to/choose_an_embedder)).

### Recommended configuration

Start with one index named `catalog` and these public fields:

| Field | Purpose |
| --- | --- |
| `id` | Stable note `uid`, or another immutable catalog identity |
| `url` | Relative static-site URL |
| `kind` | `plugin`, `repository`, or `theme`; filterable |
| `title` | H1 text; high lexical importance |
| `aliases` | Plugin id, slug, repository full name, and other public aliases |
| `body` | The generated semantic description |
| `content_hash` | Build input identity; not searchable |

Use a short embedding document template conceptually equivalent to:

> {kind}: {title}. Aliases: {aliases}. {body}

Meilisearch's document-template guidance recommends a compact 15–45 word shape,
excluding material irrelevant to retrieval and guarding optional fields
([document-template guidance](https://www.meilisearch.com/docs/capabilities/hybrid_search/advanced/document_template_best_practices)).
For this catalog, UUIDs, timestamps, counters, raw URLs, template footnotes,
screenshot markup, and Obsidian boilerplate should not enter the embedding text.
They can remain stored or filterable where useful.

Configure `title` and `aliases` ahead of `body` in the searchable-attribute order
and keep `kind` filterable. Exact identifiers and names should be recovered
lexically; prose intent should be recovered semantically. Begin a relevance
experiment at `semanticRatio: 0.5`, the documented default, but do not ship that
number merely because it is the default. Tune it against representative catalog
queries
([hybrid ranking](https://www.meilisearch.com/docs/capabilities/hybrid_search/advanced/custom_hybrid_ranking)).

### Model choice

For English documents and English queries, the documented lightweight starting
points are `BAAI/bge-small-en-v1.5` or
`sentence-transformers/all-MiniLM-L6-v2`, both producing 384-dimensional
embeddings. Meilisearch lists them as local models, and their model cards describe
the language/dimension boundary
([Meilisearch model examples](https://www.meilisearch.com/docs/capabilities/hybrid_search/how_to/configure_huggingface_embedder),
[BGE model card](https://huggingface.co/BAAI/bge-small-en-v1.5),
[MiniLM model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)).

If Russian queries must retrieve English catalog text, English-only models are
not an acceptable default. Meilisearch documents
`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` as a multilingual
384-dimensional option, and its model card lists 50 languages
([model card](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2)).
Cross-language relevance still has to be tested on this catalog.

Pin the Hugging Face model `revision`, not only its name. Meilisearch explicitly
supports revisions and warns that an unpinned model can change. Record the engine
release, model repository, revision, dimensions, document template, and content
normalizer in a committed search manifest. The first local-model request can
download model data automatically, so production packaging must stage/cache those
files deliberately rather than depend on an unpinned network fetch.

At 13,400 records, 384-dimensional float32 vectors occupy about 19.6 MiB
(`13,400 × 384 × 4` bytes) before graph/index overhead, stored text,
serialization, and model weights. This is arithmetic, not a Meilisearch memory
measurement. The model and index structures—not the raw vector matrix—must be
measured during the prototype.

### Static-site integration

The static site can call Meilisearch directly over HTTPS:

```text
docs/search.html + JS
          |
          | POST /indexes/catalog/search
          v
public HTTPS endpoint -> Meilisearch -> derived catalog index
```

Create a key restricted to the `search` action and the `catalog` index. The
Meilisearch security guide explicitly describes the default search key as safe
for client-side use; the master/admin key must never be shipped in `docs/`
([API-key guidance](https://www.meilisearch.com/docs/capabilities/security/how_to/manage_api_keys)).
Indexing remains a CI or maintainer operation using a private write key.

GitHub Pages or another static host cannot run the binary, so the API is a
separate small deployment. Terminate HTTPS either in Meilisearch's documented
TLS configuration or a reverse proxy
([deployment overview](https://www.meilisearch.com/docs/resources/self_hosting/deployment/overview)).
For a public endpoint, add request-size and rate limits at that boundary:
a search-only key restricts data mutation but does not by itself bound expensive
public query traffic. This last point is an operational recommendation.

### Main risks

- It is one process, not a no-server solution.
- Local semantic search still ships model weights and consumes model-dependent
  memory.
- The first automatic model download is convenient but not reproducible unless
  the model revision and deployment cache are controlled.
- Meilisearch lexical ranking is its own ordered ranking system rather than
  BM25. This is not inherently worse for catalog search, but it is a relevance
  difference that the query fixture must expose
  ([ranking internals](https://www.meilisearch.com/docs/resources/internals/ranking)).
- A single node is a service dependency. The index must be treated as
  rebuildable; snapshots/dumps are operational accelerators, not canonical data.

## 2. Orama: best fully static option

### Why it fits

Orama is a JavaScript search library documented for browsers, servers, and edge
runtimes. Its core package has no dependencies and provides full-text, vector,
and hybrid search
([Orama JS](https://docs.orama.com/docs/orama-js),
[package](https://www.npmjs.com/package/@orama/orama),
[hybrid search](https://docs.orama.com/docs/orama-js/search/hybrid-search)).
Its persistence plug-in can serialize and restore a database, so the catalog
index can be generated during the site build and fetched as a static asset
([persistence](https://docs.orama.com/docs/orama-js/plugins/plugin-data-persistence)).

This is the only top-three option that can run on a static host with no search
server:

```text
build: docs/**/*.md -> Orama snapshot

browser: HTML + JS + snapshot + embedding model
                     |
                     v
              in-process search results
```

There is no exposed database credential, backend uptime, or cross-origin API.
For a small public catalog, that is genuine operational portability.

### The semantic payload is not “a tiny JS library”

Orama's embedding plug-in generates embeddings at insert and query time, but its
documented setup also requires a TensorFlow.js backend and uses a
512-dimensional Universal Sentence Encoder model
([embedding plug-in](https://www.npmjs.com/package/@orama/plugin-embeddings),
[USE package](https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder)).
The core package's small size and zero-dependency claim therefore must not be
mistaken for the complete semantic-search payload.

At 13,400 records, the raw 512-dimensional float32 vectors alone are about
26.2 MiB (`13,400 × 512 × 4` bytes). The serialized database, stored document
text, lexical index, vector index, TensorFlow.js runtime, model graph, vocabulary,
and browser object overhead all add to that lower bound. Orama also keeps
documents in memory by default
([insertion/storage](https://docs.orama.com/docs/orama-js/usage/insert)).
These are reasons to measure transfer size, cold start, and mobile memory—not
claims that the design is too slow.

### When to choose it

Choose Orama over Meilisearch only when all of these are true:

- the deployment must work on a static host with no separate service;
- an initial index/model download is acceptable;
- target browsers can afford the measured memory and query-embedding time;
- the documented embedding model passes the actual language/relevance fixture;
- rebuilding and shipping the full derived index with the site is acceptable.

If the fixed embedding plug-in does not meet the language requirement,
Transformers.js is an official browser inference option supporting feature
extraction through ONNX/WASM, with optional WebGPU acceleration
([Transformers.js](https://huggingface.co/docs/transformers.js/en/index)).
That route allows a different multilingual model but is a custom integration,
not the simplest Orama configuration; it should be treated as a separate
prototype, not quietly folded into the baseline.

### Main risks

- It offers an in-process JavaScript API, not the requested HTTP Web API.
- First load and memory costs move to every visitor.
- The exact static model assets and cache behavior need an offline/deployment
  experiment; documentation alone is insufficient.
- Official documentation does not establish Russian-to-English retrieval quality
  for the embedding plug-in.
- Large client assets may be a poor experience on mobile even though the corpus
  is small on a server.

## 3. Typesense: capable server alternative

### Why it fits

Typesense publishes prebuilt server binaries and exposes a REST API
([installation](https://typesense.org/docs/guide/install-typesense.html)).
Version 30.2 documents automatic document and query embeddings, built-in or
external models, vector search, keyword search, and hybrid rank fusion with a
configurable weighting parameter
([vector and hybrid search](https://typesense.org/docs/30.2/api/vector-search.html)).
The document API supports bulk import/upsert, and API keys can be scoped to
search operations and collections
([documents](https://typesense.org/docs/30.2/api/documents.html),
[API keys](https://typesense.org/docs/30.2/api/api-keys.html)).

Its schema, filtering, faceting, field weighting, and REST surface are attractive
if the catalog UI evolves beyond a search box into a structured directory.
The browser topology and key separation are essentially the same as
Meilisearch's.

### Why it ranks third

Typesense's official sizing guide says:

- an empty process uses about 20 MB;
- the search index is held in memory;
- vector memory can be estimated as `7 bytes × dimensions × records`;
- a built-in local ML model adds **2–6 GB of RAM**;
- at least two vCPUs are recommended.

See [system requirements](https://typesense.org/docs/guide/system-requirements.html).
For 13,400 records at 384 dimensions, the documented vector formula yields only
about 34.4 MiB (`7 × 384 × 13,400`), so the catalog vectors are not the problem;
the local embedding model dominates the documented budget.

External embeddings can remove that local model cost, but then a remote provider
or a second query-embedding runtime becomes mandatory. That trades memory for an
external dependency and moves away from the “one simple portable component”
goal. Typesense remains a good fallback if deployment memory is plentiful or the
project already accepts an embedding API.

### Main risks

- Its local semantic mode has the largest explicitly documented memory floor in
  the top three.
- The whole search index is memory-resident, so field selection matters.
- Remote embeddings weaken offline portability and introduce latency, credentials,
  pricing, and provider reproducibility concerns.
- Its extra structured-search controls are useful only if the interface actually
  needs them; otherwise they buy complexity without user value.

## Candidates screened out

| Candidate | Documented strength | Why it is not in the top three |
| --- | --- | --- |
| [Pagefind 1.5.2](https://pagefind.app/docs/) | A precompiled binary builds a fully static search bundle with a browser API. | It is the best lexical/static baseline, but its official documentation does not document vector, embedding, or hybrid semantic retrieval. Pairing it with another engine creates the two-engine pipeline this research is trying to avoid. |
| [fidx](https://github.com/williamliu-ai/fidx) | Markdown/text-focused local BM25 + vector + reciprocal-rank fusion in SQLite, with local ONNX embeddings and no LLM. | It requires Python 3.11/3.12 and native SQLite capabilities, downloads a model on first indexing, and documents a CLI/Unix-socket daemon rather than a browser-facing HTTP search API. Worth watching if that API boundary changes. |
| [QMD](https://github.com/tobi/qmd) | Markdown-native local BM25, vector retrieval, query expansion, and reranking; exposes MCP and an SDK. | It brings Node/Bun, native llama bindings, SQLite, several GGUF models, query expansion, and reranking. Its HTTP mode is documented as MCP transport, not a simple public search REST contract. It is useful for agent retrieval but is more pipeline than this site needs. |
| [LanceDB](https://docs.lancedb.com/search/hybrid-search) | Embedded vector, full-text, and hybrid search with reciprocal-rank fusion. | It is a library. Automatic embedding support is runtime-specific, and a browser-facing service still has to be designed, built, packaged, and operated. |
| [SQLite FTS5](https://www.sqlite.org/fts5.html) + [sqlite-vec](https://alexgarcia.xyz/sqlite-vec/) | Extremely portable lexical and vector primitives in one database file. | FTS5, vector search, model inference, Markdown ingestion, synchronization, and HTTP serving remain separate engineering tasks. `sqlite-vec` is pre-1.0, and local embedding requires another extension/model. This is a custom product, not a ready lightweight solution. |
| [Qdrant](https://qdrant.tech/documentation/quick-start/) + [FastEmbed](https://qdrant.tech/documentation/fastembed/) | Mature vector server plus local ONNX embedding support. | Qdrant's full-text feature is documented as filtering rather than non-vector relevance ranking; dense/sparse hybrid retrieval and embedding introduce additional components and decisions. It solves a larger vector-platform problem than this catalog has. |
| Elasticsearch, OpenSearch, Vespa, Weaviate, Milvus | Broad search/data-platform capabilities. | Their multi-component or heavyweight operating models fail the portability and simplicity gate before feature comparison is useful. |

Pagefind should still be retained as the **lexical control** in the later
evaluation: it directly tests whether semantic infrastructure improves the
catalog enough to justify its model and serving costs. That does not mean shipping
both engines.

## Recommended indexing architecture

### 1. Export a search projection

Add one deterministic exporter after catalog materialization:

```text
Markdown notes -> normalize/select fields -> JSONL -> search engine bulk API
```

The exporter is not a crawler and should not call external sources. It reads only
the completed catalog. Parsing should retain:

- immutable note identity;
- site-relative URL;
- note kind;
- H1 title;
- frontmatter aliases;
- generated semantic body.

It should discard frontmatter delimiters, template identity footnotes, embedded
images, Obsidian link syntax that does not add visible meaning, and any residual
authoring boilerplate. Preserve human-visible link labels. Normalize whitespace,
but do not stem or rewrite semantic prose before embedding.

Emit a `content_hash` over the exact normalized fields. The same JSONL is useful
for Meilisearch, Typesense, Orama, and a lexical baseline, which keeps the engine
choice reversible.

### 2. Prefer a full rebuild first

For roughly 13,400 compact records, a full rebuild is the simplest trustworthy
starting point:

1. materialize all notes;
2. export all records;
3. build a new index;
4. wait for indexing tasks to succeed;
5. run smoke/relevance queries;
6. switch the published index/alias only after success.

This avoids coupling the search system to the catalog Ledger and prevents stale
documents after renames or deletions. Incremental upsert/delete can be added only
if measured rebuild time becomes inconvenient. The canonical source remains
`docs/`; neither database nor embedding cache is committed as truth.

For Orama, “switch” means publishing a versioned snapshot and then updating the
site manifest. For a server engine, use a new index and the engine's supported
swap/alias mechanism where available. If the selected release lacks a safe swap
contract, keep the previous index until the new one passes and change a small
gateway/configuration pointer.

### 3. Pin the whole semantic function

A reproducible semantic index requires more than an engine version. Commit a
manifest containing:

- engine name and exact release;
- model repository and immutable revision;
- dimensions, pooling/normalization behavior, and query prefixes if applicable;
- exact embedding document template;
- exporter schema and normalization version;
- chunking policy and maximum input length;
- lexical searchable/filterable fields and their priority;
- hybrid weighting used by the UI.

Changing any of those invalidates the derived index and triggers a full rebuild.
This is a recommendation inferred from the moving parts documented by the
engines; no vendor manifest format is assumed.

## Reliability and security boundary

- **Canonical data:** committed Markdown only.
- **Derived, disposable data:** JSONL projection, embeddings, engine index,
  snapshots, and browser bundles.
- **Public secret:** a search-only key may be embedded in the static client when
  the engine documents that use; it is an authorization scope, not a secret.
- **Private secret:** master/admin/write keys stay outside `docs/` and outside the
  browser build.
- **Failure behavior:** keep the previous successful index/site asset when export,
  indexing, model loading, or smoke queries fail.
- **Recovery:** a clean machine with the pinned binary, pinned model, manifest,
  and `docs/` must be able to reproduce the index.
- **Observability:** record engine/model identities, record counts, rejected
  documents, task status, build duration, and the published index version in the
  catalog run report.

Meilisearch documents that interrupted indexing tasks restart from their
beginning and that the database remains protected against process interruption
([FAQ](https://www.meilisearch.com/docs/resources/help/faq)). That supports a
simple retry model, but it does not remove the need for a last-known-good index
and a reproducible rebuild.

## Evaluation required before implementation is accepted

Documentation can narrow the field, but the final choice must be made with the
generated corpus. Build one engine at a time from the common JSONL and use a
checked-in fixture containing at least:

- exact plugin ids, slugs, aliases, and `owner/repo` names;
- misspellings and partial names;
- natural-language capability queries;
- terms shared by many plugins;
- queries whose correct result is a theme or repository rather than a plugin;
- Russian queries for English notes, if cross-language search is required;
- no-answer queries and deliberately ambiguous queries.

Compare keyword-only, semantic-only, and hybrid modes using:

- top-1 and top-5 success against reviewed expected results;
- reciprocal rank or another recorded rank measure;
- p50 and p95 warm query latency;
- cold process/browser start and first query;
- indexing wall time and peak resident memory;
- on-disk index size;
- for Orama, compressed transfer bytes and browser peak memory on desktop and
  mobile.

Record the exact engine release, model revision, corpus commit, query fixture,
hardware, commands, warm-up procedure, and raw results. The first release gate is
not “Meilisearch wins”; it is “the selected topology meets an explicit relevance
and resource budget.” Pagefind keyword search is the control, and Meilisearch
hybrid search is the default challenger.

No clean-context agent-behavior evaluation was run or claimed. This artifact is
not an agent skill, but it follows the repository-wide policy of stating that
gap rather than implying evaluated routing or triggering behavior.

## Decision rules

Choose:

- **Meilisearch** when a small separately hosted API is acceptable. This is the
  default decision.
- **Orama** when deployment must be static-only and its measured browser payload,
  memory, cold start, and language relevance pass.
- **Typesense** when the UI needs its richer structured search surface and the
  additional local-model memory (or a remote embedding dependency) is acceptable.
- **Pagefind alone** if the evaluation shows semantic retrieval adds too little
  relevance to justify any model.
- **a custom SQLite/Go/Rust solution** only if a later hard requirement forbids
  both a separately hosted API and browser-side model assets. That requirement
  would justify product engineering; the current problem does not.

## Open questions

1. Must users search in Russian, English, or both?
2. Where can a small HTTPS binary service run, and what memory ceiling applies?
3. Is first-load performance on mobile part of the static-site acceptance bar?
4. Will the generated semantic bodies remain short enough for one-record-per-note
   indexing?
5. Which metadata facets—kind, mode, legacy status, language, stars, downloads,
   or update time—must the interface expose?
6. Is the search index rebuilt on every catalog update or only for published
   releases?

Only questions 1 and 2 can change the top recommendation before measurement.
Static-only hosting makes Orama the lead; a low server-memory ceiling combined
with multilingual queries changes the model/topology experiment.

## Sources and evidence

### Primary source

- **Meilisearch documentation**, unversioned and mutable, accessed 2026-08-06.
  Authoritative for Meilisearch's public installation, configuration, embedding,
  search, document, and security contracts. The binary release examined is
  [v1.45.1](https://github.com/meilisearch/meilisearch/releases/tag/v1.45.1),
  commit `41322f8f257494d35e6bd0d8d57f7a2db5b1ca3c`.

### Supporting sources

- **Typesense 30.2 documentation**, versioned API pages plus mutable installation
  and sizing guides, accessed 2026-08-06. Authoritative for the Typesense
  alternative. Release
  [v30.2](https://github.com/typesense/typesense/releases/tag/v30.2), commit
  `d45d46baf3996d1de8bf96a87f375cfb43691560`.
- **Orama documentation** and official npm package pages, mutable documentation
  accessed 2026-08-06; package version 3.1.18. Authoritative for the Orama
  alternative.
- **Hugging Face model cards** for BGE, MiniLM, multilingual MiniLM, and
  Transformers.js documentation, mutable, accessed 2026-08-06. Authoritative for
  published model dimensions/language scope and browser inference contracts;
  supplementary to each search engine's integration contract.
- **Pagefind, fidx, QMD, LanceDB, SQLite, sqlite-vec, Qdrant, and FastEmbed
  official/project-owned documentation**, mutable, accessed 2026-08-06.
  Supplementary screening evidence only.
- **Local catalog specification and templates**, working-tree state inspected
  2026-08-06. Authoritative for projected scale and note shape; the catalog has
  not yet been materialized, so the eventual body-size distribution remains
  unverified.

## Limitations

- Vendor documentation tends to demonstrate capability, not comparative
  efficiency; this report does not adopt vendor benchmarks.
- Binary size, model size, peak memory, cold start, and query latency were not
  measured.
- Negative feature findings mean “not documented in the official material
  inspected,” not proof that no extension or unpublished mechanism exists.
- The projected 13,400-note corpus and template shape may change during
  implementation of the catalog review.
- Model licensing and redistribution must be checked for the exact pinned model
  before bundling it; no blanket redistribution conclusion is made here.
- Browser accessibility, result presentation, highlighting, and keyboard
  interaction belong to the later HTML interface design and were deliberately
  excluded.
