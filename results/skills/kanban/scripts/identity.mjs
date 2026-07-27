import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDirectory, isFile, readJson, toPosix } from './lib.mjs';

/**
 * Source identity for the reviewed checkouts.
 *
 * Identity is derived from file contents, never from Git state: an extracted copy of this skill has
 * no `.git`, and a directory name proves nothing about what is inside it. Every path below is
 * anchored on `import.meta.url` rather than on the process working directory or on relative depth,
 * so the checks mean the same thing wherever the directory is copied to.
 *
 * The primary source is the Kanban plugin: the whole studied material is hashed, so a checkout that
 * still says 2.0.51 but differs anywhere in `src` or `docs` fails. The supporting source is the
 * Tasks plugin, which owns the completion-date behaviour Kanban delegates to; only the files this
 * skill actually cites are pinned there, because nothing else in that tree is evidence for anything
 * written here.
 */

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));

export const IDENTITY = readJson(path.join(SCRIPT_ROOT, 'fixtures', 'upstream-identity.json'), null);

export const IDENTITY_STATUS = Object.freeze({
    verified: 'verified',
    missing: 'missing-material',
    mismatch: 'identity-mismatch',
});

/** Directories and files whose exact contents define the reviewed primary material. */
const MATERIAL_DIRECTORIES = ['src', 'docs'];
const MATERIAL_FILES = ['manifest.json', 'package.json', 'versions.json'];

/**
 * The sentinel is a source file, not the manifest.
 *
 * A released plugin folder inside somebody's vault carries the same `manifest.json` and none of the
 * studied material. Anchoring on a file that only exists in a source checkout keeps discovery from
 * locking onto the release and then reporting the real checkout as missing.
 */
export const PRIMARY = Object.freeze({
    alias: 'kanban',
    repo: 'obsidian-community/obsidian-kanban',
    flag: 'source-root',
    sentinel: { file: 'src/parsers/common.ts', contains: "frontmatterKey = 'kanban-plugin'" },
    requires: ['src', 'docs', 'manifest.json'],
});

/**
 * Supporting sources, keyed by the citation alias used in the artifact prose.
 *
 * A supporting source is identified by a content sentinel and by the exact bytes of every file the
 * artifact cites. That is weaker than the primary aggregate on purpose: this skill studies Kanban,
 * and it borrows from Tasks only the few statements it names.
 */
export const SUPPORTING = Object.freeze({
    tasks: {
        alias: 'tasks',
        repo: 'obsidian-tasks-group/obsidian-tasks',
        flag: 'tasks-root',
        sentinel: { file: 'src/Statuses/Status.ts', contains: 'StatusType.DONE' },
    },
});

export const SUPPORTING_ALIASES = Object.freeze(Object.keys(SUPPORTING));

export function filesUnder(root) {
    const files = [];
    const visit = directory => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) visit(absolute);
            else if (entry.isFile()) files.push(absolute);
        }
    };
    visit(root);
    return files.sort();
}

