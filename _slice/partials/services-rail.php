<?php /* HOMEPAGE services — rail variant.
   Vertical list of plain-text service names on the left; the active one's
   image pair + detail card fill the right side. Same services.items[] data
   and selector__tab/selector__panel JS hook as services-selector (site.js) —
   just a left rail instead of bottom tabs. Modeled on table22.com's services
   section (field-tabs__menu). */ ?>
<section class="section services services--rail" data-selector<?= !empty($SECTION_OPTS['arrival']) ? ' data-arrival="expand"' : '' ?>>
  <div class="container">
    <div class="rail__layout">

      <div class="rail__tabs" role="tablist">
        <?php foreach (c('services.items', []) as $i => $item): ?>
        <button class="selector__tab rail__tab<?= $i === 0 ? ' is-active' : '' ?>"
                role="tab"
                aria-selected="<?= $i === 0 ? 'true' : 'false' ?>"
                aria-controls="rail-panel-<?= $i ?>">
          <?= e($item['name'] ?? '') ?>
        </button>
        <?php endforeach; ?>
      </div>

      <div class="rail__panels">
        <?php foreach (c('services.items', []) as $i => $item): ?>
        <div class="selector__panel rail__panel<?= $i === 0 ? ' is-active' : '' ?>"
             role="tabpanel" id="rail-panel-<?= $i ?>">
          <div class="rail__content">

            <div class="rail__media">
              <div class="rail__media-top">
                <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>"
                     data-edit-img="services.items.<?= $i ?>.image">
              </div>
              <div class="rail__media-bottom">
                <img src="<?= e(c('about.teaser.image', '')) ?>" alt="<?= e(c('business.name', '')) ?>"
                     data-edit-img="about.teaser.image">
              </div>
            </div>

            <div class="rail__card">
              <div class="rail__card-head">
                <span class="rail__card-tag" data-edit="services.items.<?= $i ?>.tag"><?= e($item['tag'] ?? '') ?></span>
                <span class="rail__card-check" aria-hidden="true">&check;</span>
              </div>
              <h3 class="rail__card-name" data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h3>
              <ul class="rail__card-list">
                <?php foreach (($item['bullets'] ?? []) as $b => $bullet): ?>
                <li data-edit="services.items.<?= $i ?>.bullets.<?= $b ?>">
                  <span class="rail__card-check" aria-hidden="true">&check;</span> <?= e($bullet) ?>
                </li>
                <?php endforeach; ?>
              </ul>
              <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand rail__cta"
                 data-edit="services.page.book_cta"><?= e(c('services.page.book_cta', 'Get Started')) ?></a>
            </div>
          </div>
        </div>
        <?php endforeach; ?>
      </div>

    </div>
  </div>
</section>
