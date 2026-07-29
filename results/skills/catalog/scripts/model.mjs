import crypto from 'node:crypto';
import path from 'node:path';
import { isoUtc, readJson } from './lib.mjs';

/**
 * The catalog's data model: what the Release Mirror says, what a slug is, what a note is called,
 * and which uid a note carries. Everything here is pure — no filesystem writes, no network.
 */

export const INDEX_FILES = Object.freeze({
    plugins: 'community-plugins.json',
    themes: 'community-css-themes.json',
    stats: 'community-plugin-stats.json',
    pluginsRemoved: 'community-plugins-removed.json',
    themesRemoved: 'community-css-themes-removed.json',
    deprecation: 'community-plugin-deprecation.json',
});

export const DIRECTORY_ORIGIN = 'https://community.obsidian.md';
export const GITHUB_ORIGIN = 'https://github.com';
export const RAW_ORIGIN = 'https://raw.githubusercontent.com';

/** Decision 3.4: deterministic UUIDv5 in a fixed namespace. */
export const UID_NAMESPACE = 'd2812732-4375-4ea9-9a4c-fc42c9bffed6';

const NOTE_CLASSES = Object.freeze({
    plugin: {
        directory: 'plugins',
        prefix: 'Obsidian plugin - ',
        tag: 'obsidian/plugin',
        template: 'Obsidian plugin.md',
        uidPrefix: 'obsidian-plugin:',
    },
    theme: {
        directory: 'themes',
        prefix: 'Obsidian theme - ',
        tag: 'obsidian/theme',
        template: 'Obsidian theme.md',
        uidPrefix: 'obsidian-theme:',
    },
    repository: {
        directory: 'repositories',
        prefix: 'GitHub - ',
        tag: 'github/repository',
        template: 'GitHub repository.md',
        uidPrefix: 'github-repository:',
    },
});

export { NOTE_CLASSES };

/**
 * UUIDv5 (SHA-1, name-based) without a dependency.
 *
 * Written out here rather than taken from a library because the catalog's identity contract must
 * be readable in the artifact that claims it.
 */
export function uuidV5(name, namespace = UID_NAMESPACE) {
    const hex = namespace.replace(/-/g, '');
    if (hex.length !== 32) throw new Error(`bad namespace ${namespace}`);
    const namespaceBytes = Buffer.from(hex, 'hex');
    const digest = crypto
        .createHash('sha1')
        .update(Buffer.concat([namespaceBytes, Buffer.from(name, 'utf8')]))
        .digest();
    const bytes = Buffer.from(digest.subarray(0, 16));
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const out = bytes.toString('hex');
    return `${out.slice(0, 8)}-${out.slice(8, 12)}-${out.slice(12, 16)}-${out.slice(16, 20)}-${out.slice(20)}`;
}

export function pluginUid(id) {
    return uuidV5(`${NOTE_CLASSES.plugin.uidPrefix}${id}`);
}

export function themeUid(slug) {
    return uuidV5(`${NOTE_CLASSES.theme.uidPrefix}${slug}`);
}

export function repositoryUid(numericId) {
    return uuidV5(`${NOTE_CLASSES.repository.uidPrefix}${numericId}`);
}

/**
 * Theme slug rule, §2: lowercase, spaces to hyphens, delete every remaining character outside
 * `a-z`, `0-9` and the hyphen, collapse hyphen runs. Non-ASCII letters are deleted, not
 * transliterated — that deletion is what keeps `Rosé Pine` and `Rose Pine` apart.
 */
export function themeSlug(name) {
    return String(name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
}

/** A name about to become a file: no separators, no traversal, no control or reserved characters. */
export function isFilenameSafe(value) {
    if (typeof value !== 'string' || value.length === 0) return false;
    if (value === '.' || value === '..') return false;
    // eslint-disable-next-line no-control-regex
    if (/\s/.test(value)) return false;
    return !/[\u0000-\u001f\u007f/\\:*?"<>|]/.test(value);
}

export function pluginNoteName(id) {
    return `${NOTE_CLASSES.plugin.prefix}${id}.md`;
}

export function themeNoteName(slug) {
    return `${NOTE_CLASSES.theme.prefix}${slug}.md`;
}

export function repositoryNoteName(numericId) {
    return `${NOTE_CLASSES.repository.prefix}${numericId}.md`;
}

export function repositoryLink(numericId) {
    // Decision 3.1, amended by the owner on 2026-08-06: the link is written bare. The filename is
    // the only resolvable target — a slashed alias is not one — and display text was dropped, so a
    // repository rename changes no byte in any note that links to it.
    return `[[${NOTE_CLASSES.repository.prefix}${numericId}]]`;
}

export function pluginUrl(id) {
    return `${DIRECTORY_ORIGIN}/plugins/${encodeURIComponent(id)}`;
}

export function themeUrl(slug) {
    return `${DIRECTORY_ORIGIN}/themes/${encodeURIComponent(slug)}`;
}

export function githubUrl(repo) {
    return `${GITHUB_ORIGIN}/${repo}`;
}

/**
 * Decision 3.9: the screenshot embed is derived from the pinned index, and its path is URL-encoded
 * because eleven pinned paths carry spaces or other URL-hostile characters. Segments are encoded
 * individually so the path separators survive.
 */
export function screenshotUrl(repo, screenshot) {
    const encodedPath = String(screenshot)
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
    return `${RAW_ORIGIN}/${repo}/HEAD/${encodedPath}`;
}

/** Case-insensitive identity for repo strings and full names (885 of 6707 pinned repos carry case). */
export function repoKey(value) {
    return String(value).toLowerCase();
}

export function repoBasename(repo) {
    const parts = String(repo).split('/');
    return parts[parts.length - 1];
}

export function loadIndexes(releasesRoot) {
    const read = key => readJson(path.join(releasesRoot, INDEX_FILES[key]));
    return {
        plugins: read('plugins'),
        themes: read('themes'),
        stats: read('stats'),
        pluginsRemoved: read('pluginsRemoved'),
        themesRemoved: read('themesRemoved'),
        deprecation: read('deprecation'),
    };
}

/** Plugin Stats: `downloads` and `updated` (epoch ms) plus per-version keys the catalog ignores. */
export function statsFor(stats, id) {
    const record = stats?.[id];
    if (!record) return { downloads: null, updatedAt: null, present: false };
    return {
        downloads: typeof record.downloads === 'number' ? record.downloads : null,
        updatedAt: typeof record.updated === 'number' ? isoUtc(record.updated) : null,
        present: true,
    };
}

/** Exact duplicates dropped, order kept (§4.2, §4.3). */
export function dedupe(values) {
    const seen = new Set();
    const out = [];
    for (const value of values) {
        if (value === null || value === undefined || value === '') continue;
        if (seen.has(value)) continue;
        seen.add(value);
        out.push(value);
    }
    return out;
}
