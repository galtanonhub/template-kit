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
<link rel="stylesheet" href="css/base.css">      <!-- structure + default tokens -->
<link rel="stylesheet" href="css/sections.css">   <!-- the chosen section variants, concatenated -->
<link rel="stylesheet" href="css/skin.css">       <!-- chosen personality, overrides :root -->
<link rel="stylesheet" href="css/site.css">       <!-- page-layout rules for the stamped site -->
```

`base.css` defines every token with a default so it works standalone. The
personality (`skin.css`) loads after and wins. Personality files should only
override tokens + add a few signature flourishes — never re-implement
structural rules. `sections.css` is the picked variants concatenated at stamp
time; `site.css` (copied from `_slice/slice.css`) carries the page shell +
inner-page layout.

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
| `painting-photo` | _generated example_ | photo-derived palette + `modern` form preset, produced by `skin-from-photo.js` |
| _…more to come_ | | |

Hand-authored personalities live in `personalities/*.css`. Generated ones come
from `scaffold/skin-from-photo.js` (palette from an image + a form preset from
`scaffold/forms.js`) — they carry a `GENERATED SKIN` header and should be
regenerated, not hand-edited.

## Demo harness (the builder)

`demo/index.html` is the **builder**: a bottom dock to pick a variant per
section + a skin, live-preview the page, shuffle a whole recipe, and **Export**
the recipe JSON that `scaffold/new-template.js` stamps into a deployable PHP
site. Served as the `kit-demo` launch config (port 8093):
`http://localhost:8093/demo/`

> The builder previews static `sections/*/*.html`; the deployable output is the
> PHP data-layer in `_slice/` (see `_slice/ROLLOUT.md`). Keep the builder's
> `SECTIONS` list, `sections/`, `_slice/partials/`, and `new-template.js`'s
> `PARTIAL_MAP` in sync — a variant must exist in all four to be both designable
> and deliverable.

## Status

- [x] `base/base.css` — structure + default tokens
- [x] `personalities/` — `industrial-bold`, `warm-residential`, generated `painting-photo`
- [x] `demo/` builder harness (dock, shuffle, export)
- [x] `scaffold/new-template.js` — stamp a recipe into a PHP site
- [x] `scaffold/skin-from-photo.js` + `forms.js` — generate a skin from a photo
- [x] `_slice/` — proven PHP data-layer (see `ROLLOUT.md`)
- [ ] remaining personalities (target ~8)
- [x] partials for hero `split`/`editorial`/`collage`, services `carousel`/`framed`/`framed2`, areas `marquee` — now stampable
- [x] all stampable variants exposed in the builder `SECTIONS` (hero `mosaic`, services `need-state`/`selector`, process `carousel`, faq `carousel`/`selector`); builder now loads the real `_slice/site.js` so its preview interactions can't drift from what we ship
- [x] mobile nav (hamburger) wired into the delivered shell (`head.php` + generator `buildHeadPhp`)
- [x] `skin-from-photo.js`: guarantees `--c-brand` contrast vs `--c-bg` (used as link/eyebrow text)
- [x] `save.php` password-gated (`lib/auth.php` session + `password_verify`); stamper writes a unique per-site password (hash only in `lib/auth-secret.php`, printed once at stamp time), `?edit=1` shows a login prompt until unlocked
- [ ] `TEMPLATES.md` differentiation ledger
