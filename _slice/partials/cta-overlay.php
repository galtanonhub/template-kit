<?php /* HOMEPAGE CTA — overlay variant.
   Full-bleed photo + dark scrim, centered white text, single CTA — same
   mechanic as hero/overlay and the inner-header banner variants, so it
   joins that family for the shape-divider `edge` option. Reuses
   home.hero.image (already reused by feature-band/cta-split) and the
   same home.cta.* fields as band/dark-left/split.

   STYLE OPTIONS ($SECTION_OPTS, set by the includer — builder dock or
   the stamp's recipe.options — see manifest.json variant.options):
     edge (select: none/wave/triangle)  bottom-edge shape divider */ ?>
<section class="cta cta--overlay">
  <img class="cta--overlay__bg" src="<?= e(c('home.hero.image', 'https://picsum.photos/seed/trades/1600/900')) ?>" alt="" data-edit-img="home.hero.image">
  <div class="cta--overlay__scrim"></div>
  <?php kit_shape_divider($SECTION_OPTS['edge'] ?? 'none'); ?>
  <div class="container cta--overlay__inner">
    <h2 data-edit="home.cta.heading"><?= e(c('home.cta.heading', 'Ready to get started?')) ?></h2>
    <p data-edit="home.cta.text"><?= e(c('home.cta.text', 'Get your free, no-obligation estimate today.')) ?></p>
    <div class="cta--overlay__actions">
      <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand btn--lg" data-edit="home.cta.button"><?= e(c('home.cta.button', 'Get a Free Quote')) ?></a>
      <a href="tel:<?= e(preg_replace('/[^+\d]/', '', c('business.phone', ''))) ?>" class="btn btn--ghost-invert btn--lg"><?= e(c('business.phone', '')) ?></a>
    </div>
  </div>
</section>
