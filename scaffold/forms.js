/* Form presets — the NON-color half of a personality (type + shape + motif).
   A generated skin = a photo-derived palette + one of these form presets.
   Color comes from the image; form is a deliberate, judge-able choice. */

module.exports = {
  modern: {
    label: 'Modern',
    fontImport: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    tokens: {
      '--font-display': "'Inter', system-ui, sans-serif",
      '--font-body': "'Inter', system-ui, sans-serif",
      '--fw-heavy': '800', '--fw-bold': '700',
      '--tracking-display': '-0.02em',
      '--radius': '10px', '--radius-lg': '16px', '--radius-pill': '999px',
      '--btn-radius': '8px', '--btn-transform': 'none', '--border-weight': '1px',
    },
    flourishes: '',
  },

  elegant: {
    label: 'Elegant',
    fontImport: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Nunito+Sans:wght@400;600;700&display=swap',
    tokens: {
      '--font-display': "'Fraunces', Georgia, serif",
      '--font-body': "'Nunito Sans', system-ui, sans-serif",
      '--font-accent': "'Nunito Sans', system-ui, sans-serif",
      '--fw-heavy': '500', '--fw-bold': '600',
      '--tracking-display': '0', '--tracking-eyebrow': '0.22em',
      '--radius': '14px', '--radius-lg': '22px', '--radius-pill': '999px',
      '--btn-radius': '999px', '--btn-transform': 'none', '--border-weight': '1px',
    },
    flourishes:
`.display em, h1 em, h2 em { font-style: italic; color: var(--c-brand); font-weight: 400; }
.card:hover { transform: translateY(-5px); }`,
  },

  industrial: {
    label: 'Industrial',
    fontImport: 'https://fonts.googleapis.com/css2?family=Archivo:wght@600;800;900&family=Inter:wght@400;500;700&display=swap',
    tokens: {
      '--font-display': "'Archivo', system-ui, sans-serif",
      '--font-body': "'Inter', system-ui, sans-serif",
      '--fw-heavy': '900', '--fw-bold': '700',
      '--tracking-display': '-0.02em', '--tracking-eyebrow': '0.2em', '--leading-tight': '0.98',
      '--radius': '0px', '--radius-lg': '0px', '--radius-pill': '0px',
      '--btn-radius': '0px', '--btn-transform': 'uppercase', '--btn-weight': '800',
      '--border-weight': '2px', '--rule-weight': '4px', '--shadow': 'none',
    },
    flourishes:
`h1, h2 { text-transform: uppercase; }
.eyebrow { background: var(--c-ink); color: var(--c-brand); padding: 5px 12px; }
.card { box-shadow: none; }
.card:hover { transform: translate(-3px, -3px); box-shadow: 6px 6px 0 var(--c-ink); }`,
  },

  clean: {
    label: 'Clean',
    fontImport: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    tokens: {
      '--font-display': "'Plus Jakarta Sans', system-ui, sans-serif",
      '--font-body': "'Plus Jakarta Sans', system-ui, sans-serif",
      '--fw-heavy': '800', '--fw-bold': '700',
      '--tracking-display': '-0.025em',
      '--radius': '6px', '--radius-lg': '10px', '--radius-pill': '999px',
      '--btn-radius': '6px', '--btn-transform': 'none', '--border-weight': '1px',
    },
    flourishes: '',
  },
};
