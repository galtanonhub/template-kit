<?php /* HOMEPAGE services — selector variant.
   Same services.items[] data as services-teaser and services-need-state.
   Clicking a tab swaps the visible image+description panel above. JS handler in site.js. */ ?>
<section class="section services services--selector" data-selector>
  <div class="container">

    <div class="selector__panels">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <div class="selector__panel<?= $i === 0 ? ' is-active' : '' ?>"
           role="tabpanel" id="svc-sel-panel-<?= $i ?>">
        <img class="svc-sel__img"
             src="<?= e($item['image'] ?? 'https://picsum.photos/seed/svc' . ($i+1) . '/600/450') ?>"
             alt="<?= e($item['name'] ?? '') ?>"
             data-edit-img="services.items.<?= $i ?>.image">
        <div class="svc-sel__body">
          <div class="svc-sel__icon"><?= e($item['icon'] ?? '') ?></div>
          <h2 class="svc-sel__name" data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h2>
          <p class="svc-sel__desc" data-edit="services.items.<?= $i ?>.description"><?= e($item['description'] ?? '') ?></p>
          <?php if (!empty($item['features'])): ?>
          <ul class="svc-sel__features">
            <?php foreach ($item['features'] as $j => $feat): ?>
            <li>
              <span class="svc-sel__feat-icon"><?= e($feat['icon'] ?? '') ?></span>
              <span class="svc-sel__feat-title" data-edit="services.items.<?= $i ?>.features.<?= $j ?>.title"><?= e($feat['title'] ?? '') ?></span>
            </li>
            <?php endforeach; ?>
          </ul>
          <?php endif; ?>
        </div>
      </div>
      <?php endforeach; ?>
    </div>

    <div class="selector__tabs" role="tablist">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <button class="selector__tab<?= $i === 0 ? ' is-active' : '' ?>"
              role="tab"
              aria-selected="<?= $i === 0 ? 'true' : 'false' ?>"
              aria-controls="svc-sel-panel-<?= $i ?>">
        <span class="selector__tab-icon"><?= e($item['icon'] ?? '') ?></span>
        <span class="selector__tab-label"><?= e($item['name'] ?? '') ?></span>
      </button>
      <?php endforeach; ?>
    </div>

  </div>
</section>
