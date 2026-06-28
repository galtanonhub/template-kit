# Content-Layer Rollout — Build Spec / Handoff

**Purpose:** roll the proven `_slice/` data-layer pattern out across the whole template-kit.
The architecture is DECIDED and WORKING — this is mechanical execution. Do **not** re-derive
decisions; follow this spec. Safe to run on Sonnet. Flip to Opus only for a genuinely new
inner-page *layout* that needs design taste (noted inline).

---

## 0. Status — what's already proven (don't rebuild)

Working reference lives in `_template-kit/_slice/` (PHP, server-rendered). Verified end-to-end:
data→render, teaser≠page from one source, text save, image upload, revert. Study these files —
they are the blueprint for everything below:

- `lib/content.php` — loader + helpers `c('dot.path', $fallback)`, `e($s)`, `edit_mode()`
- `lib/head.php` / `lib/foot.php` — page shell + nav + editor toolbar (in `?edit=1`)
- `partials/services-teaser.php` (homepage, short) and `partials/services-page.php` (inner, deep)
- `save.php` — writes content.json, image upload, revert
- `editor.js` / `editor.css` — buyer editor (`?edit=1`)
- `content.json` (live) + `content.original.json` (revert source)

Run it: launch config **`kit-slice`** → `http://localhost:8094/_slice/index.php` (add `?edit=1`).

---

## 1. Hard rules (locked decisions — see memory)

- **Render stack:** PHP, server-rendered from `content.json`. Pages are `.php`. No build step for buyer.
- **Edit markers:** text = `data-edit="dot.path"`, image = `data-edit-img="dot.path"`. Editor reads only these. Buyer edits **data only, never structure**.
- **Revert:** ship `content.original.json` read-only; `save.php {action:'revert'}` copies it over `content.json`.
- **Single-page vs multi-page = FIRST choice.** Single = one homepage (teasers ARE the content; no inner pages). Multi = homepage + **fixed** inner pages.
- **Multi-page fixed set:** `home` + `services` + `service-areas` + `about` + `contact`. One page per nav item, all filled. **Reviews = homepage-only**, no page, no nav link.
- **Teaser ≠ page (no duplication):** homepage teaser and inner page read the SAME shared data (`services.items[]`, `areas.list[]`, `about.*`). Teaser shows SHORT fields (`blurb`); page shows DEEP fields (`description`, `bullets`). Buyer edits a fact once → both update.
- **Nav:** internal slot names (`services`, `service-areas`…) ≠ display labels. Labels live in `content.json` (`theme.nav.*`), configurable per template. Never put "Services" next to "Service Areas" — vary wording. Keep explicit **Home** link AND logo links home.
- **Social links:** every site gets the full social roster in the footer. Roster (which platforms + emoji + label) is STRUCTURE — locked in `lib/foot.php` `$SOCIAL`. URLs are DATA — in `content.json` at `business.social.<platform>`. A platform renders on the live site only if its URL is non-empty; in `?edit=1` the footer shows a URL field per platform (fill = show, clear = hide). Buyer "adds/removes" by editing URLs only.
- **Editor field types:** `data-edit` = contenteditable text (saved via `textContent`, NOT `innerText` — innerText bakes CSS text-transform like uppercase eyebrows into the data). `data-edit-field` = real `<input>`/`<textarea>` value (e.g. social URLs). `data-edit-img` = image. `save.php`'s `set_path` accepts any value type, so new field types need only an `editor.js` collector, no PHP change.

## 2. PHP environment gotchas (this machine)

- PHP 8.4.22, minimal build, **no php.ini → no `fileinfo`/`mbstring`/`gd`**.
- Use `getimagesize()` (not `mime_content_type()`); avoid `mb_*`-only code.
- Full php path: `C:\Users\galta\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe`
- Dev server already wired as launch config `kit-slice` (php -S :8094 -t _template-kit).

---

## 3. Target `content.json` schema (whole site)

This is the full shape for a multi-page site. Single-page uses the same file minus the inner-page
`*.page` blocks. Keep keys stable — they are the `data-edit` paths.

