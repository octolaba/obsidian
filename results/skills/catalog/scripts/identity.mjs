import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEX_FILES } from './model.mjs';
import { isDirectory, isFile, readJson, sha256 } from './lib.mjs';

/**
 * Material identity for the Release Mirror, established before any of it is read (§5.3).
 *
 * Identity here is *structural*, not a content fingerprint, and that is deliberate: the mirror is
 * a moving pin by category, and the pre-run inspection may legitimately be pointed at a proposed
 * new pin. What must hold before the gate trusts a byte is that the directory really is the
 * community directory data — the six data files plus the mirror README, each of the declared
 * shape. Content is then checked by the schema gate, where drift is a finding a human reads.
 *
 * Whether the catalog is *current* is a separate question with its own answer: the gate compares
 * the injected Release Pin against the `base pin` carried by the live state file and reports
 * exit 4 while they differ (§5.3). Neither check invokes the version-control system — the pin is
 * injected by the caller that owns the repository layout.
 */

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));

export const PRIMARY = Object.freeze({
    alias: 'releases',
    repo: 'obsidianmd/obsidian-releases',
    flag: 'release-mirror-root',
    sentinel: { file: 'README.md', contains: 'community plugins & themes directories' },
});

export const IDENTITY_STATUS = Object.freeze({
    verified: 'verified',
    missing: 'missing-material',
    mismatch: 'identity-mismatch',
});

/** The declared shape of each required file, checked before the file is used as evidence. */
const REQUIRED = Object.freeze([
    { file: INDEX_FILES.plugins, shape: 'array-of-objects' },
    { file: INDEX_FILES.themes, shape: 'array-of-objects' },
    { file: INDEX_FILES.stats, shape: 'object' },
    { file: INDEX_FILES.pluginsRemoved, shape: 'array-of-objects' },
    { file: INDEX_FILES.themesRemoved, shape: 'array-of-objects' },
    { file: INDEX_FILES.deprecation, shape: 'object' },
    { file: 'README.md', shape: 'text' },
]);

function shapeOk(value, shape) {
    if (shape === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
    if (shape === 'array-of-objects') {
        return Array.isArray(value) && value.length > 0 && value.every(item => item && typeof item === 'object');
    }
    return true;
}

/**
 * @param flag which injected root is being verified. An Update Run injects the community directory
 *   data twice — the mirror at the target pin, and the base pin's copy materialized beside the
 *   catalog — and the same structural proof answers for both, so the message has to name which one
 *   failed rather than always naming the mirror's flag.
 */
export function verifyMaterial(root, { flag = PRIMARY.flag } = {}) {
    if (!root || !isDirectory(root)) {
        return { status: IDENTITY_STATUS.missing, root: root ?? null, reason: `no --${flag} directory`, files: null };
    }
    const resolved = path.resolve(root);
    const sentinel = path.join(resolved, PRIMARY.sentinel.file);
    if (!isFile(sentinel) || !fs.readFileSync(sentinel, 'utf8').includes(PRIMARY.sentinel.contains)) {
        return {
            status: IDENTITY_STATUS.missing,
            root: resolved,
            reason: `${resolved} is not a checkout of ${PRIMARY.repo} (sentinel ${PRIMARY.sentinel.file} absent or unrecognised)`,
            files: null,
        };
    }
    const files = {};
    for (const required of REQUIRED) {
        const absolute = path.join(resolved, required.file);
        if (!isFile(absolute)) {
            return {
                status: IDENTITY_STATUS.missing,
                root: resolved,
                reason: `${required.file} is missing from the Release Mirror`,
                files: null,
            };
        }
        if (required.shape !== 'text') {
            const parsed = readJson(absolute, null);
            if (parsed === null || !shapeOk(parsed, required.shape)) {
                return {
                    status: IDENTITY_STATUS.mismatch,
                    root: resolved,
                    reason: `${required.file} does not have its declared shape (${required.shape})`,
                    files: null,
                };
            }
        }
        files[required.file] = sha256(fs.readFileSync(absolute));
    }
    return { status: IDENTITY_STATUS.verified, root: resolved, reason: null, files };
}

/**
 * §5.3 staleness. `pin` is the Release Pin the caller checked out; `syncState` is the `base pin`
 * the live state file records. An unknown pin is reported as unknown rather than assumed equal,
 * so a portable copy without the injecting caller cannot fake a green gate.
 */
export function describeStaleness(pin, syncState) {
    if (!pin) return { state: 'pin-unknown', pin: null, syncState: syncState ?? null };
    if (!syncState) return { state: 'no-sync-state', pin, syncState: null };
    if (pin === syncState) return { state: 'current', pin, syncState };
    return { state: 'stale', pin, syncState };
}

/** Where a portable copy looks for the mirror when no root is injected: nowhere but the flag. */
export function skillRoot() {
    return path.dirname(SCRIPT_ROOT);
}
