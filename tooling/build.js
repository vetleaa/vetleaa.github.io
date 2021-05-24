import path from 'node:path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fromProjectRoot = (dir) => path.resolve(__dirname, '..', dir);

try {
    await build({
        entryPoints: [fromProjectRoot('src/index.ts')],
        outdir: fromProjectRoot('dist'),

        target: "es2020",
        format: "esm",
        splitting: true,
        bundle: true,

        logLevel: "info",
    });
} catch (e) {
    console.log('Build failed with error:');
    console.error(e);
}
