<?php /* SERVICES detail body — banded variant (alternative to rows/cards).
   Each service gets its own full-width section, alternating background tint
   and image side, with a tag eyebrow and dual CTA (book + call). Modeled on
   doorproblems.com/services.html. Reads the SAME services.items[] as
   rows/cards. Pairs with services-header.

   STYLE OPTIONS ($SECTION_OPTS, set by the includer — builder dock or the
   stamp's recipe.{sections,pages}[].options — never buyer content):
     flip  (bool)            invert which iteration starts alternating
     frame (none|bordered|divided)  border each section, optionally with
                                     a vertical divider between media/copy */ ?>
<?php
$opt_flip  = !empty($SECTION_OPTS['flip']);
$opt_frame = $SECTION_OPTS['frame'] ?? 'none';
if (!in_array($opt_frame, ['none', 'bordered', 'divided'], true)) $opt_frame = 'none';
?>
<?php foreach (c('services.items', []) as $i => $item): ?>
<?php $isAlt = ($i % 2 === 1) !== $opt_flip; ?>
<section class="section services-page services-detail--banded<?= $isAlt ? ' section--alt' : '' ?>" id="<?= e($item['id'] ?? '') ?>">
  <div class="container">
    <div class="svc-banded__inner<?= $isAlt ? ' is-reverse' : '' ?><?= $opt_frame !== 'none' ? ' is-bordered' : '' ?><?= $opt_frame === 'divided' ? ' is-divided' : '' ?>">
      <div class="svc-banded__media">
        <img src="<?= e($item['image'] ?? '') ?>" alt="<?= e($item['name'] ?? '') ?>" data-edit-img="services.items.<?= $i ?>.image">
      </div>
      <div class="svc-banded__body">
        <span class="eyebrow" data-edit="services.items.<?= $i ?>.tag"><?= e($item['icon'] ?? '') ?> <?= e($item['tag'] ?? '') ?></span>
        <h2 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h2>
        <p data-edit="services.items.<?= $i ?>.description"><?= e($item['description'] ?? '') ?></p>
        <ul class="checklist">
          <?php foreach (($item['bullets'] ?? []) as $b => $bullet): ?>
          <li data-edit="services.items.<?= $i ?>.bullets.<?= $b ?>"><?= e($bullet) ?></li>
          <?php endforeach; ?>
        </ul>
        <div class="svc-banded__actions">
          <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand" data-edit="services.page.book_cta"><?= e(c('services.page.book_cta', 'Book This Service')) ?></a>
          <a href="tel:<?= e(preg_replace('/[^+\d]/', '', c('business.phone', ''))) ?>" class="btn btn--outline"><?= e(c('business.phone', '')) ?></a>
        </div>
      </div>
    </div>
  </div>
</section>
<?php endforeach; ?>
