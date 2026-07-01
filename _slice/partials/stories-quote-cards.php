<?php /* HOMEPAGE reviews — static quote-card grid (no JS). Reads reviews.items[]
   (quote/name/role/image), same source as stories-spotlight. Avatar uses the
   item image; quote + name + role shown per card. */ ?>
<?php $items = c('reviews.items', []); if (!$items) return; ?>
<section class="section stories stories--quote-cards section--alt">
  <div class="container">
    <div class="section-head center">
      <h2 data-edit="reviews.heading"><?= e(c('reviews.heading', 'What our customers say')) ?></h2>
    </div>
    <div class="grid grid-3">
      <?php foreach ($items as $i => $item): ?>
      <figure class="stories--quote-cards__card card">
        <div class="card__body">
          <blockquote class="stories--quote-cards__quote"><?= e($item['quote'] ?? '') ?></blockquote>
          <figcaption class="stories--quote-cards__meta">
            <?php if (!empty($item['image'])): ?><img class="stories--quote-cards__avatar" src="<?= e($item['image']) ?>" alt="<?= e($item['name'] ?? '') ?>"><?php endif; ?>
            <span class="stories--quote-cards__person">
              <strong><?= e($item['name'] ?? '') ?></strong>
              <span><?= e($item['role'] ?? '') ?></span>
            </span>
          </figcaption>
        </div>
      </figure>
      <?php endforeach; ?>
    </div>
  </div>
</section>
