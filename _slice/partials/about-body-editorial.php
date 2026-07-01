<?php /* ABOUT body — editorial variant (alternative to "story"). A single-
   column magazine narrative instead of story's boxed photo+prose layout:
   the opening story paragraph runs large as a lede statement, a contained
   photo break (rounded + shadowed, matching the kit's photo language
   elsewhere — NOT full-bleed) carries two pulled stats below it, the rest
   of the story continues as plain narrative, values render as a numbered
   strip instead of a card grid, and a closing line leads into a CTA. No
   eyebrow here — every about-header variant already shows about.page.eyebrow
   + the heading, so repeating it in the body would duplicate the header
   verbatim. No new content fields — reuses about.story[]/about.values[]/
   about.teaser.image, plus a deliberate cross-section borrow of
   home.proof.stats[] and home.cta.heading/button. Pairs with any
   about-header. */ ?>
<?php $story  = c('about.story', []); ?>
<?php $values = c('about.values', []); ?>
<?php $stats  = array_slice(c('home.proof.stats', []), 0, 2); ?>
<section class="section about-page about-page--editorial">
  <div class="container">

    <div class="about-editorial__lede">
      <?php if (!empty($story[0])): ?>
      <p class="about-editorial__lede-text" data-edit="about.story.0"><?= e($story[0]) ?></p>
      <?php endif; ?>
    </div>

    <?php if (c('about.teaser.image', '')): ?>
    <figure class="about-editorial__photo">
      <img src="<?= e(c('about.teaser.image', '')) ?>" alt="<?= e(c('business.name', '')) ?>" data-edit-img="about.teaser.image">
    </figure>
    <?php if ($stats): ?>
    <div class="about-editorial__stats">
      <?php foreach ($stats as $s): ?>
      <div class="about-editorial__stat">
        <strong><?= e($s['value'] ?? '') ?></strong>
        <span><?= e($s['label'] ?? '') ?></span>
      </div>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <?php endif; ?>

    <?php if (count($story) > 1): ?>
    <div class="about-editorial__rest">
      <div class="about-editorial__prose">
        <?php foreach (array_slice($story, 1, null, true) as $i => $para): ?>
        <p data-edit="about.story.<?= $i ?>"><?= e($para) ?></p>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endif; ?>

    <?php if ($values): ?>
    <div class="about-editorial__values">
      <?php foreach ($values as $i => $v): ?>
      <div class="about-editorial__value">
        <span class="about-editorial__value-num" aria-hidden="true"><?= str_pad((string)($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
        <div class="about-editorial__value-body">
          <h3 data-edit="about.values.<?= $i ?>.title"><?= e($v['title'] ?? '') ?></h3>
          <p data-edit="about.values.<?= $i ?>.text"><?= e($v['text'] ?? '') ?></p>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <div class="about-editorial__cta">
      <p class="about-editorial__cta-text" data-edit="home.cta.heading"><?= e(c('home.cta.heading', 'Ready to get started?')) ?></p>
      <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand"
         data-edit="home.cta.button"><?= e(c('home.cta.button', 'Get in Touch')) ?></a>
    </div>

  </div>
</section>
