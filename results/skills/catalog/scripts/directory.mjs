import { sha256 } from './lib.mjs';
import { extractAbout } from './about.mjs';

/**
 * Directory Page capture, deliberately unhurried.
 *
 * The site publishes no robots policy, so pacing errs polite: one request at a time, a recorded
 * interval between them, bounded retries with backoff, and a clean abort when throttling repeats
 * (§6.5). Every parameter is a recorded run input reported in the Run Report — nothing here has a
 * silent default that a later reader would have to guess at.
 */

export const DEFAULT_PACING = Object.freeze({
    concurrency: 1,
    intervalMs: 1500,
    retries: 2,
    backoffMs: 5000,
    throttleAbortAfter: 3,
    timeoutMs: 30000,
});

export function pacingFrom(overrides = {}) {
    return { ...DEFAULT_PACING, ...overrides };
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export class DirectoryClient {
    constructor({ pacing, userAgent }) {
        this.pacing = pacing;
        this.userAgent = userAgent;
        this.throttled = 0;
        this.requests = 0;
        this.lastAt = 0;
    }

    async fetchPage(url) {
        for (let attempt = 0; ; attempt += 1) {
            const wait = this.lastAt + this.pacing.intervalMs - Date.now();
            if (wait > 0) await sleep(wait);
            this.lastAt = Date.now();
            this.requests += 1;
            let response;
            try {
                response = await fetch(url, {
                    headers: { 'user-agent': this.userAgent, accept: 'text/html' },
                    signal: AbortSignal.timeout(this.pacing.timeoutMs),
                });
            } catch (error) {
                if (attempt >= this.pacing.retries) return { ok: false, status: null, reason: String(error) };
                await sleep(this.pacing.backoffMs * (attempt + 1));
                continue;
            }
            if (response.status === 429 || response.status >= 500) {
                this.throttled += 1;
                if (this.throttled >= this.pacing.throttleAbortAfter) {
                    const error = new Error(`repeated throttling from the Directory (${this.throttled} responses); aborting the run cleanly`);
                    error.aborted = true;
                    throw error;
                }
                if (attempt >= this.pacing.retries) return { ok: false, status: response.status, reason: 'throttled' };
                await sleep(this.pacing.backoffMs * (attempt + 1));
                continue;
            }
            const body = await response.text();
            return { ok: response.ok, status: response.status, body, bytes: body.length, hash: sha256(body) };
        }
    }

    /** Capture plus extraction in one step, so no caller ever sees unvalidated page text. */
    async captureAbout(url, kind) {
        const page = await this.fetchPage(url);
        if (!page.ok || page.body === undefined) {
            return { status: 'http-error', about: null, page, reason: `HTTP ${page.status ?? 'error'}: ${page.reason ?? ''}`.trim() };
        }
        const extraction = extractAbout(page.body, { kind, url });
        return { ...extraction, page: { status: page.status, bytes: page.bytes, hash: page.hash } };
    }
}
