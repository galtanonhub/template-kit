#!/usr/bin/env node
/* ------------------------------------------------------------------
   validate-sections.js
   Keep section variants DETERMINISTIC. Every bug class we have hit
   becomes a hard check here so it can never silently return.

   Checks, per the bugs they prevent:

   HTML (fragments must stay bare — they get injected via innerHTML):
     [ERROR] document wrapper or <head>/<link>/<!DOCTYPE>/<html>/<body>
             — a stray <link> loads a second skin and silently overrides
               the chosen one (the "mosaic looked soft" bug).
     [ERROR] tel:# / mailto:# placeholder links (dead on real devices)
     [WARN]  inline <script>/<style> (dead when injected via innerHTML;
             interaction belongs in _slice/site.js, styling in the .css)
     [WARN]  <img> without an alt attribute

   CSS (finish belongs in skins, never baked into a section):
     [ERROR] var(--token) referencing a token that doesn't exist in
             base.css (or defined locally in the same file) — the
             "--fw-semibold silently fell back to normal" bug.
     [ERROR] hard-coded border-radius px/rem literal (use --radius*;
             50% and 0 are allowed — those are geometry, not finish)
     [WARN]  hard-coded hex color outside a comment / mask-image
     [WARN]  hard-coded box-shadow (use --shadow / --shadow-lg)

   SYNC (builder and disk must agree):
     [ERROR] a variant registered in demo/index.html SECTIONS[] with no
             matching .html or .css on disk
     [ERROR] a <slot>/<variant>.{html,css} on disk not registered in
             the builder (orphan — undesignable)

   Zero dependencies. Usage:
     node validate-sections.js          # check everything
   ------------------------------------------------------------------ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SECTIONS_DIR = path.join(ROOT, 'sections');
const PARTIALS_DIR = path.join(ROOT, '_slice', 'partials');
const BASE = path.join(ROOT, 'base', 'base.css');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

const findings = [];   // { level, where, msg }
const add = (level, where, msg) => findings.push({ level, where, msg });

const stripComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

/* ---- known design tokens (from base.css :root defaults) ---- */
function baseTokens() {
  const css = fs.readFileSync(BASE, 'utf8');
  const root = css.match(/:root\s*\{([\s\S]*?)\}/);
  const set = new Set();
  const re = /(--[\w-]+)\s*:/g; let m;
  while ((m = re.exec(root ? root[1] : css)) !== null) set.add(m[1]);
  return set;
}

/* ---- per-file HTML checks ---- */
function checkHtml(file, rel) {
  const html = fs.readFileSync(file, 'utf8');

  if (/<!doctype|<html[\s>]|<\/html>|<head[\s>]|<\/head>|<body[\s>]|<\/body>/i.test(html)) {
    add('error', rel, 'is a full HTML document — must be a bare fragment (a <head>/<link> here loads a second skin and overrides the chosen one)');
  }
  if (/<link\b/i.test(html)) {
    add('error', rel, 'contains a <link> tag — sections must not pull in their own CSS/skin');
  }
  if (/<script\b/i.test(html)) {
    add('warn', rel, 'contains an inline <script> — dead when injected via innerHTML; put interaction in _slice/site.js');
  }
  if (/<style\b/i.test(html)) {
    add('warn', rel, 'contains an inline <style> — put styling in the section .css');
  }
  if (/(href|src)\s*=\s*["'](tel:#|mailto:#|tel:["']|mailto:["'])/i.test(html)) {
    add('error', rel, 'has a placeholder tel:#/mailto:# link (dead on real devices)');
  }
  // <img> without alt
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgs) {
    if (!/\balt\s*=/i.test(tag)) add('warn', rel, 'an <img> is missing an alt attribute');
  }
}

