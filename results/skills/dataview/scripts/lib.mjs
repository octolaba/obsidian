import fs from 'node:fs';
import path from 'node:path';

export const TOOL_VERSION = '2.1.0';

/**
 * Shared harness exit meanings. 0-4 are the repository-wide baseline; documented
 * tool-specific codes start at 5.
 */
export const EXIT = Object.freeze({
    clean: 0,
    findings: 1,
    usage: 2,
    missingMaterial: 3,
    identityMismatch: 4,
});

export const DEFAULT_SETTINGS = Object.freeze({
    renderNullAs: '\\-',
    taskCompletionTracking: false,
    taskCompletionUseEmojiShorthand: false,
    taskCompletionText: 'completion',
    taskCompletionDateFormat: 'yyyy-MM-dd',
    recursiveSubTaskCompletion: false,
    warnOnEmptyResult: true,
    refreshEnabled: true,
    refreshInterval: 2500,
    defaultDateFormat: 'MMMM dd, yyyy',
    defaultDateTimeFormat: 'h:mm a - MMMM dd, yyyy',
    maxRecursiveRenderDepth: 4,
    tableIdColumnName: 'File',
    tableGroupColumnName: 'Group',
    showResultCount: true,
    allowHtml: true,
    inlineQueryPrefix: '=',
    inlineJsQueryPrefix: '$=',
    inlineQueriesInCodeblocks: true,
    enableInlineDataview: true,
    enableDataviewJs: false,
    enableInlineDataviewJs: false,
    prettyRenderInlineFields: true,
    prettyRenderInlineFieldsInLivePreview: true,
    dataviewJsKeyword: 'dataviewjs',
});

const SKIP_DIRECTORIES = new Set([
    '.git',
    '.obsidian',
    '.trash',
    '.stversions',
    '.smart-env',
    'node_modules',
]);

const TASK_RESERVED_FIELDS = new Set([
    'symbol',
    'link',
    'section',
    'text',
    'tags',
    'line',
    'lineCount',
    'list',
    'outlinks',
    'path',
    'children',
    'task',
    'annotated',
    'position',
    'subtasks',
    'real',
    'header',
    'parent',
    'blockId',
    'status',
    'checked',
    'completed',
    'fullyCompleted',
    'created',
    'start',
    'scheduled',
    'due',
    'completion',
]);

export function parseArgs(argv, options = {}) {
    const booleans = new Set(options.booleans ?? []);
    const values = new Set(options.values ?? []);
    const aliases = new Map([['-h', 'help'], ...(options.aliases ?? [])]);
    const result = { _: [] };
    for (let index = 0; index < argv.length; index += 1) {
        let token = argv[index];
        if (aliases.has(token)) token = `--${aliases.get(token)}`;
        if (!token.startsWith('--')) {
            result._.push(token);
            continue;
        }
        const equal = token.indexOf('=');
        const name = token.slice(2, equal === -1 ? undefined : equal);
        if (booleans.has(name)) {
            result[name] = equal === -1 ? true : token.slice(equal + 1) !== 'false';
            continue;
        }
        if (!values.has(name)) throw new Error(`unknown option --${name}`);
        const value = equal === -1 ? argv[++index] : token.slice(equal + 1);
        if (value === undefined) throw new Error(`missing value for --${name}`);
        result[name] = value;
    }
    return result;
}

export function writeUsageError(error, usage, exitCode = 2) {
    process.stderr.write(`error: ${error.message}\n${usage}\n`);
    process.exitCode = exitCode;
}

export function toPosix(value) {
    return value.split(path.sep).join('/');
}

export function relativeTo(root, value) {
    return toPosix(path.relative(root, value));
}

export function readJson(file, fallback = null) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        if (error?.code === 'ENOENT') return fallback;
        throw new Error(`cannot parse ${file}: ${error.message}`);
    }
}

