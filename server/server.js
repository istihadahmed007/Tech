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
  console.warn('[Security Notice]', err.message);
  console.warn('[Startup] Running with default configuration. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in hosting environment variables to secure.');
}

const rawPort = process.env.PORT || '3000';
const PORT = isNaN(Number(rawPort)) ? rawPort : parseInt(rawPort, 10);
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

/**
 * Decodes URL path repeatedly to uncover multi-layer percent-encoded traversal attempts
 * e.g., %252e%252e -> %2e%2e -> ..
 */
export function decodePathRecursively(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return '';
  let current = rawPath;
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch (e) {
      return null; // Malformed percent-encoding
    }
  }
  return current;
}

/**
 * Resolves a requested relative path against a base directory with strict containment validation.
 * Returns the absolute resolved file path if safely within baseDir, or null if traversal is attempted.
 */
export function resolveSecureStaticPath(baseDir, requestedPath) {
  if (!requestedPath || typeof requestedPath !== 'string') {
    return null;
  }

  // 1. Detect null byte injection
  if (requestedPath.includes('\0') || requestedPath.includes('%00')) {
    return null;
  }

  // 2. Decode percent-encoded and multi-encoded sequences
  const decoded = decodePathRecursively(requestedPath);
  if (decoded === null || decoded.includes('\0')) {
    return null;
  }

  // 3. Detect traversal tokens in posix and win32 path formats
  const normalizedPosix = path.posix.normalize(decoded.replace(/\\/g, '/'));
  if (
    normalizedPosix.startsWith('../') || 
    normalizedPosix === '..' || 
    normalizedPosix.includes('/../') ||
    normalizedPosix.includes('/..')
  ) {
    return null;
  }

  // 4. Strip leading directory separators
  const cleanRelative = decoded.replace(/^[/\\]+/, '');
  const resolvedBase = path.resolve(baseDir);
  const resolvedPath = path.resolve(resolvedBase, cleanRelative);

  // 5. Strict filesystem root containment check
  if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
    return null;
  }

  return resolvedPath;
}

export function handleServerRequest(req, res) {
  const rawUrl = req.url || '/';
  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad Request: Malformed URL');
  }

  const rawPathname = parsedUrl.pathname;
  const decodedPathname = decodePathRecursively(rawPathname);

  // Detect malformed encoding or null byte injection
  if (decodedPathname === null || decodedPathname.includes('\0')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad Request: Invalid path encoding');
  }

  // 1. API Route Delegation
  if (decodedPathname.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // Strict traversal safeguard: Reject any unencoded or encoded directory traversal immediately
  const rawPath = (rawUrl || '/').split('?')[0];
  const decodedRaw = decodePathRecursively(rawPath);
  if (
    rawPath.includes('..') || 
    rawPath.toLowerCase().includes('%2e') || 
    rawPath.toLowerCase().includes('%252e') || 
    (decodedRaw && (decodedRaw.includes('..') || decodedRaw.includes('\0')))
  ) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access denied: Path traversal rejected');
  }

  // 2. Uploaded Images (/uploads/*)
  if (decodedPathname.startsWith('/uploads/')) {
    const relativePart = decodedPathname.slice('/uploads/'.length);
    const targetFile = resolveSecureStaticPath(UPLOADS_DIR, relativePart);

    if (!targetFile) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Access denied: Path traversal rejected');
    }

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
      const ext = path.extname(targetFile).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      return serveStaticFile(req, res, targetFile, mime);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Uploaded file not found');
    }
  }

  // 3. Static Assets from public/ directory
  const publicPath = resolveSecureStaticPath(PUBLIC_DIR, decodedPathname);
  if (!publicPath) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access denied: Path traversal rejected');
  }

  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    const ext = path.extname(publicPath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    return serveStaticFile(req, res, publicPath, mime);
  }

  // 4. Built Frontend Assets from dist/
  if (fs.existsSync(DIST_DIR)) {
    const distRelative = decodedPathname === '/' ? 'index.html' : decodedPathname;
    let distPath = resolveSecureStaticPath(DIST_DIR, distRelative);

    if (!distPath) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Access denied: Path traversal rejected');
    }

    if (fs.existsSync(distPath) && fs.statSync(distPath).isDirectory()) {
      const nestedIndex = path.join(distPath, 'index.html');
      if (fs.existsSync(nestedIndex) && fs.statSync(nestedIndex).isFile()) {
        distPath = nestedIndex;
      }
    }

    if (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) {
      const ext = path.extname(distPath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      return serveStaticFile(req, res, distPath, mime);
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
      <head><title>Tech Nest Accessories API</title></head>
      <body style="font-family: sans-serif; padding: 2rem; background: #F0F9FF; color: #10263D;">
        <h1>Tech Nest Accessories Backend</h1>
        <p>Production server is active. Build client bundle using <code>npm run build</code> to serve storefront.</p>
        <p><a href="/api/health">Check API Health</a></p>
      </body>
    </html>
  `);
}

export const server = http.createServer(handleServerRequest);

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

const isRunningTests = process.env.NODE_ENV === 'test' || 
  process.argv.some(a => a.includes('test')) || 
  process.execArgv.some(a => a.includes('test')) || 
  Boolean(process.env.DISABLE_SERVER_LISTEN);

if (!isRunningTests) {
  if (typeof PhusionPassenger !== 'undefined' || process.env.PORT === 'passenger') {
    server.listen('passenger', () => {
      console.log('[Production Server] Tech Nest listening on Passenger');
    });
  } else if (typeof PORT === 'number') {
    if (process.env.HOST) {
      server.listen(PORT, process.env.HOST, () => {
        console.log(`[Production Server] Tech Nest Storefront & API listening on http://${process.env.HOST}:${PORT}`);
      });
    } else {
      server.listen(PORT, () => {
        console.log(`[Production Server] Tech Nest Storefront & API listening on port ${PORT}`);
      });
    }
  } else {
    server.listen(PORT, () => {
      console.log(`[Production Server] Tech Nest Storefront & API listening on socket ${PORT}`);
    });
  }
}

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
