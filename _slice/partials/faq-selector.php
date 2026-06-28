<?php /* HOMEPAGE faq — selector variant.
   Same faq.* data as faq-accordion and faq-carousel.
   Clicking a tab swaps the visible Q+A panel above. JS handler in site.js. */ ?>
<section class="section faq faq--selector" data-selector>
  <div class="container">

    <span class="eyebrow faq-sel__eyebrow" data-edit="faq.eyebrow"><?= e(c('faq.eyebrow', c('faq.heading', 'Common Questions'))) ?></span>

    <div class="selector__panels">
      <?php foreach (c('faq.items', []) as $i => $item): ?>
      <div class="selector__panel<?= $i === 0 ? ' is-active' : '' ?>"
           role="tabpanel" id="faq-sel-panel-<?= $i ?>">
        <h2 class="faq-sel__q" data-edit="faq.items.<?= $i ?>.q"><?= e($item['q'] ?? '') ?></h2>
        <p class="faq-sel__a" data-edit="faq.items.<?= $i ?>.a"><?= e($item['a'] ?? '') ?></p>
      </div>
      <?php endforeach; ?>
    </div>

    <div class="selector__tabs" role="tablist">
      <?php foreach (c('faq.items', []) as $i => $item): ?>
      <button class="selector__tab<?= $i === 0 ? ' is-active' : '' ?>"
              role="tab"
              aria-selected="<?= $i === 0 ? 'true' : 'false' ?>"
              aria-controls="faq-sel-panel-<?= $i ?>">
        <span class="selector__tab-label"><?= e($item['q'] ?? '') ?></span>
      </button>
      <?php endforeach; ?>
    </div>

  </div>
</section>
