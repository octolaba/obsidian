import esbuild from 'esbuild';

await esbuild.build({
	entryPoints: ['src/main.ts'],
	bundle: true,
	external: ['electron'],
	outfile: 'main.js',
	sourcemap: true,
	minify: false,
});
