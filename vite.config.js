import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/api.js';
import { generateStaticRoutes } from './scripts/generate-static-routes.js';

import fs from 'node:fs';
import path from 'node:path';

// Load .env if present
try {
  if (typeof process.loadEnvFile === 'function') {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath);
    }
  }
} catch (e) {
  // Ignored
}

function commerceApiPlugin() {
  const handler = (req, res, next) => {
    const url = req.originalUrl || req.url;
    const apiIndex = url.indexOf('/api/');
    if (apiIndex === -1 && !url.startsWith('/api')) {
      return next();
    }
    if (apiIndex > 0) {
      req.url = url.slice(apiIndex);
    }
    handleApiRequest(req, res);
  };

  return {
    name: 'commerce-backend-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
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
