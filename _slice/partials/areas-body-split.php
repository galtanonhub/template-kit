<?php /* SERVICE AREAS body — split variant.
   Contained photo + checklist layout — a lighter-touch body meant to sit
   under a plain areas-header (standard), giving the page some visual
   weight without needing the header's own banner/split treatment.
   Reuses areas.page.image (already used by the header banner/split
   variants) and areas.list — no new content schema. */ ?>
<section class="section areas-page areas-page--split">
  <div class="container split">
    <div class="areas-page--split__media">
      <img src="<?= e(c('areas.page.image', 'https://picsum.photos/seed/areasheader/1600/700')) ?>" alt="" data-edit-img="areas.page.image">
      <span class="areas-page--split__badge"><?= count(c('areas.list', [])) ?>+ Communities Served</span>
    </div>
    <div class="areas-page--split__text">
      <p class="lead" data-edit="areas.page.intro"><?= e(c('areas.page.intro', "If you're in the area, we come to you.")) ?></p>
      <ul class="areas-page__grid">
        <?php foreach (c('areas.list', []) as $city): ?>
        <li><?= e($city) ?></li>
        <?php endforeach; ?>
      </ul>
      <p class="areas-page__note">Don't see your city? <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>">Contact us</a> — if you're within driving distance, we'll make it work.</p>
    </div>
  </div>
</section>
