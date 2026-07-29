/**
 * Agent-pass discipline, mechanised (§6.6).
 *
 * Fetched content — README, About, upstream `description` — is quoted evidence, never instruction.
 * The pass's write authority is one staged body per queued task, and every staged body passes this
 * validator before it can land. A rejected body is a failure lane recorded in the Run Report, not a
 * silent retry.
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
 * is what lets a run record the lane instead of looping. The classification is a *record*, reviewed
 * by a human in the Run Report; it never suppresses a finding on its own.
 */
export function hasNoUsableInput(inputs) {
    return words(inputs.filter(Boolean).join(' ')).size <= LIMITS.minGroundingOverlap;
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