export function resolveVault(value) {
    if (value === undefined || value === null || value === '') {
        throw new Error('a vault path is required');
    }
    const vault = path.resolve(value);
    if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
        throw new Error(`vault is not a directory: ${vault}`);
    }
    return vault;
}

/**
 * Accept the vault positionally or through `--vault`, and reject every ambiguous form —
 * two positionals, a positional contradicting `--vault`, or no vault at all — instead of
 * silently scanning the current directory.
 */
export function resolveVaultArgument(args) {
    if (args._.length > 1) throw new Error('at most one positional VAULT is allowed');
    const positional = args._[0];
    const explicit = args.vault;
    if (
        explicit !== undefined &&
        positional !== undefined &&
        path.resolve(explicit) !== path.resolve(positional)
    ) {
        throw new Error(
            `positional VAULT ${positional} contradicts --vault ${explicit}; pass the vault once`,
        );
    }
    const chosen = explicit ?? positional;
    if (chosen === undefined) {
        throw new Error('a vault path is required: pass it positionally or with --vault');
    }
    return resolveVault(chosen);
}

/** Reject a file argument that resolves outside the declared vault. */
export function resolveVaultFile(vault, value, option) {
    const absolute = path.resolve(vault, String(value).split(path.sep).join('/'));
    if (absolute !== vault && !absolute.startsWith(`${vault}${path.sep}`)) {
        throw new Error(`${option} must name a path inside the vault: ${value}`);
    }
    return absolute;
}

export function loadDataviewConfig(vault) {
    const pluginRoot = path.join(vault, '.obsidian', 'plugins', 'dataview');
    const manifestPath = path.join(pluginRoot, 'manifest.json');
    const dataPath = path.join(pluginRoot, 'data.json');
    const manifest = readJson(manifestPath, null);
    const userSettings = readJson(dataPath, null);
    return {
        manifest,
        settings: { ...DEFAULT_SETTINGS, ...(userSettings ?? {}) },
        manifestPath,
        dataPath,
        hasSettings: userSettings !== null,
    };
}

export function walkMarkdown(vault) {
    const files = [];
    const visit = directory => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                if (!SKIP_DIRECTORIES.has(entry.name)) visit(absolute);
            } else if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) {
                files.push(absolute);
            }
        }
    };
    visit(vault);
    return files.sort();
}

export function readMarkdown(file) {
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
    return { text, lines: text.split('\n') };
}

function withoutQuotePrefix(line) {
    return line.replace(/^\s*(?:>\s*)*/, '');
}

/**
 * Width of the indentation and callout/quote prefix removed by {@link withoutQuotePrefix}.
 *
 * Every reported column adds it back, so an editor or SARIF consumer points at the real
 * character inside a callout instead of column 1.
 */
function prefixWidth(line) {
    return line.length - withoutQuotePrefix(line).length;
}

function closeFence(line, open) {
    const value = withoutQuotePrefix(line).trim();
    const match = /^(`+|~+)$/.exec(value);
    return Boolean(
        match &&
            match[1][0] === open.character &&
            match[1].length >= open.length,
    );
}

function inlineCodeSpans(line) {
    const spans = [];
    for (let index = 0; index < line.length; index += 1) {
        if (line[index] !== '`') continue;
        let length = 1;
        while (line[index + length] === '`') length += 1;
        const delimiter = '`'.repeat(length);
        const end = line.indexOf(delimiter, index + length);
        if (end === -1) {
            index += length - 1;
            continue;
        }
        const content = line.slice(index + length, end);
        const leading = content.length - content.trimStart().length;
        spans.push({
            raw: content.trim(),
            contentColumn: index + length + 1 + leading,
        });
        index = end + length - 1;
    }
    return spans;
}

/**
 * Extract Dataview fences and inline queries while respecting custom Dataview settings,
 * callout quote prefixes, tilde fences and closing fences longer than their opener.
 */
