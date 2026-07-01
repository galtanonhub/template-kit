<?php /* HOMEPAGE services teaser — panel-grid variant.
   Left lead panel (heading + blurb + CTA) + right 2×3 colored card grid.
   Reads same services.items[] as other teaser variants (name, blurb, image).
   Shows first 6 items. */ ?>
<section class="section services services--panel-grid"<?= !empty($SECTION_OPTS['arrival']) ? ' data-arrival="expand"' : '' ?>>
  <div class="container">
    <div class="services--panel-grid__layout">

      <div class="services--panel-grid__lead">
        <span class="eyebrow" data-edit="services.teaser.eyebrow"><?= e(c('services.teaser.eyebrow', 'What We Do')) ?></span>
        <h2 data-edit="services.teaser.heading"><?= e(c('services.teaser.heading', 'Our Services')) ?></h2>
        <p data-edit="services.teaser.intro"><?= e(c('services.teaser.intro', 'Interior, exterior, and specialty work — we handle it all for homeowners across the area.')) ?></p>
        <a href="services.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand"
           data-edit="services.teaser.cta"><?= e(c('services.teaser.cta', 'View All Services')) ?></a>
      </div>

      <div class="services--panel-grid__grid">
        <?php foreach (array_slice(c('services.items', []), 0, 6) as $i => $item): ?>
        <article class="services--panel-grid__card">
          <div class="services--panel-grid__thumb">
            <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>"
                 data-edit-img="services.items.<?= $i ?>.image">
          </div>
          <div class="services--panel-grid__body">
            <h3 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h3>
            <p data-edit="services.items.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></p>
            <a href="services.php<?= edit_mode() ? '?edit=1' : '' ?>#<?= e($item['id'] ?? '') ?>"
               class="services--panel-grid__more">More Info</a>
          </div>
        </article>
        <?php endforeach; ?>
      </div>

    </div>
  </div>
</section>
