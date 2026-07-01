<?php /* ABOUT page header — split variant (alternative to standard).
   Photo one side, eyebrow/h1/intro the other. Unlike standard (no lead, to
   match the original about page), this richer treatment also shows
   about.page.intro. Reads about.page.*. Pairs with an about-body below it. */ ?>
<section class="section inner-header inner-header--split about-header">
  <div class="container split">
    <figure class="inner-header--split__media">
      <img src="<?= e(c('about.page.image', 'https://picsum.photos/seed/aboutheader/1600/700')) ?>" alt="<?= e(c('business.name', '')) ?>" data-edit-img="about.page.image">
    </figure>
    <div class="inner-header--split__copy">
      <span class="eyebrow" data-edit="about.page.eyebrow"><?= e(c('about.page.eyebrow', 'Our Story')) ?></span>
      <h1 data-edit="about.page.heading"><?= e(c('about.page.heading', 'Built on doing it right')) ?></h1>
      <p class="lead" data-edit="about.page.intro"><?= e(c('about.page.intro', "Here's a bit about how we got started.")) ?></p>
    </div>
  </div>
</section>
