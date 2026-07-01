<?php /* SOCIAL section — split variant.
   Text (eyebrow/heading/intro) one side, a photo the other with the
   platform buttons floating as a compact strip over its bottom edge —
   same "photo + floating chip" mechanic already used by badge-grid and
   areas-body/split. Reuses about.teaser.image (already used by the
   about teaser) and the same social roster/business.social.* data as
   the buttons variant — no new content schema beyond one optional
   social.intro line (same fallback-only pattern as eyebrow/heading). */ ?>
<?php
$SOCIAL = kit_social_roster();
$has = false; foreach ($SOCIAL as $k => $m) { if (c('business.social.' . $k, '') !== '') { $has = true; break; } }
if (!edit_mode() && !$has) return;
?>
<section class="section social social--split section--alt">
  <div class="container split">
    <div class="social--split__text">
      <span class="eyebrow" data-edit="social.eyebrow"><?= e(c('social.eyebrow', 'Stay Connected')) ?></span>
      <h2 data-edit="social.heading"><?= e(c('social.heading', 'Follow us')) ?></h2>
      <p data-edit="social.intro"><?= e(c('social.intro', "See recent jobs, tips, and specials — we're active where you already are.")) ?></p>
    </div>

    <div class="social--split__media">
      <img src="<?= e(c('about.teaser.image', 'https://picsum.photos/seed/team7/900/700')) ?>" alt="" data-edit-img="about.teaser.image">

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
      <div class="social--split__strip">
        <?php foreach ($SOCIAL as $key => $meta): $url = c('business.social.' . $key, ''); if ($url === '') continue; ?>
        <a href="<?= e($url) ?>" target="_blank" rel="noopener" aria-label="<?= e($meta['label']) ?>"><?= $meta['icon'] ?></a>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
</section>
