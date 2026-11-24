import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: { outDir: 'dist-client', emptyOutDir: true, chunkSizeWarningLimit: 2000 },
  server: { host: true, port: 5173 },
});
