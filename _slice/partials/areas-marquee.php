<?php /* HOMEPAGE areas — marquee variant. Same areas.teaser.* + areas.list[] as
   the chips teaser; the city list is duplicated inline for a seamless CSS
   scroll loop. Cities aren't individually editable (buyer edits areas.list[]
   in the JSON / a future list editor). */ ?>
<section class="section areas areas--marquee">
  <div class="container section-head center">
    <span class="eyebrow" data-edit="areas.teaser.eyebrow"><?= e(c('areas.teaser.eyebrow', 'Where We Work')) ?></span>
    <h2 data-edit="areas.teaser.heading"><?= e(c('areas.teaser.heading', 'Serving the Greater Area')) ?></h2>
    <?php if (c('areas.teaser.intro', '') !== ''): ?>
    <p data-edit="areas.teaser.intro"><?= e(c('areas.teaser.intro', '')) ?></p>
    <?php endif; ?>
  </div>
  <?php $cities = c('areas.list', []); if ($cities): ?>
  <div class="areas--marquee__viewport">
    <div class="areas--marquee__track">
      <?php for ($r = 0; $r < 2; $r++): foreach ($cities as $city): ?><span<?= $r === 1 ? ' aria-hidden="true"' : '' ?>><?= e($city) ?></span><?php endforeach; endfor; ?>
    </div>
  </div>
  <?php endif; ?>
</section>
