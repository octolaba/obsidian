import fs from 'node:fs';
import path from 'node:path';
import { isFile, nowUtc, readJson, sha256, writeJson } from './lib.mjs';
import { repoKey } from './model.mjs';

/**
 * The Ledger — a disposable cache (decision 3.10).
 *
 * It holds nothing that cannot be recovered: identity mappings come back from note frontmatter,
 * Sync State from the latest successful Run Report, capture baselines from a re-baseline pass. It
 * exists to save work, never to hold truth, so every reader here tolerates its absence and no
 * writer treats a write failure as fatal to a run.
 */

export const LEDGER_DIRECTORY = '.catalog';
const LEDGER_FILE = 'ledger.json';

export function ledgerPath(catalogRoot) {
    return path.join(catalogRoot, LEDGER_DIRECTORY, LEDGER_FILE);
}

export function emptyLedger(pin = null) {
    return {
        ledgerVersion: 1,
        pin,
        writtenAt: null,
        repositoriesByRepoString: {},
        repositoriesById: {},
        captures: {},
        checkpoints: {},
    };
}

export function loadLedger(catalogRoot, pin = null) {
    const file = ledgerPath(catalogRoot);
    if (!isFile(file)) return { present: false, ledger: emptyLedger(pin), file };
    const parsed = readJson(file, null);
    if (!parsed || parsed.ledgerVersion !== 1) return { present: false, ledger: emptyLedger(pin), file };
    return { present: true, ledger: parsed, file };
}

export function saveLedger(catalogRoot, ledger) {
    const file = ledgerPath(catalogRoot);
    ledger.writtenAt = nowUtc();
    writeJson(file, ledger);
    return file;
}

export function recordRepository(ledger, repoString, repository) {
    ledger.repositoriesByRepoString[repoKey(repoString)] = repository.numericId;
    ledger.repositoriesById[String(repository.numericId)] = {
        fullName: repository.fullName,
        note: repository.note,
        capturedAt: repository.capturedAt ?? null,
    };
}

export function lookupRepository(ledger, repoString) {
    const numericId = ledger.repositoriesByRepoString[repoKey(repoString)];
    if (numericId === undefined) return null;
    const record = ledger.repositoriesById[String(numericId)];
    return record ? { numericId, ...record } : null;
}

/**
 * Capture baselines. `baseline` returns the recorded hash or `null`; a `null` is the re-baseline
 * case (§6.2.4) — record the fresh hash, queue nothing.
 */
export function baseline(ledger, key) {
    return ledger.captures[key]?.hash ?? null;
}

export function recordCapture(ledger, key, value, capturedAt = nowUtc()) {
    const hash = sha256(value ?? '');
    const previous = ledger.captures[key]?.hash ?? null;
    ledger.captures[key] = { hash, capturedAt };
    return { hash, previous, changed: previous !== null && previous !== hash, rebaselined: previous === null };
}

export function checkpoint(ledger, name, value) {
    ledger.checkpoints[name] = { value, at: nowUtc() };
}

export function dropLedger(catalogRoot) {
    fs.rmSync(path.join(catalogRoot, LEDGER_DIRECTORY), { recursive: true, force: true });
}
