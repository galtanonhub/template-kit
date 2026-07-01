<?php /* HOMEPAGE services — badge grid variant.
   Plain lead panel (heading + blurb, no card chrome, no CTA) beside a
   3x2 grid of hairline-divided cells. Each cell: linked title + short
   line, then a rounded photo with a floating pill "chip" overlaid on
   it. Reuses services.items[].image (already used by cards-3/rail),
   .icon (need-state/selector/rail) for the chip glyph, and .tag
   (banded) for the chip label — no new content fields. Shows the
   first 6 items.

   STYLE OPTIONS ($SECTION_OPTS, set by the includer — builder dock or
   the stamp's recipe.options — see manifest.json variant.options):
     arrival (bool)  scroll-triggered entrance (base.css §13 / site.js) */

function badge_grid_lead_heading(string $text): string {
    $words = preg_split('/\s+/', trim($text));
    if (count($words) < 2) return e($text);
    $lead  = array_slice($words, 0, 3);
    $rest  = array_slice($words, 3);
    $html  = '<strong>' . e(implode(' ', $lead)) . '</strong>';
    if ($rest) $html .= ' ' . e(implode(' ', $rest));
    return $html;
}
?>
<section class="section services services--badge-grid"<?= !empty($SECTION_OPTS['arrival']) ? ' data-arrival="expand"' : '' ?>>
  <div class="container">
    <div class="badge-grid__layout">

      <div class="badge-grid__lead">
        <h2 data-edit="services.teaser.heading"><?= badge_grid_lead_heading(c('services.teaser.heading', 'Everything you need to get the job done right')) ?></h2>
        <p data-edit="services.teaser.intro"><?= e(c('services.teaser.intro', 'For every job, big or small.')) ?></p>
      </div>

      <?php foreach (array_slice(c('services.items', []), 0, 6) as $i => $item): ?>
      <article class="badge-grid__cell">
        <a class="badge-grid__title" href="services.php<?= edit_mode() ? '?edit=1' : '' ?>#<?= e($item['id'] ?? '') ?>">
          <span data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></span>
          <span class="badge-grid__arrow" aria-hidden="true">→</span>
        </a>
        <p data-edit="services.items.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></p>
        <div class="badge-grid__photo">
          <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image">
          <?php if (!empty($item['tag'])): ?>
          <span class="badge-grid__chip">
            <?php if (!empty($item['icon'])): ?><span class="badge-grid__chip-icon" aria-hidden="true"><?= $item['icon'] ?></span><?php endif; ?>
            <span data-edit="services.items.<?= $i ?>.tag"><?= e($item['tag']) ?></span>
          </span>
          <?php endif; ?>
        </div>
      </article>
      <?php endforeach; ?>

    </div>
  </div>
</section>
