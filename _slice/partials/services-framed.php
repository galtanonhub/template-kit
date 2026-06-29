<?php /* HOMEPAGE services — framed variant. Same services.items[] as the teaser;
   each card shows the service name (eyebrow), its blurb as a headline, and the
   service image in a framed panel. Arrow links to the deep services page. */ ?>
<section class="section services services--framed">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow" data-edit="services.teaser.eyebrow"><?= e(c('services.teaser.eyebrow', 'What We Do')) ?></span>
      <h2 data-edit="services.teaser.heading"><?= e(c('services.teaser.heading', 'Our Services')) ?></h2>
    </div>
    <div class="services--framed__grid">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <article class="services--framed__card">
        <div class="services--framed__head">
          <div>
            <span class="eyebrow" data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></span>
            <h3 data-edit="services.items.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></h3>
          </div>
          <a href="services.php<?= edit_mode() ? '?edit=1' : '' ?>#<?= e($item['id'] ?? '') ?>" class="services--framed__arrow" aria-label="Learn more about <?= e($item['name'] ?? '') ?>">&#8594;</a>
        </div>
        <div class="services--framed__body">
          <div class="services--framed__panel"><img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image"></div>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
