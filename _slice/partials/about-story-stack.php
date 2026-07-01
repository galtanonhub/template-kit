<?php /* HOMEPAGE about teaser — story-stack: centered heading, full-width banner
   photo, then lead paragraph + checklist in two columns. Reads the SAME
   about.teaser.* keys as about-teaser (only one about variant renders per page). */ ?>
<section class="section about about--story-stack section--alt">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow" data-edit="about.teaser.eyebrow"><?= e(c('about.teaser.eyebrow', 'Why Choose Us')) ?></span>
      <h2 data-edit="about.teaser.heading"><?= e(c('about.teaser.heading', "We've done this for years. We know what matters.")) ?></h2>
    </div>
    <figure class="about--story-stack__banner">
      <img src="<?= e(c('about.teaser.image', 'https://picsum.photos/seed/team7/1400/720')) ?>" alt="<?= e(c('business.name', '')) ?> team" data-edit-img="about.teaser.image">
    </figure>
    <div class="about--story-stack__cols">
      <p class="lead" data-edit="about.teaser.text"><?= e(c('about.teaser.text', 'A short paragraph about who you are and what you stand for.')) ?></p>
      <div>
        <?php $checklist = c('about.teaser.checklist', []); if ($checklist): ?>
        <ul class="checklist">
          <?php foreach ($checklist as $i => $item): ?>
          <li data-edit="about.teaser.checklist.<?= $i ?>"><?= e($item) ?></li>
          <?php endforeach; ?>
        </ul>
        <?php endif; ?>
        <a href="about.php<?= edit_mode() ? '?edit=1' : '' ?>" class="link-arrow" data-edit="about.teaser.cta"><?= e(c('about.teaser.cta', 'More about us')) ?></a>
      </div>
    </div>
  </div>
</section>
