<?php /* SERVICE AREAS page — upgrade from the homepage chips teaser.
   Shows the full city list as a checkmark grid; if areas.detail[] is
   populated, also renders per-city blurbs below the grid. */ ?>
<section class="section areas-page">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow" data-edit="areas.page.eyebrow"><?= e(c('areas.page.eyebrow', 'Service Area')) ?></span>
      <h1 data-edit="areas.page.heading"><?= e(c('areas.page.heading', 'Where we work')) ?></h1>
      <p class="lead" data-edit="areas.page.intro"><?= e(c('areas.page.intro', 'We come to you across the region.')) ?></p>
    </div>

    <ul class="areas-page__grid">
      <?php foreach (c('areas.list', []) as $city): ?>
      <li><?= e($city) ?></li>
      <?php endforeach; ?>
    </ul>

    <?php $detail = c('areas.detail', []); if ($detail): ?>
    <div class="areas-detail-list">
      <?php foreach ($detail as $i => $item): ?>
      <div class="areas-detail-item">
        <h2 data-edit="areas.detail.<?= $i ?>.city"><?= e($item['city'] ?? '') ?></h2>
        <p data-edit="areas.detail.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></p>
      </div>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <p class="areas-page__note">Don't see your city? <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>">Contact us</a> — if you're within driving distance, we'll make it work.</p>
  </div>
</section>
