/**
 * The About extraction contract (§6.5).
 *
 * The Directory publishes no machine payload for a page, so About is read from the server-rendered
 * markup. Markup is mutable evidence, so extraction is written as a contract with three ordered
 * obligations, and a break in any of them is a loud failure lane rather than an empty string
 * silently overwriting a note:
 *
 *   1. the response must be a Directory page at all (`PAGE_MARKER`);
 *   2. it must be *this* entity's page — canonical link, `og:url` and the title kind must all name
 *      the requested id or slug, so a redirect or a cached neighbour cannot donate its text;
 *   3. only then is the About block trusted, and only when it parses as a single block of text.
 *
 * A missing entity answers HTTP 200 with a small shell that carries no canonical link and no About
 * marker; that is `not-found`, not a contract break.
 */

export const ABOUT_MARKER = /<div class="[^"]*border-b border-gray-800">About<\/div>/;
/** The sibling block every entity page carries; its presence separates "no About" from "no page". */
export const DETAILS_MARKER = /<div class="[^"]*border-b border-gray-800">Details<\/div>/;
export const PAGE_MARKER = /<meta property="og:url" content="https:\/\/community\.obsidian\.md/;

export const STATUS = Object.freeze({
    ok: 'ok',
    /** Identity validated, the page carries its Details block, and the author wrote no About. */
    absent: 'absent',
    notFound: 'not-found',
    identityMismatch: 'identity-mismatch',
    contractMismatch: 'contract-mismatch',
});

const ENTITIES = new Map([
    ['amp', '&'],
    ['lt', '<'],
    ['gt', '>'],
    ['quot', '"'],
    ['apos', "'"],
    ['nbsp', ' '],
    ['#39', "'"],
    ['#x27', "'"],
]);

export function decodeEntities(text) {
    return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, name) => {
        if (ENTITIES.has(name)) return ENTITIES.get(name);
        if (/^#x/i.test(name)) return String.fromCodePoint(parseInt(name.slice(2), 16));
        if (/^#/.test(name)) return String.fromCodePoint(parseInt(name.slice(1), 10));
        return whole;
    });
}

function meta(html, property) {
    const match = new RegExp(`<meta property="${property}" content="([^"]*)"`).exec(html);
    return match ? decodeEntities(match[1]) : null;
}

function canonical(html) {
    const match = /<link rel="canonical" href="([^"]*)"/.exec(html);
    return match ? decodeEntities(match[1]) : null;
}

function title(html) {
    const match = /<title>([\s\S]*?)<\/title>/.exec(html);
    return match ? decodeEntities(match[1]).trim() : null;
}

export const KIND_SUFFIX = Object.freeze({ plugin: '- Obsidian Plugin', theme: '- Obsidian Theme' });

/**
 * @param {string} html   the page body as served
 * @param {object} expect `{ kind: 'plugin'|'theme', url }` — the address the capture asked for
 */
export function extractAbout(html, expect) {
    const suffix = KIND_SUFFIX[expect.kind];
    if (!suffix) throw new Error(`unknown page kind ${expect.kind}`);
    const markers = {
        siteName: meta(html, 'og:site_name'),
        canonical: canonical(html),
        ogUrl: meta(html, 'og:url'),
        ogTitle: meta(html, 'og:title'),
        ogDescription: meta(html, 'og:description'),
        title: title(html),
    };

    if (!PAGE_MARKER.test(html) || markers.title === null) {
        return { status: STATUS.contractMismatch, about: null, markers, reason: 'response is not a Directory page' };
    }
    if (markers.canonical === null && !ABOUT_MARKER.test(html)) {
        return { status: STATUS.notFound, about: null, markers, reason: 'no canonical link and no About block — the not-found shell' };
    }
    if (markers.canonical !== expect.url || markers.ogUrl !== expect.url) {
        return {
            status: STATUS.identityMismatch,
            about: null,
            markers,
            reason: `page identity ${markers.canonical ?? markers.ogUrl} is not ${expect.url}`,
        };
    }
    if (!markers.title || !markers.title.endsWith(suffix)) {
        return { status: STATUS.identityMismatch, about: null, markers, reason: `title ${markers.title} is not a ${expect.kind} page` };
    }

    const marker = ABOUT_MARKER.exec(html);
    if (!marker) {
        if (DETAILS_MARKER.test(html)) {
            return { status: STATUS.absent, about: null, markers, reason: 'entity page with a Details block and no About block' };
        }
        return { status: STATUS.contractMismatch, about: null, markers, reason: 'identity validated but neither About nor Details block is present' };
    }
    const start = marker.index + marker[0].length;
    const end = html.indexOf('</div>', start);
    if (end === -1) {
        return { status: STATUS.contractMismatch, about: null, markers, reason: 'About block is not closed' };
    }
    const inner = html.slice(start, end);
    if (/<[a-zA-Z/]/.test(inner)) {
        return { status: STATUS.contractMismatch, about: null, markers, reason: 'About block carries markup; the contract expects plain text' };
    }
    const about = decodeEntities(inner).replace(/\s+/g, ' ').trim();
    if (about === '') {
        return { status: STATUS.contractMismatch, about: null, markers, reason: 'About block is empty' };
    }
    return { status: STATUS.ok, about, markers, reason: null };
}
