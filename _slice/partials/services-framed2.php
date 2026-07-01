<?php /* HOMEPAGE services — framed2 variant (large 2-up framed cards).
   Same services.items[] as the teaser; name as eyebrow, blurb as headline,
   image in a large stage panel. Arrow links to the deep services page. */ ?>
<section class="section services services--framed2"<?= !empty($SECTION_OPTS['arrival']) ? ' data-arrival="expand"' : '' ?>>
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow" data-edit="services.teaser.eyebrow"><?= e(c('services.teaser.eyebrow', 'What We Do')) ?></span>
      <h2 data-edit="services.teaser.heading"><?= e(c('services.teaser.heading', 'Our Services')) ?></h2>
    </div>
    <div class="services--framed2__grid">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <article class="services--framed2__card">
        <div class="services--framed2__head">
          <div>
            <span class="eyebrow" data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></span>
            <h3 data-edit="services.items.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></h3>
          </div>
          <a href="services.php<?= edit_mode() ? '?edit=1' : '' ?>#<?= e($item['id'] ?? '') ?>" class="services--framed2__arrow" aria-label="Learn more about <?= e($item['name'] ?? '') ?>">&#8594;</a>
        </div>
        <div class="services--framed2__stage">
          <div class="services--framed2__panel"><img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image"></div>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
