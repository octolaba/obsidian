import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, toPosix } from './lib.mjs';

/**
 * Source identity for the reviewed Tasks checkout.
 *
 * The guarantee this provides is the same one the Dataview skill provides — a checkout is
 * accepted only when its studied contents hash to the reviewed pin — while the material set and
 * the invariants checked on top of it are specific to this component.
 */

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));

export const IDENTITY = readJson(path.join(SCRIPT_ROOT, 'fixtures', 'upstream-identity.json'));

/** Directories and files whose exact contents define the reviewed material. */
const MATERIAL_DIRECTORIES = ['src', 'docs'];
const MATERIAL_FILES = ['manifest.json', 'package.json', 'versions.json'];

export const IDENTITY_STATUS = Object.freeze({
    verified: 'verified',
    missing: 'missing-material',
    mismatch: 'identity-mismatch',
});

export function filesUnder(root) {
    const files = [];
    const visit = (directory) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) visit(absolute);
            else if (entry.isFile()) files.push(absolute);
        }
    };
    visit(root);
    return files.sort();
}

/**
 * Content fingerprint plus a complete inventory of the studied files.
 *
 * A checkout that keeps version 8.3.0 and the selected regular expressions but differs anywhere
 * else in the studied material fails here, which is what a version string alone cannot do.
 */
export function primaryFingerprint(root) {
    const files = [];
    for (const relative of MATERIAL_DIRECTORIES) {
        const directory = path.join(root, relative);
        if (!fs.existsSync(directory)) return null;
        files.push(...filesUnder(directory));
    }
    for (const relative of MATERIAL_FILES) {
        const file = path.join(root, relative);
        if (!fs.existsSync(file)) return null;
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

export function verifyPrimaryIdentity(sourceRoot) {
    const root = path.resolve(sourceRoot);
    if (!fs.existsSync(path.join(root, 'manifest.json'))) {
        return {
            status: IDENTITY_STATUS.missing,
            root,
            actual: null,
            reason: `no manifest.json under ${root}; hydrate the checkout or pass another --source-root`,
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
        fingerprint.files === IDENTITY.materialFiles &&
        fingerprint.sha256 === IDENTITY.materialSha256;
    return {
        status: matches ? IDENTITY_STATUS.verified : IDENTITY_STATUS.mismatch,
        root,
        actual: fingerprint,
        reason: matches
            ? null
            : `content fingerprint ${fingerprint.sha256} over ${fingerprint.files} files is not the reviewed ${IDENTITY.source}@${IDENTITY.version} (${IDENTITY.commit})`,
    };
}
