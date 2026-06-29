<?php /* HOMEPAGE hero — collage: headline + CTA above a 4-image mosaic.
   Tiles come from home.hero.gallery[]; if that's absent (older content) we
   seed the mosaic from the hero image + the first service photos so it's never
   empty. Each tile edits its own home.hero.gallery[N] slot. */ ?>
<?php
  $gallery = c('home.hero.gallery', []);
  if (!$gallery) {
    $gallery = array_values(array_filter([
      c('home.hero.image', ''),
      c('services.items.0.image', ''),
      c('services.items.1.image', ''),
      c('services.items.2.image', ''),
    ]));
  }
  $gallery = array_slice($gallery, 0, 4);
  $shape   = ['g-tall', '', '', 'g-wide'];
?>
<section class="hero hero--collage">
  <div class="container">
    <div class="hero--collage__head">
      <span class="eyebrow" data-edit="home.hero.eyebrow"><?= e(c('home.hero.eyebrow', 'What We Do')) ?></span>
      <h1 class="display" data-edit="home.hero.headline"><?= e(c('home.hero.headline', 'Work the whole street notices.')) ?></h1>
      <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand btn--lg" data-edit="home.hero.cta_primary"><?= e(c('home.hero.cta_primary', 'Get a Free Estimate')) ?></a>
    </div>
    <?php if ($gallery): ?>
    <div class="hero--collage__grid">
      <?php foreach ($gallery as $i => $img): ?>
      <img src="<?= e($img) ?>" alt="" class="<?= $shape[$i] ?? '' ?>" data-edit-img="home.hero.gallery.<?= $i ?>">
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
</section>
