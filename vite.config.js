import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/api.js';

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

export default defineConfig({
  plugins: [react(), commerceApiPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
