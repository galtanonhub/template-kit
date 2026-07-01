<?php /* SOCIAL section — cards variant.
   Each platform is its own small card (icon + name + "Follow us" line)
   instead of a flat row of pill buttons — makes each channel read as its
   own invitation rather than a quick-link row. Same roster/business.social.*
   data and eyebrow/heading fields as the buttons variant — no new schema. */ ?>
<?php
$SOCIAL = kit_social_roster();
$has = false; foreach ($SOCIAL as $k => $m) { if (c('business.social.' . $k, '') !== '') { $has = true; break; } }
if (!edit_mode() && !$has) return;
?>
<section class="section social social--cards section--alt">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow" data-edit="social.eyebrow"><?= e(c('social.eyebrow', 'Stay Connected')) ?></span>
      <h2 data-edit="social.heading"><?= e(c('social.heading', 'Follow us')) ?></h2>
    </div>

    <?php if (edit_mode()): ?>
    <div class="social-editor">
      <p class="social-editor__hint">Social links — paste your page URL to show a button, leave blank to hide it.</p>
      <div class="social-editor__rows">
        <?php foreach ($SOCIAL as $key => $meta): ?>
        <label class="social-editor__row">
          <span class="social-editor__icon"><?= $meta['icon'] ?></span>
          <span class="social-editor__name"><?= e($meta['label']) ?></span>
          <input type="url" class="social-editor__input"
                 data-edit-field="business.social.<?= $key ?>"
                 value="<?= e(c('business.social.' . $key, '')) ?>"
                 placeholder="https://…">
        </label>
        <?php endforeach; ?>
      </div>
    </div>
    <?php else: ?>
    <div class="social--cards__grid">
      <?php foreach ($SOCIAL as $key => $meta): $url = c('business.social.' . $key, ''); if ($url === '') continue; ?>
      <a class="social--cards__card" href="<?= e($url) ?>" target="_blank" rel="noopener">
        <span class="social--cards__icon" aria-hidden="true"><?= $meta['icon'] ?></span>
        <span class="social--cards__name"><?= e($meta['label']) ?></span>
        <span class="social--cards__follow">Follow us <span aria-hidden="true">→</span></span>
      </a>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
</section>
