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
const { buildSkinCss } = require('./derive-skin');
const { validate } = require('./validate-skin');
const forms = require('./forms');

const ROOT = path.join(__dirname, '..');
const PORT = 8093;
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

server.listen(PORT, () => {
  console.log(`Template Kit builder → http://localhost:${PORT}/demo/`);
  console.log('  POST /api/create-skin is live (used by the "New skin" button)');
});
