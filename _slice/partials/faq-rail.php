<?php /* HOMEPAGE faq — rail variant.
   Vertical list of plain-text questions on the left; the active one's
   full Q+A fills a simple panel on the right. Same faq.items[] data and
   selector__tab/selector__panel JS hook as faq-selector (site.js) — just a
   left rail instead of bottom tabs, mirroring services-rail's layout
   (text-only here since faq.items have no image/bullets to fill a card). */ ?>
<section class="section faq faq--rail" data-selector>
  <div class="container">

    <span class="eyebrow faq-rail__eyebrow" data-edit="faq.eyebrow"><?= e(c('faq.eyebrow', c('faq.heading', 'Common Questions'))) ?></span>

    <div class="rail__layout">

      <div class="rail__tabs" role="tablist">
        <?php foreach (c('faq.items', []) as $i => $item): ?>
        <button class="selector__tab rail__tab<?= $i === 0 ? ' is-active' : '' ?>"
                role="tab"
                aria-selected="<?= $i === 0 ? 'true' : 'false' ?>"
                aria-controls="faq-rail-panel-<?= $i ?>">
          <?= e($item['q'] ?? '') ?>
        </button>
        <?php endforeach; ?>
      </div>

      <div class="rail__panels">
        <?php foreach (c('faq.items', []) as $i => $item): ?>
        <div class="selector__panel rail__panel<?= $i === 0 ? ' is-active' : '' ?>"
             role="tabpanel" id="faq-rail-panel-<?= $i ?>">
          <h2 class="faq-rail__q" data-edit="faq.items.<?= $i ?>.q"><?= e($item['q'] ?? '') ?></h2>
          <p class="faq-rail__a" data-edit="faq.items.<?= $i ?>.a"><?= e($item['a'] ?? '') ?></p>
        </div>
        <?php endforeach; ?>
      </div>

    </div>
  </div>
</section>
