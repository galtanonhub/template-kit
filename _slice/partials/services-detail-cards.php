<?php /* SERVICES detail body — card grid (alternative to detail-rows).
   Same services.items[] source, deep view (description + bullets) in a
   3-up card layout. Pairs with services-header. */ ?>
<section class="section services-page services-detail--cards">
  <div class="container">
    <div class="grid grid-3">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <article class="card svc-card" id="<?= e($item['id'] ?? '') ?>">
        <div class="card__media">
          <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image">
        </div>
        <div class="card__body">
          <h2 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h2>
          <p data-edit="services.items.<?= $i ?>.description"><?= e($item['description'] ?? '') ?></p>
          <ul class="checklist">
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
