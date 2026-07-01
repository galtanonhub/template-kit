<?php /* HOMEPAGE services — statement variant.
   Large two-line statement headline (line 1 = teaser.heading, bold ink;
   line 2 = teaser.intro, muted, same size — no eyebrow, no centered
   section-head) over a flat, borderless N-column grid. Each column reads
   top to bottom: name, short blurb, photo, then the longer description
   continuing below — no card chrome, no per-item CTA. Reuses the same
   services.items[] fields (name/blurb/image/description) as the other
   teaser variants; no new content schema. */ ?>
<section class="section services services--statement"<?= !empty($SECTION_OPTS['arrival']) ? ' data-arrival="expand"' : '' ?>>
  <div class="container">

    <div class="services--statement__head">
      <p class="services--statement__line1" data-edit="services.teaser.heading"><?= e(c('services.teaser.heading', 'We handle the hard parts.')) ?></p>
      <p class="services--statement__line2" data-edit="services.teaser.intro"><?= e(c('services.teaser.intro', 'You do what you love.')) ?></p>
    </div>

    <div class="services--statement__grid">
      <?php foreach (c('services.items', []) as $i => $item): ?>
      <div class="services--statement__col">
        <h3 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h3>
        <p class="services--statement__blurb" data-edit="services.items.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></p>
        <?php if (!empty($item['image'])): ?>
        <div class="services--statement__media">
          <img src="<?= e($item['image']) ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image">
        </div>
        <?php endif; ?>
        <p class="services--statement__desc" data-edit="services.items.<?= $i ?>.description"><?= e($item['description'] ?? '') ?></p>
      </div>
      <?php endforeach; ?>
    </div>

  </div>
</section>
