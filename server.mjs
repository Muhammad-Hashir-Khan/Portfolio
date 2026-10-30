// Local production-style server: serves the built site from /dist AND the
// same /api/chat endpoint used on Vercel. Used by:
//   npm run dev    →  api server (8787) + Vite dev server (5173, proxied)
//   npm run build && npm run start  →  full self-hosted preview on 8787
//
// On Vercel this file is not deployed; api/chat.js handles that route.

import 'dotenv/config';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleChatRequest } from './api/_lib/chat.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT || 8787);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function readJsonBody(req, limitBytes = 32_768) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    let aborted = false;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        aborted = true;
        resolve(null);
        req.destroy();
        return;
      }
      chunks.push(chunk);
      void limitBytes;
    });
    req.on('end', () => {
      if (aborted) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

async function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '') rel = '/';
  const candidate = path.normalize(path.join(DIST, rel));
  if (!candidate.startsWith(DIST)) {
    res.statusCode = 403;
    res.end();
    return;
  }

  let filePath = candidate;
  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    // Unknown path → SPA fallback to index.html
    filePath = path.join(DIST, 'index.html');
  }

  let data;
  try {
    data = await readFile(filePath);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not found — run "npm run build" first.');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  if (ext === '.html') res.setHeader('Cache-Control', 'no-cache');
  res.end(req.method === 'HEAD' ? undefined : data);
}

const server = createServer(async (req, res) => {
  let pathname = '/';
  try {
    pathname = new URL(req.url || '/', 'http://localhost').pathname;
  } catch {
    /* keep '/' */
  }

  if (pathname === '/api/chat') {
    let body = {};
    if (req.method === 'POST') {
      body = (await readJsonBody(req)) ?? {};
    }
    const forwarded =
      typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'] : '';
    const rawIp = forwarded.split(',')[0].trim() || req.socket?.remoteAddress || 'local';
    // Collapse loopback variants (::1, 127.0.0.1, ::ffff:127.0.0.1) into one
    // bucket so local rate limiting behaves consistently.
    const ip = /^::(ffff:)?(127\.0\.0\.1)|^::1$/.test(rawIp) ? 'local' : rawIp;
    const result = await handleChatRequest({ method: req.method || 'GET', body, ip });
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(result.payload));
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end();
    return;
  }

  try {
    await serveStatic(req, res, pathname);
  } catch {
    res.statusCode = 500;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`[mhk] portfolio server → http://localhost:${PORT} (env GEMINI_MODEL=${process.env.GEMINI_MODEL || 'gemini-flash-lite-latest'})`);
});
