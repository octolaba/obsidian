import { spawnSync } from 'node:child_process';
import { isoUtc, sha256 } from './lib.mjs';

/**
 * GitHub Snapshot capture — GraphQL only (decision 3.8).
 *
 * One repository read carries every field the repository template consumes, plus the trees needed
 * to resolve the *preferred* README the way REST's `/readme` endpoint does. Requests are batched by
 * alias so a backfill pays roughly one point per repository rather than one request per field; the
 * measured cost is reported by the caller into the Run Report.
 *
 * Fields the API cannot serve are removed from the contract rather than fetched over REST. The
 * coverage matrix in `reference/graphql-coverage.md` records every decision and its evidence.
 */

export const ENDPOINT = 'https://api.github.com/graphql';

const REPOSITORY_FRAGMENT = `
  databaseId
  id
  name
  nameWithOwner
  isPrivate
  isFork
  url
  homepageUrl
  description
  owner { __typename login id url ... on User { databaseId } ... on Organization { databaseId } }
  primaryLanguage { name }
  defaultBranchRef { name }
  visibility
  diskUsage
  repositoryTopics(first: 100) { nodes { topic { name } } }
  licenseInfo { key name spdxId }
  stargazerCount
  forkCount
  watchers { totalCount }
  issues(states: OPEN) { totalCount }
  hasIssuesEnabled
  hasProjectsEnabled
  hasWikiEnabled
  hasDiscussionsEnabled
  isArchived
  isDisabled
  isTemplate
  createdAt
  updatedAt
  pushedAt
  sshUrl
  root: object(expression: "HEAD:") { ... on Tree { entries { name type } } }
  dotgithub: object(expression: "HEAD:.github") { ... on Tree { entries { name type } } }
  docs: object(expression: "HEAD:docs") { ... on Tree { entries { name type } } }
`;

/**
 * README discovery order, to be validated against REST `/readme` (§2, decision 3.8).
 *
 * Two orderings are involved: which directory wins, and which extension wins inside it. Both are
 * measured rather than assumed; `reference/graphql-coverage.md` records the agreement rate over the
 * pilot repositories and names the cases the pilot did not exercise.
 */
export const README_DIRECTORIES = ['', '.github', 'docs'];
export const README_EXTENSIONS = [
    '.md',
    '.markdown',
    '.mdown',
    '.mkdn',
    '.mkd',
    '.rst',
    '.textile',
    '.rdoc',
    '.org',
    '.creole',
    '.mediawiki',
    '.wiki',
    '.asciidoc',
    '.adoc',
    '.asc',
    '.pod',
    '.txt',
    '.html',
    '',
];

export function preferredReadmePath(trees) {
    for (const directory of README_DIRECTORIES) {
        const entries = trees[directory === '' ? 'root' : directory === '.github' ? 'dotgithub' : 'docs'] ?? [];
        const blobs = entries.filter(entry => entry.type === 'blob');
        for (const extension of README_EXTENSIONS) {
            const wanted = `readme${extension}`.toLowerCase();
            const hit = blobs.find(entry => entry.name.toLowerCase() === wanted);
            if (hit) return directory === '' ? hit.name : `${directory}/${hit.name}`;
        }
    }
    return null;
}

function token() {
    if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
    const result = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
    throw new Error('no GitHub credentials: set GITHUB_TOKEN or authenticate the gh CLI');
}

export async function graphql(query, variables, { userAgent }) {
    const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            authorization: `bearer ${token()}`,
            'content-type': 'application/json',
            'user-agent': userAgent,
        },
        body: JSON.stringify({ query, variables }),
    });
    const text = await response.text();
    if (!response.ok) {
        const error = new Error(`GraphQL HTTP ${response.status}`);
        error.status = response.status;
        error.body = text.slice(0, 400);
        throw error;
    }
    if (text.trim() === '') {
        // An empty 200 body is how the API reports a query it gave up on: batch smaller.
        const error = new Error('GraphQL returned an empty body; reduce --batch-size');
        error.status = response.status;
        throw error;
    }
    return JSON.parse(text);
}

function alias(index) {
    return `r${index}`;
}

