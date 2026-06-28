<?php /* SERVICES PAGE — the upgrade. Same items as the homepage teaser, but
   the deep view: full "description" + "bullets", a different (alternating
   detail-row) layout, and a page-specific header. NOT a reheated teaser. */ ?>
<section class="section services-page">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow" data-edit="services.page.eyebrow"><?= e(c('services.page.eyebrow', 'Our Services')) ?></span>
      <h1 data-edit="services.page.heading"><?= e(c('services.page.heading', 'What we do')) ?></h1>
      <p class="lead" data-edit="services.page.intro"><?= e(c('services.page.intro', 'The full range of work we handle.')) ?></p>
    </div>

    <div class="svc-detail-list">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <article class="svc-detail" id="<?= e($item['id'] ?? '') ?>">
        <div class="svc-detail__media">
          <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image">
        </div>
        <div class="svc-detail__body">
          <h2 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h2>
          <p data-edit="services.items.<?= $i ?>.description"><?= e($item['description'] ?? '') ?></p>
          <ul class="svc-detail__list">
            <?php foreach (($item['bullets'] ?? []) as $b => $bullet): ?>
            <li data-edit="services.items.<?= $i ?>.bullets.<?= $b ?>"><?= e($bullet) ?></li>
            <?php endforeach; ?>
          </ul>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
