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

/* --- differentiation fingerprint ---
   Reduces a skin to 5 categorical axes so we can compare skins against
   each other and block ones that are too similar.

   Axes:
     1. bgMode      — 'light' or 'dark' (lightness of --c-bg)
     2. fontDisplay — first font-family name, lowercased
     3. radiusCat   — 'sharp' (0-2px), 'subtle' (3-9px), 'rounded' (10-30px), 'pill' (>30px)
     4. shadowStyle — 'none', 'hard-offset' (no blur keyword, px px 0), 'glow' (rgba glow), 'soft-drop'
     5. brandHue    — color family bucket (red/orange/yellow/green/teal/blue/purple/pink/neutral)

   A new skin must differ from every existing skin on AT LEAST 3 of 5 axes.
   Matching on 2 → warning. Matching on 3+ → error (too close).
   Same display font as any existing skin → immediate error (most visible axis).
*/

function fingerprint(tokens, css) {
  // 1. bgMode
  const bgRgb = parseHex(tokens['--c-bg']);
  const bgLum = bgRgb ? relLum(bgRgb) : 0.5;
  const bgMode = bgLum < 0.2 ? 'dark' : 'light';

  // 2. fontDisplay — grab first quoted or unquoted name
  const fd = (tokens['--font-display'] || '').match(/['"]?([A-Za-z][^'",]+)['"]?/);
  const fontDisplay = fd ? fd[1].trim().toLowerCase() : 'unknown';

  // 3. radiusCat — use --radius (card corners, most visible)
  const rVal = parseFloat(tokens['--radius'] || '0');
  const radiusCat = rVal <= 2 ? 'sharp' : rVal <= 9 ? 'subtle' : rVal <= 30 ? 'rounded' : 'pill';

  // 4. shadowStyle
  const sh = (tokens['--shadow'] || '').toLowerCase();
  const shLg = (tokens['--shadow-lg'] || '').toLowerCase();
  let shadowStyle;
  if (sh === 'none' && /rgba.*0\.\d+.*rgba|0 0 \d+px/.test(shLg)) shadowStyle = 'glow';
  else if (sh === 'none' && /\d+px \d+px 0/.test(shLg))           shadowStyle = 'hard-offset';
  else if (sh === 'none')                                           shadowStyle = 'flat';
  else                                                               shadowStyle = 'soft-drop';

  // 5. brandHue — bucket the --c-brand hex into a color family
  const brandRgb = parseHex(tokens['--c-brand']);
  let brandHue = 'neutral';
  if (brandRgb) {
    const [r, g, b] = brandRgb;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    if (d > 20) {
      let h = max === r ? (g - b) / d + (g < b ? 6 : 0)
            : max === g ? (b - r) / d + 2
            : (r - g) / d + 4;
      h = (h / 6) * 360;
      brandHue = h < 20 ? 'red' : h < 45 ? 'orange' : h < 70 ? 'yellow'
               : h < 150 ? 'green' : h < 190 ? 'teal' : h < 250 ? 'blue'
               : h < 290 ? 'purple' : h < 330 ? 'pink' : 'red';
    }
  }

  return { bgMode, fontDisplay, radiusCat, shadowStyle, brandHue };
}

function diffCheck(file, tokens, css) {
  const dir = path.join(path.dirname(file));
  const thisName = path.basename(file);
  const mine = fingerprint(tokens, css);
  const issues = [];

  let siblings;
  try { siblings = fs.readdirSync(dir).filter(f => f.endsWith('.css') && f !== thisName); }
  catch { return issues; }

  for (const sib of siblings) {
    const sibPath = path.join(dir, sib);
    let sibCss;
    try { sibCss = fs.readFileSync(sibPath, 'utf8'); } catch { continue; }
    const sibTokens = readTokens(sibCss);
    const theirs = fingerprint(sibTokens, sibCss);

    // same display font is an immediate error — most visible axis
    if (mine.fontDisplay !== 'unknown' && mine.fontDisplay === theirs.fontDisplay) {
      issues.push({ level: 'error', msg: `same display font as ${sib} ("${mine.fontDisplay}") — must use a different typeface` });
      continue;
    }

    const AXES = ['bgMode', 'radiusCat', 'shadowStyle', 'brandHue'];
    const matches = AXES.filter(a => mine[a] === theirs[a]);
    if (matches.length >= 3) {
      issues.push({ level: 'error', msg: `too similar to ${sib} — matches on ${matches.join(', ')} (need to differ on at least 3 of 4 remaining axes)` });
    } else if (matches.length === 2) {
      issues.push({ level: 'warn', msg: `close to ${sib} — matches on ${matches.join(', ')} — consider differentiating further` });
    }
  }
  return issues;
}

/* --- validate one file --- */

function validate(file, { diff = true } = {}) {
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

  // 4. differentiation against existing skins
  if (diff) {
    for (const { level, msg } of diffCheck(file, tokens, css)) {
      if (level === 'error') errors.push(`[differentiation] ${msg}`);
      else                   warnings.push(`[differentiation] ${msg}`);
    }
  }

  // 5. contrast on key pairs
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
