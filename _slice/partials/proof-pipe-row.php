<?php /* HOMEPAGE proof — pipe-row variant.
   Compact strip of 5 trust signals separated by brand-colored vertical pipes.
   Data: home.proof.stats[]{value, label} — renders value + label as one line. */ ?>
<section class="section proof proof--pipe-row">
  <div class="container">
    <ul class="proof--pipe-row__list">
      <?php foreach (c('home.proof.stats', []) as $i => $stat): ?>
      <li>
        <span data-edit="home.proof.stats.<?= $i ?>.value"><?= e($stat['value'] ?? '') ?></span>
        <span data-edit="home.proof.stats.<?= $i ?>.label"><?= e($stat['label'] ?? '') ?></span>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
