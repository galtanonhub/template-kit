<?php /* HOMEPAGE proof — logos variant.
   Eyebrow + row of individually boxed partner/brand logos.
   Data: home.proof.logos.eyebrow + home.proof.logos.items[]{name, image} */ ?>
<section class="section proof proof--logos">
  <div class="container">
    <span class="eyebrow proof--logos__eyebrow"
          data-edit="home.proof.logos.eyebrow"><?= e(c('home.proof.logos.eyebrow', 'Trusted By')) ?></span>
    <div class="proof--logos__row">
      <?php foreach (c('home.proof.logos.items', []) as $i => $logo): ?>
      <div class="proof--logos__box">
        <img src="<?= e($logo['image'] ?? '') ?>"
             alt="<?= e($logo['name'] ?? 'Partner logo') ?>"
             data-edit-img="home.proof.logos.items.<?= $i ?>.image">
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
