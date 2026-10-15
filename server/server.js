import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleApiRequest } from './api.js';
import { validateProductionSecrets } from './auth.js';

// Load environment variables if .env exists
try {
  if (typeof process.loadEnvFile === 'function') {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath);
    }
  }
} catch (e) {
  // Ignored if already set
}

// Validate production security
try {
  validateProductionSecrets();
} catch (err) {
  console.error(err.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveStaticFile(req, res, filePath, contentType) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    res.writeHead(200, {
      'Content-Type': contentType || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': filePath.includes('assets') ? 'public, max-age=31536000, immutable' : 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return true;
  } catch (e) {
    return false;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. API Route Delegation
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // 2. Uploaded Images (/uploads/*)
  if (pathname.startsWith('/uploads/')) {
    const safeFilename = path.basename(pathname);
    const targetFile = path.join(UPLOADS_DIR, safeFilename);
    const ext = path.extname(safeFilename).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    if (fs.existsSync(targetFile)) {
      return serveStaticFile(req, res, targetFile, mime);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Uploaded file not found');
    }
  }

  // 3. Static Assets from public/ directory
  const publicPath = path.join(PUBLIC_DIR, pathname);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    const ext = path.extname(publicPath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    return serveStaticFile(req, res, publicPath, mime);
  }

  // 4. Built Frontend Assets from dist/
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      const nestedIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(nestedIndex)) {
        filePath = nestedIndex;
      }
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      return serveStaticFile(req, res, filePath, mime);
    }

    // SPA Fallback: serve dist/index.html for client routes
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      return serveStaticFile(req, res, indexPath, 'text/html; charset=utf-8');
    }
  }

  // Fallback if frontend is not yet built
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>Glacial Tech Accessories API</title></head>
      <body style="font-family: sans-serif; padding: 2rem; background: #EAF5FF; color: #10263D;">
        <h1>Glacial Tech Accessories Backend</h1>
        <p>Production server is active. Build client bundle using <code>npm run build</code> to serve storefront.</p>
        <p><a href="/api/health">Check API Health</a></p>
      </body>
    </html>
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server Error] Port ${PORT} is already in use by another process.`);
  } else {
    console.error('[Server Error]', err);
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
});

server.listen(PORT, HOST, () => {
  console.log(`[Production Server] Glacial Tech Storefront & API listening on http://${HOST}:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
