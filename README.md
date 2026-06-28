# Template Kit

The workshop for building DragonWorkflows sample sites that are **fast to produce, accurate, and deliberately different from one another.**

This directory is **tooling only — it never deploys.** It lives at the parent
`sites/` level (outside the public `dumpcat.com` repo) on purpose: finished
templates go in `dumpcat.com/samples/`, the workshop stays private here.

## Mental model: structure vs. skin

Every template = **structure** (the bones) + **skin** (the look).

- **Structure** lives in `base/base.css` and `sections/` — the reset, layout
  primitives, component mechanics, responsive + a11y plumbing. Written once.
- **Skin** lives in `personalities/*.css` — a bundle of CSS-variable overrides
  (color, type, shape, weight, density, motif). One file = one complete look.

Templates look different because we vary **both** layers, tracked in the
differentiation ledger so we never drift back into sameness.

## How a stamped template loads CSS

```html
<link rel="stylesheet" href="base.css">      <!-- structure + default tokens -->
<link rel="stylesheet" href="theme.css">      <!-- chosen personality, overrides :root -->
```

`base.css` defines every token with a default so it works standalone. The
personality loads after and wins. Personality files should only override tokens
+ add a few signature flourishes — never re-implement structural rules.

## Token vocabulary

The contract a personality fills in. (See the `:root` block in `base/base.css`
for defaults and inline notes.)

**Color** — `--c-bg`, `--c-bg-alt`, `--c-bg-deep`, `--c-surface`, `--c-ink`,
`--c-ink-soft`, `--c-ink-invert`(`-soft`), `--c-brand`, `--c-brand-deep`,
`--c-brand-ink`, `--c-accent`, `--c-line`, `--c-line-strong`

**Type** — `--font-display`, `--font-body`, `--font-accent`; weights
`--fw-normal/medium/bold/heavy`; rhythm `--tracking-display`,
`--tracking-eyebrow`, `--leading-tight`, `--leading-body`; scale `--fs-display`
… `--fs-eyebrow`

**Shape** — `--radius`, `--radius-lg`, `--radius-pill`, `--border-weight`,
`--rule-weight`

**Buttons** — `--btn-radius`, `--btn-weight`, `--btn-transform`,
`--btn-tracking`, `--btn-pad-y/x`

**Elevation** — `--shadow`, `--shadow-lg`, `--card-border`

**Layout/rhythm** — `--container-max`, `--gutter`, `--section-pad`, `--gap`

**Motif** — `--eyebrow-transform`, `--eyebrow-weight`, `--transition`

## Personalities

Each is a coherent, named look mapped to the kind of business it suits.

| Personality | Built for | Signature |
|---|---|---|
| `industrial-bold` | contractors, roofing, welding, auto, concrete | charcoal + hi-vis yellow, 0 radius, condensed uppercase, hard offset-block shadows |
| `warm-residential` | interior design, cleaning, florist, med-spa, in-home care | cream + terracotta + sage, big radius, serif display, soft long shadows, airy |
| _…more to come_ | | |

## Demo harness

`demo/index.html` renders the same markup with a personality toggle — the
fastest way to see contrast and to visually test a new personality before it
ships. Served as the `kit-demo` launch config (port 8093):
`http://localhost:8093/demo/`

## Status

- [x] `base/base.css` — structure + default tokens
- [x] `personalities/industrial-bold.css`, `warm-residential.css`
- [x] `demo/` harness
- [ ] `scaffold/new-template.js` — stamp a fresh independent template
- [ ] remaining personalities (target ~8)
- [ ] `sections/` variant library (hero a–h, services a–f, …)
- [ ] `TEMPLATES.md` differentiation ledger
