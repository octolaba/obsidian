import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, toPosix } from './lib.mjs';

/**
 * Source identity for the reviewed Dataview checkout.
 *
 * One implementation serves both consumers: the formal verifier proves the artifact was checked
 * against the reviewed pin, and the query linter proves a caller-supplied checkout is that pin
 * *before* loading any code or dependency from it.
 */

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));

export const IDENTITY = readJson(path.join(SCRIPT_ROOT, 'fixtures', 'upstream-identity.json'));

/** Directories and files whose exact contents define the reviewed material. */
const MATERIAL_DIRECTORIES = ['src', 'docs/docs'];
const MATERIAL_FILES = ['manifest.json', 'package.json', 'CHANGELOG.md'];

export const IDENTITY_STATUS = Object.freeze({
    verified: 'verified',
    missing: 'missing-material',
    mismatch: 'identity-mismatch',
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
    visit(root);
    return files.sort();
}

export function markdownFiles(root) {
    return filesUnder(root).filter(file => file.endsWith('.md'));
}

export function sha256File(file) {
    return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/** Content fingerprint of the primary material: path and bytes of every studied file. */
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

/**
 * Decide whether a checkout is the reviewed pin.
 *
 * Returns a status plus the identity actually observed, so a caller that deliberately parses
 * against another version can stamp findings with what was really used.
 */
export function verifyPrimaryIdentity(sourceRoot) {
    const root = path.resolve(sourceRoot);
    if (!fs.existsSync(path.join(root, 'manifest.json'))) {
        return {
            status: IDENTITY_STATUS.missing,
            root,
            expected: { source: IDENTITY.source, version: IDENTITY.version, commit: IDENTITY.commit },
            actual: null,
            reason: `no manifest.json under ${root}; hydrate the checkout or pass another --source-root`,
        };
    }
    const fingerprint = primaryFingerprint(root);
    if (!fingerprint) {
        return {
            status: IDENTITY_STATUS.missing,
            root,
            expected: { source: IDENTITY.source, version: IDENTITY.version, commit: IDENTITY.commit },
            actual: null,
            reason: `${root} does not contain the studied material (${[...MATERIAL_DIRECTORIES, ...MATERIAL_FILES].join(', ')})`,
        };
    }
    const matches =
        fingerprint.files === IDENTITY.materialFiles && fingerprint.sha256 === IDENTITY.materialSha256;
    return {
        status: matches ? IDENTITY_STATUS.verified : IDENTITY_STATUS.mismatch,
        root,
        expected: {
            source: IDENTITY.source,
            version: IDENTITY.version,
            commit: IDENTITY.commit,
            materialFiles: IDENTITY.materialFiles,
            materialSha256: IDENTITY.materialSha256,
        },
        actual: fingerprint,
        reason: matches
            ? null
            : `content fingerprint ${fingerprint.sha256} over ${fingerprint.files} files is not the reviewed ${IDENTITY.source}@${IDENTITY.version} (${IDENTITY.commit})`,
    };
}
