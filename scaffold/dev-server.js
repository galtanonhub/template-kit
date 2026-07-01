#!/usr/bin/env node
/* ------------------------------------------------------------------
   dev-server.js — the builder's dev server.

   Replaces `npx serve` for local builder use: serves the kit's static
   files AND exposes POST /api/create-skin so the builder's "New skin"
   button can close the full loop — derive a palette from one seed,
   write personalities/<name>.css, validate it, and auto-register it in
   demo/index.html's SKINS[] array.

   Dev-only. Never deployed (the kit is tooling, not a site).

   Usage:  node scaffold/dev-server.js   →   http://localhost:8093/demo/
   ------------------------------------------------------------------ */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');
const { buildSkinCss } = require('./derive-skin');
const { validate } = require('./validate-skin');
const forms = require('./forms');

const ROOT = path.join(__dirname, '..');
const PORT = 8093;
const PHP_PORT = 8390;   // internal PHP child the builder proxies .php requests to

/* ------------------------------------------------------------------
   PHP child + proxy. The builder previews sections by fetching the REAL
   _slice partials through render.php (so preview == stamped output). Node
   can't run PHP, so we spawn `php -S` on an internal port and proxy any
   .php request to it. One builder origin still does everything:
   static files + /api/create-skin + PHP-rendered previews.
   ------------------------------------------------------------------ */
function resolvePhpBin() {
  if (process.env.PHP_BIN && fs.existsSync(process.env.PHP_BIN)) return process.env.PHP_BIN;
  const winget = 'C:\\Users\\galta\\AppData\\Local\\Microsoft\\WinGet\\Packages\\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\\php.exe';
  if (fs.existsSync(winget)) return winget;
  try { execFileSync('php', ['-v'], { stdio: 'ignore' }); return 'php'; } catch { return null; }
}

let phpChild = null, phpShuttingDown = false;
function startPhp() {
  const bin = resolvePhpBin();
  if (!bin) {
    console.warn('  ⚠ php not found — section previews (render.php) will not work. Set PHP_BIN.');
    return;
  }
  phpChild = spawn(bin, ['-S', `127.0.0.1:${PHP_PORT}`, '-t', ROOT], { stdio: 'ignore' });
  // respawn if it dies unexpectedly (e.g. a stray `taskkill php`), so the builder
  // preview can't get permanently bricked while the dev-server is up
  phpChild.on('exit', () => { phpChild = null; if (!phpShuttingDown) setTimeout(startPhp, 500); });
}
const stopPhp = () => { phpShuttingDown = true; if (phpChild) phpChild.kill(); };
process.on('exit', stopPhp);
process.on('SIGINT', () => { stopPhp(); process.exit(0); });
process.on('SIGTERM', () => { stopPhp(); process.exit(0); });

function proxyToPhp(req, res) {
  const opts = {
    host: '127.0.0.1', port: PHP_PORT, method: req.method,
    path: req.url, headers: req.headers,
  };
  const up = http.request(opts, upRes => {
    res.writeHead(upRes.statusCode, upRes.headers);
    upRes.pipe(res);
  });
  up.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('PHP preview server unavailable');
  });
  req.pipe(up);
}
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const NAME_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const HEX_RE = /^#?[0-9a-f]{6}$/i;
const titleCase = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const json = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};

/* add { id, label } to the SKINS[] array in demo/index.html if absent */
function registerSkin(id, label) {
  const file = path.join(ROOT, 'demo', 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(`id: '${id}'`)) return false;          // already registered
  const m = html.match(/(const SKINS = \[)([\s\S]*?)(\n  \];)/);
  if (!m) throw new Error('could not find SKINS[] in demo/index.html');
  const entry = `\n    { id: '${id}',${' '.repeat(Math.max(1, 20 - id.length))}label: '${label}' },`;
  html = html.replace(m[0], m[1] + m[2] + entry + m[3]);
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

function createSkin(payload) {
  const name = String(payload.name || '').trim().toLowerCase();
  let seed = String(payload.seed || '').trim();
  const mode = payload.mode === 'dark' ? 'dark' : 'light';
  const preset = forms[payload.preset] ? payload.preset : 'modern';

  if (!NAME_RE.test(name)) {
    return { ok: false, fatal: 'Name must be lowercase kebab-case, e.g. "coastal-calm".' };
  }
  if (!HEX_RE.test(seed)) {
    return { ok: false, fatal: 'Seed must be a 6-digit hex color, e.g. "#2563eb".' };
  }
  if (!seed.startsWith('#')) seed = '#' + seed;

  const outPath = path.join(ROOT, 'personalities', name + '.css');
  if (fs.existsSync(outPath)) {
    return { ok: false, fatal: `A skin named "${name}" already exists.` };
  }

  const css = buildSkinCss({ name, seed, mode, preset });
  fs.writeFileSync(outPath, css, 'utf8');

  const { errors, warnings } = validate(outPath);
  const label = titleCase(name);
  const registered = registerSkin(name, label);

  return {
    ok: errors.length === 0,
    id: name, label, mode, seed, preset, registered,
    errors, warnings,
  };
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/create-skin') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try { json(res, 200, createSkin(JSON.parse(body || '{}'))); }
      catch (e) { json(res, 400, { ok: false, fatal: e.message }); }
    });
    return;
  }

  // PHP requests (render.php preview endpoint) → proxy to the PHP child
  if (req.url.split('?')[0].endsWith('.php')) {
    return proxyToPhp(req, res);
  }

  // static files
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/demo/';
  let filePath = path.join(ROOT, urlPath);
  if (filePath.endsWith(path.sep) || urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');

  // keep requests inside ROOT
  if (!path.resolve(filePath).startsWith(path.resolve(ROOT))) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

startPhp();
server.listen(PORT, () => {
  console.log(`Template Kit builder → http://localhost:${PORT}/demo/`);
  console.log('  POST /api/create-skin is live (used by the "New skin" button)');
  console.log(`  .php requests proxied to an internal PHP server on :${PHP_PORT} (section previews)`);
});
