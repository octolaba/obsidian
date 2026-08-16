/**
 * Agent-pass discipline, mechanised (§6.6).
 *
 * Fetched content — README, About, upstream `description` — is quoted evidence, never instruction.
 * The pass's write authority is one staged body per queued task, and every staged body passes this
 * validator before it can land. A rejected body is a failure lane the run prints and the worklist
 * keeps pending, not a silent retry.
 *
 * What is checked here is what a machine can check. Whether a sentence is a fair summary is not
 * mechanical, and this file claims no opinion about it — the two grounding checks below are a floor
 * (the body talks about *this* entity, in its own words), not a proof of faithfulness.
 */

export const LIMITS = Object.freeze({
    minSentences: 2,
    maxSentences: 4,
    minChars: 80,
    maxChars: 900,
    minGroundingOverlap: 2,
});

const FORBIDDEN = [
    { id: 'frontmatter-injection', pattern: /^\s*---\s*$/m, message: 'a line consisting of --- would open a frontmatter block' },
    { id: 'fence-injection', pattern: /```/, message: 'code fences are not allowed in a body' },
    { id: 'heading-injection', pattern: /^#{1,6} /m, message: 'headings are not allowed in a body' },
    { id: 'html-injection', pattern: /<[a-zA-Z/][^>]*>/, message: 'raw HTML is not allowed in a body' },
    { id: 'footnote-injection', pattern: /\[\^/, message: 'footnote markers are reserved for the template identity marker' },
    { id: 'wikilink', pattern: /\[\[/, message: 'wikilinks are written by the renderer, not by the body' },
];

/** Marketing register the pipeline refuses outright; a body states what the thing does. */
const MARKETING = /\b(?:amazing|awesome|beautifully|best-in-class|blazing|effortless(?:ly)?|game[- ]changer|magic(?:al)?|must[- ]have|powerful|revolutionary|seamless(?:ly)?|stunning|ultimate|supercharge[sd]?)\b/i;

/**
 * Boilerplate the Plugin Index appends to the `description` of every plugin its staff has not
 * reviewed. It is a statement about the review process, not about the plugin, so it describes no
 * entity and grounds no body — which is why every body writer drops it before summarising, and why
 * the definition lives here once rather than inline in each caller.
 */
export const UNREVIEWED_PLUGIN_NOTICE = 'This plugin has not been manually reviewed by Obsidian staff.';

/**
 * The notice as the index serves it: appended after a hyphen separator whose surrounding
 * whitespace varies, and sometimes the whole of a `description`. The sentence itself is matched
 * literally, so nothing an author actually wrote can be swallowed with it.
 */
const UNREVIEWED_PLUGIN_NOTICE_PATTERN = new RegExp(
    `\\s*(?:-\\s*)?${UNREVIEWED_PLUGIN_NOTICE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'g',
);

/** A recorded input with the index's unreviewed-plugin boilerplate removed. */
export function withoutIndexBoilerplate(input) {
    return String(input ?? '').replace(UNREVIEWED_PLUGIN_NOTICE_PATTERN, '').trim();
}

/**
 * Which of an entity's recorded body inputs moved, and therefore whether a fresh body is owed.
 *
 * The note's own data block is the baseline (decision 3.11), and an entity body is grounded in two
 * recorded inputs: the upstream `description` and the About the Directory served. Comparing only
 * About is the trap this function exists to close — a plugin whose description was rewritten
 * upstream while its About stood still would queue no body at all, silently contradicting the rule
 * that a `description` change queues one. A theme carries no description, so only About can move.
 *
 * @param recorded the note's flattened data-block values, or `null` when it has none.
 * @returns the moved input names in a fixed order; empty means the recorded body still stands.
 */
export function movedBodyInputs({ kind, description = null, about = null, recorded = null }) {
    const value = key => recorded?.get(`${kind}.${key}`) ?? null;
    const moved = [];
    if ((about ?? '') !== (value('about') ?? '')) moved.push('About');
    if (kind === 'plugin' && (description ?? '') !== (value('description') ?? '')) moved.push('description');
    return moved;
}

function sentences(text) {
    return text
        .split(/(?<=[.!?])\s+/)
        .map(part => part.trim())
        .filter(Boolean);
}

function words(text) {
    return new Set(
        text
            .toLowerCase()
            .split(/[^a-z0-9+.#-]+/)
            .filter(word => word.length >= 5),
    );
}

/**
 * Whether the recorded inputs for an entity can ground *any* body at all (§6.5
 * `bodyless-no-input`).
 *
 * The grounding floor is a fixed number of shared content words. An input set holding no more
 * content words than that floor cannot ground a body that says anything the input does not already
 * say: every body that cleared the floor would have to reuse essentially all of them, which is
 * restating the input rather than describing the entity. Measured at the pin, the seven entities in
 * this lane hold a bare title (`# GDCT`) or a single image embed (`![image](image.png)`) — one or
 * two tokens, and both of them file names.
 *
 * Classifying that case here — rather than writing a body and watching the validator reject it —
 * is what lets a run record the lane instead of looping. The classification is a *record* — the
 * `bodyless-no-input` exception line in the state file, reviewed by a human in the diff; it never
 * suppresses a finding on its own.
 *
 * The index's unreviewed-plugin boilerplate is dropped before the floor is measured, so the count
 * reflects what upstream says about the entity. Counted, its five content words carry a plugin
 * whose `description` is nothing else over the floor and put the lane out of reach: the note is
 * then neither written nor excused, which coverage reports as an uncovered index row.
 */
export function hasNoUsableInput(inputs) {
    return words(inputs.filter(Boolean).map(withoutIndexBoilerplate).join(' ')).size <= LIMITS.minGroundingOverlap;
}

/**
 * @param body        the staged body
 * @param inputs      the recorded inputs this body may be grounded in (description, About, README)
 * @param allowedLinks the entity's own recorded addresses; any other link is a rejection
 */
export function validateBody(body, { inputs, allowedLinks = [] }) {
    const problems = [];
    const text = String(body ?? '').trim();

    if (text.length < LIMITS.minChars || text.length > LIMITS.maxChars) {
        problems.push(`length ${text.length} is outside ${LIMITS.minChars}–${LIMITS.maxChars} characters`);
    }
    const parts = sentences(text);
    if (parts.length < LIMITS.minSentences || parts.length > LIMITS.maxSentences) {
        problems.push(`${parts.length} sentences; the contract is ${LIMITS.minSentences}–${LIMITS.maxSentences}`);
    }
    for (const rule of FORBIDDEN) {
        if (rule.pattern.test(text)) problems.push(`${rule.id}: ${rule.message}`);
    }
    if (MARKETING.test(text)) {
        problems.push(`marketing register: ${MARKETING.exec(text)[0]}`);
    }

    // English: the body is written in English even when its subject is not.
    const letters = text.replace(/[^\p{L}]/gu, '');
    const ascii = text.replace(/[^A-Za-z]/g, '');
    if (letters.length === 0 || ascii.length / letters.length < 0.9) {
        problems.push('body does not read as English (fewer than 90% of its letters are ASCII)');
    }

    for (const link of text.matchAll(/\]\(([^)]+)\)/g)) {
        if (!allowedLinks.includes(link[1])) problems.push(`link ${link[1]} is not one of the entity's recorded addresses`);
    }
    for (const bare of text.matchAll(/https?:\/\/\S+/g)) {
        const url = bare[0].replace(/[).,]+$/, '');
        if (!allowedLinks.includes(url)) problems.push(`link ${url} is not one of the entity's recorded addresses`);
    }

    const recorded = words(inputs.filter(Boolean).join(' '));
    const used = words(text);
    const overlap = [...used].filter(word => recorded.has(word));
    if (overlap.length < LIMITS.minGroundingOverlap) {
        problems.push(`body shares only ${overlap.length} content words with its recorded inputs`);
    }

    return { ok: problems.length === 0, problems, sentences: parts.length, chars: text.length };
}
