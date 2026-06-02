import esbuild from 'esbuild';
import process from 'process';
import { builtinModules } from 'node:module';

const prod = process.argv[2] === 'production';

await esbuild.context({
	entryPoints: ['src/main.ts'],
	bundle: true,
	external: ['obsidian', 'electron', '@codemirror/state', '@codemirror/view', '@lezer/common', ...builtinModules],
	format: 'cjs',
	target: 'es2021',
	sourcemap: prod ? false : 'inline',
	outfile: 'main.js',
	minify: prod,
});
