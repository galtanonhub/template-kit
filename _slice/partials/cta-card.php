<?php /* HOMEPAGE CTA — card variant.
   A centered floating card on a tinted section background, single CTA
   button, and a row of quick trust stats below a divider — ties the ask
   directly to credibility signals at the decision point. Reuses the same
   home.cta.* fields as band/dark-left, plus home.proof.stats[] (already
   used by proof/stat-bar) for the trust row — no new content schema. */ ?>
<section class="section section--alt cta cta--card">
  <div class="container">
    <div class="cta--card__box">
      <h2 data-edit="home.cta.heading"><?= e(c('home.cta.heading', 'Ready to get started?')) ?></h2>
      <p data-edit="home.cta.text"><?= e(c('home.cta.text', 'Get your free, no-obligation estimate today.')) ?></p>
      <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand btn--lg" data-edit="home.cta.button"><?= e(c('home.cta.button', 'Get a Free Quote')) ?></a>
      <?php $stats = array_slice(c('home.proof.stats', []), 0, 3); if ($stats): ?>
      <div class="cta--card__stats">
        <?php foreach ($stats as $i => $stat): ?>
        <div class="cta--card__stat">
          <span class="cta--card__stat-value" data-edit="home.proof.stats.<?= $i ?>.value"><?= e($stat['value'] ?? '') ?></span>
          <span class="cta--card__stat-label" data-edit="home.proof.stats.<?= $i ?>.label"><?= e($stat['label'] ?? '') ?></span>
        </div>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
</section>