/* ---- per-file CSS checks ---- */
function checkCss(file, rel, known) {
  const raw = fs.readFileSync(file, 'utf8');
  const css = stripComments(raw);

  // local custom properties defined in this file are allowed
  const local = new Set();
  let m, re = /(--[\w-]+)\s*:/g;
  while ((m = re.exec(css)) !== null) local.add(m[1]);

  // var(--x) referencing an unknown token
  const seen = new Set();
  re = /var\(\s*(--[\w-]+)/g;
  while ((m = re.exec(css)) !== null) {
    const tok = m[1];
    if (seen.has(tok)) continue; seen.add(tok);
    if (!known.has(tok) && !local.has(tok)) {
      add('error', rel, `references undefined token ${tok} (not in base.css or defined locally)`);
    }
  }

  // hard-coded border-radius literal (allow 0, 50%, and any value using var())
  re = /border-radius\s*:\s*([^;]+);/g;
  while ((m = re.exec(css)) !== null) {
    const val = m[1].trim();
    if (val.includes('var(')) continue;
    if (/^(0px|0|50%|inherit|initial)$/.test(val)) continue;
    if (/\d+(px|rem|em)\b/.test(val)) {
      add('error', rel, `hard-coded border-radius "${val}" — use a --radius* token (50% for circles is fine)`);
    }
  }

  // hard-coded box-shadow (allow none and any using var())
  re = /box-shadow\s*:\s*([^;]+);/g;
  while ((m = re.exec(css)) !== null) {
    const val = m[1].trim();
    if (val.includes('var(') || val === 'none') continue;
    add('warn', rel, `hard-coded box-shadow "${val.slice(0, 40)}…" — prefer --shadow / --shadow-lg`);
  }

  // hard-coded hex colors (skip mask-image lines — those are alpha masks)
  for (const line of css.split('\n')) {
    if (/mask-image/i.test(line)) continue;
    if (/#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{6}\b/.test(line)) {
      add('warn', rel, `hard-coded hex color in "${line.trim().slice(0, 48)}" — use a --c-* token`);
    }
  }
}

/* ---- manifest <-> disk sync (manifest.json is the single source of truth) ----
   Homepage body variants render via _slice PHP partials; shell slots (nav/footer)
   render via static preview fragments; inner-page variants render via partials.
   Per-variant CSS (sections/<slot>/<id>.css) feeds the builder's CSS bundle. */
function checkSync() {
  const homeVariants = [];   // {slot, id, partial, shell}
  for (const slot of MANIFEST.home)
    for (const v of slot.variants)
      homeVariants.push({ slot: slot.key, id: v.id, partial: v.partial || null, shell: !!slot.shell });

  const pageVariants = [];   // {slot, id, partial}
  for (const pg of Object.values(MANIFEST.pages))
    for (const slot of pg.slots)
      for (const v of slot.variants)
        pageVariants.push({ slot: slot.key, id: v.id, partial: v.partial || null });

  // what's actually on disk
  const cssOnDisk = new Set(), htmlOnDisk = new Set();
  for (const slot of fs.readdirSync(SECTIONS_DIR)) {
    const slotDir = path.join(SECTIONS_DIR, slot);
    if (!fs.statSync(slotDir).isDirectory()) continue;
    for (const f of fs.readdirSync(slotDir)) {
      if (f.startsWith('_')) continue;   // _mods are not variants
      if (f.endsWith('.css'))  cssOnDisk.add(`${slot}/${f.replace(/\.css$/, '')}`);
      if (f.endsWith('.html')) htmlOnDisk.add(`${slot}/${f.replace(/\.html$/, '')}`);
    }
  }
  const partialsOnDisk = new Set(fs.readdirSync(PARTIALS_DIR).filter(f => f.endsWith('.php')));
  const usedPartials = new Set();

  // manifest -> disk
  for (const v of homeVariants) {
    const key = `${v.slot}/${v.id}`;
    if (!cssOnDisk.has(key)) add('error', 'sync', `${key} is in the manifest but sections/${key}.css is missing`);
    if (v.shell) {
      if (!htmlOnDisk.has(key)) add('error', 'sync', `shell variant ${key} needs sections/${key}.html (preview fragment) — missing`);
    } else if (v.partial) {
      if (!partialsOnDisk.has(v.partial)) add('error', 'sync', `${key} maps to _slice/partials/${v.partial} — missing`);
      usedPartials.add(v.partial);
    } else {
      add('error', 'sync', `${key} has no partial and is not a shell slot — nothing to render`);
    }
  }
  for (const v of pageVariants) {
    const key = `${v.slot}/${v.id}`;
    if (!v.partial) { add('error', 'sync', `inner ${key} has no partial in the manifest`); continue; }
    if (!partialsOnDisk.has(v.partial)) add('error', 'sync', `inner ${key} maps to _slice/partials/${v.partial} — missing`);
    usedPartials.add(v.partial);
  }

  // disk -> manifest (orphans)
  const homeKeys  = new Set(homeVariants.map(v => `${v.slot}/${v.id}`));
  const shellKeys = new Set(homeVariants.filter(v => v.shell).map(v => `${v.slot}/${v.id}`));
  for (const key of cssOnDisk)
    if (!homeKeys.has(key)) add('error', 'sync', `sections/${key}.css exists but is not in the manifest home[]`);
  for (const key of htmlOnDisk)
    if (!shellKeys.has(key)) add('warn', 'sync', `sections/${key}.html is a dead fragment — body/inner sections render via PHP now; delete it`);
  for (const f of partialsOnDisk)
    if (!usedPartials.has(f)) add('warn', 'sync', `_slice/partials/${f} is not referenced by the manifest (orphan)`);
}

/* ---- _slice partials: bare-fragment hygiene (they are injected via innerHTML
   in the builder preview too, so a stray <link>/<head> breaks the same way).
   We DON'T reuse checkHtml's img-alt / tel:# checks here: PHP interpolation
   (<?= … ?>) contains '>' and confuses those attribute regexes. The structural
   checks below are PHP-safe. ---- */
function checkPartials() {
  for (const f of fs.readdirSync(PARTIALS_DIR)) {
    if (!f.endsWith('.php')) continue;
    const rel = `_slice/partials/${f}`;
    const src = fs.readFileSync(path.join(PARTIALS_DIR, f), 'utf8');
    if (/<!doctype|<html[\s>]|<\/html>|<head[\s>]|<\/head>|<body[\s>]|<\/body>/i.test(src))
      add('error', rel, 'is a full HTML document — partials must be bare fragments (injected via innerHTML in the builder preview)');
    if (/<link\b/i.test(src))
      add('error', rel, 'contains a <link> tag — a stray skin link overrides the chosen one');
    if (/<script\b/i.test(src))
      add('warn', rel, 'contains an inline <script> — dead when injected via innerHTML; put interaction in _slice/site.js');
    if (/<style\b/i.test(src))
      add('warn', rel, 'contains an inline <style> — put styling in the section CSS');
  }
}

/* ---- run ---- */
function walk(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function main() {
  const known = baseTokens();
  for (const file of walk(SECTIONS_DIR)) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    if (file.endsWith('.html')) checkHtml(file, rel);
    else if (file.endsWith('.css')) checkCss(file, rel, known);
  }
  checkPartials();
  checkSync();

  const errors = findings.filter(f => f.level === 'error');
  const warnings = findings.filter(f => f.level === 'warn');

  for (const f of warnings) console.log(`  ! warn   [${f.where}] ${f.msg}`);
  for (const f of errors)   console.log(`  x error  [${f.where}] ${f.msg}`);

  console.log(`\n${errors.length ? '✗' : '✓'} ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

main();
