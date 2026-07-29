import { githubUrl, pluginUrl, screenshotUrl, themeUrl } from './model.mjs';

/**
 * The data block: the template's CUE fence, filled with the captured source values.
 *
 * Owner decision (2026-08-06): the fence is no longer stripped at instantiation. Every note carries
 * its own recorded inputs beside the prose, so a note is self-sufficient — the frontmatter *renders*
 * values (epoch milliseconds become ISO 8601, an absent value writes a bare key), while the block
 * *records* them as the source served them.
 *
 * Two properties make this safe to write mechanically:
 *
 * 1. **Fence safety.** Upstream controls every string in the block. Strings are therefore emitted as
 *    single-line CUE quoted literals with `\`, `"`, newlines and control characters escaped, so no
 *    upstream value can begin a line — and a run of backticks can only close the Markdown fence at
 *    the start of a line. `emitDataBlock` asserts that invariant on its own output rather than
 *    trusting the argument, and `cueString` escapes the backslash first so CUE's `\(` interpolation
 *    cannot survive either.
 * 2. **Byte stability.** The emitter is deterministic — 4-space indentation, one blank line between
 *    groups, values aligned inside each contiguous run of scalar fields — and `parseDataBlock`
 *    reads exactly that shape back. The gate re-emits what it parsed and compares bytes, so a
 *    hand-edited or drifted block is a finding instead of an invisible rewrite on the next run.
 */

export const FENCE_INFO = 'cue';
const INDENT = '    ';

/** A blank line inside a block: the group separator the templates use. */
export const GAP = null;

/** Marks a nested mapping, so a plain array can stay the list literal it looks like. */
export function fields(entries) {
    return { __fields: entries.filter(entry => entry !== undefined) };
}

function isMapping(value) {
    return Boolean(value) && typeof value === 'object' && Array.isArray(value.__fields);
}

/** Emits `key: value` only when the value is present; optional fields simply vanish. */
function optional(key, value) {
    if (value === null || value === undefined || value === '') return undefined;
    return [key, value];
}

function required(key, value) {
    return [key, value];
}

export { optional, required };

/**
 * CUE quoted-string escaping. The backslash goes first: everything after it is then unambiguous,
 * including CUE's `\(` interpolation, which becomes a literal backslash followed by a parenthesis.
 */
export function cueString(value) {
    let out = '"';
    for (const character of String(value)) {
        const code = character.codePointAt(0);
        if (character === '\\') out += '\\\\';
        else if (character === '"') out += '\\"';
        else if (character === '\n') out += '\\n';
        else if (character === '\r') out += '\\r';
        else if (character === '\t') out += '\\t';
        else if (code < 0x20 || code === 0x7f || code === 0x2028 || code === 0x2029) {
            out += `\\u${code.toString(16).padStart(4, '0')}`;
        } else out += character;
    }
    return `${out}"`;
}

export function unquoteCueString(text) {
    let out = '';
    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        if (character !== '\\') {
            out += character;
            continue;
        }
        const next = text[index + 1];
        index += 1;
        if (next === 'n') out += '\n';
        else if (next === 'r') out += '\r';
        else if (next === 't') out += '\t';
        else if (next === '"') out += '"';
        else if (next === '\\') out += '\\';
        else if (next === 'u') {
            out += String.fromCharCode(Number.parseInt(text.slice(index + 1, index + 5), 16));
            index += 4;
        } else throw new Error(`unsupported escape \\${next}`);
    }
    return out;
}

function scalar(value) {
    if (typeof value === 'number') {
        if (!Number.isInteger(value)) throw new Error(`non-integer number in a data block: ${value}`);
        return String(value);
    }
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (Array.isArray(value)) return `[${value.map(item => scalar(item)).join(', ')}]`;
    return cueString(value);
}

function emitFields(entries, indent, out) {
    let index = 0;
    while (index < entries.length) {
        const entry = entries[index];
        if (entry === GAP) {
            out.push('');
            index += 1;
            continue;
        }
        const [key, value] = entry;
        if (isMapping(value)) {
            out.push(`${indent}${key}: {`);
            emitFields(value.__fields, indent + INDENT, out);
            out.push(`${indent}}`);
            index += 1;
            continue;
        }
        // Values are aligned inside a contiguous run of scalar fields; a gap or a nested mapping
        // ends the run, which is exactly how the templates are written.
        const group = [];
        while (index < entries.length && entries[index] !== GAP && !isMapping(entries[index][1])) {
            group.push(entries[index]);
            index += 1;
        }
        const width = Math.max(...group.map(([name]) => name.length));
        for (const [name, item] of group) {
            out.push(`${indent}${name}:${' '.repeat(width - name.length + 1)}${scalar(item)}`);
        }
    }
}

