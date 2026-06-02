import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDirectory, isFile, readJson, toPosix } from './lib.mjs';

/**
 * Identity of the six pinned upstream sources this skill was written against.
 *
 * The skill's own claims are only reproducible while these trees are the ones that were read, so
 * identity is established from file contents — never from Git state, which a copied or exported
 * checkout does not carry.
 */

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));

export const IDENTITY = readJson(path.join(SCRIPT_ROOT, 'fixtures', 'upstream-identity.json'), null);

export const IDENTITY_STATUS = Object.freeze({
    verified: 'verified',
    missing: 'missing-material',
    mismatch: 'identity-mismatch',
});

/** Alias -> repository, pinned commit, CLI flag and the content sentinel that identifies the root. */
export const SOURCES = Object.freeze({
    api: {
        repo: 'obsidianmd/obsidian-api',
        commit: 'cc1744324150c632416857c98964f87b1574a5fc',
        version: '1.13.2',
        flag: 'obsidian-api-root',
        sentinel: { file: 'obsidian.d.ts', contains: 'export class App' },
    },
    docs: {
        repo: 'obsidianmd/obsidian-developer-docs',
        commit: '2d0e942f03b23ed94ebda3c610ed074662ed63db',
        flag: 'developer-docs-root',
        sentinel: {
            file: 'en/Reference/Manifest.md',
            contains: 'This page describes the schema for the manifest',
        },
    },
    sample: {
        repo: 'obsidianmd/obsidian-sample-plugin',
        commit: '23c165fd362d4049330cb3edad6a52914ff2007a',
        flag: 'sample-plugin-root',
        sentinel: { file: 'manifest.json', contains: '"id": "sample-plugin"' },
    },
    theme: {
        repo: 'obsidianmd/obsidian-sample-theme',
        commit: 'be9db886ee504a5b261304a072efed8dd95477d9',
        flag: 'sample-theme-root',
        sentinel: { file: 'manifest.json', contains: '"name": "Sample Theme"' },
    },
    rel: {
        repo: 'obsidianmd/obsidian-releases',
        commit: '80239338536205c598b72ed46c77ecb86831bc57',
        flag: 'releases-root',
        sentinel: { file: 'desktop-releases.json', contains: '"latestVersion"' },
    },
    help: {
        repo: 'obsidianmd/obsidian-help',
        commit: 'a97de34c1a9f2381586f4f51070aeb9207c8a457',
        flag: 'obsidian-help-root',
        sentinel: { file: 'en/Extending Obsidian/Obsidian CLI.md', contains: 'plugin:reload' },
    },
});

export const ALIASES = Object.freeze(Object.keys(SOURCES));

/**
 * The studied material per source. Entries are literal paths or the two glob forms `dir/**` and
 * `dir/**\/*.ext`. The set is the union of the plan's manifest and every file the artifact cites,
 * so the subset check "cited files are studied material" is self-maintaining.
 */
export const MANIFESTS = Object.freeze({
    api: ['obsidian.d.ts', 'canvas.d.ts', 'publish.d.ts', 'package.json', 'CHANGELOG.md', 'README.md'],
    docs: ['en/**/*.md'],
    sample: [
        'manifest.json',
        'versions.json',
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        'esbuild.config.mjs',
        'eslint.config.mts',
        'version-bump.mjs',
        'styles.css',
        'README.md',
        'AGENTS.md',
        '.npmrc',
        '.editorconfig',
        '.gitignore',
        'src/**',
        '.github/workflows/**',
    ],
    theme: [
        'manifest.json',
        'versions.json',
        'theme.css',
        'version-bump.mjs',
        'package.json',
        'README.md',
        '.github/workflows/**',
    ],
    rel: [
        'README.md',
        'plugin-review.md',
        'cla.md',
        '.github/**',
        'community-plugins.json',
        'community-css-themes.json',
        'community-plugin-deprecation.json',
        'community-plugins-removed.json',
        'community-css-themes-removed.json',
        'community-snippets.json',
        'desktop-releases.json',
    ],
    help: [
        'en/Extending Obsidian/CSS snippets.md',
        'en/Extending Obsidian/Community plugins.md',
        'en/Extending Obsidian/Obsidian CLI.md',
        'en/Extending Obsidian/Plugin security.md',
        'en/Extending Obsidian/Themes.md',
        'en/Files and folders/Configuration folder.md',
        'en/Getting started/Glossary.md',
        'en/Getting started/Update Obsidian.md',
        'en/Help and support.md',
        'en/Obsidian Publish/Customize your site.md',
        'en/Obsidian Sync/Headless Sync.md',
        'en/Obsidian Sync/Sync settings and selective syncing.md',
        'en/Teams/Security considerations for teams.md',
        'en/User interface/Settings.md',
    ],
});

