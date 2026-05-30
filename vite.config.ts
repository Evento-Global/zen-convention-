import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

/** Deep links like `/products/haldi-traditional` load `index.html` in dev. */
function spaFallback(): Plugin {
  return {
    name: 'spa-fallback-products',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url ?? '';
        const pathOnly = raw.split('?')[0] ?? '';
        if (
          req.method === 'GET' &&
          pathOnly.startsWith('/products/') &&
          !pathOnly.includes('.')
        ) {
          req.url = '/';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback()],
});
