/* Form presets — the NON-color half of a personality (type + shape + motif).
   A generated skin = a photo-derived palette + one of these form presets.
   Color comes from the image; form is a deliberate, judge-able choice. */

/* Every preset inherits these defaults, then overrides only what gives it
   character. This guarantees a generated skin is always a COMPLETE look —
   one that passes scaffold/validate-skin.js — even if a preset (or a future
   new preset) forgets a token. Mirrors the defaults in base/base.css. */
const base = {
  '--font-display': "'Inter', system-ui, sans-serif",
  '--font-body':    "'Inter', system-ui, sans-serif",
  '--font-accent':  'var(--font-display)',
  '--fw-normal': '400', '--fw-medium': '600', '--fw-bold': '700', '--fw-heavy': '800',
  '--tracking-display': '-0.01em', '--tracking-eyebrow': '0.14em',
  '--leading-tight': '1.1', '--leading-body': '1.65',
  '--radius': '10px', '--radius-lg': '16px', '--radius-pill': '999px',
  '--border-weight': '1px', '--rule-weight': '1px',
  '--btn-radius': '10px', '--btn-transform': 'none', '--btn-weight': '700', '--btn-tracking': '0',
  '--shadow':    '0 1px 3px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.04)',
  '--shadow-lg': '0 14px 36px rgba(16,24,40,0.14)',
  '--card-border': '1px solid var(--c-line)',
  '--section-pad': 'clamp(56px, 4vw + 40px, 104px)',
  '--gap': '28px',
};

/* helper: a complete token set = shared base with this preset's overrides on top */
const preset = overrides => ({ ...base, ...overrides });

module.exports = {
  modern: {
    label: 'Modern',
    fontImport: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    tokens: preset({
      '--font-display': "'Inter', system-ui, sans-serif",
      '--font-body': "'Inter', system-ui, sans-serif",
      '--tracking-display': '-0.02em',
      '--btn-radius': '8px',
    }),
    flourishes: '',
  },

  elegant: {
    label: 'Elegant',
    fontImport: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Nunito+Sans:wght@400;600;700&display=swap',
    tokens: preset({
      '--font-display': "'Fraunces', Georgia, serif",
      '--font-body': "'Nunito Sans', system-ui, sans-serif",
      '--font-accent': "'Nunito Sans', system-ui, sans-serif",
      '--fw-heavy': '500', '--fw-bold': '600',
      '--tracking-display': '0', '--tracking-eyebrow': '0.22em',
      '--leading-tight': '1.12',
      '--radius': '14px', '--radius-lg': '22px',
      '--btn-radius': '999px',
      '--shadow': '0 6px 20px rgba(40,32,24,0.07)',
      '--shadow-lg': '0 24px 56px rgba(40,32,24,0.16)',
      '--section-pad': 'clamp(64px, 5vw + 48px, 120px)',
      '--gap': '32px',
    }),
    flourishes:
`.display em, h1 em, h2 em { font-style: italic; color: var(--c-brand); font-weight: 400; }
.card:hover { transform: translateY(-5px); }`,
  },

  industrial: {
    label: 'Industrial',
    fontImport: 'https://fonts.googleapis.com/css2?family=Archivo:wght@600;800;900&family=Inter:wght@400;500;700&display=swap',
    tokens: preset({
      '--font-display': "'Archivo', system-ui, sans-serif",
      '--font-body': "'Inter', system-ui, sans-serif",
      '--fw-heavy': '900', '--fw-bold': '700',
      '--tracking-display': '-0.02em', '--tracking-eyebrow': '0.2em', '--leading-tight': '0.98',
      '--radius': '0px', '--radius-lg': '0px', '--radius-pill': '0px',
      '--btn-radius': '0px', '--btn-transform': 'uppercase', '--btn-weight': '800', '--btn-tracking': '0.04em',
      '--border-weight': '2px', '--rule-weight': '4px',
      '--shadow': 'none', '--shadow-lg': '7px 7px 0 var(--c-ink)',
      '--card-border': '2px solid var(--c-ink)',
    }),
    flourishes:
`h1, h2 { text-transform: uppercase; }
.eyebrow { background: var(--c-ink); color: var(--c-brand); padding: 5px 12px; }
.card { box-shadow: none; }
.card:hover { transform: translate(-3px, -3px); box-shadow: 6px 6px 0 var(--c-ink); }`,
  },

  clean: {
    label: 'Clean',
    fontImport: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    tokens: preset({
      '--font-display': "'Plus Jakarta Sans', system-ui, sans-serif",
      '--font-body': "'Plus Jakarta Sans', system-ui, sans-serif",
      '--tracking-display': '-0.025em',
      '--radius': '6px', '--radius-lg': '10px',
      '--btn-radius': '6px',
    }),
    flourishes: '',
  },
};