export function fileSha256(file) {
    return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/**
 * Content fingerprint plus a complete inventory of the studied primary files.
 *
 * Returns `null` when any declared directory or file is absent, so "not hydrated" and "hydrated but
 * different" stay distinguishable and map to different exit codes.
 */
export function primaryFingerprint(root) {
    const files = [];
    for (const relative of MATERIAL_DIRECTORIES) {
        const directory = path.join(root, relative);
        if (!isDirectory(directory)) return null;
        files.push(...filesUnder(directory));
    }
    for (const relative of MATERIAL_FILES) {
        const file = path.join(root, relative);
        if (!isFile(file)) return null;
        files.push(file);
    }
    files.sort();
    const hash = crypto.createHash('sha256');
    for (const file of files) {
        hash.update(`${toPosix(path.relative(root, file))}\0`);
        hash.update(fs.readFileSync(file));
        hash.update('\0');
    }
    return { files: files.length, sha256: hash.digest('hex') };
}

function sentinelMatches(descriptor, root) {
    const file = path.join(root, ...descriptor.sentinel.file.split('/'));
    if (!isFile(file)) return false;
    for (const required of descriptor.requires ?? []) {
        if (!fs.existsSync(path.join(root, ...required.split('/')))) return false;
    }
    try {
        return fs.readFileSync(file, 'utf8').includes(descriptor.sentinel.contains);
    } catch {
        return false;
    }
}

export function verifyPrimaryIdentity(sourceRoot) {
    if (!IDENTITY) {
        return {
            status: IDENTITY_STATUS.missing,
            root: sourceRoot ? path.resolve(sourceRoot) : null,
            actual: null,
            reason: 'scripts/fixtures/upstream-identity.json is missing; the skill cannot prove what it studied',
        };
    }
    if (!sourceRoot) {
        return {
            status: IDENTITY_STATUS.missing,
            root: null,
            actual: null,
            reason: `no --${PRIMARY.flag} and no checkout of ${PRIMARY.repo} found near this skill`,
        };
    }
    const root = path.resolve(sourceRoot);
    if (!sentinelMatches(PRIMARY, root)) {
        return {
            status: IDENTITY_STATUS.missing,
            root,
            actual: null,
            reason: `${root} does not contain ${PRIMARY.sentinel.file} for ${PRIMARY.repo}; hydrate the checkout or pass another --${PRIMARY.flag}`,
        };
    }
    const fingerprint = primaryFingerprint(root);
    if (!fingerprint) {
        return {
            status: IDENTITY_STATUS.missing,
            root,
            actual: null,
            reason: `${root} does not contain the studied material (${[...MATERIAL_DIRECTORIES, ...MATERIAL_FILES].join(', ')})`,
        };
    }
    const matches =
        fingerprint.files === IDENTITY.materialFiles && fingerprint.sha256 === IDENTITY.materialSha256;
    return {
        status: matches ? IDENTITY_STATUS.verified : IDENTITY_STATUS.mismatch,
        root,
        actual: fingerprint,
        reason: matches
            ? null
            : `content fingerprint ${fingerprint.sha256} over ${fingerprint.files} files is not the reviewed ${IDENTITY.source}@${IDENTITY.version} (${IDENTITY.commit})`,
    };
}

export function verifySupportingIdentity(alias, root) {
    const descriptor = SUPPORTING[alias];
    if (!descriptor) {
        return { status: IDENTITY_STATUS.missing, root: null, reason: `unknown supporting source ${alias}` };
    }
    const record = IDENTITY?.supporting?.[alias];
    if (!record) {
        return {
            status: IDENTITY_STATUS.missing,
            root: null,
            reason: `no recorded identity for ${descriptor.repo}; regenerate with --write-fingerprints`,
        };
    }
    if (!root) {
        return {
            status: IDENTITY_STATUS.missing,
            root: null,
            reason: `no --${descriptor.flag} and no checkout of ${descriptor.repo} found near this skill`,
        };
    }
    const resolved = path.resolve(root);
    if (!sentinelMatches(descriptor, resolved)) {
        return {
            status: IDENTITY_STATUS.missing,
            root: resolved,
            reason: `${resolved} is not a checkout of ${descriptor.repo}`,
        };
    }
    const missing = [];
    const differing = [];
    for (const [relative, expected] of Object.entries(record.files ?? {})) {
        const file = path.join(resolved, ...relative.split('/'));
        if (!isFile(file)) {
            missing.push(relative);
            continue;
        }
        if (fileSha256(file) !== expected) differing.push(relative);
    }
    if (missing.length) {
        return {
            status: IDENTITY_STATUS.missing,
            root: resolved,
            reason: `${descriptor.repo} is missing cited files: ${missing.slice(0, 5).join(', ')}`,
        };
    }
    if (differing.length) {
        return {
            status: IDENTITY_STATUS.mismatch,
            root: resolved,
            reason: `${descriptor.repo} cited files differ from ${record.version} (${record.commit}): ${differing.slice(0, 5).join(', ')}`,
        };
    }
    return { status: IDENTITY_STATUS.verified, root: resolved, reason: null };
}

/**
 * Find the checkouts by content, walking up from this directory.
 *
 * Directory names are never used: a candidate is accepted only when its sentinel file contains the
 * declared string. The Makefile passes every root explicitly, so discovery exists for the case
 * where a human runs a script by hand from inside the repository.
 */
export function discoverRoots(start) {
    const descriptors = [PRIMARY, ...SUPPORTING_ALIASES.map(alias => SUPPORTING[alias])];
    const found = {};
    const skip = new Set(['node_modules', '.git', '.obsidian']);
    const MAX_DEPTH = 4;
    const MAX_VISITS = 4000;
    let visits = 0;

    const candidatesOf = directory => {
        const out = [];
        const queue = [[directory, 0]];
        while (queue.length) {
            const [current, depth] = queue.shift();
            if (visits > MAX_VISITS) break;
            out.push(current);
            if (depth >= MAX_DEPTH) continue;
            let entries;
            try {
                entries = fs.readdirSync(current, { withFileTypes: true });
            } catch {
                continue;
            }
            for (const entry of entries) {
                if (!entry.isDirectory() || skip.has(entry.name)) continue;
                visits += 1;
                if (visits > MAX_VISITS) break;
                queue.push([path.join(current, entry.name), depth + 1]);
            }
        }
        return out;
    };

    let current = path.resolve(start);
    for (;;) {
        for (const candidate of candidatesOf(current)) {
            for (const descriptor of descriptors) {
                if (found[descriptor.alias]) continue;
                if (sentinelMatches(descriptor, candidate)) found[descriptor.alias] = candidate;
            }
        }
        if (descriptors.every(descriptor => found[descriptor.alias])) break;
        const parent = path.dirname(current);
        if (parent === current) break;
        current = parent;
    }
    return found;
}

/**
 * The record `verify.mjs --write-fingerprints` writes.
 *
 * `citedBySource` maps a supporting alias to the set of files the artifact cites, so the pinned
 * supporting surface is exactly the evidence in the prose and stays correct without a second list
 * to maintain.
 */
export function buildIdentityRecord(primaryRoot, supportingRoots, citedBySource) {
    const manifest = readJson(path.join(primaryRoot, 'manifest.json'), {});
    const fingerprint = primaryFingerprint(primaryRoot);
    const record = {
        source: PRIMARY.repo,
        version: manifest.version ?? null,
        commit: IDENTITY?.commit ?? null,
        materialAlgorithm:
            'sha256(path NUL content NUL), sorted paths, over src, docs, manifest.json, package.json and versions.json',
        materialFiles: fingerprint?.files ?? null,
        materialSha256: fingerprint?.sha256 ?? null,
        supporting: {},
    };
    for (const alias of SUPPORTING_ALIASES) {
        const root = supportingRoots[alias];
        if (!root) continue;
        const supportingManifest = readJson(path.join(root, 'manifest.json'), {});
        const files = {};
        for (const relative of [...(citedBySource[alias] ?? [])].sort()) {
            const file = path.join(root, ...relative.split('/'));
            if (isFile(file)) files[relative] = fileSha256(file);
        }
        record.supporting[alias] = {
            repo: SUPPORTING[alias].repo,
            version: supportingManifest.version ?? null,
            commit: IDENTITY?.supporting?.[alias]?.commit ?? null,
            fileAlgorithm: 'sha256 of each cited file',
            files,
        };
    }
    return record;
}
