import { defineConfig } from 'vite';

// SINGLE=1 builds one classic script without chunks, for the single-file version (tools/build-single.cjs).
const single = process.env.SINGLE === '1';

export default defineConfig({
  base: './',
  build: single
    ? { outDir: 'dist-single', emptyOutDir: true, chunkSizeWarningLimit: 4000, modulePreload: false,
        rollupOptions: { output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'game.js' } } }
    : { outDir: 'dist-client', emptyOutDir: true, chunkSizeWarningLimit: 2000,
        // The engine library changes rarely: its own file stays cached when the game code is updated.
        rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } } },
  server: { host: true, port: 5173 },
});