export function extractDataviewBlocks(text, settings = DEFAULT_SETTINGS) {
    const lines = text.split('\n');
    const blocks = [];
    const fencedLines = new Set();
    let open = null;
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (open) {
            fencedLines.add(index + 1);
            if (closeFence(line, open)) {
                if (open.type) {
                    blocks.push({
                        type: open.type,
                        raw: open.body.join('\n'),
                        lineColumns: open.bodyColumns,
                        startLine: open.startLine,
                        startColumn: open.startColumn,
                        endLine: index + 1,
                        closed: true,
                    });
                }
                open = null;
            } else if (open.type) {
                open.body.push(withoutQuotePrefix(line));
                open.bodyColumns.push(prefixWidth(line) + 1);
            }
            continue;
        }

        const stripped = withoutQuotePrefix(line);
        const match = /^(\s*)(`{3,}|~{3,})\s*([A-Za-z0-9_-]+)?(?:\s+.*)?$/.exec(stripped);
        if (!match) continue;
        fencedLines.add(index + 1);
        const language = (match[3] ?? '').toLowerCase();
        const jsKeyword = String(settings.dataviewJsKeyword || 'dataviewjs').toLowerCase();
        const type =
            language === 'dataview'
                ? 'dql'
                : language === jsKeyword
                  ? 'js'
                  : null;
        open = {
            type,
            character: match[2][0],
            length: match[2].length,
            startLine: index + 1,
            startColumn: prefixWidth(line) + match[1].length + 1,
            body: [],
            bodyColumns: [],
        };
    }
    if (open?.type) {
        blocks.push({
            type: open.type,
            raw: open.body.join('\n'),
            lineColumns: open.bodyColumns,
            startLine: open.startLine,
            startColumn: open.startColumn,
            endLine: lines.length,
            closed: false,
        });
    }

    for (let index = 0; index < lines.length; index += 1) {
        if (fencedLines.has(index + 1) && !settings.inlineQueriesInCodeblocks) continue;
        const offset = prefixWidth(lines[index]);
        for (const span of inlineCodeSpans(withoutQuotePrefix(lines[index]))) {
            span.contentColumn += offset;
            const raw = span.raw;
            const jsPrefix = String(settings.inlineJsQueryPrefix ?? '$=');
            const dqlPrefix = String(settings.inlineQueryPrefix ?? '=');
            if (jsPrefix && raw.startsWith(jsPrefix)) {
                const expression = raw.slice(jsPrefix.length);
                const leading = expression.length - expression.trimStart().length;
                blocks.push({
                    type: 'inline-js',
                    raw: expression.trim(),
                    startLine: index + 1,
                    startColumn: span.contentColumn + jsPrefix.length + leading,
                    endLine: index + 1,
                    closed: true,
                });
            } else if (dqlPrefix && raw.startsWith(dqlPrefix)) {
                const expression = raw.slice(dqlPrefix.length);
                const leading = expression.length - expression.trimStart().length;
                blocks.push({
                    type: 'inline',
                    raw: expression.trim(),
                    startLine: index + 1,
                    startColumn: span.contentColumn + dqlPrefix.length + leading,
                    endLine: index + 1,
                    closed: true,
                });
            }
        }
    }

    return blocks.sort(
        (left, right) =>
            left.startLine - right.startLine ||
            left.startColumn - right.startColumn,
    );
}

export function offsetToLineColumn(
    text,
    offset,
    baseLine = 1,
    baseColumn = 1,
    lineColumns = null,
) {
    const before = text.slice(0, Math.max(0, offset));
    const pieces = before.split('\n');
    const lineIndex = pieces.length - 1;
    const physicalBase = lineColumns?.[lineIndex] ?? (lineIndex === 0 ? baseColumn : 1);
    return {
        line: baseLine + lineIndex,
        column: physicalBase + pieces.at(-1).length,
    };
}

/** Mask strings, comments and wiki links while preserving source offsets. */
export function maskDql(text) {
    const chars = [...text];
    let quote = false;
    let escaped = false;
    let wikiDepth = 0;
    let comment = false;
    for (let index = 0; index < chars.length; index += 1) {
        const char = chars[index];
        const next = chars[index + 1];
        if (comment) {
            if (char === '\n') comment = false;
            else chars[index] = ' ';
            continue;
        }
        if (quote) {
            if (char === '\n') {
                quote = false;
                escaped = false;
                continue;
            }
            if (escaped) {
                chars[index] = ' ';
                escaped = false;
            } else if (char === '\\') {
                chars[index] = ' ';
                escaped = true;
            } else if (char === '"') {
                quote = false;
            } else {
                chars[index] = ' ';
            }
            continue;
        }
        if (wikiDepth > 0) {
            if (char === ']' && next === ']') {
                chars[index] = ' ';
                chars[index + 1] = ' ';
                index += 1;
                wikiDepth -= 1;
            } else {
                chars[index] = char === '\n' ? '\n' : ' ';
            }
            continue;
        }
        if (char === '/' && next === '/') {
            chars[index] = ' ';
            chars[index + 1] = ' ';
            index += 1;
            comment = true;
        } else if (char === '"') {
            quote = true;
        } else if (char === '[' && next === '[') {
            chars[index] = ' ';
            chars[index + 1] = ' ';
            index += 1;
            wikiDepth += 1;
        }
    }
    return chars.join('');
}

const CLAUSE_RE = /\b(FROM|WHERE|SORT|GROUP\s+BY|FLATTEN|LIMIT)\b/gi;

/** A stable structural fallback; exact mode additionally validates with the upstream parser. */
export function parseDqlShape(raw) {
    const masked = maskDql(raw);
    const hits = [...masked.matchAll(CLAUSE_RE)].map(match => ({
        keyword: match[1].toUpperCase().replace(/\s+/g, ' '),
        start: match.index,
        end: match.index + match[0].length,
    }));
    const headerEnd = hits.length ? hits[0].start : masked.length;
    const header = {
        masked: masked.slice(0, headerEnd).trim(),
        raw: raw.slice(0, headerEnd).trim(),
    };
    const clauses = hits.map((hit, index) => {
        const end = index + 1 < hits.length ? hits[index + 1].start : masked.length;
        return {
            keyword: hit.keyword,
            index,
            start: hit.start,
            end,
            masked: masked.slice(hit.end, end).trim(),
            raw: raw.slice(hit.end, end).trim(),
        };
    });
    return {
        raw,
        masked,
        header,
        clauses,
        type: /^(TABLE|LIST|TASK|CALENDAR)\b/i.exec(header.masked)?.[1]?.toUpperCase(),
        order: clauses.map(clause => clause.keyword),
    };
}

export function clausesOf(shape, keyword) {
    return shape.clauses.filter(clause => clause.keyword === keyword);
}

export function hasClause(shape, keyword) {
    return shape.order.includes(keyword);
}

function parseYamlScalar(raw) {
    let trimmed = raw.trim();
    const quoted =
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"));
    if (!quoted) trimmed = trimmed.replace(/\s+#.*$/, '').trim();
    let value = quoted ? trimmed.slice(1, -1) : trimmed;
    if (!quoted && (value === '' || value === 'null' || value === '~')) value = null;
    else if (!quoted && /^(true|false)$/i.test(value)) value = value.toLowerCase() === 'true';
    else if (!quoted && /^-?\d+(?:\.\d+)?$/.test(value)) value = Number(value);
    else if (!quoted && /^\[.*\]$/.test(value)) {
        value = value
            .slice(1, -1)
            .split(',')
            .map(item => parseYamlScalar(item).value);
    }
    return { value, quoted, raw: trimmed };
}

export function parseFrontmatter(lines) {
    if (lines[0]?.trim() !== '---') {
        return { fields: [], data: {}, endLine: 0, malformed: false };
    }
    const fields = [];
    const data = {};
    let index = 1;
    for (; index < lines.length; index += 1) {
        const line = lines[index];
        if (line.trim() === '---') {
            return { fields, data, endLine: index + 1, malformed: false };
        }
        const match = /^([^\s][^:]*):(?:\s*(.*))?$/.exec(line);
        if (!match) continue;
        const key = match[1].trim();
        const raw = match[2] ?? '';
        if (raw.trim() === '') {
            const values = [];
            let next = index + 1;
            for (; next < lines.length; next += 1) {
                const item = /^\s+-\s+(.*)$/.exec(lines[next]);
                if (!item) break;
                values.push(parseYamlScalar(item[1]).value);
            }
            if (values.length) {
                fields.push({ key, value: values, raw, quoted: false, line: index + 1, location: 'frontmatter' });
                data[key] = values;
                index = next - 1;
                continue;
            }
        }
        const scalar = parseYamlScalar(raw);
        fields.push({ key, ...scalar, line: index + 1, location: 'frontmatter' });
        if (key in data) {
            data[key] = Array.isArray(data[key])
                ? [...data[key], scalar.value]
                : [data[key], scalar.value];
        } else {
            data[key] = scalar.value;
        }
    }
    return { fields: [], data: {}, endLine: 0, malformed: true };
}

function parseInlineScalar(raw) {
    const trimmed = raw.trim();
    if (trimmed === '') return null;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === 'true';
    if (/^"(?:[^"\\]|\\.)*"(?:\s*,\s*"(?:[^"\\]|\\.)*")+$/.test(trimmed)) {
        return [...trimmed.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(match => match[1]);
    }
    return trimmed;
}

function bracketedInlineFields(line) {
    const fields = [];
    for (let start = 0; start < line.length; start += 1) {
        const open = line[start];
        if (open !== '[' && open !== '(') continue;
        const close = open === '[' ? ']' : ')';
        const separator = line.indexOf('::', start + 1);
        if (separator === -1) break;
        const key = line.slice(start + 1, separator).trim();
        if (!key || /[()[\]]/.test(key)) continue;

        let wikiDepth = 0;
        let nestedParentheses = 0;
        let end = separator + 2;
        for (; end < line.length; end += 1) {
            const char = line[end];
            const next = line[end + 1];
            if (char === '[' && next === '[') {
                wikiDepth += 1;
                end += 1;
                continue;
            }
            if (wikiDepth && char === ']' && next === ']') {
                wikiDepth -= 1;
                end += 1;
                continue;
            }
            if (wikiDepth) continue;
            if (open === '(' && char === '(') {
                nestedParentheses += 1;
                continue;
            }
            if (open === '(' && char === ')' && nestedParentheses) {
                nestedParentheses -= 1;
                continue;
            }
            if (char === close && nestedParentheses === 0) break;
        }
        if (end >= line.length) continue;
        fields.push({
            key,
            raw: line.slice(separator + 2, end).trim(),
        });
        start = end;
    }
    return fields;
}

export function extractInlineFields(lines, frontmatterEnd = 0) {
    const fields = [];
    let fence = null;
    for (let index = frontmatterEnd; index < lines.length; index += 1) {
        const line = lines[index];
        const stripped = withoutQuotePrefix(line);
        const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(stripped);
        if (fenceMatch) {
            if (!fence) {
                fence = { character: fenceMatch[1][0], length: fenceMatch[1].length };
            } else if (
                fenceMatch[1][0] === fence.character &&
                fenceMatch[1].length >= fence.length
            ) {
                fence = null;
            }
            continue;
        }
        if (fence) continue;

        const task = /^\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+\[[^\]]?\]\s+/.test(line);
        const bracketed = bracketedInlineFields(line);
        for (const field of bracketed) {
            fields.push({
                key: field.key,
                value: parseInlineScalar(field.raw),
                raw: field.raw,
                quoted: false,
                line: index + 1,
                location: task ? 'task' : 'inline',
            });
        }
        if (!task && bracketed.length === 0) {
            const full = /^\s*(?:[-*+]\s+)?(?:\*\*|__)?([^:]+?)(?:\*\*|__)?::\s*(.*)$/.exec(line);
            if (full) {
                fields.push({
                    key: full[1].trim(),
                    value: parseInlineScalar(full[2]),
                    raw: full[2].trim(),
                    quoted: false,
                    line: index + 1,
                    location: /^\s*[-*+]\s+/.test(line) ? 'list' : 'inline',
                });
            }
        }
    }
    return fields;
}

export function canonicalizeFieldName(name) {
    return name
        .trim()
        .toLocaleLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{Letter}\p{Number}_\-\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
}

export function inferDataviewType(value) {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value !== 'string') return 'object';
    const text = value.trim();
    if (/^!?\[\[[^\]]+\]\]$/.test(text)) return 'link';
    if (/^\d{4}-\d{2}(?:-\d{2})?(?:T.*)?$/.test(text)) return 'date';
    if (
        /^-?(?:\d+(?:\.\d+)?\s*(?:years?|yrs?|months?|mos?|weeks?|wks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|[ymwdhs]))(?:[\s,]+-?\d+(?:\.\d+)?\s*(?:years?|yrs?|months?|mos?|weeks?|wks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|[ymwdhs]))*$/i.test(
            text,
        )
    ) {
        return 'duration';
    }
    return 'string';
}

export function documentMetadata(file, vault) {
    const { lines } = readMarkdown(file);
    const frontmatter = parseFrontmatter(lines);
    const inline = extractInlineFields(lines, frontmatter.endLine);
    const fields = [...frontmatter.fields, ...inline].map(field => ({
        ...field,
        canonical: canonicalizeFieldName(field.key),
        type: inferDataviewType(field.value),
    }));
    const relative = relativeTo(vault, file);
    const tags = new Set();
    let fence = null;
    for (let index = frontmatter.endLine; index < lines.length; index += 1) {
        const stripped = withoutQuotePrefix(lines[index]);
        const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(stripped);
        if (fenceMatch) {
            if (!fence) {
                fence = { character: fenceMatch[1][0], length: fenceMatch[1].length };
            } else if (
                fenceMatch[1][0] === fence.character &&
                fenceMatch[1].length >= fence.length
            ) {
                fence = null;
            }
            continue;
        }
        if (fence) continue;
        const prose = stripped.replace(/`+(?:[^`]|`(?!`))*`+/g, ' ');
        for (const match of prose.matchAll(/(?:^|[\s(])#([\p{Letter}\p{Number}_/-]+)/gu)) {
            tags.add(`#${match[1]}`);
        }
    }
    for (const field of frontmatter.fields) {
        if (!['tag', 'tags'].includes(field.key.toLowerCase())) continue;
        const values = Array.isArray(field.value)
            ? field.value
            : String(field.value ?? '').split(/[,\s]+/);
        for (const value of values) {
            if (!value) continue;
            tags.add(String(value).startsWith('#') ? String(value) : `#${value}`);
        }
    }
    return {
        file: relative,
        fields,
        frontmatter,
        tags: [...tags],
        implicit: {
            'file.path': relative,
            'file.folder': toPosix(path.dirname(relative)) === '.' ? '' : toPosix(path.dirname(relative)),
            'file.name': path.basename(relative).replace(/\.(?:md|markdown)$/i, ''),
            'file.ext': path.extname(relative).slice(1),
            'file.tags': [...tags],
            'file.etags': [...tags],
        },
    };
}

export function isTaskReservedField(name) {
    return TASK_RESERVED_FIELDS.has(name);
}

export function percentile(values, ratio) {
    if (!values.length) return null;
    const sorted = [...values].sort((left, right) => left - right);
    return sorted[Math.max(0, Math.ceil(ratio * sorted.length) - 1)];
}
