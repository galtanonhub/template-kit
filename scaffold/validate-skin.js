#!/usr/bin/env node
/* ------------------------------------------------------------------
   validate-skin.js
   Check a personality (skin) file against the SKINS.md contract
   BEFORE it goes into the builder.

   Verifies three things:
     1. REQUIRED tokens are all present (errors if missing).
     2. RECOMMENDED tokens are present (warnings if missing).
     3. Key text/background pairs pass WCAG AA contrast (4.5:1).

   Zero dependencies — runs on a fresh clone without `npm install`.

   Usage:
     node validate-skin.js ../personalities/<skin-name>.css
     node validate-skin.js --all          # check every personality
   ------------------------------------------------------------------ */
const fs = require('fs');
const path = require('path');

/* --- the contract (mirrors SKINS.md + base.css token vocabulary) --- */

// Missing any of these = a skin is incomplete. ERROR.
const REQUIRED = {
  Color: [
    '--c-bg', '--c-bg-alt', '--c-bg-deep', '--c-surface',
    '--c-ink', '--c-ink-soft', '--c-ink-invert', '--c-ink-invert-soft',
    '--c-brand', '--c-brand-deep', '--c-brand-ink', '--c-accent',
    '--c-line', '--c-line-strong',
  ],
  Type: ['--font-display', '--font-body', '--fw-bold', '--fw-heavy',
         '--tracking-display', '--tracking-eyebrow', '--leading-tight'],
  Shape: ['--radius', '--radius-lg', '--radius-pill',
          '--border-weight', '--rule-weight'],
  Buttons: ['--btn-radius', '--btn-transform', '--btn-weight'],
  Elevation: ['--shadow', '--shadow-lg', '--card-border'],
};

// Nice to have for a fully-realised look. WARNING only.
const RECOMMENDED = {
  Type: ['--font-accent', '--fw-normal', '--fw-medium', '--leading-body'],
  Buttons: ['--btn-tracking'],
  Rhythm: ['--section-pad', '--gap'],
};

// Text/background pairs that must stay legible.
// [foreground, background, label, minRatio]
// 4.5:1 is WCAG AA for normal body text; 3:1 is AA for large/bold text —
// button labels are bold, so the brand-button pair is held to 3:1.
const AA = 4.5, AA_LARGE = 3.0;
const CONTRAST_PAIRS = [
  ['--c-ink',        '--c-bg',      'body text on page',     AA],
  ['--c-ink',        '--c-surface', 'text on cards',         AA],
  ['--c-ink-soft',   '--c-bg',      'muted text on page',    AA],
  ['--c-brand-ink',  '--c-brand',   'text on brand buttons', AA_LARGE],
  ['--c-ink-invert', '--c-bg-deep', 'text on dark sections', AA],
];

/* --- tiny self-contained WCAG contrast math --- */

function parseHex(v) {
  if (!v) return null;
  const m = v.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;                 // rgba()/var()/named — skip, can't math it
  let h = m[1];
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}

function relLum([r, g, b]) {
  const f = c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg, bg) {
  const a = relLum(fg) + 0.05, b = relLum(bg) + 0.05;
  return (Math.max(a, b) / Math.min(a, b));
}

/* --- parse a skin file's :root token declarations --- */

function readTokens(css) {
  const tokens = {};
  // grab the first :root { ... } block
  const root = css.match(/:root\s*\{([\s\S]*?)\}/);
  const body = root ? root[1] : css;
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

// resolve a token whose value is `var(--other)` one hop, so contrast still works
function resolve(tokens, name, seen = new Set()) {
  let v = tokens[name];
  while (v && /^var\(\s*(--[\w-]+)\s*\)$/.test(v)) {
    const next = v.match(/^var\(\s*(--[\w-]+)\s*\)$/)[1];
    if (seen.has(next)) break;
    seen.add(next);
    v = tokens[next];
  }
  return v;
}

/* --- validate one file --- */

function validate(file) {
  const css = fs.readFileSync(file, 'utf8');
  const tokens = readTokens(css);
  const name = path.basename(file);
  const errors = [], warnings = [];

  // 1. required tokens
  for (const [group, list] of Object.entries(REQUIRED)) {
    for (const t of list) {
      if (!(t in tokens)) errors.push(`missing required ${group} token  ${t}`);
    }
  }

  // 2. recommended tokens
  for (const [group, list] of Object.entries(RECOMMENDED)) {
    for (const t of list) {
      if (!(t in tokens)) warnings.push(`missing recommended ${group} token  ${t}`);
    }
  }

  // 3. font @import present?
  if (!/@import\s+url\(/.test(css)) {
    errors.push('no @import url(...) — display & body fonts must be loaded by the skin');
  }

  // 4. contrast on key pairs
  for (const [fgT, bgT, label, min] of CONTRAST_PAIRS) {
    const fg = parseHex(resolve(tokens, fgT));
    const bg = parseHex(resolve(tokens, bgT));
    if (!fg || !bg) {
      if (fgT in tokens && bgT in tokens)
        warnings.push(`could not check contrast (${label}) — non-hex value`);
      continue;
    }
    const ratio = contrast(fg, bg);
    if (ratio < min) {
      errors.push(`low contrast ${ratio.toFixed(2)}:1 (need ${min})  ${label}  [${fgT} on ${bgT}]`);
    }
  }

  return { name, errors, warnings };
}

/* --- runner --- */

function report({ name, errors, warnings }) {
  const ok = errors.length === 0;
  console.log(`\n${ok ? '✓' : '✗'} ${name}`);
  for (const w of warnings) console.log(`  ! warning  ${w}`);
  for (const e of errors)   console.log(`  x error    ${e}`);
  if (ok && warnings.length === 0) console.log('  all checks passed');
  return ok;
}

function main() {
  const argv = process.argv.slice(2);
  let files;
  if (argv[0] === '--all' || argv.length === 0) {
    const dir = path.join(__dirname, '..', 'personalities');
    files = fs.readdirSync(dir).filter(f => f.endsWith('.css'))
              .map(f => path.join(dir, f));
    if (argv.length === 0 && argv[0] !== '--all') {
      // no args at all -> still default to --all, but hint usage
      console.log('No file given — checking all personalities. (Pass a path to check one.)');
    }
  } else {
    files = [path.resolve(argv[0])];
  }

  let allOk = true;
  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.log(`\n✗ ${f}\n  x error    file not found`);
      allOk = false;
      continue;
    }
    if (!report(validate(f))) allOk = false;
  }
  console.log('');
  process.exit(allOk ? 0 : 1);
}

module.exports = { validate };

// only run the CLI when invoked directly, not when require()'d by the server
if (require.main === module) main();
