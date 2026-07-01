<?php /* SERVICES page header — banner variant (alternative to standard).
   Full-bleed background photo + dark scrim, eyebrow/h1/intro in white on
   top — a compact page-banner version of the homepage hero--overlay.
   Reads services.page.*. Pairs with a services-detail body below it. */ ?>
<section class="section inner-header inner-header--banner services-header">
  <img class="inner-header--banner__bg" src="<?= e(c('services.page.image', 'https://picsum.photos/seed/svcheader/1600/700')) ?>" alt="" data-edit-img="services.page.image">
  <div class="inner-header--banner__scrim"></div>
  <?php kit_shape_divider($SECTION_OPTS['edge'] ?? 'none'); ?>
  <div class="container inner-header--banner__inner">
    <span class="eyebrow" data-edit="services.page.eyebrow"><?= e(c('services.page.eyebrow', 'Our Services')) ?></span>
    <h1 data-edit="services.page.heading"><?= e(c('services.page.heading', 'What we do')) ?></h1>
    <p class="lead" data-edit="services.page.intro"><?= e(c('services.page.intro', 'The full range of work we handle.')) ?></p>
  </div>
</section>