/**
 * @param records ordered `[name, fields(...)]` pairs — one per top-level CUE record.
 * @returns the fenced block, ready to be placed between the body and the template footnote.
 */
export function emitDataBlock(records) {
    const out = [];
    records.forEach(([name, value], index) => {
        if (index > 0) out.push('');
        out.push(`${name}: {`);
        emitFields(value.__fields, INDENT, out);
        out.push('}');
    });
    for (const line of out) {
        // Defensive, not decorative: a value that could open or close a Markdown fence would let
        // upstream text escape the code block. Escaping makes this unreachable; the assertion is
        // what proves it stayed unreachable.
        if (/^\s*`{3,}/.test(line)) throw new Error('a data block line would break out of the Markdown fence');
    }
    return `\`\`\`${FENCE_INFO}\n${out.join('\n')}\n\`\`\``;
}

const FIELD = /^([A-Za-z_][A-Za-z0-9_]*):( +)(.*)$/;
const MAPPING_OPEN = /^([A-Za-z_][A-Za-z0-9_]*): \{$/;

function parseScalar(text) {
    if (text === 'true') return true;
    if (text === 'false') return false;
    if (/^-?\d+$/.test(text)) return Number(text);
    if (text.startsWith('[') && text.endsWith(']')) {
        const inner = text.slice(1, -1).trim();
        if (inner === '') return [];
        return inner.split(', ').map(item => parseScalar(item));
    }
    if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) return unquoteCueString(text.slice(1, -1));
    throw new Error(`unparsable value: ${text}`);
}

/**
 * Reads back exactly what `emitDataBlock` writes — deliberately strict. Anything else is reported,
 * never guessed at, which is what makes the gate's byte-stability check meaningful.
 */
export function parseDataBlock(text) {
    const lines = text.split('\n');
    const records = [];
    const stack = [];
    let current = null;
    for (const line of lines) {
        if (line === '') {
            if (current) current.push(GAP);
            continue;
        }
        const depth = /^ */.exec(line)[0].length;
        const body = line.slice(depth);
        if (depth % INDENT.length !== 0) throw new Error(`indentation is not a multiple of ${INDENT.length}: ${line}`);
        const level = depth / INDENT.length;
        if (body === '}') {
            if (level !== stack.length - 1) throw new Error(`unexpected closing brace: ${line}`);
            const closed = stack.pop();
            current = stack.length ? stack[stack.length - 1].entries : null;
            if (stack.length === 0) records.push([closed.name, fields(closed.entries)]);
            else current.push([closed.name, fields(closed.entries)]);
            continue;
        }
        if (level !== stack.length) throw new Error(`unexpected indentation: ${line}`);
        const open = MAPPING_OPEN.exec(body);
        if (open) {
            stack.push({ name: open[1], entries: [] });
            current = stack[stack.length - 1].entries;
            continue;
        }
        const field = FIELD.exec(body);
        if (!field) throw new Error(`unparsable line: ${line}`);
        if (!current) throw new Error(`field outside any record: ${line}`);
        current.push([field[1], parseScalar(field[3])]);
    }
    if (stack.length !== 0) throw new Error('a record is left unclosed');
    return records;
}

/** Flattens a parsed block into `record.path.to.key` → value, for the gate's value checks. */
export function flattenDataBlock(records) {
    const out = new Map();
    const walk = (entries, prefix) => {
        for (const entry of entries) {
            if (entry === GAP) continue;
            const [key, value] = entry;
            const name = prefix ? `${prefix}.${key}` : key;
            if (isMapping(value)) walk(value.__fields, name);
            else out.set(name, value);
        }
    };
    for (const [name, value] of records) walk(value.__fields, name);
    return out;
}

// --- the three note contracts, filled ------------------------------------------------------------

/**
 * §4.2. `updated_at` stays the raw epoch integer the Plugin Stats file serves: the block records
 * source values and the frontmatter renders them, so the two are not allowed to agree by accident.
 */
export function pluginDataBlock({ plugin, stats, about }) {
    const record = stats?.[plugin.id] ?? null;
    return emitDataBlock([
        [
            'plugin',
            fields([
                required('id', plugin.id),
                required('name', plugin.name),
                required('author', plugin.author),
                required('repo', plugin.repo),
                GAP,
                required('html_url', pluginUrl(plugin.id)),
                required('github_url', githubUrl(plugin.repo)),
                required('description', plugin.description),
                optional('about', about),
                ...(record
                    ? [
                          GAP,
                          required(
                              'stats',
                              fields([required('downloads', record.downloads), required('updated_at', record.updated)]),
                          ),
                      ]
                    : []),
            ]),
        ],
    ]);
}

/** §4.3. `legacy` appears only when the index carries the rare key — absence is not `false` here. */
export function themeDataBlock({ theme, slug, about }) {
    return emitDataBlock([
        [
            'theme',
            fields([
                required('name', theme.name),
                required('author', theme.author),
                required('repo', theme.repo),
                required('slug', slug),
                GAP,
                required('html_url', themeUrl(slug)),
                required('github_url', githubUrl(theme.repo)),
                required('screenshot_url', screenshotUrl(theme.repo, theme.screenshot)),
                GAP,
                required('modes', [...theme.modes]),
                theme.legacy === undefined ? undefined : required('legacy', theme.legacy === true),
                optional('about', about),
            ]),
        ],
    ]);
}

/**
 * §4.1. The README record carries identity only — name, path, blob oid, size, binary flag. The text
 * itself feeds the agent pass and is recorded as a hash; it is never stored in a note (decision 3.8).
 */
export function repositoryDataBlock({ repository }) {
    const readme = repository.readme ?? null;
    const records = [
        [
            'repository',
            fields([
                required('id', repository.numericId),
                required('node_id', repository.nodeId),
                required('name', repository.name),
                required('full_name', repository.fullName),
                required('private', repository.private === true),
                required('fork', repository.fork === true),
                GAP,
                required('html_url', repository.htmlUrl),
                optional('homepage', repository.homepage),
                required('ssh_url', repository.sshUrl),
                optional('description', repository.description),
                GAP,
                required(
                    'owner',
                    fields([
                        required('login', repository.owner.login),
                        required('id', repository.owner.id),
                        required('type', repository.owner.type),
                        required('html_url', repository.owner.htmlUrl),
                    ]),
                ),
                GAP,
                optional('language', repository.language),
                required('default_branch', repository.defaultBranch),
                required('visibility', repository.visibility),
                required('size', repository.sizeKb),
                required('topics', [...repository.topics]),
                GAP,
                ...(repository.license
                    ? [
                          required(
                              'license',
                              fields([
                                  required('key', repository.license.key),
                                  required('name', repository.license.name),
                                  required('spdx_id', repository.license.spdxId),
                              ]),
                          ),
                          GAP,
                      ]
                    : []),
                required(
                    'stats',
                    fields([
                        required('stargazers_count', repository.stars),
                        required('watchers_count', repository.watchers),
                        required('forks_count', repository.forks),
                        required('open_issues_count', repository.openIssues),
                    ]),
                ),
                GAP,
                required(
                    'features',
                    fields([
                        required('has_issues', repository.features.hasIssues === true),
                        required('has_projects', repository.features.hasProjects === true),
                        required('has_wiki', repository.features.hasWiki === true),
                        required('has_discussions', repository.features.hasDiscussions === true),
                        required('archived', repository.features.archived === true),
                        required('disabled', repository.features.disabled === true),
                        required('is_template', repository.features.isTemplate === true),
                    ]),
                ),
                GAP,
                required(
                    'timestamps',
                    fields([
                        required('created_at', repository.createdAt),
                        required('updated_at', repository.updatedAt),
                        required('pushed_at', repository.pushedAt),
                    ]),
                ),
            ]),
        ],
    ];
    if (readme) {
        records.push([
            'readme',
            fields([
                required('name', readme.name),
                required('path', readme.path),
                required('sha', readme.oid),
                required('size', readme.byteSize),
                required('is_binary', readme.isBinary === true),
            ]),
        ]);
    }
    return emitDataBlock(records);
}
