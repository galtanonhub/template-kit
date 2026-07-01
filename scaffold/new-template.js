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
const crypto = require('crypto');
const { execFileSync } = require('child_process');

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

/* Shell slots are rendered by the page shell (head.php / foot.php), NOT by a
   stamped partial. The builder exports them as recipe sections, so drop them
   here — otherwise every straight Export → stamp dies on "No partial mapping
   for nav/...". (When nav/footer become recipe-driven, give them PARTIAL_MAP
   entries and remove them from this set.) */
const MANIFEST = JSON.parse(fs.readFileSync(path.join(KIT, 'manifest.json'), 'utf8'));
const SHELL_SLOTS = new Set(MANIFEST.shellSlots);
recipe.sections = recipe.sections.filter(s => !SHELL_SLOTS.has(s.slot));
if (!recipe.sections.length) {
  console.error('Recipe has no body sections after dropping shell slots (nav/footer).');
  process.exit(1);
}

const name    = arg('--name') || recipe.name || 'untitled';
const slug    = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
const titleFn = s => s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const mode    = arg('--mode') || recipe.mode || 'multi';
const outDir  = arg('--out') || path.join(KIT, '_generated', slug);
const contentSrc = arg('--content') || path.join(SLICE, 'content.original.json');

/* ---- map recipe {slot/variant} → PHP partial filename — derived from the
   manifest's homepage slots (skipping shell slots, which have no partial). ---- */
const PARTIAL_MAP = {};
MANIFEST.home.forEach(slot => {
  if (slot.shell) return;
  slot.variants.forEach(v => { if (v.partial) PARTIAL_MAP[`${slot.key}/${v.id}`] = v.partial; });
});

/* ---- inner-page section library + page order — derived from manifest.pages.
   Inner pages are composed from these the same way the homepage is composed
   from sections. ---- */
const INNER_PARTIAL_MAP = {};
const INNER_PAGES = Object.entries(MANIFEST.pages).map(([slug, pg]) => {
  pg.slots.forEach(slot => slot.variants.forEach(v => {
    if (v.partial) INNER_PARTIAL_MAP[`${slot.key}/${v.id}`] = v.partial;
  }));
  return { slug, default: pg.default.map(([slot, variant]) => ({ slot, variant })) };
});

/* Resolve each inner page to its ordered list of {slot, variant, key, file, options}.
   Uses recipe.pages[slug] when present, else the page's default recipe.
   `options` (e.g. { flip: true, frame: "divided" }) is the builder dock's
   per-variant style toggles — passed through as-is to buildInnerPhp. */
function resolveInnerPages() {
  return INNER_PAGES.map(pg => {
    const secs = (recipe.pages && Array.isArray(recipe.pages[pg.slug]) && recipe.pages[pg.slug].length)
      ? recipe.pages[pg.slug]
      : pg.default;
    const partials = secs.map(({ slot, variant, options }) => {
      const key = `${slot}/${variant}`;
      return { slot, variant, key, file: INNER_PARTIAL_MAP[key], options };
    });
    return { slug: pg.slug, partials };
  });
}
const innerPages = mode === 'multi' ? resolveInnerPages() : [];

/* ---- lib files (copied verbatim) ---- */
const LIB_FILES = ['content.php', 'foot.php', 'auth.php'];

/* ---- support files (root of site, copied verbatim) ---- */
const SUPPORT_FILES = ['save.php', 'editor.js', 'editor.css', 'site.js'];
const MULTI_SUPPORT = ['form.php'];

/* ---- validate all inputs up front ---- */
const missing = [];

const skinFile = path.join(KIT, 'personalities', recipe.skin + '.css');
if (!fs.existsSync(skinFile)) missing.push(`personalities/${recipe.skin}.css`);

if (!fs.existsSync(contentSrc)) missing.push(contentSrc);

const picks = recipe.sections.map(({ slot, variant, options }) => {
  const key     = `${slot}/${variant}`;
  const partial = PARTIAL_MAP[key];
  const phpFile = partial ? path.join(SLICE, 'partials', partial) : null;
  const cssFile = path.join(KIT, 'sections', slot, variant + '.css');

  if (!partial)                      missing.push(`No partial mapping for ${key} — add it to PARTIAL_MAP`);
  else if (!fs.existsSync(phpFile))  missing.push(`_slice/partials/${partial}`);
  if (!fs.existsSync(cssFile))       missing.push(`sections/${slot}/${variant}.css`);

  return { slot, variant, key, partial, phpFile, cssFile, options };
});