/** First pass: repository metadata plus the three trees, batched. */
export async function captureRepositories(repos, options) {
    const parts = repos.map((repo, index) => {
        const [owner, name] = repo.split('/');
        return `${alias(index)}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${REPOSITORY_FRAGMENT} }`;
    });
    const query = `query { ${parts.join('\n')} rateLimit { cost remaining nodeCount } }`;
    const payload = await graphql(query, {}, options);
    const out = [];
    repos.forEach((repo, index) => {
        const node = payload.data?.[alias(index)] ?? null;
        const error = (payload.errors ?? []).find(item => (item.path ?? []).includes(alias(index)));
        out.push({ repo, node, error: node ? null : error?.type ?? (payload.errors ? 'ERROR' : 'NOT_FOUND') });
    });
    return { records: out, rateLimit: payload.data?.rateLimit ?? null, errors: payload.errors ?? [] };
}

/** Second pass: the preferred README blob for each repository, batched by path. */
export async function captureReadmes(requests, options) {
    if (requests.length === 0) return { blobs: new Map(), rateLimit: null };
    const parts = requests.map((request, index) => {
        const [owner, name] = request.repo.split('/');
        return `${alias(index)}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) {
      object(expression: ${JSON.stringify(`HEAD:${request.path}`)}) { ... on Blob { oid byteSize isBinary text } }
    }`;
    });
    const query = `query { ${parts.join('\n')} rateLimit { cost remaining nodeCount } }`;
    const payload = await graphql(query, {}, options);
    const blobs = new Map();
    requests.forEach((request, index) => {
        const blob = payload.data?.[alias(index)]?.object ?? null;
        blobs.set(request.repo, blob ? { ...blob, path: request.path } : null);
    });
    return { blobs, rateLimit: payload.data?.rateLimit ?? null };
}

/** Normalises a GraphQL repository node into the record the templates and renderer consume. */
export function toRepositoryRecord(node, readme, capturedAt) {
    const trees = {
        root: node.root?.entries ?? [],
        dotgithub: node.dotgithub?.entries ?? [],
        docs: node.docs?.entries ?? [],
    };
    return {
        numericId: node.databaseId,
        nodeId: node.id,
        name: node.name,
        fullName: node.nameWithOwner,
        htmlUrl: node.url,
        homepage: node.homepageUrl ?? null,
        description: node.description ?? null,
        private: node.isPrivate,
        fork: node.isFork,
        owner: {
            login: node.owner.login,
            id: node.owner.databaseId ?? null,
            type: node.owner.__typename,
            htmlUrl: node.owner.url,
        },
        language: node.primaryLanguage?.name ?? null,
        defaultBranch: node.defaultBranchRef?.name ?? null,
        visibility: String(node.visibility ?? '').toLowerCase(),
        sizeKb: node.diskUsage ?? null,
        topics: (node.repositoryTopics?.nodes ?? []).map(item => item.topic.name),
        license: node.licenseInfo ? { key: node.licenseInfo.key, name: node.licenseInfo.name, spdxId: node.licenseInfo.spdxId } : null,
        stars: node.stargazerCount,
        forks: node.forkCount,
        openIssues: node.issues?.totalCount ?? null,
        // The contract's `watchers_count` means *real* watchers: `watchers.totalCount`, which equals
        // REST's `subscribers_count`. REST's own `watchers_count` is a legacy duplicate of the star
        // count and is deliberately not used.
        watchers: node.watchers?.totalCount ?? null,
        features: {
            hasIssues: node.hasIssuesEnabled,
            hasProjects: node.hasProjectsEnabled,
            hasWiki: node.hasWikiEnabled,
            hasDiscussions: node.hasDiscussionsEnabled,
            archived: node.isArchived,
            disabled: node.isDisabled,
            isTemplate: node.isTemplate,
        },
        createdAt: isoUtc(node.createdAt),
        updatedAt: isoUtc(node.updatedAt),
        pushedAt: isoUtc(node.pushedAt),
        sshUrl: node.sshUrl,
        trees,
        readme: readme
            ? {
                  path: readme.path,
                  name: readme.path.split('/').pop(),
                  oid: readme.oid,
                  byteSize: readme.byteSize,
                  isBinary: readme.isBinary,
                  content: readme.text ?? null,
                  contentHash: readme.text ? sha256(readme.text) : null,
              }
            : null,
        capturedAt,
    };
}
