import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

/**
 * Build the pinned Dataview query parser into an in-memory-use temporary CommonJS bundle.
 *
 * This deliberately reads the supplied checkout instead of vendoring parser code into the skill.
 * It needs the checkout's development dependencies (`npm install`/`npm ci`) and never writes to
 * the checkout itself.
 */
export async function loadUpstreamParser(sourceRoot) {
    const root = path.resolve(sourceRoot);
    const packagePath = path.join(root, 'package.json');
    const parserPath = path.join(root, 'src', 'query', 'parse.ts');
    if (!fs.existsSync(packagePath) || !fs.existsSync(parserPath)) {
        const error = new Error(
            `Dataview source is not hydrated at ${root}; expected package.json and src/query/parse.ts`,
        );
        error.code = 'SOURCE_MISSING';
        throw error;
    }

    const requireFromSource = createRequire(packagePath);
    let rollup;
    let typescript;
    let nodeResolve;
    let commonjs;
    try {
        ({ rollup } = requireFromSource('rollup'));
        typescript = requireFromSource('rollup-plugin-typescript2');
        nodeResolve = requireFromSource('@rollup/plugin-node-resolve').default;
        commonjs = requireFromSource('@rollup/plugin-commonjs');
    } catch (cause) {
        const error = new Error(
            `Dataview parser dependencies are unavailable at ${root}; run npm install in that checkout`,
            { cause },
        );
        error.code = 'DEPENDENCIES_MISSING';
        throw error;
    }

    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dataview-parser-'));
    const cacheRoot = path.join(temporary, 'typescript-cache');
    const outputPath = path.join(temporary, 'parser.cjs');
    const previousCwd = process.cwd();
    let bundle;
    try {
        process.chdir(root);
        bundle = await rollup({
            input: parserPath,
            onwarn(warning, warn) {
                if (warning.code === 'CIRCULAR_DEPENDENCY') return;
                warn(warning);
            },
            plugins: [
                typescript({
                    tsconfig: path.join(root, 'tsconfig-lib.json'),
                    cacheRoot,
                    clean: true,
                }),
                nodeResolve({ browser: false }),
                commonjs(),
            ],
        });
        const generated = await bundle.generate({ format: 'cjs', exports: 'named' });
        const chunk = generated.output.find(item => item.type === 'chunk');
        if (!chunk) throw new Error('Rollup produced no parser chunk');
        fs.writeFileSync(outputPath, chunk.code, 'utf8');
        const parser = createRequire(outputPath)(outputPath);
        if (typeof parser.parseQuery !== 'function') {
            throw new Error('Generated upstream parser does not export parseQuery');
        }
        return {
            parseQuery: parser.parseQuery,
            parseInline(expression) {
                return parser.parseQuery(`TABLE WITHOUT ID ${expression}`);
            },
            sourceRoot: root,
        };
    } finally {
        process.chdir(previousCwd);
        if (bundle) await bundle.close();
        fs.rmSync(temporary, { recursive: true, force: true });
    }
}

