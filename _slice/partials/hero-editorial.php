<?php /* HOMEPAGE hero — editorial split: copy on the left, tall figure on the
   right. Reads home.hero.* (cta_primary links to the contact page). */ ?>
<section class="hero hero--editorial">
  <div class="container hero--editorial__grid">
    <div class="hero--editorial__copy">
      <span class="eyebrow" data-edit="home.hero.eyebrow"><?= e(c('home.hero.eyebrow', 'Studio')) ?></span>
      <h1 class="display" data-edit="home.hero.headline"><?= e(c('home.hero.headline', 'Spaces that feel like you.')) ?></h1>
      <p class="lead" data-edit="home.hero.sub"><?= e(c('home.hero.sub', 'Thoughtful work designed around how you actually live.')) ?></p>
      <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand btn--lg" data-edit="home.hero.cta_primary"><?= e(c('home.hero.cta_primary', 'Get Started')) ?></a>
    </div>
    <figure class="hero--editorial__figure">
      <img src="<?= e(c('home.hero.image', 'https://picsum.photos/seed/interior9/800/1000')) ?>" alt="" data-edit-img="home.hero.image">
    </figure>
  </div>
</section>
