<?php /* ABOUT page header — banner variant (alternative to standard).
   Full-bleed background photo + dark scrim. Unlike standard (no lead, to
   match the original about page), this richer treatment also shows
   about.page.intro. Reads about.page.*. Pairs with an about-body below it. */ ?>
<section class="section inner-header inner-header--banner about-header">
  <img class="inner-header--banner__bg" src="<?= e(c('about.page.image', 'https://picsum.photos/seed/aboutheader/1600/700')) ?>" alt="" data-edit-img="about.page.image">
  <div class="inner-header--banner__scrim"></div>
  <?php kit_shape_divider($SECTION_OPTS['edge'] ?? 'none'); ?>
  <div class="container inner-header--banner__inner">
    <span class="eyebrow" data-edit="about.page.eyebrow"><?= e(c('about.page.eyebrow', 'Our Story')) ?></span>
    <h1 data-edit="about.page.heading"><?= e(c('about.page.heading', 'Built on doing it right')) ?></h1>
    <p class="lead" data-edit="about.page.intro"><?= e(c('about.page.intro', "Here's a bit about how we got started.")) ?></p>
  </div>
</section>
