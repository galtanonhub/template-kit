<?php /* HOMEPAGE services — carousel variant. Same services.items[] as the
   teaser (name/blurb/image/id); a horizontal scroll track with prev/next
   arrows (site.js handles .services--carousel__arrow). */ ?>
<section class="section services services--carousel"<?= !empty($SECTION_OPTS['arrival']) ? ' data-arrival="expand"' : '' ?>>
  <div class="container">
    <div class="services--carousel__head">
      <div class="section-head" style="margin-bottom:0;">
        <span class="eyebrow" data-edit="services.teaser.eyebrow"><?= e(c('services.teaser.eyebrow', 'What We Do')) ?></span>
        <h2 data-edit="services.teaser.heading"><?= e(c('services.teaser.heading', 'Our Services')) ?></h2>
      </div>
      <div class="services--carousel__nav">
        <button class="services--carousel__arrow" type="button" data-dir="-1" aria-label="Previous services">&#8249;</button>
        <button class="services--carousel__arrow" type="button" data-dir="1" aria-label="Next services">&#8250;</button>
      </div>
    </div>
    <div class="services--carousel__track">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <article class="card services--carousel__card">
        <div class="card__media">
          <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image">
        </div>
        <div class="card__body">
          <h3 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h3>
          <p data-edit="services.items.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></p>
          <a href="services.php<?= edit_mode() ? '?edit=1' : '' ?>#<?= e($item['id'] ?? '') ?>" class="link-arrow">Learn more</a>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
