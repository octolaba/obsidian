import { spawnSync } from 'node:child_process';
import { isoUtc, sha256 } from './lib.mjs';

/**
 * GitHub Snapshot capture — GraphQL for repository metadata, REST for the README (decision 3.8).
 *
 * One batched GraphQL read carries every metadata field the repository template consumes; the
 * README then costs one REST `GET /repos/{owner}/{repo}/readme` per captured repository. REST owns
 * preferred-README discovery server-side, so no client-side discovery rule exists. The measured
 * costs and the evidence live in `reference/graphql-coverage.md`.
 *
 * Contract names follow the GraphQL schema verbatim; the record below carries them under the same
 * spelling the data block writes.
 */

export const ENDPOINT = 'https://api.github.com/graphql';
export const REST_ENDPOINT = 'https://api.github.com';

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
  repositoryTopics(first: 20) { nodes { topic { name } } }
  licenseInfo { key name spdxId }
  stargazerCount
  forkCount
  watchers { totalCount }
  issues(states: OPEN) { totalCount }
  hasIssuesEnabled
  hasPullRequestsEnabled
  hasProjectsEnabled
  hasWikiEnabled
  hasDiscussionsEnabled
  hasSponsorshipsEnabled
  forkingAllowed
  isArchived
  isDisabled
  isTemplate
  createdAt
  updatedAt
  pushedAt
  sshUrl
`;

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

/** First pass: repository metadata, batched. */
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

/**
 * Normalises a REST `GET /repos/{owner}/{repo}/readme` payload into the captured README record.
 *
 * Server-side discovery makes `name` and `path` free; the note stores only `sha`, `size` and
 * `htmlUrl`, but the queue records the path so a body task can name what grounded it. A README
 * between 1 and 100 MB answers `encoding: "none"` with an empty `content` (documented REST contents
 * behaviour, verified 2026-08-10): `oversized` marks it, the text is not captured, and the caller
 * records the `readme-oversized` lane — the README is skipped as a summary input by owner decision.
 */
export function normalizeReadme(payload) {
    const decoded = payload.encoding === 'base64' ? Buffer.from(payload.content ?? '', 'base64').toString('utf8') : null;
    return {
        name: payload.name,
        path: payload.path,
        sha: payload.sha,
        size: payload.size,
        htmlUrl: payload.html_url,
        oversized: payload.encoding !== 'base64',
        content: decoded,
        contentHash: decoded ? sha256(decoded) : null,
    };
}

/** Second pass: the preferred README, one REST call per repository; `null` on 404 (no README). */
export async function fetchReadme(nameWithOwner, { userAgent }) {
    const response = await fetch(`${REST_ENDPOINT}/repos/${nameWithOwner}/readme`, {
        headers: {
            authorization: `bearer ${token()}`,
            accept: 'application/vnd.github+json',
            'user-agent': userAgent,
        },
    });
    if (response.status === 404) return null;
    const text = await response.text();
    if (!response.ok) {
        const error = new Error(`README REST HTTP ${response.status} for ${nameWithOwner}`);
        error.status = response.status;
        error.body = text.slice(0, 400);
        throw error;
    }
    return normalizeReadme(JSON.parse(text));
}

/** Normalises a GraphQL repository node into the record the templates and renderer consume. */
export function toRepositoryRecord(node, readme, capturedAt) {
    return {
        // The identity trio that filenames, links and resolution key on.
        numericId: node.databaseId,
        nodeId: node.id,
        fullName: node.nameWithOwner,
        // The contract payload, spelled exactly as the data block writes it.
        name: node.name,
        description: node.description ?? null,
        language: node.primaryLanguage?.name ?? null,
        topics: (node.repositoryTopics?.nodes ?? []).map(item => item.topic.name),
        url: node.url,
        sshUrl: node.sshUrl,
        homepageUrl: node.homepageUrl ?? null,
        owner: {
            id: node.owner.databaseId ?? null,
            type: node.owner.__typename,
            login: node.owner.login,
            url: node.owner.url,
        },
        license: node.licenseInfo
            ? { key: node.licenseInfo.key, name: node.licenseInfo.name, spdxId: node.licenseInfo.spdxId ?? null }
            : null,
        stargazerCount: node.stargazerCount,
        // Real watchers: `watchers.totalCount` equals REST's `subscribers_count`. REST's own
        // `watchers_count` is a legacy duplicate of the star count and is deliberately not used.
        watcherCount: node.watchers?.totalCount ?? null,
        forkCount: node.forkCount,
        // Open issues only; pull requests are excluded by decision.
        openIssueCount: node.issues?.totalCount ?? null,
        features: {
            hasIssuesEnabled: node.hasIssuesEnabled,
            hasPullRequestsEnabled: node.hasPullRequestsEnabled,
            hasProjectsEnabled: node.hasProjectsEnabled,
            hasWikiEnabled: node.hasWikiEnabled,
            hasDiscussionsEnabled: node.hasDiscussionsEnabled,
            hasSponsorshipsEnabled: node.hasSponsorshipsEnabled,
            forkingAllowed: node.forkingAllowed,
        },
        state: {
            // The enum stays as GraphQL serves it: PUBLIC | PRIVATE | INTERNAL.
            visibility: node.visibility,
            defaultBranch: node.defaultBranchRef?.name ?? null,
            isPrivate: node.isPrivate,
            isFork: node.isFork,
            isArchived: node.isArchived,
            isDisabled: node.isDisabled,
            isTemplate: node.isTemplate,
        },
        diskUsage: node.diskUsage ?? null,
        createdAt: isoUtc(node.createdAt),
        updatedAt: isoUtc(node.updatedAt),
        pushedAt: node.pushedAt ? isoUtc(node.pushedAt) : null,
        readme,
        capturedAt,
    };
}