function filesUnder(root) {
    const files = [];
    const visit = directory => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) visit(absolute);
            else if (entry.isFile()) files.push(absolute);
        }
    };
    if (isDirectory(root)) visit(root);
    return files;
}

function expandEntry(root, entry) {
    const globAll = entry.match(/^(.*)\/\*\*$/);
    if (globAll) {
        const base = path.join(root, ...globAll[1].split('/'));
        return filesUnder(base).map(file => toPosix(path.relative(root, file)));
    }
    const globExtension = entry.match(/^(.*)\/\*\*\/\*(\.[A-Za-z0-9]+)$/);
    if (globExtension) {
        const base = path.join(root, ...globExtension[1].split('/'));
        return filesUnder(base)
            .filter(file => file.endsWith(globExtension[2]))
            .map(file => toPosix(path.relative(root, file)));
    }
    return isFile(path.join(root, ...entry.split('/'))) ? [entry] : [];
}

/** Relative posix paths of the studied material actually present under `root`. */
export function manifestFiles(alias, root) {
    const seen = new Set();
    for (const entry of MANIFESTS[alias]) {
        for (const relative of expandEntry(root, entry)) seen.add(relative);
    }
    return [...seen].sort();
}

/** Entries that resolve to nothing, i.e. material this checkout does not carry. */
export function missingManifestEntries(alias, root) {
    return MANIFESTS[alias].filter(entry => expandEntry(root, entry).length === 0);
}

