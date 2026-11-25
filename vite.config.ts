import { defineConfig } from 'vite';

// SINGLE=1 builds one classic script without chunks, for the single-file version (tools/build-single.cjs).
const single = process.env.SINGLE === '1';

// TLS_PRODUCTION=1 builds without developer and presentation tools (fixed seeds, demonstration,
// presentation mode, test hook). The default build is the demo build and keeps them.
const devTools = process.env.TLS_PRODUCTION !== '1';

export default defineConfig({
  base: './',
  define: { __DEV_TOOLS__: JSON.stringify(devTools) },
  build: single
    ? { outDir: 'dist-single', emptyOutDir: true, chunkSizeWarningLimit: 4000, modulePreload: false,
        rollupOptions: { output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'game.js' } } }
    : { outDir: 'dist-client', emptyOutDir: true, chunkSizeWarningLimit: 2000,
        // The engine library changes rarely: its own file stays cached when the game code is updated.
        rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } } },
  server: { host: true, port: 5173 },
});
