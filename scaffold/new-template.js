#!/usr/bin/env node
/* ------------------------------------------------------------------
   new-template.js
   Stamp a builder RECIPE into a self-contained deliverable PHP site.

   A recipe is what the builder's "Export" button produces:
     { "name": "...", "skin": "...", "mode": "single"|"multi",
       "sections": [ { "slot": "hero", "variant": "overlay" }, ... ] }

   The stamped site reads content.json at runtime (PHP, server-rendered).
   Buyer edits data only (text + images via ?edit=1) — never structure.

   Usage:
     node scaffold/new-template.js --recipe <recipe.json> [options]

   Options:
     --recipe   path to the exported recipe JSON          (required)
     --out      output folder
                (default: _generated/<slug>)
     --name     override recipe name
     --mode     "single" | "multi"  (override recipe.mode, default: multi)
     --content  path to content.original.json placeholder
                (default: _slice/content.original.json)
   ------------------------------------------------------------------ */
'use strict';
const fs   = require('fs');
const path = require('path');

const KIT   = path.join(__dirname, '..');
const SLICE = path.join(KIT, '_slice');

/* ---- arg helper ---- */
function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

/* ---- validate required args ---- */
const recipePath = arg('--recipe');
if (!recipePath) {
  console.error('Usage: node scaffold/new-template.js --recipe <recipe.json> [--out <dir>] [--mode single|multi] [--content <json>]');
  process.exit(1);
}

/* ---- read recipe ---- */
let recipe;
try { recipe = JSON.parse(fs.readFileSync(recipePath, 'utf8')); }
catch (e) { console.error('Could not read recipe:', e.message); process.exit(1); }

if (!Array.isArray(recipe.sections) || !recipe.sections.length) {
  console.error('Recipe has no "sections" array.'); process.exit(1);
}
if (!recipe.skin) {
  console.error('Recipe has no "skin".'); process.exit(1);
}

const name    = arg('--name') || recipe.name || 'untitled';
const slug    = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
const titleFn = s => s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const mode    = arg('--mode') || recipe.mode || 'multi';
const outDir  = arg('--out') || path.join(KIT, '_generated', slug);
const contentSrc = arg('--content') || path.join(SLICE, 'content.original.json');

/* ---- map recipe {slot/variant} → PHP partial filename in _slice/partials/ ---- */
const PARTIAL_MAP = {
  'hero/overlay':       'hero-overlay.php',
  'hero/split':         'hero-split.php',
  'hero/editorial':     'hero-editorial.php',
  'hero/collage':       'hero-collage.php',
  'hero/mosaic':        'hero-mosaic.php',
  'proof/stat-bar':     'proof-stat-bar.php',
  'services/cards-3':   'services-teaser.php',
  'services/need-state':'services-need-state.php',
  'services/selector':  'services-selector.php',
  'services/carousel':  'services-carousel.php',
  'services/framed':    'services-framed.php',
  'services/framed2':   'services-framed2.php',
  'process/numbered':   'process-numbered.php',
  'process/carousel':   'process-carousel.php',
  'about/split-photo':  'about-teaser.php',
  'areas/chips':        'areas-teaser.php',
  'areas/marquee':      'areas-marquee.php',
  'stories/spotlight':  'stories-spotlight.php',
  'faq/accordion':      'faq-accordion.php',
  'faq/carousel':       'faq-carousel.php',
  'faq/selector':       'faq-selector.php',
  'cta/band':           'cta-band.php',
};

/* ---- inner-page partials (always included in multi mode) ---- */
const INNER_PARTIALS = [
  'services-page.php',
  'areas-page.php',
  'about-page.php',
  'contact-page.php',
];

/* ---- lib files (copied verbatim) ---- */
const LIB_FILES = ['content.php', 'foot.php'];

/* ---- support files (root of site, copied verbatim) ---- */
const SUPPORT_FILES = ['save.php', 'editor.js', 'editor.css', 'site.js'];
const MULTI_SUPPORT = ['form.php'];

/* ---- validate all inputs up front ---- */
const missing = [];

const skinFile = path.join(KIT, 'personalities', recipe.skin + '.css');
if (!fs.existsSync(skinFile)) missing.push(`personalities/${recipe.skin}.css`);

