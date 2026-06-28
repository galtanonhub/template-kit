<?php /* HOMEPAGE process — carousel variant.
   Same home.process.* data as process-numbered; different layout.
   Step numbers auto-generated from index (01, 02…). */ ?>
<section class="section process process--carousel section--alt">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow" data-edit="home.process.eyebrow"><?= e(c('home.process.eyebrow', 'How It Works')) ?></span>
      <h2 data-edit="home.process.heading"><?= e(c('home.process.heading', 'Simple, start to finish')) ?></h2>
    </div>
    <div class="kit-carousel" role="region" aria-label="Process steps">
      <button class="kit-carousel__arrow" data-dir="-1" aria-label="Previous step">‹</button>
      <div class="kit-carousel__track">
        <?php foreach (c('home.process.steps', []) as $i => $step): ?>
        <div class="kit-carousel__card">
          <span class="process__num"><?= str_pad($i + 1, 2, '0', STR_PAD_LEFT) ?></span>
          <h3 data-edit="home.process.steps.<?= $i ?>.title"><?= e($step['title'] ?? '') ?></h3>
          <p data-edit="home.process.steps.<?= $i ?>.text"><?= e($step['text'] ?? '') ?></p>
        </div>
        <?php endforeach; ?>
      </div>
      <button class="kit-carousel__arrow" data-dir="1" aria-label="Next step">›</button>
    </div>
  </div>
</section>
