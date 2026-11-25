import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist-client', emptyOutDir: true, chunkSizeWarningLimit: 2000,
    // The engine library changes rarely: its own file stays cached when the game code is updated.
    rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } },
  },
  server: { host: true, port: 5173 },
});