if (!fs.existsSync(contentSrc)) missing.push(contentSrc);

const picks = recipe.sections.map(({ slot, variant }) => {
  const key     = `${slot}/${variant}`;
  const partial = PARTIAL_MAP[key];
  const phpFile = partial ? path.join(SLICE, 'partials', partial) : null;
  const cssFile = path.join(KIT, 'sections', slot, variant + '.css');

  if (!partial)                      missing.push(`No partial mapping for ${key} — add it to PARTIAL_MAP`);
  else if (!fs.existsSync(phpFile))  missing.push(`_slice/partials/${partial}`);
  if (!fs.existsSync(cssFile))       missing.push(`sections/${slot}/${variant}.css`);

  return { slot, variant, key, partial, phpFile, cssFile };
});

if (mode === 'multi') {
  INNER_PARTIALS.forEach(f => {
    const p = path.join(SLICE, 'partials', f);
    if (!fs.existsSync(p)) missing.push(`_slice/partials/${f}`);
  });
  MULTI_SUPPORT.forEach(f => {
    const p = path.join(SLICE, f);
    if (!fs.existsSync(p)) missing.push(`_slice/${f}`);
  });
}

LIB_FILES.forEach(f => {
  const p = path.join(SLICE, 'lib', f);
  if (!fs.existsSync(p)) missing.push(`_slice/lib/${f}`);
});
SUPPORT_FILES.forEach(f => {
  const p = path.join(SLICE, f);
  if (!fs.existsSync(p)) missing.push(`_slice/${f}`);
});

if (missing.length) {
  console.error('Missing inputs:\n  - ' + missing.join('\n  - '));
  process.exit(1);
}

