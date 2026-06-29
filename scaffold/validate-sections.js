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
const DEMO = path.join(ROOT, 'demo', 'index.html');
const BASE = path.join(ROOT, 'base', 'base.css');

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

/* ---- builder <-> disk registration sync ---- */
function checkSync() {
  const demo = fs.readFileSync(DEMO, 'utf8');
  const block = (demo.match(/const SECTIONS = \[([\s\S]*?)\n\s*\];/) || [])[1] || '';
  const registered = {};                       // slot -> Set(variant)
  const re = /key:\s*'([^']+)'[\s\S]*?variants:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const slot = m[1];
    const variants = m[2].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    registered[slot] = new Set(variants);
  }

  // registered -> disk
  for (const [slot, variants] of Object.entries(registered)) {
    for (const v of variants) {
      for (const ext of ['html', 'css']) {
        const p = path.join(SECTIONS_DIR, slot, `${v}.${ext}`);
        if (!fs.existsSync(p)) add('error', 'sync', `${slot}/${v} is in the builder but ${slot}/${v}.${ext} is missing on disk`);
      }
    }
  }

  // disk -> registered (orphans)
  for (const slot of fs.readdirSync(SECTIONS_DIR)) {
    const slotDir = path.join(SECTIONS_DIR, slot);
    if (!fs.statSync(slotDir).isDirectory()) continue;
    for (const f of fs.readdirSync(slotDir)) {
      if (!f.endsWith('.html') || f.startsWith('_')) continue;   // _mods etc. are not variants
      const v = f.replace(/\.html$/, '');
      if (!registered[slot] || !registered[slot].has(v)) {
        add('error', 'sync', `${slot}/${v}.html exists on disk but is not registered in the builder SECTIONS[]`);
      }
    }
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
  checkSync();

  const errors = findings.filter(f => f.level === 'error');
  const warnings = findings.filter(f => f.level === 'warn');

  for (const f of warnings) console.log(`  ! warn   [${f.where}] ${f.msg}`);
  for (const f of errors)   console.log(`  x error  [${f.where}] ${f.msg}`);

  console.log(`\n${errors.length ? '✗' : '✓'} ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

main();
