<?php /* HOMEPAGE faq — carousel variant.
   Same faq.* data as faq-accordion; different layout.
   Answers are always visible (no expand) — the card IS the content. */ ?>
<section class="section faq faq--carousel">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow">Common Questions</span>
      <h2 data-edit="faq.heading"><?= e(c('faq.heading', 'Before you call')) ?></h2>
    </div>
    <div class="kit-carousel" role="region" aria-label="Frequently asked questions">
      <button class="kit-carousel__arrow" data-dir="-1" aria-label="Previous question">‹</button>
      <div class="kit-carousel__track">
        <?php foreach (c('faq.items', []) as $i => $item): ?>
        <div class="kit-carousel__card">
          <h3 data-edit="faq.items.<?= $i ?>.q"><?= e($item['q'] ?? '') ?></h3>
          <p data-edit="faq.items.<?= $i ?>.a"><?= e($item['a'] ?? '') ?></p>
        </div>
        <?php endforeach; ?>
      </div>
      <button class="kit-carousel__arrow" data-dir="1" aria-label="Next question">›</button>
    </div>
  </div>
</section>