if (mode === 'multi') {
  innerPages.forEach(pg => pg.partials.forEach(p => {
    if (!p.file)                                                   missing.push(`No inner-page mapping for ${p.key} — add it to INNER_PARTIAL_MAP`);
    else if (!fs.existsSync(path.join(SLICE, 'partials', p.file))) missing.push(`_slice/partials/${p.file}`);
  }));
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

/* ---- lib/: content.php + foot.php + auth.php verbatim; head.php generated ---- */
LIB_FILES.forEach(f => fs.copyFileSync(path.join(SLICE, 'lib', f), path.join(libDir, f)));
fs.writeFileSync(path.join(libDir, 'head.php'), buildHeadPhp(name, mode), 'utf8');

/* ---- per-site edit password: unique random password, only the hash on disk.
   Printed once below so we can hand it to the buyer; never stored in plaintext.
   Needs php on PATH to compute the bcrypt hash; if absent, the site falls back
   to auth.php's dev password and we warn loudly. ---- */
const editPassword = crypto.randomBytes(9).toString('base64')
  .replace(/[+/=]/g, '').slice(0, 12);
let editPasswordNote;
try {
  const hash = execFileSync('php', ['-r', `echo password_hash($argv[1], PASSWORD_DEFAULT);`, '--', editPassword], { encoding: 'utf8' }).trim();
  if (!/^\$2y\$/.test(hash)) throw new Error('unexpected hash: ' + hash);
  fs.writeFileSync(
    path.join(libDir, 'auth-secret.php'),
    `<?php\n/* Per-site edit password hash — generated at stamp time. Do NOT commit\n   this file or put it in a public repo. Regenerate by re-stamping. */\ndefine('KIT_EDIT_HASH', '${hash}');\n`,
    'utf8'
  );
  editPasswordNote = `  edit pass:  ${editPassword}   (open <site>/?edit=1 and enter this)`;
} catch (err) {
  editPasswordNote = `  ⚠ edit pass: could not generate (php not found) — site uses auth.php's DEV password "edit". Set lib/auth-secret.php before delivery.`;
}

/* ---- partials: homepage + inner pages ---- */
picks.forEach(p => {
  fs.copyFileSync(p.phpFile, path.join(partialsDir, p.partial));
});
if (mode === 'multi') {
  // copy every inner-page partial referenced by the resolved pages (dedup)
  const innerFiles = [...new Set(innerPages.flatMap(pg => pg.partials.map(p => p.file)))];
  innerFiles.forEach(f => fs.copyFileSync(path.join(SLICE, 'partials', f), path.join(partialsDir, f)));
}

/* ---- support files ---- */
SUPPORT_FILES.forEach(f => fs.copyFileSync(path.join(SLICE, f), path.join(outDir, f)));
if (mode === 'multi') {
  MULTI_SUPPORT.forEach(f => fs.copyFileSync(path.join(SLICE, f), path.join(outDir, f)));
}

/* ---- page PHP files ---- */
fs.writeFileSync(path.join(outDir, 'index.php'), buildIndexPhp(picks), 'utf8');
if (mode === 'multi') {
  innerPages.forEach(pg => {
    fs.writeFileSync(
      path.join(outDir, `${pg.slug}.php`),
      buildInnerPhp(pg.slug, pg.partials),
      'utf8'
    );
  });
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
const pages = ['index.php', ...innerPages.map(pg => `${pg.slug}.php`)];
console.log(`  pages:    ${pages.join(', ')}`);
if (mode === 'multi') innerPages.forEach(pg => console.log(`    └ ${pg.slug}: ${pg.partials.map(p => p.key).join(' + ')}`));
console.log(editPasswordNote);
console.log(`\n  preview:  add "${rel}" to launch.json with php.exe -S localhost:<PORT> -t "${rel}"`);

/* ================================================================
   Generators
   ================================================================ */

/* One include, optionally fenced by a $SECTION_OPTS assignment when the
   recipe carries per-variant style toggles (builder dock "Options" — see
   manifest variant.options + render.php). Mirrors render.php's $SECTION_OPTS
   convention so the stamp renders identically to the builder preview. */
// PHP single-quoted string literal (only \ and ' need escaping; no $-interpolation
// risk like a double-quoted literal would have).
function phpSingleQuoted(s) {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function buildIncludeLine(file, options) {
  if (!options || !Object.keys(options).length) {
    return `<?php include __DIR__ . '/partials/${file}'; ?>`;
  }
  // PHP has no {...} object-literal syntax — decode the JSON at runtime instead
  // of hand-emitting a PHP array literal.
  const json = phpSingleQuoted(JSON.stringify(options));
  return `<?php $SECTION_OPTS = json_decode(${json}, true); include __DIR__ . '/partials/${file}'; unset($SECTION_OPTS); ?>`;
}

function buildIndexPhp(sectionPicks) {
  const includes = sectionPicks
    .map(p => buildIncludeLine(p.partial, p.options))
    .join('\n');
  return `<?php require __DIR__ . '/lib/content.php'; $PAGE = 'home'; ?>
<?php require __DIR__ . '/lib/head.php'; ?>

${includes}

<?php require __DIR__ . '/lib/foot.php'; ?>
`;
}

function buildInnerPhp(pageSlot, partials) {
  const includes = partials
    .map(p => buildIncludeLine(p.file, p.options))
    .join('\n');
  return `<?php require __DIR__ . '/lib/content.php'; $PAGE = '${pageSlot}'; ?>
<?php require __DIR__ . '/lib/head.php'; ?>

${includes}

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
<?php if (edit_requested()): ?><link rel="stylesheet" href="editor.css"><?php endif; ?>
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
${siteMode === 'multi' ? `    <button class="nav__toggle" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>` : ''}
  </div>
${siteMode === 'multi' ? `  <nav class="nav__mobile" aria-label="Mobile">
    <a href="index.php<?= $eq ?>"<?= $PAGE==='home' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.home', 'Home')) ?></a>
    <a href="services.php<?= $eq ?>"<?= $PAGE==='services' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.services', 'What We Do')) ?></a>
    <a href="service-areas.php<?= $eq ?>"<?= $PAGE==='service-areas' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.service-areas', 'Where We Work')) ?></a>
    <a href="about.php<?= $eq ?>"<?= $PAGE==='about' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.about', 'Our Story')) ?></a>
    <a class="btn btn--brand" href="contact.php<?= $eq ?>"<?= $PAGE==='contact' ? ' aria-current="page"' : '' ?>><?= e(c('theme.nav.contact', 'Get a Quote')) ?></a>
  </nav>` : ''}
</header>

<main>
`;
}
