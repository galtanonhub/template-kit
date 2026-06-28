<?php /* ABOUT page — upgrade from the homepage about-teaser.
   Teaser: one image + paragraph + checklist.
   This page: full story prose + company values grid. Different layout, deeper. */ ?>
<section class="section about-page">
  <div class="container">

    <div class="section-head">
      <span class="eyebrow" data-edit="about.page.eyebrow"><?= e(c('about.page.eyebrow', 'Our Story')) ?></span>
      <h1 data-edit="about.page.heading"><?= e(c('about.page.heading', 'Built on doing it right')) ?></h1>
    </div>

    <div class="about-story">
      <figure class="about-story__photo">
        <img src="<?= e(c('about.teaser.image', '')) ?>" alt="<?= e(c('business.name', '')) ?>" data-edit-img="about.teaser.image">
      </figure>
      <div class="about-story__prose">
        <?php foreach (c('about.story', []) as $i => $para): ?>
        <p data-edit="about.story.<?= $i ?>"><?= e($para) ?></p>
        <?php endforeach; ?>
      </div>
    </div>

    <?php $values = c('about.values', []); if ($values): ?>
    <div class="about-values">
      <h2>What we stand for</h2>
      <div class="about-values__grid">
        <?php foreach ($values as $i => $v): ?>
        <div class="about-values__item">
          <h3 data-edit="about.values.<?= $i ?>.title"><?= e($v['title'] ?? '') ?></h3>
          <p data-edit="about.values.<?= $i ?>.text"><?= e($v['text'] ?? '') ?></p>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endif; ?>

  </div>
</section>
