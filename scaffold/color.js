/* ------------------------------------------------------------------
   color.js — tiny dependency-free color math for skin derivation.
   Just enough HSL + WCAG to derive a legible palette from one seed.
   ------------------------------------------------------------------ */

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}

function rgbToHex([r, g, b]) {
  const c = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function hslToRgb([h, s, l]) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) { const v = l * 255; return [v, v, v]; }
  const hue = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue(p, q, h + 1 / 3), hue(p, q, h), hue(p, q, h - 1 / 3)].map(v => v * 255);
}

/* build a hex straight from H (0-360), S (0-1), L (0-1) */
const hsl = (h, s, l) => rgbToHex(hslToRgb([h, Math.max(0, Math.min(1, s)), Math.max(0, Math.min(1, l))]));

/* nudge a hex's lightness by delta (-1..1) */
function adjustL(hex, delta) {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  return hsl(h, s, l + delta);
}

/* --- WCAG contrast --- */
function relLum([r, g, b]) {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(aHex, bHex) {
  const a = relLum(hexToRgb(aHex)) + 0.05, b = relLum(hexToRgb(bHex)) + 0.05;
  return Math.max(a, b) / Math.min(a, b);
}

/* white or near-black — whichever is more legible on bg */
const NEAR_BLACK = '#15120e';
function pickReadable(bgHex) {
  return contrast(bgHex, '#ffffff') >= contrast(bgHex, NEAR_BLACK) ? '#ffffff' : NEAR_BLACK;
}

/* push a foreground color until it clears `ratio` against bg.
   dir 'darken' lowers lightness, 'brighten' raises it. */
function ensureContrast(fgHex, bgHex, ratio, dir) {
  let c = fgHex, guard = 0;
  while (contrast(c, bgHex) < ratio && guard < 50) {
    c = adjustL(c, dir === 'darken' ? -0.03 : 0.03);
    guard++;
  }
  return c;
}

module.exports = {
  hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hsl, adjustL,
  contrast, pickReadable, ensureContrast, NEAR_BLACK,
};
