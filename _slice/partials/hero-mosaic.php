<?php /* HOMEPAGE hero — text left, framed 4-panel offset image grid right.
   Images stored at home.hero.mosaic.0–3; right column auto-offsets via CSS.
   Text fields share keys with other hero variants (eyebrow, headline, sub, cta_*). */ ?>
<section class="section hero hero--mosaic">
  <div class="container hero--mosaic__inner">

    <div class="hero--mosaic__body">
      <span class="eyebrow" data-edit="home.hero.eyebrow"><?= e(c('home.hero.eyebrow', 'Licensed &amp; Insured')) ?></span>
      <h1 class="display" data-edit="home.hero.headline"><?= e(c('home.hero.headline', 'We get it done right.')) ?></h1>
      <p class="lead" data-edit="home.hero.sub"><?= e(c('home.hero.sub', 'Fast, reliable service across the area. No surprises — just honest work and clean results.')) ?></p>
      <div class="hero__actions">
        <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand btn--lg" data-edit="home.hero.cta_primary"><?= e(c('home.hero.cta_primary', 'Get a Free Estimate')) ?></a>
        <a href="<?= e(c('home.hero.cta_secondary_url', 'services.php')) ?>" class="btn btn--outline btn--lg" data-edit="home.hero.cta_secondary"><?= e(c('home.hero.cta_secondary', 'See Our Work')) ?></a>
      </div>
      <?php $badges = c('home.hero.badges', []); if ($badges): ?>
      <ul class="hero--mosaic__badges">
        <?php foreach ($badges as $i => $b): ?>
        <li data-edit="home.hero.badges.<?= $i ?>"><?= e($b) ?></li>
        <?php endforeach; ?>
      </ul>
      <?php endif; ?>
    </div>

    <div class="hero--mosaic__frame" aria-hidden="true">
      <div class="hero--mosaic__col">
        <div class="hero--mosaic__tile">
          <img src="<?= e(c('home.hero.mosaic.0', 'https://picsum.photos/seed/mosaic1/480/380')) ?>" alt="" data-edit-img="home.hero.mosaic.0">
        </div>
        <div class="hero--mosaic__tile">
          <img src="<?= e(c('home.hero.mosaic.1', 'https://picsum.photos/seed/mosaic2/480/260')) ?>" alt="" data-edit-img="home.hero.mosaic.1">
        </div>
      </div>
      <div class="hero--mosaic__col">
        <div class="hero--mosaic__tile">
          <img src="<?= e(c('home.hero.mosaic.2', 'https://picsum.photos/seed/mosaic3/480/260')) ?>" alt="" data-edit-img="home.hero.mosaic.2">
        </div>
        <div class="hero--mosaic__tile">
          <img src="<?= e(c('home.hero.mosaic.3', 'https://picsum.photos/seed/mosaic4/480/380')) ?>" alt="" data-edit-img="home.hero.mosaic.3">
        </div>
      </div>
    </div>

  </div>
</section>