export function sha256File(file) {
    return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/** Aggregate content fingerprint: sha256 over sorted `path NUL content NUL`. */
export function aggregateFingerprint(root, relatives) {
    const hash = crypto.createHash('sha256');
    for (const relative of [...relatives].sort()) {
        hash.update(`${relative}\0`);
        hash.update(fs.readFileSync(path.join(root, ...relative.split('/'))));
        hash.update('\0');
    }
    return { files: relatives.length, sha256: hash.digest('hex') };
}

function sentinelMatches(alias, root) {
    const { sentinel } = SOURCES[alias];
    const file = path.join(root, ...sentinel.file.split('/'));
    if (!isFile(file)) return false;
    return fs.readFileSync(file, 'utf8').includes(sentinel.contains);
}

/**
 * Locate the six roots without knowing the repository's layout: walk up from `start`, and at each
 * ancestor test its children and grandchildren against the content sentinels. Directory names are
 * never used to decide what a root is.
 */
export function discoverRoots(start) {
    const found = {};
    const skip = new Set(['node_modules', '.git', '.svn', '.hg']);
    const MAX_DEPTH = 3;
    const MAX_VISITS = 4000;
    const candidatesOf = root => {
        const result = [];
        let visits = 0;
        const queue = [[root, 0]];
        while (queue.length) {
            const [directory, depth] = queue.shift();
            result.push(directory);
            if (depth >= MAX_DEPTH || visits >= MAX_VISITS) continue;
            let entries;
            try {
                entries = fs.readdirSync(directory, { withFileTypes: true });
            } catch {
                continue;
            }
            visits += 1;
            for (const entry of entries) {
                if (!entry.isDirectory() || entry.isSymbolicLink() || skip.has(entry.name)) continue;
                queue.push([path.join(directory, entry.name), depth + 1]);
            }
        }
        return result;
    };
    let current = path.resolve(start);
    while (true) {
        for (const candidate of candidatesOf(current)) {
            for (const alias of ALIASES) {
                if (found[alias]) continue;
                if (sentinelMatches(alias, candidate)) found[alias] = candidate;
            }
        }
        if (ALIASES.every(alias => found[alias])) break;
        const parent = path.dirname(current);
        if (parent === current) break;
        current = parent;
    }
    return found;
}

/**
 * Decide whether one checkout is the studied pin, and say which files differ when it is not.
 * `files` in the fixture holds the cited surface; `aggregate` covers the whole manifest, so a drift
 * outside the cited surface is still caught, just without a per-file name.
 */
export function verifySourceIdentity(alias, root) {
    const expected = IDENTITY?.sources?.[alias] ?? null;
    const source = SOURCES[alias];
    const base = { alias, root, repo: source.repo, commit: source.commit };
    if (!expected) {
        return { ...base, status: IDENTITY_STATUS.missing, reason: 'fixtures/upstream-identity.json has no record for this source', differing: [] };
    }
    if (!root || !isDirectory(root)) {
        return { ...base, status: IDENTITY_STATUS.missing, reason: `no directory at ${root}; pass --${source.flag}`, differing: [] };
    }
    if (!sentinelMatches(alias, root)) {
        return {
            ...base,
            status: IDENTITY_STATUS.missing,
            reason: `${root} does not carry ${source.sentinel.file} containing ${JSON.stringify(source.sentinel.contains)}; hydrate the checkout or pass another --${source.flag}`,
            differing: [],
        };
    }
    const missingEntries = missingManifestEntries(alias, root);
    if (missingEntries.length) {
        return {
            ...base,
            status: IDENTITY_STATUS.missing,
            reason: `studied material absent under ${root}: ${missingEntries.join(', ')}`,
            differing: [],
        };
    }
    const relatives = manifestFiles(alias, root);
    const actual = aggregateFingerprint(root, relatives);
    const differing = [];
    for (const [relative, digest] of Object.entries(expected.files)) {
        const file = path.join(root, ...relative.split('/'));
        const observed = isFile(file) ? sha256File(file) : null;
        if (observed !== digest) differing.push(`${relative} (${observed ? observed.slice(0, 12) : 'absent'} != ${digest.slice(0, 12)})`);
    }
    const matches = actual.files === expected.aggregate.files && actual.sha256 === expected.aggregate.sha256;
    return {
        ...base,
        status: matches ? IDENTITY_STATUS.verified : IDENTITY_STATUS.mismatch,
        expected: expected.aggregate,
        actual,
        differing: differing.sort().slice(0, 5),
        reason: matches
            ? null
            : differing.length
              ? `${source.repo} differs from the studied pin ${source.commit} in ${differing.length} cited file(s); first: ${differing.slice(0, 3).join('; ')}`
              : `${source.repo} aggregate ${actual.sha256.slice(0, 12)} over ${actual.files} files is not the studied pin ${source.commit} (${expected.aggregate.sha256.slice(0, 12)} over ${expected.aggregate.files}); every cited file still matches, so the drift is elsewhere in the studied material`,
    };
}

/** Cited surface per source: the files the artifact points at, hashed individually. */
export function buildIdentityRecord(roots, citedBySource) {
    const sources = {};
    for (const alias of ALIASES) {
        const root = roots[alias];
        const relatives = manifestFiles(alias, root);
        const cited = [...new Set(citedBySource[alias] ?? [])].sort();
        const explicit = MANIFESTS[alias].filter(entry => !entry.includes('*'));
        const hashed = [...new Set([...cited, ...explicit])].filter(relative =>
            isFile(path.join(root, ...relative.split('/'))),
        );
        sources[alias] = {
            repo: SOURCES[alias].repo,
            commit: SOURCES[alias].commit,
            ...(SOURCES[alias].version ? { version: SOURCES[alias].version } : {}),
            aggregate: aggregateFingerprint(root, relatives),
            files: Object.fromEntries(
                hashed.sort().map(relative => [relative, sha256File(path.join(root, ...relative.split('/')))]),
            ),
        };
    }
    return {
        algorithm: 'aggregate: sha256 over sorted `path NUL content NUL` of the studied manifest; files: sha256 of each cited file',
        manifests: MANIFESTS,
        sources,
    };
}