/* ---- create output directories ---- */
const cssDir      = path.join(outDir, 'css');
const libDir      = path.join(outDir, 'lib');
const partialsDir = path.join(outDir, 'partials');
const uploadsDir  = path.join(outDir, 'uploads');
[cssDir, libDir, partialsDir, uploadsDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

/* ---- CSS: section variants concatenated ---- */
const sectionsCss = picks
  .map(p => `/* ===== ${p.slot} · ${p.variant} ===== */\n` + fs.readFileSync(p.cssFile, 'utf8').trim())
  .join('\n\n');
fs.writeFileSync(path.join(cssDir, 'sections.css'), sectionsCss + '\n', 'utf8');
fs.copyFileSync(path.join(KIT, 'base', 'base.css'), path.join(cssDir, 'base.css'));
fs.copyFileSync(skinFile, path.join(cssDir, 'skin.css'));
/* slice.css becomes site.css — page layout rules for the stamped site */
fs.copyFileSync(path.join(SLICE, 'slice.css'), path.join(cssDir, 'site.css'));

/* ---- lib/: content.php + foot.php verbatim; head.php generated ---- */
LIB_FILES.forEach(f => fs.copyFileSync(path.join(SLICE, 'lib', f), path.join(libDir, f)));
fs.writeFileSync(path.join(libDir, 'head.php'), buildHeadPhp(name, mode), 'utf8');

/* ---- partials: homepage + inner pages ---- */
picks.forEach(p => {
  fs.copyFileSync(p.phpFile, path.join(partialsDir, p.partial));
});
if (mode === 'multi') {
  INNER_PARTIALS.forEach(f => fs.copyFileSync(path.join(SLICE, 'partials', f), path.join(partialsDir, f)));
}

/* ---- support files ---- */
SUPPORT_FILES.forEach(f => fs.copyFileSync(path.join(SLICE, f), path.join(outDir, f)));
if (mode === 'multi') {
  MULTI_SUPPORT.forEach(f => fs.copyFileSync(path.join(SLICE, f), path.join(outDir, f)));
}

/* ---- page PHP files ---- */
fs.writeFileSync(path.join(outDir, 'index.php'), buildIndexPhp(picks), 'utf8');
if (mode === 'multi') {
  fs.writeFileSync(path.join(outDir, 'services.php'),      buildInnerPhp('services',      'services-page.php'), 'utf8');
  fs.writeFileSync(path.join(outDir, 'service-areas.php'), buildInnerPhp('service-areas', 'areas-page.php'),    'utf8');
  fs.writeFileSync(path.join(outDir, 'about.php'),         buildInnerPhp('about',         'about-page.php'),    'utf8');
  fs.writeFileSync(path.join(outDir, 'contact.php'),       buildInnerPhp('contact',       'contact-page.php'),  'utf8');
}

/* ---- content JSON ---- */
fs.copyFileSync(contentSrc, path.join(outDir, 'content.json'));
fs.copyFileSync(contentSrc, path.join(outDir, 'content.original.json'));

/* ---- report ---- */
const rel = path.relative(process.cwd(), outDir);
console.log(`✓ stamped "${titleFn(name)}" → ${rel}`);
console.log(`  skin:     ${recipe.skin}`);
console.log(`  mode:     ${mode}`);
console.log(`  sections: ${picks.map(p => p.key).join(', ')}`);
const pages = ['index.php'];
if (mode === 'multi') pages.push('services.php', 'service-areas.php', 'about.php', 'contact.php');
console.log(`  pages:    ${pages.join(', ')}`);
console.log(`\n  preview:  add "${rel}" to launch.json with php.exe -S localhost:<PORT> -t "${rel}"`);

/* ================================================================
   Generators
   ================================================================ */

function buildIndexPhp(sectionPicks) {
  const includes = sectionPicks
    .map(p => `<?php include __DIR__ . '/partials/${p.partial}'; ?>`)
    .join('\n');
  return `<?php require __DIR__ . '/lib/content.php'; $PAGE = 'home'; ?>
<?php require __DIR__ . '/lib/head.php'; ?>

${includes}

<?php require __DIR__ . '/lib/foot.php'; ?>
`;
}

function buildInnerPhp(pageSlot, partialFile) {
  return `<?php require __DIR__ . '/lib/content.php'; $PAGE = '${pageSlot}'; ?>
<?php require __DIR__ . '/lib/head.php'; ?>

<?php include __DIR__ . '/partials/${partialFile}'; ?>

<?php require __DIR__ . '/lib/foot.php'; ?>
`;
}

function buildHeadPhp(siteName, siteMode) {
  /* Generates lib/head.php for the stamped site.
     CSS paths point to css/ (relative to root pages, since lib/ is one level in). */
  return `<?php /* shared page shell. Expects $PAGE set before include. */ ?>
<?php $eq = edit_mode() ? '?edit=1' : ''; ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e(c('business.name', ${JSON.stringify(siteName)})) ?></title>
<meta name="description" content="<?= e(c('home.hero.sub', c('services.teaser.intro', ''))) ?>">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/sections.css">
<link rel="stylesheet" href="css/skin.css">
<link rel="stylesheet" href="css/site.css">
<?php if (edit_mode()): ?><link rel="stylesheet" href="editor.css"><?php endif; ?>
</head>
<body class="<?= edit_mode() ? 'is-editing' : '' ?>">

<header class="nav nav--centered slice-nav">
  <div class="container nav__inner">
    <a class="nav__logo" href="index.php<?= $eq ?>"><?= e(c('business.name', ${JSON.stringify(siteName)})) ?></a>
    <nav class="nav__links">
      <a href="index.php<?= $eq ?>"<?= $PAGE==='home' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.home', 'Home')) ?></a>
${siteMode === 'multi' ? `      <a href="services.php<?= $eq ?>"<?= $PAGE==='services' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.services', 'What We Do')) ?></a>
      <a href="service-areas.php<?= $eq ?>"<?= $PAGE==='service-areas' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.service-areas', 'Where We Work')) ?></a>
      <a href="about.php<?= $eq ?>"<?= $PAGE==='about' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.about', 'Our Story')) ?></a>
      <a class="btn btn--brand" href="contact.php<?= $eq ?>"<?= $PAGE==='contact' ? ' aria-current="page"' : '' ?>><?= e(c('theme.nav.contact', 'Get a Quote')) ?></a>` : `      <a class="btn btn--brand" href="tel:<?= e(preg_replace('/[^+\\d]/', '', c('business.phone', ''))) ?>"><?= e(c('business.phone', '')) ?></a>`}
    </nav>
  </div>
</header>

<main>
`;
}
