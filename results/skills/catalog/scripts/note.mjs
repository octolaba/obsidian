import path from 'node:path';
import { readText } from './lib.mjs';
import { FENCE_INFO } from './datablock.mjs';

/**
 * Note shape, quoting policy, and the renderer.
 *
 * The templates under the injected templates root are the single source of key order, fixed tags,
 * and the footnote marker: a template change therefore shows up as a re-render diff (§4.4) instead
 * of as drift nobody sees. The template's CUE fence documents the Data Contract and is *filled*
 * with the captured source values at instantiation (owner decision, 2026-08-06), so every note
 * carries its own recorded inputs.
 *
 * Note layout, in order: H1, the agent-written body, the screenshot embed (themes only), the filled
 * data block, the template footnote.
 */

const BOOL_OR_NULL = /^(?:y|Y|yes|Yes|YES|n|N|no|No|NO|true|True|TRUE|false|False|FALSE|on|On|ON|off|Off|OFF|null|Null|NULL|~)$/;
const PLAIN_SAFE = /^[A-Za-z0-9][A-Za-z0-9 _./-]*$/;
const PLAIN_URL = /^https?:\/\/[^\s"'`]+$/;

/**
 * Fixed quoting policy. A string is written plain only when it is unambiguous under any YAML
 * reader; everything else — colons, emoji, leading punctuation, anything non-ASCII — is
 * double-quoted. Upstream controls these strings, so the policy errs toward quoting.
 */
export function yamlScalar(value) {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    const text = String(value);
    if (text.trim() !== text) return quote(text);
    if (PLAIN_URL.test(text)) return text;
    if (PLAIN_SAFE.test(text) && !BOOL_OR_NULL.test(text) && !/^-?\d+(?:\.\d+)?$/.test(text)) return text;
    return quote(text);
}

function quote(text) {
    return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function unquote(text) {
    if (text.length >= 2 && text.startsWith('"') && text.endsWith('"')) {
        return text
            .slice(1, -1)
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
    }
    if (text.length >= 2 && text.startsWith("'") && text.endsWith("'")) {
        return text.slice(1, -1).replace(/''/g, "'");
    }
    return text;
}

/**
 * Frontmatter reader for the shape this renderer writes: `key: scalar`, or `key:` followed by
 * two-space-indented `- item` lines. Anything else is reported rather than guessed at, which is
 * what makes §5.4 well-formedness a real check instead of a lenient parse.
 */
export function parseFrontmatter(text) {
    const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
    if (!match) return { ok: false, reason: 'no frontmatter block', keys: [], values: {}, rest: text };
    const keys = [];
    const values = {};
    let current = null;
    for (const line of match[1].split('\n')) {
        if (line === '') continue;
        const item = /^ {2}- (.*)$/.exec(line);
        if (item) {
            if (current === null) return { ok: false, reason: `list item before any key: ${line}`, keys, values };
            if (!Array.isArray(values[current])) values[current] = [];
            const raw = item[1].trim();
            values[current].push(coerce(unquote(raw), raw));
            continue;
        }
        const entry = /^([A-Za-z0-9 _-]+):(?: (.*))?$/.exec(line);
        if (!entry) return { ok: false, reason: `unparsable frontmatter line: ${line}`, keys, values };
        current = entry[1];
        if (keys.includes(current)) return { ok: false, reason: `duplicate key: ${current}`, keys, values };
        keys.push(current);
        const raw = entry[2] === undefined ? '' : entry[2].trim();
        values[current] = raw === '' ? null : coerce(unquote(raw), raw);
    }
    return { ok: true, reason: null, keys, values, rest: text.slice(match[0].length) };
}

function coerce(value, raw) {
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    if (/^-?\d+$/.test(raw)) return Number(raw);
    return value;
}

export function serializeFrontmatter(order, values) {
    const lines = ['---'];
    for (const key of order) {
        const value = values[key];
        if (Array.isArray(value)) {
            lines.push(`${key}:`);
            for (const item of value) lines.push(`  - ${yamlScalar(item)}`);
            continue;
        }
        const scalar = yamlScalar(value);
        lines.push(scalar === '' ? `${key}:` : `${key}: ${scalar}`);
    }
    lines.push('---');
    return `${lines.join('\n')}\n`;
}

/**
 * A template as the renderer consumes it: the frontmatter key order, the fixed tag list, and the
 * footnote line. The placeholder prose is documentation; the CUE fence is the Data Contract, and
 * the renderer emits its filled counterpart into every instance.
 */
export function loadTemplate(templatesRoot, filename) {
    const text = readText(path.join(templatesRoot, filename));
    const frontmatter = parseFrontmatter(text);
    if (!frontmatter.ok) throw new Error(`${filename}: ${frontmatter.reason}`);
    const footnote = /^\[\^template\]: .*$/m.exec(text);
    if (!footnote) throw new Error(`${filename}: no [^template] identity marker`);
    if (!Array.isArray(frontmatter.values.tags) || frontmatter.values.tags.length === 0) {
        throw new Error(`${filename}: no fixed tags`);
    }
    const contract = new RegExp(`\`\`\`${FENCE_INFO}\\n([\\s\\S]*?)\\n\`\`\``).exec(text);
    if (!contract) throw new Error(`${filename}: no \`${FENCE_INFO}\` Data Contract fence`);
    return {
        filename,
        keys: frontmatter.keys,
        tags: frontmatter.values.tags,
        footnote: footnote[0],
        uid: frontmatter.values.uid ?? null,
        // The declared record names, in order: what a filled block in an instance must carry.
        contractRecords: [...contract[1].matchAll(/^([A-Za-z_][A-Za-z0-9_]*): \{$/gm)].map(match => match[1]),
    };
}

/**
 * `body` may be the empty string: a mechanical capture wave renders the note and leaves the prose
 * to a later body pass. The empty case emits no body paragraph at all rather than a blank one, so
 * the absence is visible to the gate (`catalog/block-order`) instead of hiding behind whitespace.
 */
export function renderNote({ template, values, h1, body, extra = [] }) {
    const prose = typeof body === 'string' ? body.trim() : '';
    const parts = [serializeFrontmatter(template.keys, values), '\n', `# ${h1}\n`];
    if (prose !== '') parts.push('\n', `${prose}\n`);
    for (const block of extra) parts.push('\n', `${block.trim()}\n`);
    parts.push('\n', `${template.footnote}\n`);
    return parts.join('');
}

/**
 * Whether a parsed note carries no agent-written body.
 *
 * The empty case is obvious; the second one is not, and it is the reason this lives in one place.
 * A theme note may carry its screenshot embed between the body and the data block, and the parser
 * calls the *first* block the body. A body-less theme therefore parses with the embed sitting in
 * the body position, and a naive "is the body empty" test passes it. An embed is never prose, so a
 * block starting the embed marker in the body position means the body is missing.
 */
export function bodyMissing(note) {
    const first = String(note?.body ?? '').trim();
    return first === '' || first.startsWith('![');
}

/**
 * Splits a rendered note back into the pieces the gate re-renders from.
 *
 * `body` is the agent-owned prose alone; `embeds` are the blocks between it and the data block (the
 * theme screenshot, today); `data` is the filled Data Contract, or `null` when the note carries
 * none — which the gate reports rather than tolerates.
 */
export function parseNote(text) {
    const frontmatter = parseFrontmatter(text);
    if (!frontmatter.ok) return { ok: false, reason: frontmatter.reason };
    const rest = frontmatter.rest ?? '';
    const heading = /(?:^|\n)# (.*)\n/.exec(rest);
    if (!heading) return { ok: false, reason: 'no H1' };
    const footnote = /\n(\[\^template\]: .*)\n?$/.exec(rest);
    if (!footnote) return { ok: false, reason: 'no [^template] identity marker at the end' };
    const between = rest.slice(heading.index + heading[0].length, footnote.index).trim();

    // The data block carries blank lines of its own, so it is cut off by its fence rather than by
    // paragraph splitting; only what precedes it is split into body and embeds.
    const fenceOpen = `\`\`\`${FENCE_INFO}\n`;
    let data = null;
    let head = between;
    if (between.endsWith('\n```')) {
        if (between.startsWith(fenceOpen)) {
            data = between.slice(fenceOpen.length, -4);
            head = '';
        } else {
            const at = between.lastIndexOf(`\n\n${fenceOpen}`);
            if (at !== -1) {
                data = between.slice(at + 2 + fenceOpen.length, -4);
                head = between.slice(0, at);
            }
        }
    }
    const blocks = head === '' ? [] : head.split('\n\n');
    return {
        ok: true,
        keys: frontmatter.keys,
        values: frontmatter.values,
        h1: heading[1],
        bodyBlock: between,
        body: blocks.length ? blocks[0] : '',
        embeds: blocks.slice(1),
        data,
        footnote: footnote[1],
    };
}
