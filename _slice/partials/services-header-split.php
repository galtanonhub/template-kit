<?php /* SERVICES page header — split variant (alternative to standard).
   Photo one side, eyebrow/h1/intro the other — reuses base .split, same
   pattern as the homepage about--split-photo teaser. Reads services.page.*.
   Pairs with a services-detail body below it. */ ?>
<section class="section inner-header inner-header--split services-header">
  <div class="container split">
    <figure class="inner-header--split__media">
      <img src="<?= e(c('services.page.image', 'https://picsum.photos/seed/svcheader/1600/700')) ?>" alt="<?= e(c('business.name', '')) ?>" data-edit-img="services.page.image">
    </figure>
    <div class="inner-header--split__copy">
      <span class="eyebrow" data-edit="services.page.eyebrow"><?= e(c('services.page.eyebrow', 'Our Services')) ?></span>
      <h1 data-edit="services.page.heading"><?= e(c('services.page.heading', 'What we do')) ?></h1>
      <p class="lead" data-edit="services.page.intro"><?= e(c('services.page.intro', 'The full range of work we handle.')) ?></p>
    </div>
  </div>
</section>
