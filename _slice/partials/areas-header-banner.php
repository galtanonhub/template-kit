<?php /* SERVICE AREAS page header — banner variant (alternative to standard).
   Full-bleed background photo + dark scrim. Reads areas.page.*.
   Pairs with an areas-body below it. */ ?>
<section class="section inner-header inner-header--banner areas-header">
  <img class="inner-header--banner__bg" src="<?= e(c('areas.page.image', 'https://picsum.photos/seed/areasheader/1600/700')) ?>" alt="" data-edit-img="areas.page.image">
  <div class="inner-header--banner__scrim"></div>
  <div class="container inner-header--banner__inner">
    <span class="eyebrow" data-edit="areas.page.eyebrow"><?= e(c('areas.page.eyebrow', 'Service Area')) ?></span>
    <h1 data-edit="areas.page.heading"><?= e(c('areas.page.heading', 'Where we work')) ?></h1>
    <p class="lead" data-edit="areas.page.intro"><?= e(c('areas.page.intro', 'We come to you across the region.')) ?></p>
  </div>
</section>
