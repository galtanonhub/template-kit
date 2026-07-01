<?php /* HOMEPAGE services — need-state variant.
   Clickable card grid → per-service modal with image header + features grid.
   Same services.items[] as services-teaser, but also reads:
     item.icon     — emoji shown on the card (e.g. "🔧")
     item.features[] — { "icon","title","text" } for the 2×2 modal grid
   Falls back cleanly if those fields are absent (older content.json).
   Editing in ?edit=1: service names/descriptions are data-edit in the
   modals (textContent works on un-opened modals). Open a card to edit
   its deep content, then Save. */ ?>
<section class="section services services--need-state"<?= !empty($SECTION_OPTS['arrival']) ? ' data-arrival="expand"' : '' ?>>
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow" data-edit="services.teaser.eyebrow"><?= e(c('services.teaser.eyebrow', 'What We Do')) ?></span>
      <h2 data-edit="services.teaser.heading"><?= e(c('services.teaser.heading', 'Choose a service')) ?></h2>
      <?php if (c('services.teaser.intro', '') !== ''): ?>
      <p data-edit="services.teaser.intro"><?= e(c('services.teaser.intro', '')) ?></p>
      <?php endif; ?>
    </div>

    <div class="need-state__grid">
      <?php foreach (c('services.items', []) as $i => $item):
        $mid = 'ns-modal-' . e($item['id'] ?? $i); ?>
      <button class="need-state__card" data-modal="<?= $mid ?>" type="button" aria-haspopup="dialog">
        <?php if (!empty($item['icon'])): ?>
        <span class="need-state__card-icon" aria-hidden="true"><?= $item['icon'] ?></span>
        <?php endif; ?>
        <span class="need-state__card-name"><?= e($item['name'] ?? '') ?></span>
        <span class="need-state__card-arrow" aria-hidden="true">›</span>
      </button>
      <?php endforeach; ?>
    </div>
  </div>

  <?php /* Modals pre-rendered for SEO + no-JS resilience.
           Placed outside .container so the overlay can cover the full viewport. */ ?>
  <?php foreach (c('services.items', []) as $i => $item):
    $mid      = 'ns-modal-' . e($item['id'] ?? $i);
    $features = $item['features'] ?? [];
  ?>
  <div class="need-state__modal" id="<?= $mid ?>" role="dialog" aria-modal="true" aria-label="<?= e($item['name'] ?? '') ?>">
    <div class="need-state__modal-overlay"></div>
    <div class="need-state__modal-box">
      <button class="need-state__modal-close" aria-label="Close">×</button>

      <div class="need-state__modal-header"<?php
        if (!empty($item['image'])) echo ' style="background-image:url(' . e($item['image']) . ')"';
      ?>></div>

      <div class="need-state__modal-body">
        <h3 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h3>
        <p data-edit="services.items.<?= $i ?>.description"><?= e($item['description'] ?? '') ?></p>

        <?php if ($features): ?>
        <div class="need-state__features">
          <?php foreach ($features as $fi => $f): ?>
          <div class="need-state__feature">
            <?php if (!empty($f['icon'])): ?>
            <span class="need-state__feature-icon" aria-hidden="true"><?= $f['icon'] ?></span>
            <?php endif; ?>
            <div>
              <strong data-edit="services.items.<?= $i ?>.features.<?= $fi ?>.title"><?= e($f['title'] ?? '') ?></strong>
              <p data-edit="services.items.<?= $i ?>.features.<?= $fi ?>.text"><?= e($f['text'] ?? '') ?></p>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand btn--lg">
          <?= e(c('home.cta.button', 'Get a Free Quote')) ?>
        </a>
      </div>
    </div>
  </div>
  <?php endforeach; ?>

</section>
