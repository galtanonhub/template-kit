<?php /* SERVICES detail body — feature-band variant (alternative to
   rows/cards/banded). Modeled on jmelectric.com/industrial/, minus its hero
   (services-header already owns the page banner). Three stacked blocks:
   (1) a compact intro + checkmark list of services.items — the reference's
   plain 2-col "core services" list, arrows swapped for checkmarks; (2) the
   reference's signature full-bleed photo band — a dark scrim over the image
   plus a translucent panel around the text, so the statement pops against a
   busy photo instead of competing with it; (3) an image + checkmark list
   "why choose us" block, mirroring the reference's arrow-list section (again
   checkmarks, not arrows). No new content fields: reuses services.teaser.*,
   services.items[], home.hero.image/headline/sub (the band photo + statement),
   and about.teaser.image / about.values[] (the why-choose block) — the same
   cross-section reuse approach as about-body/editorial. Pairs with any
   services-header. */ ?>
<section class="section services-page services-detail--feature-band">
  <div class="container">
    <div class="svc-feature-intro">
      <div class="svc-feature-intro__copy">
        <h2 data-edit="services.teaser.heading"><?= e(c('services.teaser.heading', 'We handle the hard parts.')) ?></h2>
        <p class="lead" data-edit="services.teaser.intro"><?= e(c('services.teaser.intro', 'You do what you love.')) ?></p>
      </div>
      <ul class="feature-checklist">
        <?php foreach (c('services.items', []) as $i => $item): ?>
        <li class="feature-checklist__item">
          <span class="feature-checklist__check" aria-hidden="true">&check;</span>
          <div class="feature-checklist__body">
            <h3 data-edit="services.items.<?= $i ?>.name"><?= e($item['name'] ?? '') ?></h3>
            <p data-edit="services.items.<?= $i ?>.blurb"><?= e($item['blurb'] ?? '') ?></p>
          </div>
        </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</section>

<section class="svc-feature-band">
  <div class="svc-feature-band__media">
    <img src="<?= e(c('home.hero.image', '')) ?>" alt="" class="svc-feature-band__bg" data-edit-img="home.hero.image">
    <div class="svc-feature-band__scrim"></div>
    <?php kit_shape_divider($SECTION_OPTS['edge'] ?? 'none'); ?>
  </div>
  <div class="container">
    <div class="svc-feature-band__box">
      <p class="svc-feature-band__heading" data-edit="home.hero.headline"><?= e(c('home.hero.headline', '')) ?></p>
      <p class="svc-feature-band__text" data-edit="home.hero.sub"><?= e(c('home.hero.sub', '')) ?></p>
    </div>
  </div>
</section>

<section class="section services-page">
  <div class="container">
    <div class="svc-feature-choose">
      <?php if (c('about.teaser.image', '')): ?>
      <div class="svc-feature-choose__media">
        <img src="<?= e(c('about.teaser.image', '')) ?>" alt="<?= e(c('business.name', '')) ?>" data-edit-img="about.teaser.image">
      </div>
      <?php endif; ?>
      <ul class="feature-checklist">
        <?php foreach (c('about.values', []) as $i => $v): ?>
        <li class="feature-checklist__item">
          <span class="feature-checklist__check" aria-hidden="true">&check;</span>
          <div class="feature-checklist__body">
            <h3 data-edit="about.values.<?= $i ?>.title"><?= e($v['title'] ?? '') ?></h3>
            <p data-edit="about.values.<?= $i ?>.text"><?= e($v['text'] ?? '') ?></p>
          </div>
        </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</section>
