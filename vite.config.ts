import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
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
