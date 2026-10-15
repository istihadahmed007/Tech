import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/api.js';
import { generateStaticRoutes } from './scripts/generate-static-routes.js';

function commerceApiPlugin() {
  return {
    name: 'commerce-backend-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }
        handleApiRequest(req, res);
      });
    }
  };
}

function staticRoutesPlugin() {
  return {
    name: 'static-product-routes',
    closeBundle() {
      try {
        generateStaticRoutes();
      } catch (err) {
        console.warn('Could not generate static routes during build:', err.message);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), commerceApiPlugin(), staticRoutesPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
