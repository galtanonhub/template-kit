<?php /* SERVICE AREAS page header — split variant (alternative to standard).
   Photo one side, eyebrow/h1/intro the other. Reads areas.page.*.
   Pairs with an areas-body below it. */ ?>
<section class="section inner-header inner-header--split areas-header">
  <div class="container split">
    <figure class="inner-header--split__media">
      <img src="<?= e(c('areas.page.image', 'https://picsum.photos/seed/areasheader/1600/700')) ?>" alt="<?= e(c('business.name', '')) ?>" data-edit-img="areas.page.image">
    </figure>
    <div class="inner-header--split__copy">
      <span class="eyebrow" data-edit="areas.page.eyebrow"><?= e(c('areas.page.eyebrow', 'Service Area')) ?></span>
      <h1 data-edit="areas.page.heading"><?= e(c('areas.page.heading', 'Where we work')) ?></h1>
      <p class="lead" data-edit="areas.page.intro"><?= e(c('areas.page.intro', 'We come to you across the region.')) ?></p>
    </div>
  </div>
</section>
