#!/usr/bin/env node

/**
 * Backward-compatible entry point for the original scanner.
 *
 * New automation should invoke dataview-query-lint.mjs directly. The wrapper keeps
 * --json, --all, --top and --min-score accepted so existing shell aliases do not
 * accidentally reinterpret their values as a vault path.
 */

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const usage = `usage: node audit-dataview-queries.mjs [VAULT] [options]

  --json            emit the new linter's JSON report
  --all             include every extracted query in that report
  --top N           accepted for compatibility; no longer truncates diagnostics
  --min-score N     accepted for compatibility; severity replaces numeric scores
  --source-root P   enable exact parsing from a Dataview source checkout
  -h, --help        show this help`;

const forwarded = [];
let compatibilityNotice = false;
for (let index = 0; index < process.argv.slice(2).length; index += 1) {
    const token = process.argv.slice(2)[index];
    if (token === '-h' || token === '--help') {
        process.stdout.write(`${usage}\n`);
        process.exit(0);
    }
    if (token === '--json') {
        forwarded.push('--format', 'json');
    } else if (token === '--top' || token === '--min-score') {
        if (process.argv.slice(2)[index + 1] === undefined) {
            process.stderr.write(`error: ${token} needs a value\n${usage}\n`);
            process.exit(2);
        }
        index += 1;
        compatibilityNotice = true;
    } else {
        forwarded.push(token);
    }
}

if (compatibilityNotice) {
    process.stderr.write(
        'note: --top/--min-score are compatibility no-ops; filter the structured JSON/SARIF report by severity instead.\n',
    );
}

const script = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'dataview-query-lint.mjs',
);
const result = spawnSync(process.execPath, [script, ...forwarded], {
    stdio: 'inherit',
});
if (result.error) {
    process.stderr.write(`error: could not launch dataview-query-lint.mjs: ${result.error.message}\n`);
    process.exit(2);
}
process.exit(result.status ?? 2);
