<?php /* HOMEPAGE reviews / spotlight — JS-driven image+quote switcher.
   PHP renders all items into the picker data-* attributes so JS can switch
   without a round-trip. First item initializes the stage.
   data-edit is on the visible stage text (item 0 only) — full per-item
   editing deferred to a future editor enhancement. */ ?>
<?php $items = c('reviews.items', []); if (!$items) return; ?>
<?php $first = $items[0]; ?>
<section class="section stories stories--spotlight section--alt">
  <div class="container">
    <div class="section-head center">
      <h2 data-edit="reviews.heading"><?= e(c('reviews.heading', 'What our customers say')) ?></h2>
    </div>
    <div class="stories--spotlight__stage">
      <figure class="stories--spotlight__media">
        <img class="js-spotlight-img" src="<?= e($first['image'] ?? '') ?>" alt="">
      </figure>
      <div class="stories--spotlight__body">
        <p class="stories--spotlight__quote js-spotlight-quote"><?= e($first['quote'] ?? '') ?></p>
        <div class="stories--spotlight__meta">
          <strong class="js-spotlight-name"><?= e($first['name'] ?? '') ?></strong>
          <span class="js-spotlight-role"><?= e($first['role'] ?? '') ?></span>
        </div>
      </div>
    </div>
    <div class="stories--spotlight__picker" role="tablist" aria-label="Choose a review">
      <?php foreach ($items as $i => $item): ?>
      <button class="stories--spotlight__thumb<?= $i === 0 ? ' is-active' : '' ?>" type="button"
        data-img="<?= e($item['image'] ?? '') ?>"
        data-quote="<?= e($item['quote'] ?? '') ?>"
        data-name="<?= e($item['name'] ?? '') ?>"
        data-role="<?= e($item['role'] ?? '') ?>">
        <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>">
      </button>
      <?php endforeach; ?>
    </div>
  </div>
</section>