```jsonc
{
  "business": {
    "name": "Summit Garage Door Co.",
    "phone": "(407) 555-0142",
    "email": "hello@example.com",
    "address": "123 Main St, Orlando, FL",
    "area": "Central Florida",
    "hours": "Mon–Sat 7am–7pm",
    "social": {                            // URLs only; roster/emoji locked in foot.php $SOCIAL
      "facebook": "", "instagram": "", "x": "",
      "youtube": "", "linkedin": "", "tiktok": ""
    }
  },
  "theme": {
    "skin": "warm-residential",          // personalities/<skin>.css
    "mode": "multi",                       // "single" | "multi"
    "nav": {                               // DISPLAY labels (vary per template)
      "home": "Home",
      "services": "What We Do",
      "service-areas": "Where We Work",
      "about": "Our Story",
      "contact": "Get a Quote"
    }
  },

  "home": {
    "hero":   { "eyebrow": "", "headline": "", "sub": "", "cta_primary": "", "cta_secondary": "", "image": "" },
    "proof":  { "stats": [ { "value": "20+", "label": "Years" }, { "value": "5,000+", "label": "Doors fixed" } ] },
    "process":{ "eyebrow": "", "heading": "", "intro": "",
                "steps": [ { "title": "", "text": "" } ] },
    "cta":    { "heading": "", "text": "", "button": "" }
  },

  // ---- SHARED topic data (used by BOTH a homepage teaser AND its inner page) ----
  "services": {
    "teaser": { "eyebrow": "", "heading": "", "intro": "" },      // homepage band copy
    "page":   { "eyebrow": "", "heading": "", "intro": "" },      // /services header copy
    "items": [
      { "id": "repair", "name": "", "image": "",
        "blurb": "",                 // SHORT — homepage teaser
        "description": "",           // DEEP — services page
        "bullets": [ "", "", "" ] }  // DEEP — services page
    ]
  },
  "areas": {
    "teaser": { "eyebrow": "", "heading": "", "intro": "" },
    "page":   { "eyebrow": "", "heading": "", "intro": "" },
    "list": [ "Orlando", "Winter Park", "Kissimmee" ],            // city chips/marquee + page list
    "detail": [ { "city": "Orlando", "blurb": "" } ]              // OPTIONAL per-city copy for the page
  },
  "about": {
    "teaser": { "eyebrow": "", "heading": "", "text": "", "image": "" },   // homepage about band
    "page":   { "eyebrow": "", "heading": "" },
    "story":  [ "", "" ],                                          // paragraphs for /about
    "values": [ { "title": "", "text": "" } ]
  },
  "contact": {
    "page": { "heading": "", "intro": "" }
    // contact page also reads business.{phone,email,address,hours}
  },

  // ---- HOMEPAGE-ONLY (no inner page) ----
  "reviews": {
    "heading": "",
    "items": [ { "quote": "", "name": "", "role": "", "image": "" } ]  // 2–3 only; NO reviews page
  },
  "faq": {
    "heading": "",
    "items": [ { "q": "", "a": "" } ]
  }
}
```

---

## 4. Section → content-key map (conversion cheat-sheet)

Convert each `sections/<slot>/<variant>.html` to `.php`, swapping hardcoded text for `c()`/`e()`
and adding `data-edit`/`data-edit-img`. Loop arrays with `foreach (c('path', []) as $i => $x)`.
(Reference: `partials/services-teaser.php` does exactly this.)

| Slot (homepage) | Reads |
|---|---|
| nav | `business.name` (logo), `theme.nav.*`, `business.phone` |
| hero | `home.hero.*` |
| proof | `home.proof.stats[]` |
| services (teaser) | `services.teaser.*`, `services.items[]` → `name`,`blurb`,`image`,`id` |
| process | `home.process.*`, `home.process.steps[]` |
| about (teaser) | `about.teaser.*` |
| areas (teaser) | `areas.teaser.*`, `areas.list[]` |
| stories | `reviews.heading`, `reviews.items[]` |
| faq | `faq.heading`, `faq.items[]` |
| cta | `home.cta.*` |
| footer | `business.*`, `theme.nav.*` |

| Inner page | Reads |
|---|---|
| services.php | `services.page.*`, `services.items[]` → `name`,`description`,`bullets[]`,`image`,`id` |
| service-areas.php | `areas.page.*`, `areas.list[]`, `areas.detail[]` |
| about.php | `about.page.*`, `about.story[]`, `about.values[]`, `business.*` |
| contact.php | `contact.page.*`, `business.{phone,email,address,hours}`, contact form |

---

## 5. Task order

1. **Battle-test the pattern on ONE more section before scaling.** Convert `proof/stat-bar` and `cta/band` (simple, array + flat) to PHP partials reading `home.proof` / `home.cta`, wire into a homepage. Confirms the pattern holds beyond services. (Low risk, Sonnet-fine.)
2. **Convert the remaining homepage section partials** to content-parameterized PHP (table in §4). Keep variant structure identical — only swap content for `c()` + add `data-edit`.
3. **Build the 3 remaining inner pages**: `service-areas.php`, `about.php`, `contact.php`, mirroring `services.php` (header from `*.page`, body from shared data). ⚠️ Each new page LAYOUT is a small design call — if it feels flat, flip to Opus for that one layout, then back.
4. **Finalize the full `content.json` schema** (§3) + a complete placeholder `content.original.json` for one real niche (garage-door, Central FL — the dumpcat first niche).
5. **Update `new-template.js`** to emit the PHP site: copy `lib/`, the chosen variants as `.php` partials, `save.php`, `editor.js/css`, base+skin CSS, and write `content.json` + `content.original.json` from the recipe; respect `theme.mode` (single → only index.php; multi → + 4 inner pages).
6. **Builder PHP preview:** the demo builder currently fetches static `.html`. Add a `render.php?slot=&variant=` endpoint that renders a partial with placeholder content, and point the builder's `loadSection()` at it. (Or keep the static `.html` variants as structure-only previews and treat `.php` as delivery output — decide based on effort.)

## 6. Before delivery (don't ship without)

- **Password-gate `save.php`** (session/login). It's open now for local testing only.
- Lock the `uploads/` dir to images; cap size.
- Verify on real cPanel PHP (likely 8.1–8.3) — code uses only core funcs, should be fine.

---

_Pattern proven 2026-06-28 on Opus. Rollout intended for Sonnet against this spec.
See memory: [[project-template-kit]], [[project-template-kit-delivery]], [[feedback-sample-nav-labels]]._
