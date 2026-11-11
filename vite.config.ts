import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site from a subpath — relative asset URLs keep
  // the built site working at any repo location (e.g. /mhk-portfolio/).
  base: './',
  plugins: [react()],
  server: {
    // Dev: Vite serves the UI, /api is proxied to the Node server (port 8787).
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});
